const Router = require("express")
const { loginController } = require('../controllers/userController')
const router = new Router()

router.post('/login', loginController)

module.exports = router