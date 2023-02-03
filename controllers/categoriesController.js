const { CloudstoreError } = require("../helpers/errors");
const { Category } = require("../models/Category");

const addCategoryController = async (req, res, next) => {
  try {
    const { title, parentId } = req.body;
    const newCategory = new Category({
      title,
      parentId,
    });
    await Category.validate(newCategory);
    await newCategory.save();

    res.status(201).json({
      status: "ok",
      message: `Category was added!`,
      file: newCategory,
    });
  } catch (error) {
    console.log(error);
    next(new CloudstoreError(error.message));
  }
};

const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    // const categories = await Category.deleteMany();

    res.status(200).json({
      status: "ok",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    next(new CloudstoreError(error.message));
  }
};

module.exports = { addCategoryController, getCategoriesController };
