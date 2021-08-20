const express = require('express')
const router = express.Router()
const registerController = require('../controller/register')

router.post('/create', registerController.registerController)
router.get('/', registerController.findAll)

module.exports = router
