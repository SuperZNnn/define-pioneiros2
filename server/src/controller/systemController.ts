import { Request, Response } from "express";
import { prisma } from "./usersController";

export class SystemController{
    static async getAllTokens (req: Request, res: Response){
        try{
            const tokens = await prisma.token_manager.findMany()
            res.status(200).json(tokens)
        }
        catch (err){
            res.status(500).send(err)
        }
    }

    static async add30minutes (req: Request, res: Response){
        const { token } = req.params

        try{
            const existingToken = await prisma.token_manager.findUnique({
                where: {
                    token: token
                }
            })
            if (!existingToken){
                res.status(404).json({ message: 'Token não encontrado' })
                return
            }

            const newExpiresAt = new Date(existingToken.expires_at.getTime() + 30 * 60 * 1000)

            await prisma.token_manager.update({
                where:{
                    token: token
                },
                data:{
                    expires_at: newExpiresAt
                }
            })

            res.status(200).json({ message: 'Token atualizado' })
        }
        catch(err){
            res.status(500).send(err)
        }
    }

    static async deleteToken (req: Request, res: Response){
        const { token } = req.params

        try{
            await prisma.token_manager.delete({
                where: {
                    token: token
                }
            })

            res.status(200).json({ message: 'Deletado com sucesso' })
        }
        catch(err){
            res.status(500).send(err)
        }
    }
}