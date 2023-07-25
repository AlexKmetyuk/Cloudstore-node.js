const Router = require("express");
const path = require("path");
const express = require("express");
const {
  addCategoryController,
  getCategoriesController,
  deleteCategoryController,
} = require("../controllers/categoriesController");

const router = new Router();

router.post("", addCategoryController);
router.get("", getCategoriesController);
router.delete("", deleteCategoryController);

module.exports = router;
