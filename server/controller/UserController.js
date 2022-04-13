const User = require('../model/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        if (!email || !password)
            return res.status(200).json({ errors: true, message: "Not all fields have been entered." });

        const existinguser = await User.findOne({ email: email })

        if (existinguser) {
            if (existinguser.status === 0) {
                res.status(200).json({ errors: true, message: "User Blocked" })
            }
            else if (bcrypt.compareSync(password, existinguser.password)) {
                const user = {
                    id: existinguser.id,
                    fullname: existinguser.fullname,
                    email: existinguser.email,
                    type: existinguser.type
                }
                const token = jwt.sign({ data: user }, process.env.SECRET_KEY)
                res.status(200).json({ errors: false, jwt: token, message: '/' + existinguser.type + '/dashboard' })
            }
            else {
                res.status(200).json({ errors: true, message: "Invalid password " })
            }
        }
        else {
            res.status(200).json({ errors: true, message: "User do not exist" })
        }
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}
exports.authuser = async (req, res, next) => {
    try {
        const getuser = req.body.cookies
        jwt.verify(getuser, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded)
                if (decoded.data.type)
                    return res.status(200).json({ errors: false, message: '/' + decoded.data.type + '/dashboard', type: decoded.data.type });
        });
    } catch (err) {
        res.status(200).json({ errors: true, message: err.message })
    }
}

