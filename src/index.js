const fs = require('fs');
const path = require('path');
const express = require('express');
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

app.listen(port, () => console.log(`App running on http://${ip}:${port}/`));

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

function addToNumber(v) {
  return (parseInt(v, 10) || 0) + 1;
}

function getCount() {
  return getFileOr(0, VISIT_COUNT_FILE);
}

function updateCount(value) {
  console.log('updateCount()', value);
  return new Promise((resolve, reject) => {
    fs.writeFile(VISIT_COUNT_FILE, value, 'utf8', err => {
      if (err) {
        console.log('write err', err);
        return reject(err);
      }
      return resolve(value);
    });
  });
}
