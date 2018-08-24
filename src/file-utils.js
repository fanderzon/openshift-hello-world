const fs = require('fs');

function getFileOr(orValue, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('node err', err);
        return resolve(orValue);
      }
      return resolve(data);
    });
  });
}

function writeFile(filename, value) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, value, 'utf8', err => {
      if (err) {
        console.log('write err', err);
        return reject(err);
      }
      return resolve(value);
    });
  });
}

module.exports = {
  getFileOr,
  writeFile,
}
