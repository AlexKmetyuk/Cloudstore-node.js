const { CloudstoreError } = require("../helpers/errors");
const { Category } = require("../models/Category");
const { Counters } = require("../models/Counters");
const { deleteCategory } = require("../services/categoriesServices");

const addCategoryController = async (req, res, next) => {
  try {
    const [categoriesCounter] = await Counters.find({
      counterName: "categories",
    });
    const newCategoryId = categoriesCounter.count + 1;

    const { title, parentId } = req.body;
    const newCategory = new Category({
      title,
      parentId,
      categoryId: newCategoryId,
    });
    await Category.validate(newCategory);
    await newCategory.save();

    await Counters.findOneAndUpdate(
      { counterName: "categories" },
      { count: newCategoryId }
    );

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

    res.status(200).json({
      status: "ok",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    next(new CloudstoreError(error.message));
  }
};

const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategory(req.body.id);

    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    next(new CloudstoreError(error.message));
  }
};

module.exports = {
  addCategoryController,
  getCategoriesController,
  deleteCategoryController,
};
