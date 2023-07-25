const multer = require("multer");
const path = require("path");
const util = require("util");

let processFile = multer({
  storage: multer.memoryStorage(),
}).single("file");

let processFileMiddleware = util.promisify(processFile);

module.exports = {
  processFileMiddleware,
};
