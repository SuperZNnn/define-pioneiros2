import { PrismaClient } from "../generated/prisma"
import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { toUpdate } from "../types/users"
import { dateByString } from "../services/generators"

export const prisma = new PrismaClient()
export const AdmFuncs = ['Diretor', 'Diretora', 'Diretor Associado', 'Diretora Associada', 'Secretário', 'Secretária']

export class UsersController {
    static async getAll (req: Request, res: Response) {
        const { wphoto } = req.query
        const showPhoto = wphoto === 'true' || wphoto === '1'

        try {
            const sessionToken = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY
            
            let sessionuser
            if (sessionToken){
                const jwtUser = jwt.verify(sessionToken, `${jwtkey}`) as { exp: number, iat: number, userId: number }

                sessionuser = await prisma.users.findUnique({
                    where: {
                        id: jwtUser.userId
                    }
                })
            }

            const users = await prisma.users.findMany({
                select: {
                    id: true,
                    fullname: true,
                    photo: true,
                    funcao: true,
                    nascimento: true,
                    telefone: true,
                    telefone_responsavel: true,
                    email: true,
                    email_responsavel: true,
                    reg: true,
                    sgc_code: true,
                    cpf: true,
                    status: true,
                    pix: true
                },
                orderBy: {
                    fullname: 'asc'
                }
            })

            if (sessionuser?.funcao && AdmFuncs.includes(sessionuser?.funcao)){
                const formattedUsers = users.map(user => {
                    if (showPhoto){
                        return {
                            ...user,
                            photo: user.photo ? Buffer.from(user.photo).toString('base64') : null
                        }
                    }
                    else{
                        return{
                            ...user,
                            photo: null
                        }
                    }
                })

                res.status(200).send(formattedUsers)
            }
            else{
                const formattedUsers = users.map(user => {
                    let base
                    base = {
                        id: user.id,
                        fullname: user.fullname,
                        funcao: user.funcao,
                        nascimento: user.nascimento,
                        telefone: user.telefone?true:false,
                        telefone_responsavel: user.telefone_responsavel?true:false,
                        email: user.email?true:false,
                        email_responsavel: user.email_responsavel?true:false,
                        reg: user.reg,
                        status: user.status,
                        pix: user.pix
                    }

                    if (showPhoto) {
                        return {
                            ...base,
                            photo: user.photo ? Buffer.from(user.photo).toString('base64') : null
                        }
                    }
                    else {
                        return base
                    }
                })

                res.status(200).send(formattedUsers)
            }
        }
        catch (err) {
            res.status(500).send(err)
        }

    }
    static async getAllDisplay (req: Request, res: Response){
        try{
            const usersDisplay = await prisma.reg_users.findMany({
                select: {
                    origin_id: true,
                    display_name: true
                }
            })

            res.status(200).json({ usersDisplay })
        }
        catch (err){
            res.status(500).send(err)
        }
    }

    static async getByLogin (req: Request, res: Response){
        const { login } = req.params
        const { wphoto } = req.query

        const showPhoto = wphoto === 'true' || wphoto === '1'

        try{
            const user = await prisma.reg_users.findMany({
                select: {
                    users: {
                        select: {
                            id: true,
                            fullname: true,
                            photo: true,
                            funcao: true,
                            nascimento: true,
                            telefone: true,
                            telefone_responsavel: true,
                            email: true,
                            email_responsavel: true,
                            reg: true
                        }
                    }
                },
                where:{
                    login: login
                }
            })

            if (user){
                let base: any = {
                    id: user[0].users.id,
                    fullname: user[0].users.fullname,
                    funcao: user[0].users.funcao,
                    nascimento: user[0].users.nascimento,
                    telefone: user[0].users.telefone?true:false,
                    telefone_responsavel: user[0].users.telefone_responsavel?true:false,
                    email: user[0].users.email?true:false,
                    email_responsavel: user[0].users.email_responsavel?true:false,
                    reg: user[0].users.reg,
                }

                if (showPhoto) {
                    base = {
                        ...base,
                        photo: user[0].users.photo ? Buffer.from(user[0].users.photo).toString('base64') : null
                    }
                }
                res.status(200).json({ user: base })
            }
            else{
                res.status(404).json({ error: 'Usuário não encontrado' })
            }
        }
        catch(err){
            res.status(500).send(err)
        }
    }

    static async getUser (req: Request, res: Response){
        const { id } = req.params

        try{
            const sessionToken = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY

            const user = await prisma.users.findUnique({
                where: {
                    id: Number(id)
                }
            })
            const jwtUser = jwt.verify(sessionToken, `${jwtkey}`) as { exp: number, iat: number, userId: number }

            const formattedUsers = {
                ...user,
                photo: user?.photo ? Buffer.from(user.photo).toString('base64') : null
            }

            if (user?.id === jwtUser.userId){

                res.status(200).json({ message: 'Autorizado', user: formattedUsers })
            }
            else{
                const reqUser = await prisma.users.findUnique({
                    where: {
                        id: jwtUser.userId
                    },
                    select: {
                        funcao: true
                    }
                })

                if (reqUser?.funcao && AdmFuncs.includes(reqUser.funcao)){
                    res.status(200).json({ message: 'Autorizado', user: formattedUsers })
                }
                else{
                    res.status(401).json({ message: 'Não autorizado' })
                }
            }
        }
        catch(err){
            res.status(500).send(err)
        }
    }
    static async getUserDisplay (req: Request, res: Response) {
        try{
            const sessionToken = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY
            const jwtUser = jwt.verify(sessionToken, `${jwtkey}`) as { exp: number, iat: number, userId: number }

            const user = await prisma.reg_users.findUnique({
                where: {
                    origin_id: Number(jwtUser.userId)
                },
                select: {
                    login: true,
                    is_old: true,
                    display_name: true
                }
            })
            if (user){
                res.status(200).json({ message: 'Autorizado', user })
            }
            else{
                res.status(401).json({ message: 'Não autorizado' })
            }
            
        }
        catch (err){
            res.status(500).send(err)
        }
    }

    static async updateUsers (req: Request, res: Response){
        const { userId } = req.params
        const { data } = req.body

        const UserData = data as toUpdate

        try{
            const updateduser = await prisma.users.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    cpf: UserData.cpf,
                    email: UserData.email,
                    email_responsavel: UserData.email_responsavel,
                    fullname: UserData.fullname,
                    funcao: UserData.funcao,
                    mae: UserData.mae,
                    pai: UserData.pai,
                    responsavel: UserData.responsavel,
                    nascimento: dateByString(UserData.nascimento??''),
                    telefone: UserData.telefone,
                    telefone_responsavel: UserData.telefone_responsavel
                },
                select:{
                    cpf: true,
                    email: true,
                    email_responsavel: true,
                    fullname: true,
                    funcao: true,
                    mae: true,
                    pai: true,
                    responsavel: true,
                    nascimento: true,
                    telefone: true,
                    telefone_responsavel: true
                }
            })

            res.status(200).json({ message: 'Alterado com sucesso', updateduser })
        }
        catch(err){
            res.status(500).send(err)
        }
    }

    static async inativeUser (req: Request, res: Response){
        const { userid } = req.params

        try{
            await prisma.users.update({
                where: {
                    id: Number(userid)
                },
                data: {
                    status: 0
                }
            })
            res.status(200).json({ message: 'Usuário inativado' })
        }
        catch(err){
            res.status(500).send(err)
        }
    }
    static async reativeUser (req: Request, res: Response){
        const { userid } = req.params

        try{
            await prisma.users.update({
                where: {
                    id: Number(userid)
                },
                data: {
                    status: 1
                }
            })
            res.status(200).json({ message: 'Usuário ativado' })
        }
        catch(err){
            res.status(500).send(err)
        }
    }
}