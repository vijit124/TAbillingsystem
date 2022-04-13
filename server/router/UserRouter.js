const express = require('express')
const router = express.Router()
const user = require('../controller/UserController')
const cors = require('cors')
router.use(cors())
router.post('/authlogin',user.authuser)
router.post('/login', user.login)
module.exports = router
