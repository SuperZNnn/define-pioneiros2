import { Request, Response, NextFunction } from 'express';
import { AdmFuncs, prisma } from '../controller/usersController';
import jwt from 'jsonwebtoken'

export const systemMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.pdaSessionCookie
    const jwtkey = process.env.JWT_KEY

    try{
        const jwtUser = jwt.verify(sessionToken, `${jwtkey}`) as { exp: number, iat: number, userId: number }
        if (!jwtUser){
            res.status(401).json({ message: 'Não autorizado' })
            return
        }

        const user = await prisma.users.findUnique({
            where: {
                id: Number(jwtUser.userId)
            },
            select:{
                funcao: true
            }
        })

        if (user?.funcao && AdmFuncs.includes(user.funcao)){
            next()
        }
        else{
            res.status(401).json({ message: 'Não autorizado' })
        }
    }
    catch (err){
        res.status(401).json({ message: 'Não autorizado' })
    }
}