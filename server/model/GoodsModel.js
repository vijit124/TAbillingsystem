const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    product_id: {
        type: Number,
    },
    batch: {
        type: String
    },
    barcode: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
    updated: {
        type: String
    },
    create_at: {
        type: String
    },
    remarks: {
        type: String,
        default: ''
    }
}, {
    versionKey: false
})


module.exports = User = mongoose.model('Goods', UserSchema)
