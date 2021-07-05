const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const isEmail = require('isemail');

const sendMail = require('../helper/sendMail');
const {str_rand, sendConfirmEmail} = require("../helper/helper");


const {UserModel} = require('../models/user');
const {TokenModel} = require('../models/token');
const User = new UserModel()
const Token = new TokenModel()


// ===========Authentication module=============
router.get('/confirm/:code', async (req, res) => {

    const userByCode = await User.getUserByCode(req.params.code)

    if (userByCode !== null) {
        await User.confirmUser(userByCode.id)

        res.status(200).send('Email confirm')
    } else {
        res.status(404).send('User not found')
    }

})

router.post('/register', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const validEmail = isEmail.validate(req.body.email, {errorLevel: true})
        if (validEmail === 0) {
            const randStr = str_rand();
           await User.createUser(req.body.login, hashPassword, req.body.full_name, req.body.email, randStr)
            const message = {
                to: req.body.email,
                subject: 'Confirm email',
                html: `<h2>Поздравляем, вы успешно зарегестрировались на сайте!<h2>
                   
                    <a href="http://localhost:8080/api/auth/confirm/${randStr}  ">Перейдите по ссылке для подтверждения регистрации</a>
                    <br>
                    <i>Данное письмо не требует ответа</i>`
            }
            sendMail(message)
            res.status(201).send("User registered")
        } else {
            res.status(400).send("email is not valid")
        }
    } catch (e) {
        console.log(e)
    }
})
router.post('/login', async (req, res) => {
    try {
        const userEm = await User.getUserByEmail(req.body.email)
        if (userEm) {
            const areSame = await bcrypt.compare(req.body.password, userEm.password)
            if (areSame) {
                const token = await Token.createToken(userEm.id, str_rand())
                res.status(200).send(token)
            } else {
                res.status(400).send('Password not valid')
            }
        } else {
            res.status(404).send('Email not found')
        }
    } catch (e) {
        console.log(e)
    }
})
router.post('/logout', async (req, res) => {
    try {
        await Token.logout(req.headers.authorization)
        res.send('User logged out')
    } catch (e) {
        console.log(e)
    }
})

// router.get('/password-reset/:code', async (req, res) => {
//     res.status(200).send(`<div><form method="post" action="http://localhost:3001/password-reset/confirm-token/${req.params.code}"><input placeholder="New password" name="password" value=""><button type="submit">submit</button></form></div>`)
// })


router.post('/password-reset', async (req, res) => {
    try {
        const validEmail = isEmail.validate(req.body.email, {errorLevel: true})
        if (validEmail === 0) {
            const user = await User.getUserByEmail(req.body.email)
            if (user !== undefined) {
                const randStr = str_rand();
                await User.createTokenResPasword(user.id, randStr)
                sendConfirmEmail(randStr, req.body.email);
                res.status(201).send("Password reset link send")
            } else {
                res.status(404).send('User not found')
            }
        } else {
            res.status(400).send("email is not valid")
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/password-reset/confirm-token/:code', async (req, res) => {
    try {
        if (!req.body.password) {
            console.log(req.params.code)
            res.status(400).send('password parameter is missing')
            return
        }
        const user = await User.getUserByResetCode(req.params.code)
        if (user) {
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            await User.updateUserPassword(user.id, hashPassword)
            await User.createTokenResPasword(user.id, str_rand())
            res.status(200).send('Password updated')
        } else {
            res.status(404).send('User not found')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
