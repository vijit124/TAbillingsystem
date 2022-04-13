const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductDetailsSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    product_id: {
        type: Number,
    },
    quantity:{
        type: Number
    },
    ingredientname: {
        type: String
    },
    ingredientquantity: {
        type: Number
    },
    unit: {
        type: Number
    },
}, {
    versionKey: false
})

module.exports = ProductDetails = mongoose.model('ProductDetails', ProductDetailsSchema)
