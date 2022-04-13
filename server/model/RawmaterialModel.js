const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RawMaterialSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        default: 1
    },
    rawmaterialname: {
        type: String
    },
    quantity:{
        type: Number
    },
    unit: {
        type: Number
    },
    create_at: {
        type: String
    },
}, {
    versionKey: false
})


module.exports = Rawmaterial = mongoose.model('rawmaterial', RawMaterialSchema)
