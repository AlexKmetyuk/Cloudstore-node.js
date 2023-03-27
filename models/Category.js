const { model, Schema } = require("mongoose");

const CategorySchema = new Schema({
  title: { type: String, required: true },
  parentId: { type: Number, required: true },
  categoryId: { type: Number, required: true },
});

const Category = model("Category", CategorySchema);

module.exports = { Category };
