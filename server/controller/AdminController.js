const User = require('../model/UserModel')
const Rawmaterial = require('../model/RawmaterialModel')
const Product = require('../model/ProductModel')
const Goods = require('../model/GoodsModel')
const Productdetails = require('../model/ProductdetailsModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.deleteuser = async (req, res) => {
    try {
        const userid = req.body.id
        User.findOneAndDelete({ id: userid }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "User Deleted" })
            }
        })
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.displayuser = async (req, res) => {
    try {
        var display = await User.find({ type: { $ne: 'admin' } }).sort({ id: -1 })
        res.status(200).json({ errors: false, message: display })
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.displayproducts = async (req, res) => {
    try {
        var display = await Product.find({}).sort({ id: -1 })
        res.status(200).json({ errors: false, message: display })
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.deleteproduct = async (req, res) => {
    try {
        const id = req.body.id
        Product.findOneAndDelete({ id: id }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Product Deleted" })
            }
        })
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.create = async (req, res) => {
    try {
        const today = new Date().toLocaleString()
        const newid = await User.findOne().sort({ id: -1 })
        if (newid) {
            var id = newid.id + 1
        }
        const userdata = {
            id: id,
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            create_at: today,
            decryptpass: req.body.password,
            type: req.body.type
        }
        const existinguser = await User.findOne({ email: userdata.email })

        if (existinguser) {
            res.status(200).json({ errors: true, message: "User Already Exists" })
        }
        else {
            userdata.password = bcrypt.hashSync(userdata.password, 8)
            User.create(userdata, function (err) {
                if (err) {
                    res.status(200).json({ errors: true, message: err.message })
                } else {
                    res.status(200).json({ errors: false, message: "User Added Successfully" })
                }
            })
        }

    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })

    }
}
exports.edituser = async (req, res) => {
    try {
        const id = req.body.id
        const edituser = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            decryptpass: req.body.password,
            type: req.body.type,
            status: req.body.status,
        }
        edituser.password = bcrypt.hashSync(edituser.password, 8)
        User.findOneAndUpdate({ id: id }, edituser, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "User Details Updated" })
            }
        })
    }
    catch (err) {
        res.status(200).json({ errors: true, message: err.message });
    }
}
exports.addproduct = async (req, res) => {
    try {
        const newid = await Product.findOne().sort({ id: -1 })
        if (newid) {
            var ids = newid.id + 1
        }
        const newrawmaterial = {
            id: ids,
            productname: req.body.productname,
            modelno: req.body.modelno,
            create_at: new Date(new Date().getTime() + 19800000).toLocaleString(),
            rawids: []
        }
        Product.create(newrawmaterial, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "New Item Added" })
            }
        })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.productdetails = async (req, res) => {
    try {
        const id = req.body.id
        var display = await Product.findOne({ id: id })
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
        res.status(200).json({ errors: false, message: display, rawmaterials: rawmaterials, allrawmaterials: await Rawmaterial.find() })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}


exports.editproduct = async (req, res) => {
    try {
        const id = req.body.id
        Product.findOneAndUpdate({ id: id }, { productname: req.body.productname, modelno: req.body.modelno }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Product Updated" })
            }
        })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.addmaterialtoproduct = async (req, res) => {
    try {
        const id = req.body.id
        const newid = await Product.findOne({ id: id }, { _id: 0, rawids: 1 }).sort({ id: -1 })
        var oldrawids = newid.rawids
        var newrawid = req.body.rawids
        oldrawids.push(newrawid)
        Product.findOneAndUpdate({ id: id }, { rawids: oldrawids }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Material Added" })
            }
        })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.goods = async (req, res) => {
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
exports.orders = async (req, res) => {
    try {
        res.status(200).json({ errors: false, message: await Productdetails.find().sort({ id: -1 }) })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.updaterawmaterials = async (req, res) => {
    try {
        const qty = req.body.qty
        if (qty) {
            const updatedrawmaterials = {
                product_id: req.body.product_id,
                id: req.body.id,
                qty: req.body.qty,
                rawmaterialname: req.body.rawmaterialname,
                quantity: req.body.quantity,
            }
            var product = await Product.findOne({ id: updatedrawmaterials.product_id })
            var rawids = product.rawids
            var objIndex = rawids.findIndex((obj => obj.id === updatedrawmaterials.id))
            rawids[objIndex].qty = updatedrawmaterials.qty
            Product.findOneAndUpdate({ id: updatedrawmaterials.product_id }, { rawids: rawids }, function (err) {
            })
        }
        const updatedrawmaterials = {
            id: req.body.id,
            rawmaterialname: req.body.rawmaterialname,
            quantity: req.body.quantity,
        }
        Rawmaterial.findOneAndUpdate({ id: updatedrawmaterials.id }, updatedrawmaterials, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Updated" })
            }
        })

    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.adminupdateorder = async (req, res) => {
    try {
        const id = req.body.id
        const updatedrawmaterials = {
            productname: req.body.productname,
            batch: req.body.batch,
            quantity: req.body.quantity,
            quantity_left: req.body.quantity_left
        }
        Productdetails.findOneAndUpdate({ id: id }, updatedrawmaterials, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Updated" })
            }
        })

    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}
exports.removematerial = async (req, res) => {
    try {
        const id = req.body.product_id
        var product = await Product.findOne({ id: id })
        const rawid = req.body.id
        var Arrayrawids = product.rawids
        var filtered = Arrayrawids.filter(function (el) { return el.id !== rawid; });
        Product.findOneAndUpdate({ id: id }, { rawids: filtered }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                res.status(200).json({ errors: false, message: "Material Removed from Product" })
            }
        })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}

/*exports.removematerial = async (req, res) => {
    try {
        const id = req.body.product_id
        var product = Product.findOne({ id: id })
        const rawid = req.body.id
        var Arrayrawids = product.rawids
        var objIndex = rawids.findIndex((obj => obj.id === rawid))
        var qtyper = rawids[objIndex].qty
        var rawmaterial = await Rawmaterial.findOne({ id: rawid })
        qtyper = rawmaterial.quantity + qtyper
        var filtered = Arrayrawids.filter(function (el) { return el.id !== rawid; });
        Product.findOneAndUpdate({ id: id }, { rawids: filtered }, function (err) {
            if (err) {
                res.status(200).json({ errors: true, message: err.message })
            } else {
                Rawmaterial.findOneAndUpdate({ id: rawid }, { quantity: qtyper }, function (err) {
                    if (err) {
                        res.status(200).json({ errors: true, message: err.message })
                    } else {
                        res.status(200).json({ errors: false, message: "Material Deleted" })
                    }
                })
            }
        })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
} */

exports.adminauth = async (req, res, next) => {
    try {
        const getuser = req.body.cookies
        jwt.verify(getuser, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(200).json({ auth: true, message: "SignIn First" });
            } else {
                const id = decoded.data.id
                const type = decoded.data.type
                if (id) {
                    if (type !== 'admin') {
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