const Goods = require('../model/GoodsModel')
const jwt = require('jsonwebtoken')
exports.dashboard = async (req, res) => {
    try {
        const product = await Product.find()
        var lookup = {}
        var i = 0
        while(i < product.length){
          lookup[product[i].id] = product[i].productname
          i++
        }
        res.status(200).json({ errors: false, message: await Goods.find({ status: 2 }).sort({ id: -1 }), lookup: lookup })
    } catch (error) {
        res.status(200).json({ errors: true, message: error.message })
    }
}

exports.authstock = async (req, res, next) => {
    try {
        const getuser = req.body.cookies
        jwt.verify(getuser, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(200).json({ auth: true, message: "SignIn First" });
            } else {
                const id = decoded.data.id
                const type = decoded.data.type
                if (id) {
                    if (type !== 'stockmanager'  ) {
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