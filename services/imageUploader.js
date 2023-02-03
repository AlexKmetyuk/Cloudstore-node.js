const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const fs = require("fs");
const util = require("util");

const storage = new Storage();

const bucketName = "cloudstorage-playtika";

const bucket = storage.bucket(bucketName);

const uploadImgToStorage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = {
  uploadImgToStorage,
};
