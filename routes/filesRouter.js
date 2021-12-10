const Router = require("express")
const path = require('path')
const express = require('express')

const {
    createFileController,
    getFilesController,
    deleteFileController,
    fileImageUpload,
    updateFileController,
    findByNameController
} = require('../controllers/fileController')

const { uploadFileImgMiddleware } = require('../middlewares/uploadFileImgMiddleware')
const { authMiddleware } = require("../middlewares/authMiddleware")

const router = new Router()

router.use(authMiddleware)

router.get('', getFilesController)
router.get('/find', findByNameController)
router.post('/createFile', createFileController)
router.post('/uploadImg/:id', uploadFileImgMiddleware.single('fileImg'), fileImageUpload)
router.use('/downloadImg', express.static(path.resolve('./tmp')))
router.delete('/:id', deleteFileController)
router.patch('/:id', updateFileController)

module.exports = router