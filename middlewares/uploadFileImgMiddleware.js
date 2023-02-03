const multer = require("multer");
const path = require("path");
const util = require("util");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve("./tmp"));
//   },
//   filename: async (req, file, cb) => {
//     const [_, extension] = file.originalname.split(".");
//     req.filename = `${req.params.id}.${extension}`;

//     cb(null, `${req.params.id}.${extension}`);
//   },
// });

// const uploadFileImgMiddleware = multer({ storage });

let processFile = multer({
  storage: multer.memoryStorage(),
}).single("file");

let processFileMiddleware = util.promisify(processFile);

module.exports = {
  // uploadFileImgMiddleware,
  processFileMiddleware,
};
