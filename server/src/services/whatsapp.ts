import { Request, Response } from "express"
import Whatsapp, { Client, MessageMedia } from 'whatsapp-web.js'
import qrcode from 'qrcode'
import { Router } from 'express';
import { generateBdayPhoto, getIdade } from "./generators";
import { WhatsAppReplys } from "./whatsappReplys";

const client = new Client({
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    },

    authStrategy: new Whatsapp.LocalAuth()
})

let latestQr: string | null = null
let clientReady = false

client.on("qr", async (qr: any) => {
    latestQr = qr
})

client.on("ready", async () => {
    console.log("Whatsapp conectado!")
    clientReady = true
})

client.on("disconnected", async () => {
    if (clientReady){
        console.log("Whatsapp deconectado")
        clientReady = false

        await client.destroy()
        await client.initialize()
        console.log('Cliente inicializado')
    }
})
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado', error)
})

// Mensagens
client.on('message', WhatsAppReplys)

const WhatsappRouter = Router()
WhatsappRouter.get('/whatsapp/qrcode', async (req: Request, res: Response) => {
    try{
        if (clientReady){
            res.status(201).json({ message: 'Cliente já conectado' })
            return
        }

        if (latestQr){
            const qrImageBuffer = await qrcode.toBuffer(latestQr, { type: "png" })
            res.set("Content-Type", "image/png")
            res.status(200).send(qrImageBuffer)
        }
        else{
            res.status(404).json({ error: "Qr code não gerado" })
        }
    }
    catch (err) {
        res.status(500).send('Erro interno')
    }
})

export const newBePathfinderMessage = async (data: {bairro?: string, city: string, name: string, nascimento: string, rua?: string, state: string, email?: string, phone: string, respPhone?: boolean}) => {
    try{
        if (clientReady){
            const idade = getIdade(data.nascimento)

            let text = `*Novo Interessado*
*Informações Pessoais*
*Nome*: ${data.name}
*Nascimento*: ${data.nascimento}
*Idade*: ${idade}

*Localidade*
*Cidade*: ${data.city} - ${data.state}`
            if (data.bairro) text += `\n*Bairro*: ${data.bairro}`
            if (data.rua) text += `\n*Rua*: ${data.rua}`
            
            text += `\n\n*Contato*
*Celular*: ${data.phone} ${data.respPhone?'(Responsável)':''}`
            if (data.email) text += `*Email*: \n${data.email}`

            await client.sendMessage(`${process.env.DIRETOR_PHONE}@c.us`, text)
            return {message: 'Success'}
        }
        else{
            setTimeout(() => {newBePathfinderMessage(data)}, 500)
        }
    }
    catch(err){
        throw err
    }
}

export const sendBdayMessage = async (userid: number, name: string, funcao: string, gender: 'f'|'m') => {
    const imageBuffer = await generateBdayPhoto(userid)
    const chatId = `${process.env.TEST_PHONE}@c.us`

    const media = new MessageMedia(
        'image/png',
        imageBuffer.toString('base64'),
        'bday.png'
    )

    const frases = {
        m: [
            `Parabéns, *${name}*! Que sua jornada seja sempre guiada por fé e esperança!`,
            `Feliz aniversário, meu querido *${funcao}*! Que sua luz continue a brilhar e inspirar a todos!`,
            `Que neste novo ciclo, *${name}*, você receba em dobro todo o bem que espalha!`,
            `Feliz vida, *${name}*! Que os planos de Deus se cumpram com perfeição em sua caminhada!`,
            `Parabéns, meu *${funcao}*! Que cada dia seja uma nova oportunidade para viver os sonhos de Deus!`,
            `Feliz aniversário, *${name}*! Que a paz, o amor e a fé estejam sempre presentes em sua vida!`,
            `Que o seu dia, *${name}*, seja especial como você é para todos nós!`,
            `Meu *${funcao}*, que seu novo ano seja marcado por conquistas, saúde e muitas alegrias!`,
            `Feliz aniversário, *${name}*! Que Deus continue te fortalecendo e capacitando a cada passo!`,
            `Parabéns, *${name}*! Que a graça divina te envolva hoje e sempre!`
        ],
        f: [
            `Parabéns, *${name}*! Que sua caminhada continue iluminada pela presença de Deus!`,
            `Feliz aniversário, minha querida *${funcao}*! Que sua vida floresça a cada novo amanhecer!`,
            `Que neste dia especial, *${name}*, o céu sorria pra você e Deus te cubra com amor!`,
            `Feliz vida, *${name}*! Que cada sonho seu esteja alinhado com os planos de Deus!`,
            `Parabéns, minha *${funcao}*! Que sua doçura e força continuem sendo bênçãos para todos ao seu redor!`,
            `Feliz aniversário, *${name}*! Que o Senhor derrame saúde, paz e realizações sobre você!`,
            `Que o seu novo ano, *${name}*, seja cheio de motivos para sorrir e agradecer!`,
            `Minha *${funcao}*, que Deus te envolva em abraços de amor e alegria neste novo ciclo!`,
            `Feliz aniversário, *${name}*! Que você continue sendo luz por onde passar!`,
            `Parabéns, *${name}*! Que sua vida seja reflexo da graça e bondade do nosso Deus!`
        ]
    }


    try{
        if (clientReady){
            await client.sendMessage(chatId, media, { caption: frases[gender][Math.floor(Math.random() * frases[gender].length)] })
        }
        else{
            setTimeout(() => {
                sendBdayMessage(userid, name, funcao, gender)
            }, 5000);
        }
    }
    catch(err){
        console.log(err)
    }
}
client.initialize()

export default WhatsappRouter