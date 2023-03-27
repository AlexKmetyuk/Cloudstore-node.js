const { File } = require("../models/File");
const url = require("url");
const { getFileById } = require("../services/filesServices");
const { CloudstoreError } = require("../helpers/errors");
const { uploadImgToStorage } = require("../services/imageUploader");

const createFilesController = async (req, res, next) => {
  try {
    const { name, link, category, desc } = req.body;

    const newFile = new File({ name, link, category, desc });
    await File.validate(newFile);
    await newFile.save();

    res
      .status(201)
      .json({ status: "ok", message: `File was created!`, file: newFile });
  } catch (error) {
    console.log(error.message);
    next(new CloudstoreError(error.message));
  }
};

const fileImageUpload = async (req, res, next) => {
  try {
    const currentFile = await getFileById(req.params.id);
    const image = req.file;

    if (!currentFile) {
      next(new CloudstoreError(`Not found file with id ${req.params.id}`));
      return;
    }

    if (!image) {
      next(new CloudstoreError("Please upload a image!"));
      return;
    }

    const [_, extension] = image.originalname.split(".");
    image.originalname = `${req.params.id}.${extension}`;

    const imageUrl = await uploadImgToStorage(image);

    await File.findByIdAndUpdate(req.params.id, {
      imgUrl: imageUrl,
    });

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
    // const bodyObj = req.body;

    const limit = queryObj.limit || 0;
    const offset = queryObj.page ? (queryObj.page - 1) * limit : 0;

    const findParameters = {};

    if (queryObj.category) {
      findParameters.category = { $regex: queryObj.category, $options: "i" };
    }

    if (queryObj.name) {
      findParameters.name = { $regex: queryObj.name, $options: "i" };
    }

    console.log(findParameters);

    const data = await File.find(findParameters).limit(limit).skip(offset);

    res.status(200).json({ status: "ok", message: "success", data });
  } catch (error) {
    console.log(error.message);
    next(new CloudstoreError(error.message));
  }
};

// const findByNameController = async (req, res, next) => {
//   try {
//     const name = req.body.name;
//     const data = await File.find({ name: { $regex: name, $options: "i" } });

//     res.status(200).json({ status: "ok", message: "success", data });
//   } catch (error) {
//     console.log(error.message);
//     next(new CloudstoreError(error.message));
//   }
// };

const deleteFilesController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const file = await getFileById(id);

    if (!file) {
      next(new CloudstoreError("File not found!"));
      return;
    }

    await File.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: "ok", message: `File with id ${id} was deleted!` });
  } catch (error) {
    next(new CloudstoreError(error.message));
  }
};

const updatefilesController = async (req, res, next) => {
  try {
    const currentFile = await getFileById(req.params.id);
    if (!currentFile) {
      next(new CloudstoreError("File is not found!"));
      return;
    }
    const { owner, name, link, desc, category } = req.body;
    if (owner) {
      currentFile.owner = owner;
    }
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

    await File.findByIdAndUpdate(req.params.id, currentFile);
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
  updatefilesController,
  // findByNameController,
};
