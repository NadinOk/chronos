const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.ukr.net',
        port: 465 ,
        secure: true,
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            auth: {
            user: 'usoftest@ukr.net',
            pass: 'L8MtDlOLr5MXCKVk'
        }
    },
{
        from: 'Mailer test <usoftest@ukr.net>',
    })

    const mailer = message => {
        transporter.sendMail(message,(err, info) => {
            if(err) return console.log(err)
            console.log('Send mail: ', info)
        })
}



module.exports = mailer