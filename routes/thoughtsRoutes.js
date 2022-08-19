const express = require('express')
const ThoughtController = require('../controllers/ThoughtController')
//helper
const checkAuth = require('../helpers/auth').checkAuth
const router = express.Router()
router.post('/add', checkAuth, ThoughtController.pushThoughts)
router.get('/add', checkAuth, ThoughtController.createThoughts)
router.get('/dash', checkAuth, ThoughtController.dashboard)
router.post('/remove', checkAuth, ThoughtController.removeThoughts)
router.get('/edit/:id', checkAuth, ThoughtController.edit)
router.post('/update', checkAuth, ThoughtController.update)
router.get('/', ThoughtController.showThoughts)

module.exports = router
