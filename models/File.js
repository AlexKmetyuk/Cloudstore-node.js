const { model, Schema } = require("mongoose");

const FileSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    category: { type: String, required: true },
    imgUrl: { type: String, default: "" },
    desc: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

const File = model("File", FileSchema);

module.exports = { File };
