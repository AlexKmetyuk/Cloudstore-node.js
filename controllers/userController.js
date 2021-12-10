const { CloudstoreError, NotAuthorizedError } = require('../helpers/errors')
const { User } = require('../models/User')
const { registration, login } = require('../services/userServices')

const registerController = async(req, res, next) => {
    try {
        const { email, firstName, password, individualCode } = req.body

        if (individualCode !== "First1Logon") {
            next(new NotAuthorizedError(`Individual code is wrong!`))
            return

        }
        await registration(email, firstName, password)

        res.json({ status: 'ok', message: `User ${firstName} was registered!` })
    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const loginController = async(req, res, next) => {
    try {
        const { email, password } = req.body



        if (!password || !email) {
            next(new NotAuthorizedError(`Email and password is required!`))
            return

        }

        const user = await login(email, password)

        if (!user) {
            next(new NotAuthorizedError(`Wrong email or password!`))
            return

        }

        res.json({
            status: 'ok',
            message: `success!`,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                token: user.token
            }
        })

    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}


module.exports = {
    loginController,
    registerController
}