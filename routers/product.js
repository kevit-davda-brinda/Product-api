const express = require('express');
const Product = require('../models/product.js');
const auth = require('../middlaware/auth.js');

const router = express.Router();

router.post('/product' , auth  , async(req,res)=>{
    const product = new Product({
        ...req.body,
        owner: req.user._id
    })


    console.log(req.user);

    try {
        // console.log(req.user);
        const products = await product.save()
        res.status(201).send({products});
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router;
