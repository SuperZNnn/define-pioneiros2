import { Response } from 'express'
import jwt from 'jsonwebtoken'

export const createSession = (userId: number, res: Response) => {
    const jwtkey = process.env.JWT_KEY

    const jwtToken = jwt.sign({ userId }, `${jwtkey}`, { expiresIn: '4h' })
    res.cookie('pdaSessionCookie', jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        domain: 'localhost',
        path: '/',
        maxAge: 4 * 60 * 60 * 1000
    })
}
export const deleteSession = (res: Response) => {
    res.clearCookie('pdaSessionCookie', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        domain: 'localhost', // <--- ESSENCIAL
    })
}