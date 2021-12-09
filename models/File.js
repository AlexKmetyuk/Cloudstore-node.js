const mongoose = require('mongoose');

const File = mongoose.model("File", {
    owner: String,
    name: String,
    link: String,
    imgUrl: String,
    category: String,
    desc: String
})

module.exports = { File }