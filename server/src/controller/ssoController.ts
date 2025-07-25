import { Request, Response } from "express";
import { generateUrlFriendlyToken } from "../services/generators";
import { prisma } from "./usersController";
import { sendEmail } from "../services/email";
import { FinishRegisterMessage, ForgotPasswordMessage } from "../services/emailsMessages";
import bcrypt from 'bcrypt'
import { createSession, deleteSession } from "../services/cookiesManager";
import jwt from 'jsonwebtoken'
import { allowedOrigins } from "..";
import { verifyIdToken } from "../services/firebase";
import multer from 'multer'

const upload = multer().single('photo')

export class SsoController{
    static async validateRedirect (req: Request, res: Response){
        const { redirectUrl } = req.query

        if (!redirectUrl || typeof redirectUrl !== 'string'){
            res.status(400).json({ error: 'Parâmetro redirectUrl é obrigatório e deve ser uma string' })
            return
        }

        try{
            const url = new URL(redirectUrl)
            const origin = url.origin

            if (allowedOrigins.includes(origin)){
                res.status(200).json({ message: 'URL permitida' })
                return
            }
            else{
                res.status(403).json({ error: 'URL não autorizada' })
                return
            }
        }
        catch (err){
            res.status(400).json({ error: 'URL inválida' })
            return
        }
    }

    static async createToken (req: Request, res: Response) {
        const { userId, type } = req.body
        const { resp } = req.query

        const responsavel = resp === 'true' || resp === '1'
        const tokenType = parseInt(type)

        if (!userId || `${userId}`.length <= 0) {
            res.status(400).json({ error: 'userId é obrigatório' })
            return
        }

        if (![1, 2].includes(tokenType)) {
            res.status(400).json({ error: 'Tipo de token inválido' })
            return
        }

        const userIdInt = parseInt(userId)

        try {
            const existingToken = await prisma.token_manager.findFirst({
                where: {
                    owner_id: userIdInt,
                    token_type: tokenType,
                    expires_at: {
                        gt: new Date()
                    }
                }
            })
            if (existingToken) {
                res.status(400).json({ error: 'Já existe um token válido para este usuário.' })
                return
            }

            const regUser = await prisma.reg_users.findUnique({
                where: {
                    origin_id: userIdInt
                }
            })

            if (tokenType === 1 && regUser) {
                res.status(400).json({ error: 'Este usuário já está registrado. Não é possível gerar um token de validação de email.' })
                return
            }
            if (tokenType === 2 && !regUser) {
                res.status(400).json({ error: 'Este usuário não está registrado. Não é possível gerar um token de recuperação de senha.' })
                return
            }

            let tokenExists = true;
            let token: string = ''
            while (tokenExists) {
                token = generateUrlFriendlyToken(10);
                tokenExists = await prisma.token_manager.findUnique({
                where: { token },
                }) !== null;
            }

            const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
            const createdToken = await prisma.token_manager.create({
                data: {
                    owner_id: userIdInt,
                    token,
                    token_type: tokenType,
                    expires_at: expiresAt
                }
            })

            const user = await prisma.users.findUnique({
                where: {
                    id: userIdInt
                },
                select: {
                    fullname: true,
                    email: true,
                    email_responsavel: true
                }
            })
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' })
                return
            }

            const message = tokenType === 1
                ? FinishRegisterMessage(user.fullname, createdToken.token, responsavel)
                : ForgotPasswordMessage(user.fullname, createdToken.token, responsavel)

            const subject = tokenType === 1
                ? 'Finalize seu registro'
                : 'Recupere sua senha'

            const email = responsavel?user.email_responsavel:user.email
            if (!email) {
                res.status(400).json({ error: 'Usuário não possui e-mail válido para envio.' })
                return
            }

            sendEmail(message, subject, email)

            res.status(201).json({
                message: "Token criado com sucesso"
            })
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }
    static async validateCode (req: Request, res: Response) {
        const { token } = req.params
        const { type, name } = req.query

        if (!name || `${name}`.length <= 0 || !type || `${type}`.length <= 0){
            res.status(400).json({ error: "'name' e 'type' são obrigatórios" })
            return
        }

        try{
            const tokenid = await prisma.token_manager.findUnique({
                where: {
                    token: token,
                    token_type: parseInt(`${type}`),
                    expires_at: {
                        gt: new Date()
                    }
                }
            })
            if (!tokenid){
                res.status(404).json({ error: 'Usuário não encontrado' })
                return
            }

            const user = await prisma.users.findUnique({
                where: {
                    id: tokenid.owner_id,
                    fullname: `${name}`
                }
            })
            if (!user){
                res.status(404).json({ error: 'Usuário não encontrado' })
                return
            }

            res.status(200).json({ message: 'Token Válido', token: tokenid })
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }

    static async createUser (req: Request, res: Response){
        const { userId, login, password, display_name } = req.body

        if (!userId || `${userId}`.length <= 0 || !login || `${login}`.length <= 0 || !password || `${password}`.length <= 0 ){
            res.status(400).json({ error: "'name' e 'type' são obrigatórios" })
            return
        }

        try{
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) return res.status(500).json({ error: err })
                
                const user = await prisma.reg_users.create({
                    data: {
                        origin_id: Number(userId),
                        login,
                        password: hashedPassword,
                        display_name
                    }
                })
                await prisma.token_manager.deleteMany({
                    where: {
                        owner_id: Number(userId),
                        token_type: 1
                    }
                })
                await prisma.users.update({
                    where: { id: Number(userId) },
                    data: { reg: 1 }
                })

                createSession(userId, res)
                res.status(201).json(user)
            })
        }
        catch (err){
            res.status(500).json({ error: err })
        }
    }
    static async loginUser (req: Request, res: Response){
        const { login, password } = req.body

        try{
            const user = await prisma.reg_users.findFirst({
                where: {
                    login: login
                }
            })
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' })
                return
            }

            bcrypt.compare(password, user.password, async (err, result) => {
                if (err) return res.status(500).json({ error: err })

                if (result){
                    createSession(user.origin_id, res)
                    res.status(200).json({ message: 'Logado com sucesso', user })
                }
                else res.status(401).json({ message: 'Senha incorreta' })
            })
        }
        catch (err){
            res.status(500).json({ error: err })
        }
    }

    static async resetPassword (req: Request, res: Response){
        const { token, password } = req.body

        if (!token || `${token}`.length <= 0 || !password || `${password}`.length <= 0){
            res.status(400).json({ error: "'token' e 'password' são obrigatórios" })
            return
        }

        try{
            const user = await prisma.token_manager.findUnique({
                where:{
                    token: token,
                    token_type: 2,
                },

                select:{
                    owner_id: true
                }
            })
            if (!user) {
                res.status(404).json({ error: "Token inválido ou não encontrado" })
                return
            }

            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) return res.status(500).json({ error: err })

                await prisma.reg_users.update({
                    where: {
                        origin_id: user.owner_id
                    },
                    data: {
                        password: hashedPassword
                    }
                })

                await prisma.token_manager.delete({
                    where: {
                        token: token,
                        token_type: 2
                    }
                })

                const updatedUser = await prisma.reg_users.findFirst({
                    where: {
                        origin_id: user.owner_id
                    }
                })

                createSession(user.owner_id, res)
                res.status(200).json({ message: "Senha atualizada com sucesso", user: updatedUser })
            })
        }
        catch (err){
            res.status(500).json({ error: err })
        }
    }
    static async changeInfos (req: Request, res: Response){
        upload(req, res, async (err) =>{
            const { login, display_name } = req.body
            const photo = req.file?.buffer
            const { userId } = req.params

            try{
                if (login||display_name||photo){
                    if (login){
                        await prisma.reg_users.update({
                            where: {
                                origin_id: Number(userId)
                            },
                            data: {
                                login: login,
                                is_old: 0
                            }
                        })
                    }
                    if (display_name){
                        await prisma.reg_users.update({
                            where: {
                                origin_id: Number(userId)
                            },
                            data: {
                                display_name: display_name
                            }
                        })
                    }
                    if (photo){
                        await prisma.users.update({
                            where: {
                                id: Number(userId)
                            },
                            data: {
                                photo: photo
                            }
                        })
                    }
                    res.status(200).json({ message: 'Dados alterados com sucesso' })
                }
                else{
                    res.status(400).json({ message: 'Nenhum dado enviado' })
                }
            }
            catch (err) {
                res.status(500).json({ error: err })
            }
        })
    }

    static async verifySession (req: Request, res: Response){
        try{
            const token = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY

            if (!token){
                res.status(401).json({ message: 'Não autorizado' })
                return
            }

            res.header('Cache-Control', 'no-store')

            const user = jwt.verify(token, `${jwtkey}`)
            res.status(200).json({ message: 'Autorizado', user })
        }
        catch (err){
            res.status(403).json({ message: 'Token inválido' })
        }
    }
    static async destroySession (req: Request, res: Response){
        deleteSession(res)
        res.status(200).json({message: 'Cookie Destruido'})
    }

    static async firebaseLogin (req: Request, res: Response){
        const { firebaseToken } = req.body

        try{
            verifyIdToken(firebaseToken)
            .then(async (response)=>{
                const user = await prisma.users.findFirst({
                    where: {
                        email: response.email
                    },
                    select: {
                        id: true,

                        reg_users: {
                            select: {
                                origin_id: true,
                                login: true,
                                password: true,
                                display_name: true,
                                is_old: true
                            }
                        }
                    }
                })
                if (user){
                    if (user.reg_users){
                        createSession(user.reg_users.origin_id, res)
                        res.status(200).json({ message: 'Logado com sucesso', user })
                        return
                    }
                    else{
                        const splitemail = response.email?.split('@')

                        const createdUser = await prisma.reg_users.create({
                            data: {
                                origin_id: user.id,
                                login: splitemail![0]+'@',
                                password: "#@#firebaselogin",
                            }
                        })

                        await prisma.users.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                reg: 1
                            }
                        })

                        createSession(user.id, res)
                        res.status(201).json({ message: 'Usuário criado', user: createdUser })
                    }
                }
                else{
                    res.status(404).json({ error: 'Usuário não encontrado' })
                    return
                }
            })
        }
        catch (err){
            res.status(500).json({ error: err })
        }
    }
}