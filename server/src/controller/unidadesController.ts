import { Request, Response } from "express";
import { prisma } from "./usersController";

export class UnidadesController {
    static async getUnidades (req: Request, res: Response){
        try{
            const unidades = await prisma.unidade_info.findMany()
            const membros = await prisma.unidade_member.findMany()
            if (!unidades){
                res.status(404).json({ message: 'Não há unidades' })
                return
            }
            const formattedUnidades = unidades.map(user => {   
                return {
                    ...user,
                    photo: user.photo ? Buffer.from(user.photo).toString('base64') : null
                }     
            })

            res.status(200).json({ message: 'Sucesso', unidades: formattedUnidades, membros })
        }
        catch (err){
            res.status(500).send(err)
        }
    }

    static async changeMember (req: Request, res: Response){
        const { userId } = req.params
        const { unidade, cargo } = req.body

        try{
            if (cargo){
                await prisma.unidade_member.update({
                    where:{
                        member_id: parseInt(userId)
                    },
                    data: {
                        cargo: cargo
                    }
                })
            }
            if (unidade){
                await prisma.unidade_member.update({
                    where:{
                        member_id: parseInt(userId)
                    },
                    data: {
                        unidade_cod: unidade
                    }
                })
                await prisma.users.update({
                    where: {
                        id: parseInt(userId)
                    },
                    data: {
                        unidade: unidade
                    }
                })
            }
            res.status(200).json({ message: 'Success' })
        }
        catch (err){
            res.status(500).send(err)
        }
    }
    static async setNew (req: Request, res: Response){
        const { userId } = req.params
        const { unidade, cargo } = req.body

        try{
            await prisma.users.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                    unidade: unidade
                }
            })
            await prisma.unidade_member.create({
                data: {
                    member_id: parseInt(userId),
                    unidade_cod: unidade,
                    cargo: cargo
                }
            })
            res.status(201).json({ message: 'Success' })
        }
        catch (err){
            console.log(err)
            res.status(500).send(err)
        }
    }
}