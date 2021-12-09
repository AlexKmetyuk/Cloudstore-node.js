const { File } = require("../models/File")


const getFileById = async(id) => {
    try {
        const file = await File.findById(id)
        if (file) {
            return file
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = {
    getFileById
}