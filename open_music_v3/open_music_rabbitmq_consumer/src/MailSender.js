const nodemailer = require('nodemailer')

class MailSender{
    constructor(){
        this._transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD
            }
        })
    }

    sendEmail(targetMail, content){
        const message = {
            from : 'Music Applications',
            to: targetMail,
            subject: 'Ekspor Lagu',
            text: 'Terlampir hasil dari ekspor lagu',
            attachments:[
                {
                    filename: 'songs.json',
                    content
                }
            ]
        }

        return this._transporter.sendMail(message)

    }
}

module.exports = MailSender
