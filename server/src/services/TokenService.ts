import { prisma } from "../controller/usersController";

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