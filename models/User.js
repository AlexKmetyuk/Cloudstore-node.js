const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: { type: String, required: 'Email address is required', unique: true },
    name: { type: String, required: 'Name is required' },
    token: String
})

const User = model("User", UserSchema)

module.exports = { User }