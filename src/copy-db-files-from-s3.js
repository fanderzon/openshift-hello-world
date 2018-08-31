const AWS = require('aws-sdk');
const path = require('path');

const { writeFile } = require('./file-utils');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.test_user_access_key;
AWS.config.secretAccessKey = process.env.test_user_secret_key;
AWS.config.region = 'eu-west-1';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const bucket_name = process.env.test_bucket_name || 'bucket';
const files = ['categories', 'games', 'collections', 'tags', 'users'];

function getFromS3(name){
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: bucket_name,
      Key: `tmp/${name}`,
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    })
  });
}

function copyFiles() {
  return Promise.all(
    files.map(
      filename => getFromS3(filename)
        .then(data => ({ name: filename, data}))
    )
  );
}

function writeFiles(files) {
  return Promise.all(
    files.map(({ name, data }) =>
      writeFile(path.join('/', 'data', name), data.Body).then(() => name)
    )
  );
}

module.exports = function copyDbFilesFromS3() {
  return copyFiles()
    .then(writeFiles)
    .then(files => `wrote files ${files.join(', ')}`);
};
