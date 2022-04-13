const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    productname: {
        type: String
    },
    modelno:{
        type: String
    },
    create_at: {
        type: String
    },
    rawids:{
        _id: false,
        type: Array
    }
}, {
    versionKey: false
})


module.exports = Product = mongoose.model('Product', ProductSchema)
