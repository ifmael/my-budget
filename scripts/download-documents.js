/* eslint-disable no-console */
const { google } = require('googleapis');
const fs = require('fs');
const auth = require('../utils/auth.js');
const { getDate } = require('../utils/date.js');

// List of files for the current month
const listFiles = async (drive) => {
  const date = getDate();
  const query = {
    q: `name contains '${date}' and mimeType='text/csv' or mimeType='application/vnd.ms-excel'`,
  };

  const {
    data: { files },
  } = await drive.files.list(query);

  return files;
};

// eslint-disable-next-line consistent-return
module.exports = async (basePath) => {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const listOfPromises = [];
    const listOfFiles = await listFiles(drive);
    // eslint-disable-next-line no-restricted-syntax
    for (const fileInDrive of listOfFiles) {
      const promise = drive.files.get(
        { fileId: fileInDrive.id, alt: 'media' },
        { responseType: 'stream' }
      );
      listOfPromises.push(promise);
    }
    const listOfFileStreams = await Promise.all(listOfPromises);

    const savedFiles = listOfFileStreams.map((fileStream, index) => {
      const { id, name } = listOfFiles[index];

      return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(`${basePath}${name}`, { flags: 'w' });
        fileStream.data
          .on('end', () => {
            console.log(`· File ${name} downloaded`);
            resolve({ id, name, status: 'ok' });
          })
          .on('error', (err) => {
            reject(new Error(`The file ${name} has failed: ${err}`));
          })
          .pipe(dest);
      });
    });

    return Promise.all(savedFiles);
  } catch (error) {
    console.log(error);
  }
};
