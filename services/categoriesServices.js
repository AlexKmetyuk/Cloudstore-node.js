const { Category } = require("../models/Category");

const deleteCategory = async (categoryId) => {
  const children = await Category.find({ parentId: categoryId });

  await Category.findOneAndDelete({ categoryId: categoryId });

  for (const child of children) {
    await deleteCategory(child.categoryId);
  }
};

module.exports = {
  deleteCategory,
};
