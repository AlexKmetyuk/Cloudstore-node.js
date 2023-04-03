const Router = require("express");
const path = require("path");
const express = require("express");

const {
  createFilesController,
  getFilesController,
  deleteFilesController,
  fileImageUpload,
  updateFilesController,
} = require("../controllers/filesController");

const {
  uploadFileImgMiddleware,
  processFileMiddleware,
} = require("../middlewares/uploadFileImgMiddleware");

const router = new Router();

router.post("", createFilesController);
router.get("", getFilesController);
router.post("/img/:id", processFileMiddleware, fileImageUpload);
router.delete("/:id", deleteFilesController);
router.patch("/:id", updateFilesController);

module.exports = router;
