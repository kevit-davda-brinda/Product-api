const mongoose = require('mongoose');

const ProductModel = mongoose.model('Product', {
    name: {
        type: String,
        required: true
    },
    infotmation: {
        type: String,
        required: true
    },
    productCode:{
        type: Number,
        required: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

module.exports = ProductModel