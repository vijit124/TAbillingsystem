const jwt = require('jsonwebtoken')
const Goods = require('../model/GoodsModel')
const Product = require('../model/ProductModel')
const ProductDetails = require('../model/ProductdetailsModel')
function increment(s) {
    var [left, right = '0'] = s.split(/(\d*$)/),
        length = right.length;

    return left + (+right + 1).toString().padStart(length, '0');
}
exports.updategood = async (req, res) => {
    try {
        const id = req.body.id
        const goodsdetails = {
            barcode: req.body.barcode,
            batch: req.body.batch,
            status: req.body.status,
            updated: new Date(new Date().getTime() + 19800000).toLocaleString(),
            remarks: req.body.remarks,
        }
        Goods.findOneAndUpdate({ id: id }, goodsdetails, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Good Updated" })
            }
        })
    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.startbarcode = async (req, res) => {
    try {
        var lastbarcode = await Goods.findOne({ product_id: req.body.product_id }).sort({ id: -1 })
        var startbarcode = ''
        if (lastbarcode) {
            lastbarcode = lastbarcode.barcode
            startbarcode = [lastbarcode].map(increment)
            startbarcode = startbarcode.toString()
        }
        res.status(200).json({ errors: false, startbarcode: startbarcode })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.goodsdetails = async (req, res) => {
    try {
        var lastbarcode = await Goods.findOne().sort({ id: -1 })
        var startbarcode = ''
        if (lastbarcode) {
            lastbarcode = lastbarcode.barcode
            startbarcode = [lastbarcode].map(increment)
            startbarcode = startbarcode.toString()
        }
        var products = await Product.find()
        var Batch = await ProductDetails.find().sort({ id: -1 })
        res.status(200).json({ errors: false, lastbarcode: lastbarcode, products: products, batch: Batch, startbarcode: startbarcode })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.addgoods = async (req, res) => {
    try {
        var today = new Date(new Date().getTime() + 19800000).toLocaleString()
        const newid = await Goods.findOne().sort({ id: -1 })
        var ids = 1
        if (newid) {
            ids = newid.id + 1
        }
        const goodsdetails = {
            quantity: parseInt(req.body.quantity),
            batch: req.body.batch,
            product_id: req.body.product_id,
        }
        if (goodsdetails.quantity < 0) {
            goodsdetails.quantity = goodsdetails.quantity * -1;
        }
        const productdetails = await ProductDetails.findOne({ batch: goodsdetails.batch })
        var quantity_left = productdetails.quantity_left
        var left = quantity_left - goodsdetails.quantity
        if (!goodsdetails.quantity || !goodsdetails.batch || !goodsdetails.product_id) {
            return res.status(200).json({ errors: true, message: "Not all fields have been entered" })
        }
        else if (left < 0) {
            return res.status(200).json({ errors: true, message: "New Barcodes quantity is more than quantity left in Batch which is: " + quantity_left })
        } else {
            ProductDetails.findOneAndUpdate({ id: productdetails.id }, { quantity_left: (quantity_left - goodsdetails.quantity) }, function (err) {
            })
            var errors = false
            var startbarcode = req.body.startbarcode
            var i = 1
            var barcodes = []
            while (i <= goodsdetails.quantity) {
                barcodes.push(startbarcode)
                Goods.create({
                    id: ids, product_id: goodsdetails.product_id, batch: goodsdetails.batch,
                    barcode: startbarcode, updated: today,
                    create_at: today,
                }, function (err) {
                    if (err) {
                        errors = true
                        res.status(200).json({ errors: true, message: err.message })
                    }
                })
                ids++
                startbarcode = [startbarcode].map(increment)
                startbarcode = startbarcode.toString()
                i++
            }
            if (!errors)
                res.status(200).json({ errors: false, barcodes: barcodes, message: i - 1 + " Goods added" })
        }
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}

exports.dashboard = async (req, res) => {
    try {
        res.status(200).json({ errors: false, message: await ProductDetails.find().sort({ id: -1 }) })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.workingflow = async (req, res) => {
    try {
        const product = await Product.find()
        var lookup = {}
        var i = 0
        while (i < product.length) {
            lookup[product[i].id] = product[i].productname
            i++
        }
        res.status(200).json({ errors: false, message: await Goods.find().sort({ id: -1 }), lookup: lookup })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.barcoderead = async (req, res) => {
    try {
        var barcode = req.body.barcode
        var good = await Goods.findOne({ barcode: barcode })
        if (good)
            res.status(200).json({ errors: false, message: 'Found', good: good })
        else
            res.status(200).json({ errors: true, message: 'Not Found' })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.scanqrcode = async (req, res) => {
    try {
        var qrcode = req.body.qrcode
        var good = await ProductDetails.findOne({ qrcode: qrcode })
        if (good)
            res.status(200).json({ errors: false, message: 'Found', productdetails: good })
        else
            res.status(200).json({ errors: true, message: 'Not Found' })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}

exports.authproduction = async (req, res, next) => {
    try {
        const getuser = req.body.cookies
        jwt.verify(getuser, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(200).json({ auth: true, message: "SignIn First" });
            } else {
                const id = decoded.data.id
                const type = decoded.data.type
                if (id) {
                    if (type === 'production' || type === 'admin') {
                        next()
                    } else {
                        return res.status(200).json({ auth: true, message: "Authentication Denied" });
                    }
                }
            }
        });
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }

}