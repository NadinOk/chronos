const {TokenModel} = require('../models/token');
const {UserModel} = require("../models/user");

const Token = new TokenModel()
const User = new UserModel()

const sendMail = require('../helper/sendMail');

 function str_rand() {
    let result       = '';
    let words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let max_position = words.length - 1;
    let position = 0;
    for( let i = 0; i < 10; ++i ) {
        position = Math.floor( Math.random() * max_position );
        result = result + words.substring(position, position + 1);
    }
    return  result;

}

async function getCurrentUser(token) {
    if (!token) {
        return undefined
    } else {
        const tokenObject = await Token.getUserByToken(token)
        if (!tokenObject || tokenObject.expires_at < Date.now()) {
            return undefined
        }
        return await User.getUserById(tokenObject.user_id)
    }
}

async function checkPermission(req, res) {
    const user = await getCurrentUser(req.headers.authorization)
    if (!user) {
        res.status(401).send('Unauthorized')
        return false
    } else {
        return true
    }
}


function sendConfirmEmail(randStr, email) {
    const message = {
        to: email,
        subject: 'Confirm email',
        html: `<h2>Для смены пароля перейдите по ссылке <h2>
                   
                    <a href="http://localhost:3000/password-reset/${randStr} "> Сменить пароль </a>
                    <br>
                    <i>Данное письмо не требует ответа</i>`
    }
    sendMail(message)
}

module.exports = {
    str_rand,
    getCurrentUser,
    sendConfirmEmail,
    checkPermission
 }