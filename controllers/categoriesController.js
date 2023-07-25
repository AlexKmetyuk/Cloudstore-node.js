const { CloudstoreError } = require("../helpers/errors");
const { deleteCategory } = require("../services/categoriesServices");

const db = require("../models/index");

const Category = db.categories;

const addCategoryController = async (req, res, next) => {
  try {
    const { title, parentId } = req.body;

    const parentCategory = await Category.findOne({ where: { id: parentId } });

    if (!parentCategory && parentId != 0) {
      next(new CloudstoreError("Parent category not found!"));
      return;
    }

    const newCategory = await Category.create({ title, parentId });

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
    const categories = await Category.findAll({});

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
    const categoryId = req.body.id;
    const category = await Category.findOne({ where: { id: categoryId } });
    console.log("Cat", category);
    if (!category) {
      next(new CloudstoreError(`Not found category with id ${categoryId}`));
      return;
    }

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
