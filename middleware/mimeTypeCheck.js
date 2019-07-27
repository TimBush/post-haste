module.exports = function(req, res, next) {
  // Defining accetable file mimetypes
  const mimetypes = [
    "video/mp4",
    "video/3gpp",
    "video/mpeg",
    "video/ogg",
    "video/quicktime",
    "video/webm",
    "video/x-m4v",
    "video/ms-asf",
    "video/x-ms-wmv",
    "video/x-msvideo"
  ];
  // IF the user didn't upload any file, pass control to handle in router
  if (!req.file) {
    return next();
  }
  if (mimetypes.includes(req.file.mimetype)) {
    req.file.validMimeType = true;
    next();
  } else {
    req.file.validMimeType = false;
    next();
  }
};
