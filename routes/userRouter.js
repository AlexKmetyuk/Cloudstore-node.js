const Router = require("express")
const { loginController, registerController } = require('../controllers/userController')
const router = new Router()

router.post('/login', loginController)
router.post('/register', registerController)

module.exports = router