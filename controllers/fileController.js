const { File } = require("../models/File")
const { check, validationResult } = require('express-validator')
const url = require('url');
var fs = require('fs');


const createFileController = async(req, res) => {
    try {
        const {
            owner,
            name,
            link,
            imgUrl,
            desc,
            category
        } = req.body

        const candidateFile = await File.find({ name })
        if (candidateFile.length) {
            res.status(400).json({
                message: "File name should be unique!"
            })
            return
        }

        if (!name || !link || !owner || !category) {
            res.status(400).json({
                message: "All fields are required! (owner, name, link, category)"
            })
            return
        }

        const newFile = new File({
            owner,
            name,
            link,
            category,
            imgUrl: imgUrl || "",
            desc: desc || "",
        })
        await newFile.save()

        res.status(201).json({ status: "ok", message: `File ${name} was created!`, file: newFile })

    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error })
    }
}

const fileImageUpload = async(req, res) => {
    try {
        await File.findByIdAndUpdate(req.params.id, { imgUrl: `https://enigmatic-garden-22484.herokuapp.com/api/files/downloadImg/${req.filename}` })

        res.status(201).json({ status: 'ok', message: 'File was uploaded!', imgUrl: `https://enigmatic-garden-22484.herokuapp.com/api/files/downloadImg/${req.filename}` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error })
    }
}

const getFilesController = async(req, res) => {
    try {
        const queryObj = {...url.parse(req.url, true).query }
        console.log(queryObj);

        let data;

        if (queryObj.page) {

            data = await File.find(queryObj).skip((queryObj.page - 1) * 10).limit(10)
        } else {
            data = await File.find(queryObj)
        }

        res.status(200).json({ status: "ok", message: "success", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error ": error })
    }
}

const findByNameController = async(req, res) => {
    try {
        const name = req.body.name
        const data = await File.find({ "name": { $regex: name, $options: 'i' } })

        res.status(200).json({ status: "ok", message: "success", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error ": error })
    }
}

const deleteFileController = async(req, res) => {
    try {
        const _id = req.params.id
        const file = await File.findById(_id)

        if (!file) {
            res.status(404).json({ status: "error", message: 'File not found!' })
            return
        }

        const filenameArr = file.imgUrl.split('.')

        try {
            fs.unlinkSync(`./tmp/${_id}.${filenameArr[filenameArr.length - 1]}`)
        } catch (error) {
            console.log(error);
        }

        await File.deleteOne({ _id })
        res.status(200).json({ status: "ok", message: `File with id ${_id} was deleted!` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "Server error": error })
    }
}

const updateFileController = async(req, res) => {
    try {
        const currentFile = await File.findById(req.params.id)
        console.log(currentFile);
        const {
            owner,
            name,
            link,
            imgUrl,
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
        res.status(500).json({ "Server error": error })
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