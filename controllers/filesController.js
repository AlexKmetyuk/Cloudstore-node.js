const url = require("url");
const { getFileById } = require("../services/filesServices");
const { CloudstoreError } = require("../helpers/errors");
const { uploadImgToStorage } = require("../services/imageUploader");
const { Op } = require("sequelize");

const db = require("../models/index");

const File = db.files;

const createFilesController = async (req, res, next) => {
  try {
    const { name, link, category, desc } = req.body;

    const file = await File.create({ name, link, category, desc });

    res.status(201).json({ status: "ok", message: `File was created!`, file });
  } catch (error) {
    console.log(error.message);
    next(new CloudstoreError(error.message));
  }
};

const fileImageUpload = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const currentFile = await File.findOne({ where: { id: fileId } });
    const image = req.file;

    if (!currentFile) {
      next(new CloudstoreError(`Not found file with id ${fileId}`));
      return;
    }

    if (!image) {
      next(new CloudstoreError("Please upload a image!"));
      return;
    }

    const [_, extension] = image.originalname.split(".");
    image.originalname = `${fileId}.${extension}`;

    const imageUrl = await uploadImgToStorage(image);

    const updatedFile = await File.update(
      { imgUrl: imageUrl },
      { where: { id: fileId } }
    );

    res.status(200).json({
      status: "ok",
      message: "Upload was successful",
      imgUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);
    next(new CloudstoreError(error.message || "Something went wrong"));
  }
};

const getFilesController = async (req, res, next) => {
  try {
    const queryObj = { ...url.parse(req.url, true).query };

    const limit = queryObj.limit || 10;
    const offset = queryObj.page ? (queryObj.page - 1) * limit : 0;

    const findParameters = {};

    if (queryObj.category) {
      findParameters.category = { [Op.like]: `%${queryObj.category}%` };
    }

    if (queryObj.name) {
      findParameters.name = { [Op.like]: `%${queryObj.name}%` };
    }

    const data = await File.findAll({
      limit,
      offset,
      where: {
        ...findParameters,
      },
    });

    res.status(200).json({ status: "ok", message: "success", data });
  } catch (error) {
    console.log(error.message);
    next(new CloudstoreError(error.message));
  }
};

const deleteFilesController = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    const result = await File.destroy({
      where: { id: fileId },
    });

    if (result == 0) {
      next(new CloudstoreError(`Not found file with id ${fileId}`));
      return;
    }

    res.status(200).json({
      status: "ok",
      message: `File with id ${fileId} was deleted!`,
    });
  } catch (error) {
    next(new CloudstoreError(error.message));
  }
};

const updateFilesController = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const file = await File.findOne({ where: { id: fileId } });
    const currentFile = file.dataValues;

    if (!currentFile) {
      next(new CloudstoreError("File is not found!"));
      return;
    }

    const { name, link, desc, category } = req.body;

    if (name) {
      currentFile.name = name;
    }
    if (link) {
      currentFile.link = link;
    }
    if (desc) {
      currentFile.desc = desc;
    }
    if (category) {
      currentFile.category = category;
    }

    await File.update(currentFile, { where: { id: fileId } });

    res.status(200).json({
      status: "ok",
      message: "File was updated!",
      file: currentFile,
    });
  } catch (error) {
    console.log(error.message);
    next(new CloudstoreError(error.message));
  }
};

module.exports = {
  createFilesController,
  getFilesController,
  deleteFilesController,
  fileImageUpload,
  updateFilesController,
};
