const { File } = require("../models/File")
const url = require('url');
var fs = require('fs');
const { getFileById } = require('../services/filesServices');
const { CloudstoreError } = require("../helpers/errors");

const createFileController = async(req, res, next) => {
    try {

        const { owner, name, link, category, desc } = req.body
        const newFile = new File({ owner: req.user.name, name, link, category })
        await File.validate(newFile)
        await newFile.save()

        res.status(201).json({ status: "ok", message: `File ${req.body.name} was created!`, file: newFile })

    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const fileImageUpload = async(req, res, next) => {
    try {
        const currentFile = await getFileById(req.params.id)
        if (!currentFile) {
            await fs.unlinkSync(`./tmp/${req.filename}`)
            next(new CloudstoreError('File is not found!'))
            return
        }

        await File.findByIdAndUpdate(req.params.id, { imgUrl: `localhost:5005/api/files/downloadImg/${req.filename}` })

        res.status(201).json({ status: 'ok', message: 'File was uploaded!', imgUrl: `localhost:5005/api/files/downloadImg/${req.filename}` })
    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const getFilesController = async(req, res, next) => {
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
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const findByNameController = async(req, res, next) => {
    try {
        const name = req.body.name
        const data = await File.find({ "name": { $regex: name, $options: 'i' } })

        res.status(200).json({ status: "ok", message: "success", data })
    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const deleteFileController = async(req, res, next) => {
    try {
        const id = req.params.id
        const file = await getFileById(id)

        if (!file) {
            next(new CloudstoreError('File not found!'))
            return

        }

        const filenameArr = file.imgUrl.split('.')

        try {
            await fs.unlinkSync(`./tmp/${id}.${filenameArr[filenameArr.length - 1]}`)
        } catch (error) {
            console.log(error);
        }

        await File.findByIdAndDelete(id)
        res.status(200).json({ status: "ok", message: `File with id ${id} was deleted!` })
    } catch (error) {
        console.log(error.message);
        next(new CloudstoreError(error.message))
    }
}

const updateFileController = async(req, res, next) => {
    try {
        const currentFile = await getFileById(req.params.id)
        if (!currentFile) {
            next(new CloudstoreError('File is not found!'))
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
        console.log(error.message);
        next(new CloudstoreError(error.message))
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