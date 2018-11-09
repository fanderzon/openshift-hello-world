const path = require('path');
const express = require('express');

const  { getFileOr, writeFile } = require('./file-utils');
const copyDbFilesFromS3 = require('./copy-db-files-from-s3');

const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const DATA_PATH = path.join('/', 'data');
const VISIT_COUNT_FILE = path.join(DATA_PATH, 'visit_count');

app.get('/', (req, res) => {
  return getCount()
    .then(addToNumber)
    .then(updateCount)
    .then(count => res.send(`Hello visitor number ${count}`))
    .catch(err => res.send(`something went wrong`));
});

app.get('/copy-db-files', (req, res) => {
  return copyDbFilesFromS3()
    .then(() => res.send('DB files have been copied from s3 and written to /data dir'))
    .catch(err => res.send(err));
});

app.listen(port, () => console.log(`App running on http://${ip}:${port}/`));


function addToNumber(v) {
  return (parseInt(v, 10) || 0) + 1;
}

function getCount() {
  return getFileOr(0, VISIT_COUNT_FILE);
}

function updateCount(value) {
  return writeFile(VISIT_COUNT_FILE, value);
}
