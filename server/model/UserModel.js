const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    email: {
        type: String,
    },
    fullname: {
        type: String
    },
    type: {
        type: String
    },
    password: {
        type: String
    },
    create_at: {
        type: String
    },
    decryptpass:{
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false
})


module.exports = User = mongoose.model('User', UserSchema)
