const express = require('express');
const User = require('../models/user.js');
const auth = require('../middlaware/auth.js');
const router = express.Router();

console.log(User)

//creating / register / signin user data
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        console.log('user middleware');
        const data = await user.save();
        console.log('user saved succesfully');
        const AuthUser = await User.findbyCredential(req.body.email, req.body.password);
        const token = await AuthUser.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(404).send(e.toString());
    }

})

//login user 
router.post('/users/login', async (req, res) => {
    try {
        // console.log(User.findbyCredential);
        const user = await User.findbyCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken()

        user.tokens = user.tokens.concat({ token })
        await user.save();

        res.send({ user  , token});
    } catch (e) {
        res.status(400).send('' + e)
    }
})

//logout all token
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logout All');
    }
    catch (e) {
        res.status(500).send(e.toString());
    }
})

module.exports = router;