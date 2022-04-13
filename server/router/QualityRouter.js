const express = require('express')
const router = express.Router()
const quality = require('../controller/QualityController')
const cors = require('cors')
router.use(cors())
router.post('/dashboard',quality.dashboard)
module.exports = router
