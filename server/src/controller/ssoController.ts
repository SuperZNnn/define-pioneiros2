import { Request, Response } from "express";
import { prisma } from "./usersController";
import bcrypt from 'bcrypt'
import { createSession, deleteSession } from "../services/cookiesManager";
import jwt from 'jsonwebtoken'
import { allowedOrigins } from "..";
import { verifyIdToken } from "../services/firebase";
import multer from 'multer'
import { internalCreateToken } from "../services/TokenService";

const upload = multer({ storage: multer.memoryStorage() })
const uploadImages = upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
])

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

        const tokenType = parseInt(type)
        const userIdInt = parseInt(userId)
        const responsavel = resp === 'true' || resp === '1'

        const result = await internalCreateToken(userIdInt, tokenType, responsavel)

        if (!result.success) {
            res.status(400).json({ error: result.error })
            return
        }

        res.status(201).json({ message: result.message })
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
        uploadImages(req, res, async (err) =>{
            const { login, display_name } = req.body
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const photo = files?.photo?.[0]?.buffer;
            const banner = files?.banner?.[0]?.buffer;
            const { userId } = req.params

            try{
                if (login||display_name||photo||banner){
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
                    if (banner){
                        await prisma.reg_users.update({
                            where: {
                                origin_id: Number(userId)
                            },
                            data: {
                                banner: banner
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

    static async createSessionByToken (req: Request, res: Response){
        const { token } = req.params
        const { name } = req.body

        if (!name || `${name}`.length <= 0){
            res.status(400).json({ error: "'name' é obrigatório" })
            return
        }

        try{
            const tokenid = await prisma.token_manager.findUnique({
                where: {
                    token: token,
                    token_type: 3,
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
                },
                select: {
                    id: true,
                    reg_users: true
                }
            })
            if (!user){
                res.status(404).json({ error: 'Usuário não encontrado' })
                return
            }

            createSession(user.id, res)
            await prisma.token_manager.delete({
                where: {
                    token: token,
                    token_type: 3
                }
            })
            res.status(200).json({ message: 'Autorizado', user: user.reg_users })
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }
}