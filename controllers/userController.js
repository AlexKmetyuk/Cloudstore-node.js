const { User } = require('../models/User')

const loginController = async(req, res) => {
    try {
        const { login, password } = req.body

        const [_, isPlaytika] = login.split('@')

        if (isPlaytika === 'playtika.com' && password === "First1Logon") {
            res.status(200).json({ status: 'ok', message: `Success, ${_} is authorized!`, isLogin: true })
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid login or password!', isLogin: false })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error.message })
    }
}

const registerController = async(req, res) => {
    try {
        const { name, email } = req.body
        const user = new User({ name, email })
        await User.validate(user)
        await user.save()

        res.status(200).json({ status: 'ok', message: `User ${user.name} was registered!`, user })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ "Server error": error.message })
    }
}

module.exports = {
    loginController,
    registerController
}