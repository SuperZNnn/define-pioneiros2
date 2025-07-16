import { Request, Response, NextFunction } from 'express'
import { TokenService } from '../services/TokenService'

export async function cleanExpiredTokens (req: Request, res: Response, next: NextFunction) {
    try{
        await TokenService.deleteExpiredTokens()
    }
    catch(err){
        console.error(err)
    }
    next()
}