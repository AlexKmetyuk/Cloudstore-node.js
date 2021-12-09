const { File } = require("../models/File")
const url = require('url');
var fs = require('fs');
const { getFileById } = require('../services/filesServices')

const createFileController = async(req, res) => {
    try {
        const newFile = new File(req.body)
        await File.validate(newFile)
        await newFile.save()

        res.status(201).json({ status: "ok", message: `File ${req.body.name} was created!`, file: newFile })

    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error.message })
    }
}

const fileImageUpload = async(req, res) => {
    try {
        const currentFile = await getFileById(req.params.id)
        if (!currentFile) {
            res.status(404).json({ status: 'error', message: 'File is not found!' })
            return
        }

        await File.findByIdAndUpdate(req.params.id, { imgUrl: `localhost:5005/api/files/downloadImg/${req.filename}` })

        res.status(201).json({ status: 'ok', message: 'File was uploaded!', imgUrl: `localhost:5005/api/files/downloadImg/${req.filename}` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error.message })
    }
}

const getFilesController = async(req, res) => {
    try {
        const queryObj = {...url.parse(req.url, true).query }

        let data;

        if (queryObj.page) {
            data = await File.find(queryObj).skip((queryObj.page - 1) * 10).limit(10)
        } else {
            data = await File.find(queryObj)
        }

        res.status(200).json({ status: "ok", message: "success", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error ": error.message })
    }
}

const findByNameController = async(req, res) => {
    try {
        const name = req.body.name
        const data = await File.find({ "name": { $regex: name, $options: 'i' } })

        res.status(200).json({ status: "ok", message: "success", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error ": error.message })
    }
}

const deleteFileController = async(req, res) => {
    try {
        const id = req.params.id
        const file = await getFileById(id)

        if (!file) {
            res.status(404).json({ status: "error", message: 'File not found!' })
            return
        }

        const filenameArr = file.imgUrl.split('.')

        try {
            fs.unlinkSync(`./tmp/${id}.${filenameArr[filenameArr.length - 1]}`)
        } catch (error) {
            console.log(error);
        }

        await File.findByIdAndDelete(id)
        res.status(200).json({ status: "ok", message: `File with id ${id} was deleted!` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error.message })
    }
}

const updateFileController = async(req, res) => {
    try {
        const currentFile = await getFileById(req.params.id)
        if (!currentFile) {
            res.status(404).json({ status: 'error', message: 'File is not found!' })
            return
        }
        const {
            owner,
            name,
            link,
            desc,
            category
        } = req.body
        if (owner) {
            currentFile.owner = owner
        }
        if (name) {
            currentFile.name = name
        }
        if (link) {
            currentFile.link = link
        }

        if (desc) {
            currentFile.desc = desc
        }
        if (category) {
            currentFile.category = category
        }

        await File.findByIdAndUpdate(req.params.id, currentFile)
        res.status(200).json({
            status: 'ok',
            message: "File was updated!",
            file: currentFile
        })
    } catch (error) {
        res.status(500).json({ "Server error": error.message })
    }
}

module.exports = {
    createFileController,
    getFilesController,
    deleteFileController,
    fileImageUpload,
    updateFileController,
    findByNameController
}