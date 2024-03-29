const { File } = require("../models/File");

const getFileById = async (id) => {
  try {
    const file = await File.findOne({ _id: id });
    if (file) {
      return file;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getFileById,
};
