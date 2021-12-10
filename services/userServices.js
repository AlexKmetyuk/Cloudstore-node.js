const { User } = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const registration = async(email, firstName, password) => {

    const newUser = new User({ email, firstName, password: await bcrypt.hash(password, 10) })

    await newUser.save()
}

const login = async(email, password) => {

    const currentUser = await User.findOne({ email: email })

    if (!currentUser) {
        return false
    }

    if (!await bcrypt.compare(password, currentUser.password)) {
        return false
    }

    const token = jwt.sign({
        _id: currentUser._id,
        name: currentUser.firstName
    }, process.env.JWT_SECRET)
    await User.findOneAndUpdate({ _id: currentUser._id }, { $set: { token: token } })
    currentUser.token = token
    return currentUser
}

module.exports = { registration, login }