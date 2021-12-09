const { model, Schema } = require('mongoose');

const FileSchema = new Schema({
    owner: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    category: { type: String, required: true },
    imgUrl: { type: String, default: '' },
    desc: { type: String, default: '' }
})

const File = model("File", FileSchema)

module.exports = { File }