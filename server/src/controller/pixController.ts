import { Request, Response } from "express";
import { prisma } from "./usersController";
import jwt from 'jsonwebtoken'
import Decimal from "decimal.js";

export class PixController{
    static async getTransactions (req: Request, res: Response){
        try{
            const token = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY

            if (!token){
                res.status(401).json({ message: 'Não autorizado' })
                return
            }
            res.header('Cache-Control', 'no-store')
            const user = jwt.verify(token, `${jwtkey}`) as { userId: number }

            const sends = await prisma.pix_history.findMany({
                where:{
                    from: user.userId
                }
            })
            const recieves = await prisma.pix_history.findMany({
                where: {
                    to: user.userId
                }
            })
            res.status(200).json({ sends, recieves })
        }
        catch(err){
            res.status(500).json({ error: err })
        }
    }
    static async SendTo (req: Request, res: Response) {
        const { to } = req.params
        const { amount } = req.body

        try{
            const token = req.cookies.pdaSessionCookie
            const jwtkey = process.env.JWT_KEY

            if (!token){
                res.status(401).json({ message: 'Não autorizado' })
                return
            }
            res.header('Cache-Control', 'no-store')
            const user = jwt.verify(token, `${jwtkey}`) as { userId: number } 

            const formattedAmount = new Decimal(amount.replace(',', '.'))

            await prisma.$transaction(async (tx) => {
                const sender = await tx.users.findUnique({
                    where: { id: user.userId },
                    select: { pix: true }
                })
                if (!sender || sender.pix < formattedAmount){
                    res.status(406).json({ message: 'Sem saldo!' })
                    return
                }
                await tx.pix_history.create({
                    data: {
                        from: user.userId,
                        to: Number(to),
                        value: formattedAmount
                    }
                })
                await tx.users.update({
                    where: { id: user.userId },
                    data: {
                        pix: {
                            decrement: formattedAmount
                        }
                    }
                })
                await tx.users.update({
                    where: { id: Number(to) },
                    data: {
                        pix: {
                            increment: formattedAmount
                        }
                    }
                })
            })
            res.status(200).json({ message: 'Pix Enviado!' })
        }
        catch (err){
            res.status(500).json({ error: err })
        }
    }
}