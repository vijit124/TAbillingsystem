const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductDetailsSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    qrcode: {
        type: String,
    },
    product_id:{
        type: Number,
    },
    productname: {
        type: String
    },
    batch:{
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number
    },
    quantity_left: {
        type: Number
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String,
        default: '-'
    },
}, {
    versionKey: false
})


module.exports = ProductDetails = mongoose.model('ProductDetails', ProductDetailsSchema)
