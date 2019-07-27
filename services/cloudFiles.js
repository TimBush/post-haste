const debug = require("debug")("cloudinary");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

/* This takes the randomly generated file name
 * of the file that the user uploaded and begins
 * the upload process via Cloudinary SDK
 * returns a promise of the result response from cloudinary
 * after a succesful upload
 */

function uploadFile(fileName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path.join(__dirname, "../uploads", fileName),
      {
        resource_type: "auto",
        folder: "posthaste"
      },
      (error, result) => {
        debug(result);
        if (error) reject(error);
        return resolve(result);
      }
    );
  });
}

function deleteFile(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      publicId,
      { resource_type: "video" },
      function(error, result) {
        if (error) reject(error);
        return resolve(result);
      }
    );
  });
}

function generateVideoHtml(publicId) {
  return cloudinary.video(publicId, {
    width: 800,
    controls: true
  });
}

function generateImgHtml(publicId) {
  return cloudinary.image(`${publicId}.jpg`, {
    width: 300,
    height: 250,
    resource_type: "video"
  });
}

module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;
module.exports.generateVideoHtml = generateVideoHtml;
module.exports.generateImgHtml = generateImgHtml;
