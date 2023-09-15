const jwt = require('jsonwebtoken')
const User  = require('../models/user.js')

const auth = async (req, res, next) => {
    // console.log('auth middleware');

    try {

        console.log( req.headers.authorization.split(' ')[1]);

        const token = req.header('Authorization').replace('Bearer ', '')
        
        console.log(token)

        const decoded = jwt.verify(token, 'SecrateKey');

        // console.log(decoded);

        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new Error();
        }

        req.user = user;

        req.token = token;

        next();

    } catch (e) {
        res.status(401).send({ error: 'Please autheticate..'+e })
    }



}

module.exports = auth;