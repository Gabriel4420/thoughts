const express = require('express')
const AuthController = require('../controllers/AuthController')
const router = express.Router()

router.get('/login', AuthController.login)
router.post('/login', AuthController.tryLogin)
router.get('/register', AuthController.registerScreen)
router.post('/register', AuthController.registerUser)
router.get('/logout', AuthController.logout)

module.exports = router
