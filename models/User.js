const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, required: 'Email address is required', unique: true },
    firstName: { type: String, required: 'Name is required' },
    password: { type: String, required: 'Password is required' },
    token: { type: String, default: '' }
})

const User = model("User", UserSchema)

module.exports = { User }