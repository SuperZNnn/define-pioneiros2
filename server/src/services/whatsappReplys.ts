import { AdmFuncs, prisma } from "../controller/usersController"
import Whatsapp from 'whatsapp-web.js'
import { internalCreateToken } from "./TokenService"
import { ssoPrefix } from "./emailsMessages"

type ActionState = {
    action: 'sgc_code' | 'sleep' | 'finishregister',
    status: 'waiting_number' | 'sleep' | 'waiting_confirmation' | 'waiting_name' | 'wait_try_confirm'
    forUser?: { telefone?: string | null, telefone_responsavel?: string | null, cpf?: string | null, id: number } 
}

const userStates = new Map<string, ActionState>()
const userTimeouts = new Map<string, NodeJS.Timeout>()

const setInactivityTimeout = (number: string) => {
    if (userTimeouts.has(number)) {
        clearTimeout(userTimeouts.get(number)!)
    }

    const timeout = setTimeout(() => {
        userStates.set(number, { action: 'sleep', status: 'sleep' })
        userTimeouts.delete(number)
    }, 60 * 1000)

    userTimeouts.set(number, timeout)
}

export const WhatsAppReplys = async (message: Whatsapp.Message) => {
    const noSufix = message.from.replace('@c.us', '')
    const onlyNumber = noSufix.startsWith('55') ? noSufix.slice(2) : noSufix
    const ddd = onlyNumber.slice(0,2)
    const rest = onlyNumber.slice(2)

    const number = `${ddd}9${rest}`

    const users = await prisma.users.findMany({
        where:{
            OR:[
                { telefone: number },
                { telefone_responsavel: number },
            ]
        },
        select: {
            sgc_code: true,
            fullname: true,
            telefone: true,
            funcao: true,
        }
    })
    
    const state = userStates.get(number) || {action: 'sleep', status: 'sleep'}

    // Código SGC
    if (state.action === 'sleep' && message.body.toLowerCase().includes('sgc') && message.body.toLowerCase().includes('código')){
        if (users.length>0){
            setInactivityTimeout(number)

            if (users.length === 1){
                let text = `Olá *${users[0].fullname}*\nDeseja receber seu código do SGC?\n\n*1-* Sim\n*2-* Não, obrigado`
                
                const originPhone = users.find(item=>item.telefone === number)
                if (AdmFuncs.includes(originPhone?.funcao??'')) text += `\n*3-* Quero receber o código de outro membro`

                await message.reply(text)
                userStates.set(number, {action: 'sgc_code', status: "waiting_confirmation"})
            }
            else if (users.length === 2){
                userStates.set(number, {action: 'sleep', status: 'sleep'})
            }
            else{
                let text = `Olá, de quem você quer receber o código do SGC?\n\n`
                for (let i = 0; i < users.length; i++){
                    text += `*${i+1}-* ${users[i].fullname}\n`
                }

                const originPhone = users.find(item=>item.telefone === number)
                if (AdmFuncs.includes(originPhone?.funcao??'')) text += `*${users.length+1}-* Código de outro membro`

                await message.reply(text)
                userStates.set(number, {action: "sgc_code", status: 'waiting_number'})
            }
        }
    }
    if (state.action === 'sgc_code' && state.status === 'waiting_number'){
        setInactivityTimeout(number)

        const originPhone = users.find(item=>item.telefone === number)
        if (parseInt(message.body) <= users.length){
            await message.reply(`Código SGC de ${users[parseInt(message.body) - 1].fullname}:`)
            await message.reply(`${users[parseInt(message.body) - 1].sgc_code}`)
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
        else if (parseInt(message.body) === users.length + 1 && AdmFuncs.includes(originPhone?.funcao??'')){
            await message.reply('Certo.\nDigite o nome completo do membro que você deseja o código.')
            userStates.set(number, {action: 'sgc_code', status: 'waiting_name'})
        }
        else{
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
    }
    if (state.action === 'sgc_code' && state.status === 'waiting_confirmation'){
        setInactivityTimeout(number)

        const originPhone = users.find(item=>item.telefone === number)
        if (message.body === '1'){
            await message.reply('Seu código do SGC:')
            await message.reply(`${users[0].sgc_code}`)
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
        else if(message.body === '2'){
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
        else if (message.body === '3' && AdmFuncs.includes(originPhone?.funcao??'')){
            await message.reply('Certo.\nDigite o nome completo do membro que você deseja o código.')
            userStates.set(number, {action: 'sgc_code', status: 'waiting_name'})
        }
        else{
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
    }
    if (state.action === 'sgc_code' && state.status === 'waiting_name'){
        setInactivityTimeout(number)

        const name = message.body.toUpperCase()

        const ByNameUser = await prisma.users.findFirst({
            where: {
                fullname: name
            },
            select: {
                sgc_code: true
            }
        })
        if (!ByNameUser){
            await message.reply(`Membro inexistente, ou digitado incorretamente!\nDeseja tentar novamente?\n\n*1-* Sim\n*2-* Não`)
            userStates.set(number, {status: 'wait_try_confirm', action: 'sgc_code'})
        }
        else{
            await message.reply(`Código do SGC de *${name}*:`)
            await message.reply(`${ByNameUser.sgc_code}`)
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
    }
    if (state.action === 'sgc_code' && state.status === 'wait_try_confirm'){
        setInactivityTimeout(number)

        if (message.body === '1'){
            await message.reply('Certo.\nDigite o nome completo do membro que você deseja o código.')
            userStates.set(number, {action: 'sgc_code', status: 'waiting_name'})
        }
        else{
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
    }

    // Finalização de registro
    if (state.action === 'sleep' && /^Olá, gostaria de continuar o registro de \*.+\*$/.test(message.body.trim())){
        const match = message.body.trim().match(/^Olá, gostaria de continuar o registro de \*(.+)\*$/)
        setInactivityTimeout(number)
        
        const user = await prisma.users.findFirst({
            where: {
                fullname: match![1],
                reg: 0
            },
            select: {
                telefone: true,
                telefone_responsavel: true,
                cpf: true,
                id: true
            }
        })

        if (!user){
            await message.reply('Desculpe, mas esse usuário não está disponível!')
            userStates.set(number, {action: 'sleep', status: 'sleep'})
            return
        }

        if (user.telefone === number || user.telefone_responsavel === number){
            const result = await internalCreateToken(user.id, 1, user.telefone === number, true)

            if (!result.success) {
                if (result.error){
                    if (result.error === 'Já existe um token válido para este usuário.'){
                        await message.reply('*Token já gerado!*')
                        userStates.set(number, {action: 'sleep', status: 'sleep'})
                        return
                    }
                }

                await message.reply('*Erro interno!*\nPor favor tente novamente mais tarde!')
                userStates.set(number, {action: 'sleep', status: 'sleep'})
                return
            }

            if (result.token && match){
                await message.reply(`*Sucesso!*\nContinue seu registro em:`)
                await message.reply(`${ssoPrefix}/finishregister/${result.token}/${encodeURIComponent(match[1])}`)
                userStates.set(number, {action: 'sleep', status: 'sleep'})
            }
        }
        else{
            await message.reply('Desculpe, este número não está vinculado a este usuário!\nDeseja comprovar sua identidade?\n\n*1-* Sim\n*2-* Não')
            userStates.set(number, {action: 'finishregister', status: 'wait_try_confirm', forUser: user})
        }
    }
    if (state.action === 'finishregister' && state.status === 'wait_try_confirm'){
        setInactivityTimeout(number)

        if (message.body === '1'){
            await message.reply('Ok!\nDigite seu cpf (apenas números, sem pontos e traços)')
            userStates.set(number, {action: 'finishregister', status: 'waiting_number', forUser: state.forUser})
        }
        else{
            userStates.set(number, {action: 'sleep', status: 'sleep', forUser: undefined})
        }
    }
    if (state.action === 'finishregister' && state.status === 'waiting_number'){
        setInactivityTimeout(number)

        const user = await prisma.users.findFirst({
            where: {
                id: userStates.get(number)?.forUser?.id
            },
            select: {
                fullname: true
            }
        })

        if (state.forUser?.cpf && state.forUser?.cpf === message.body){
            const result = await internalCreateToken(userStates.get(number)!.forUser!.id, 1, false, true)

            if (!result.success) {
                if (result.error){
                    if (result.error === 'Já existe um token válido para este usuário.'){
                        await message.reply('*Token já gerado!*')
                        userStates.set(number, {action: 'sleep', status: 'sleep'})
                        return
                    }
                }

                await message.reply('*Erro interno!*\nPor favor tente novamente mais tarde!')
                userStates.set(number, {action: 'sleep', status: 'sleep'})
                return
            }

            if (result.token){
                await message.reply(`*Sucesso!*\nContinue seu registro em:`)
                await message.reply(`${ssoPrefix}/finishregister/${result.token}/${encodeURIComponent(user!.fullname)}`)
                userStates.set(number, {action: 'sleep', status: 'sleep'})
            }
        }
        else{
            await message.reply('Não foi possível validar seu contato!')
            userStates.set(number, {action: 'sleep', status: 'sleep'})
        }
    }
}