const jwt = require('jsonwebtoken')
const Rawmaterial = require('../model/RawmaterialModel')
const ProductDetails = require('../model/ProductdetailsModel')
const Product = require('../model/ProductModel')
var uniqid = require('uniqid');
exports.dashboard = async (req, res) => {
    try {
        var display = await Rawmaterial.find().sort({ id: 1 })
        if (req.body.alldetails) {
            var less = await Rawmaterial.countDocuments({ quantity: { $lt: 100 } })
            var between = await Rawmaterial.countDocuments({ quantity: { $gt: 99 }, quantity: { $lt: 1001 } })
            var more = await Rawmaterial.countDocuments({ quantity: { $gt: 1000 } })
            res.status(200).json({ errors: false, message: display, less: less, between: between, more: more })
        } else {
            res.status(200).json({ errors: false, message: display })
        }
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }

}
exports.addrawmaterial = async (req, res) => {
    try {
        const newid = await Rawmaterial.findOne().sort({ id: -1 })
        if (newid) {
            var ids = newid.id + 1
        }
        const newrawmaterial = {
            id: ids,
            rawmaterialname: req.body.rawmaterialname,
            quantity: req.body.quantity * req.body.unit,
            unit: req.body.unit,
            create_at: new Date(new Date().getTime() + 19800000).toLocaleString(),
        }
        Rawmaterial.create(newrawmaterial, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "New Item Added" })
            }
        })
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }

}

exports.editrawmatarial = async (req, res) => {
    try {
        const id = req.body.id
        const rawmaterial = {
            quantity: (req.body.quantity + req.body.difference) * req.body.unit,
            unit: req.body.unit
        }
        Rawmaterial.findOneAndUpdate({ id: id }, rawmaterial, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Item Quantity Updated" })
            }
        })
    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}


exports.addorder = async (req, res) => {
    try {
        const newid = await ProductDetails.findOne().sort({ id: -1 })
        var ids = 1
        if (newid) {
            ids = newid.id + 1
        }
        const productdetails = {
            id: ids,
            quantity: parseInt(req.body.quantity),
            qrcode: uniqid(),
            batch: req.body.batch,
            product_id: req.body.product_id,
            productname: req.body.productname,
            quantity_left: req.body.quantity,
            start_date: req.body.start_date
        }
        var i = 0
        var product = await Product.findOne({ id: productdetails.product_id })
        var rawids = product.rawids
        while (i < rawids.length) {
            var object = rawids[i]
            var rawmaterial = await Rawmaterial.findOne({ id: object.id })
            Rawmaterial.findOneAndUpdate({ id: object.id }, { quantity: rawmaterial.quantity - (object.qty * productdetails.quantity) }, function (err) {
                if (err) {
                    res.status(200).json({ errors: true, message: err.message })
                }
            })
            i++
        }
        ProductDetails.create(productdetails, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Order Added" })
            }
        })

    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}


exports.Changematerial = async (req, res) => {
    try {
        var ids = 2
        var product = await Product.findOne({ id: ids })
        var i = 0
        var rawids = product.rawids
        while (i < rawids.length) {
            var object = rawids[i]
            var rawmaterial = await Rawmaterial.findOne({ id: object.id })
            var total = rawmaterial.quantity + (object.qty * 100)
            Rawmaterial.findOneAndUpdate({ id: object.id }, { quantity: total }, function (err) {
                if (err) {
                    res.status(200).json({ errors: true, message: err.message })
                }else{
                    console.log(i)
                }
            })
            i++
        }
        res.status(200).json({ errors: false, message: "Order Added" })

    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.displayoutitem = async (req, res) => {
    try {
        res.status(200).json({ errors: false, productdetails: await ProductDetails.find().sort({ id: -1 }), products: await Product.find() })
    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}

exports.rawmaterialchange = async (req, res) => {
    try {
        var product_id = req.body.product_id
        var display = await Product.findOne({ id: product_id })
        var rawmaterials = []
        if (display) {
            var rawids = display.rawids
            var i = 0
            while (i < rawids.length) {
                var onematerial = await Rawmaterial.findOne({ id: rawids[i].id })
                onematerial = onematerial.toObject()
                Object.assign(onematerial, { qty: rawids[i].qty });
                rawmaterials.push(onematerial);
                i++
            }
        }
        res.status(200).json({ errors: false, message: rawmaterials })
    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.authrawstore = async (req, res, next) => {
    try {
        const getuser = req.body.cookies
        jwt.verify(getuser, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(200).json({ auth: true, message: "SignIn First" });
            } else {
                const id = decoded.data.id
                const type = decoded.data.type
                if (id) {
                    if (type !== 'rawstore') {
                        return res.status(200).json({ auth: true, message: "Authentication Denied" });
                    } else {
                        next()
                    }
                }
            }
        });
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}

exports.delete = async (req, res) => {
    try {
        Rawmaterial.findOneAndDelete({ id: req.body.id }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err })
            } else {
                res.status(200).json({ errors: false, message: "Material Deleted" })
            }
        })

    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }

}