const fs = require("fs");
const path = require("path");

const clearDirectory = directory => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    });
  });
};

module.exports = clearDirectory;
