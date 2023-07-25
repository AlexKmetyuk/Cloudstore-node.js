const db = require("../models/index");
const Category = db.categories;

const deleteCategory = async (categoryId) => {
  const children = await Category.findAll({ where: { parentId: categoryId } });
  await Category.destroy({ where: { id: categoryId } });

  for (const child of children) {
    await deleteCategory(child.id);
  }
};

module.exports = {
  deleteCategory,
};
