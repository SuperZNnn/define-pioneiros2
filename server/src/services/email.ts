import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV !== 'production' ? false : true
    }
})

export const sendEmail = async (message: string, title: string, email: string) => {
    try{
        await transporter.sendMail({
            from: '"Pioneiros do Advento" <nao-responda@pioneirosdoadvento.com>',
            to: `${process.env.TEST_EMAIL}`,
            subject: title,
            html: message
        })
    }
    catch(err){
        throw err
    }
}