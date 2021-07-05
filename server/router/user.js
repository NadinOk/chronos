const express = require('express');
const router = express.Router();

const upload = require('../helper/upload')
const { str_rand, getCurrentUser } = require("../helper/helper");

const {UserModel} = require("../models/user");
const {checkPermission} = require("../helper/helper");
const User = new UserModel()

//================User module===================

router.get('/', async (req, res) => {
    if (!checkPermission(req, res)) return;

    const allUsers = await User.getUsers(req.query.page);
    if (allUsers !== null) {
        res.status(200).send(allUsers)
    } else {
        res.status(400).send('Could not get users')
    }
})

router.get('/:id', async (req, res) => {
    if (!checkPermission(req, res)) return;

    const userById = await User.getUserById(req.params.id)
    if (userById !== null) {
        res.status(200).send(userById)
    } else {
        res.status(400).send('Could not get user by id' )
    }
})
// router.get('/:id/event', async (req, res) => {
//     if (!await checkPermission(req, res)) return;
//     console.log(req.params.id)
//     const eventByUserId = await User.getEventsByUserId(req.params.id, req.params.id)
//
//     if (eventByUserId !== null) {
//         res.status(200).send(eventByUserId)
//     } else {
//         res.status(400).send('Could not get event by user id')
//     }
// })


router.post('/', async (req, res) => {
    if (!checkPermission(req, res)) return;

    const user = await getCurrentUser(req.headers.authorization)
    if (user.role === 'admin') {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const randStr = str_rand();
        const obj_user = await User.createUser(req.body.login, hashPassword, req.body.full_name, req.body.email, randStr)
        sendConfirmEmail(randStr, req.body.email);
        if (obj_user !== null) {
            res.status(201).send(obj_user)
        } else {
            res.status(400).send('Could not create user')
        }
    }
})
router.post('/:id/avatar', upload.single('image'), async  (req, res) => {
    if (!checkPermission(req, res)) return;
    
    try {
        const user = await User.getUsersById(req.params.id);
        console.log(req.file)
        if (user !== undefined && user.length > 0) {
            await User.updateUserAvatar(req.params.id, req.file.filename)
            res.status(201).send('avatar uploaded')
        } else {
            res.status(404).send('User not found');
        }
    } catch (e) {
        console.log(e)
    }
})

router.patch('/:id', async (req, res) => {
    if (!checkPermission(req, res)) return;

    const uptUser = await User.updateUser(req.params.id, req.body.login, req.body.password, req.body.full_name, req.body.email,
        req.body.profile_picture, req.body.rating, req.body.role)
    if (uptUser[0] === 1) {
        res.status(200).send('Object updated')
    } else {
        res.status(400).send('Could not update user')
    }
})
router.delete('/:id', async (req, res) => {
    if (!checkPermission(req, res)) return;

    const delUser = await User.deleteUserById(req.params.id)
    if (delUser !== null) {
        res.status(204).send()
    } else {
        res.status(400).send('Could not deleted user')
    }
})

module.exports = router