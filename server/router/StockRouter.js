const express = require('express')
const router = express.Router()
const stock = require('../controller/StockController')
const cors = require('cors')
router.use(cors())
router.post('/dashboard',stock.dashboard)
module.exports = router
