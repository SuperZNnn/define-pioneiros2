import { prisma } from "../controller/usersController";
import { generateUrlFriendlyToken } from "./generators";
import { FinishRegisterMessage, ForgotPasswordMessage } from "./emailsMessages";
import { sendEmail } from './email'

export class TokenService{
    static async deleteExpiredTokens () {
        try{
            const result = await prisma.token_manager.deleteMany({
                where: {
                    expires_at: {
                        lt: new Date()
                    }
                }
            })

            return result.count
        }
        catch (err){
            console.log(err)
            throw err
        }
    }
}

export const internalCreateToken = async (
  userId: number,
  tokenType: number,
  responsavel: boolean,
  whatsapp?: boolean

): Promise<{ success: boolean; message?: string; error?: string, token?: string }> => {
  if (!userId || `${userId}`.length <= 0) {
    return { success: false, error: 'userId é obrigatório' }
  }

  if (![1, 2].includes(tokenType)) {
    return { success: false, error: 'Tipo de token inválido' }
  }

  try {
    const existingToken = await prisma.token_manager.findFirst({
      where: {
        owner_id: userId,
        token_type: tokenType,
        expires_at: {
          gt: new Date()
        }
      }
    })

    if (existingToken) {
      return { success: false, error: 'Já existe um token válido para este usuário.' }
    }

    const regUser = await prisma.reg_users.findUnique({
      where: { origin_id: userId }
    })

    if (tokenType === 1 && regUser) {
      return { success: false, error: 'Este usuário já está registrado. Não é possível gerar um token de validação de email.' }
    }

    if (tokenType === 2 && !regUser) {
      return { success: false, error: 'Este usuário não está registrado. Não é possível gerar um token de recuperação de senha.' }
    }

    let tokenExists = true
    let token = ''

    while (tokenExists) {
      token = generateUrlFriendlyToken(10)
      tokenExists = await prisma.token_manager.findUnique({ where: { token } }) !== null
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    const createdToken = await prisma.token_manager.create({
      data: {
        owner_id: userId,
        token,
        token_type: tokenType,
        expires_at: expiresAt
      }
    })

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        fullname: true,
        email: true,
        email_responsavel: true
      }
    })

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    if (!whatsapp){
      const message =
        tokenType === 1
          ? FinishRegisterMessage(user.fullname, createdToken.token, responsavel)
          : ForgotPasswordMessage(user.fullname, createdToken.token, responsavel)

      const subject =
        tokenType === 1 ? 'Finalize seu registro' : 'Recupere sua senha'

      const email = responsavel ? user.email_responsavel : user.email
      if (!email) {
        await prisma.token_manager.delete({
          where:{
            token: token
          }
        })

        return { success: false, error: 'Usuário não possui e-mail válido para envio.' }
      }

      sendEmail(message, subject, email)
    }

    return { success: true, message: 'Token criado com sucesso', token: createdToken.token }
  }
  catch (err) {
    return { success: false, error: 'Erro interno no servidor' }
  }
}
