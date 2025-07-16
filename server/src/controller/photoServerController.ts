import { Request, Response } from "express"
import { prisma } from "./usersController"

export class PhotoServerController {
    static async bdayPhoto (req: Request, res: Response){
        const { userid } = req.params

        const user = await prisma.users.findUnique({
            where: {
                id: Number(userid)
            },
            select:{
                fullname: true,
                nascimento: true,
                photo: true,
                funcao: true,
                reg_users: {
                    select:{
                        display_name: true
                    }
                }
            }
        })

        if (!user){
            res.status(404).json({ error: 'Usuário não encontrado' })
            return
        }

        const formattedPhoto = user?.photo ? Buffer.from(user!.photo).toString('base64') : null

        let backgroundTexture: { opacity: number, url: string }
        const nascimento = new Date(user.nascimento)
        const hoje = new Date()

        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const aniversarioEsteAno = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())
        if (hoje < aniversarioEsteAno) {
            idade -= 1
        }

        const nameParts = user.fullname.split(' ');
        const secondWord = nameParts[1]?.toLowerCase();
        const sliceCount = ["da", "do", "de"].includes(secondWord) ? 3 : 2;
        const showName = user.reg_users?.display_name || nameParts.slice(0, sliceCount).join(' ');

        if (['Diretor', 'Diretora', 'Diretor Associado', 'Diretora Associada'].includes(user.funcao)) {
            backgroundTexture = { url: '/assets/images/colors/gold_bg.png', opacity: 1 }
        }
        else if (['Desbravador', 'Desbravadora'].includes(user.funcao)) {
            const corPorIdade: Record<number, {url: string, opacity: number}> = {
                10: {url:'blue_bg.jpg', opacity: .7},
                11: {url:'red_bg.jpg', opacity: .6},
                12: {url:'green_bg.jpeg', opacity: .7},
                13: {url:'gray_bg.jpeg', opacity: .6},
                14: {url:'purple_bg.png', opacity: .6},
                15: {url:'yellow_bg.jpg', opacity: .5}
            }

            const cor = corPorIdade[idade]
            backgroundTexture = cor
                ? { url: `/assets/images/colors/${cor.url}`, opacity: cor.opacity }
                : { url: '/assets/images/colors/white_bg.jpg', opacity: 0.5 }
        }
        else {
            backgroundTexture = {
                url: '/assets/images/colors/white_bg.jpg',
                opacity: 0.5
            }
        }

        res.render('bday_photo', {
            photo: formattedPhoto?'data:image/jpeg;base64,' + formattedPhoto:'https://pioneirosdoadvento.com/assets/images/default_user.jpg',
            backgroundTexture,
            idade,
            name: showName.toUpperCase()
        })
    }


}