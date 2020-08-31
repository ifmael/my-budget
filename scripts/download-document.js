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

// List of files for the current month
const listFiles = async () => {
  const currentDate = new Date();
  const month = `0${currentDate.getMonth() + 1}`.slice(-2);
  const year = `${currentDate.getFullYear()}`.slice(-2);
  const query = {
    q: `name contains '${month}-${year}' and mimeType='text/csv'`,
  };

  const {
    data: { files },
  } = await drive.files.list(query);

  return files;
};

const downloadFiles = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const fileInDrive of await listFiles()) {
      const { id, name } = fileInDrive;
      const dest = fs.createWriteStream(`./reports/${name}`);
      const promise = drive.files.get(
        { fileId: id, alt: 'media' },
        { responseType: 'stream' }
      );

      promise.then((fileStream) => {
        fileStream.data
          .on('end', () => {
            console.log(`File '${name}' saved in reports directory`);
          })
          .on('error', (err) => {
            console.log('Error during download', err);
          })
          .pipe(dest);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

downloadFiles();
