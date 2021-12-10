const { NotAuthorizedError } = require("../helpers/errors")
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

const authMiddleware = async(req, res, next) => {
    console.log(req.headers['authorization']);
    if (!req.headers['authorization']) {
        next(new NotAuthorizedError("Auth token is required!"))
        return
    }

    const [tokenType, token] = req.headers['authorization'].split(' ')

    if (!token) {
        next(new NotAuthorizedError("Auth token is required!"))
        return
    }

    try {
        const userData = jwt.decode(token, process.env.JWT_SECRET)
        console.log("user data:", userData);
        req.user = userData
        req.token = token

        const currentUser = await User.findById(userData._id)
        if (token !== currentUser.token) {
            next(new NotAuthorizedError("User is not login"))
            return
        }
    } catch (error) {
        next(new NotAuthorizedError("Invalid token!"))
        return
    }


    next()
}

module.exports = {
    authMiddleware
}