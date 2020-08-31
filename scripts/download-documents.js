const { google } = require('googleapis');
const fs = require('fs');
const credentials = require('../config/credentials.json');

// Set up the connection to Google drive
const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
const drive = google.drive({ version: 'v3', auth });

const getDate = () => {
  const currentDate = new Date();
  const month = `0${currentDate.getMonth() + 1}`.slice(-2);
  const year = `${currentDate.getFullYear()}`.slice(-2);
  return `${month}-${year}`;
};

// List of files for the current month
const listFiles = async () => {
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
    const listOfPromises = [];
    const listOfFiles = await listFiles();
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
        const dest = fs.createWriteStream(`${basePath}${name}`);
        fileStream.data
          .on('end', () => {
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
