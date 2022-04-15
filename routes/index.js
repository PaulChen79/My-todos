const express = require("express")
const router = express.Router()
const home = require('./modules/home')
const todos = require('./modules/todo')

router.use('/', home)
router.use('/todos', todos)

module.exports = router