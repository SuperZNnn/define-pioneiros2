import express, { json } from 'express'
import usersRouter from './router/usersRouter'
import cors from 'cors'
import WhatsappRouter, { sendBdayMessage } from './services/whatsapp'
import dotenv from 'dotenv'
import SsoRouter from './router/ssoRouter'
import { cleanExpiredTokens } from './middlewares/cleanExpiredTokens'
import cookieParser from 'cookie-parser'
import SystemRouter from './router/systemRouter'
import path from 'path'
import PhotoServerRouter from './router/photoServerRouter'
import schedule from 'node-schedule'
import { prisma } from './controller/usersController'
import PixRouter from './router/pixRouter'
import UnidadesRouter from './router/unidadesRouter'

dotenv.config()

const app = express()
const port = 3000

export const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000'
]

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.includes(origin)){
            return callback(null, true)
        }
        else{
            return callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(json())
app.use(cookieParser())
app.use(cleanExpiredTokens)

app.use(PhotoServerRouter)
app.use(PixRouter)
app.use(UnidadesRouter)
app.use(usersRouter)
app.use(SsoRouter)
app.use(WhatsappRouter)
app.use(SystemRouter)

app.listen(port, ()=> {
    console.log(`Servidor rodando em http://localhost:${port}`)
}).on('error', (err) => {
    console.error('Erro ao iniciar o servidor:', err.message)
})

schedule.scheduleJob('00 11 * * *', async () => {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()

    try{
        const usersBdayToday = await prisma.$queryRaw`
            SELECT
                u.id,
                u.fullname,
                u.funcao,
                u.genero,
                ru.display_name
            FROM users u
            LEFT JOIN reg_users ru ON u.id = ru.origin_id
            WHERE MONTH(u.nascimento) = ${month} AND DAY(u.nascimento) = ${day}
        `
        const users = usersBdayToday as { id: number, fullname: string, funcao: string, genero: 'm'|'f', display_name?: string }[]
        
        if (users.length > 0){
            console.log('Enviando')
            for (const user of users){
                try{
                    await sendBdayMessage(user.id, user?.display_name?.toUpperCase()??user.fullname, user.funcao, user.genero )
                    console.log(`Enviado ${user.id}`)
                }
                catch(err){
                    console.log(err)
                }
            }
        }
    }
    catch(err){
        console.log(err)
    }
})