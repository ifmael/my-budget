/* eslint-disable no-console */
const fs = require('fs');
const dowloadDocuments = require('./scripts/download-documents.js');
const generateRecords = require('./scripts/generate-records.js');
const createDocument = require('./scripts/create-document.js');
const { getDate } = require('./utils/date.js');

const main = async () => {
  try {
    const basePath = './reports/';

    // Download documents
    console.log('Downloading files...');
    const filesDownloaded = await dowloadDocuments(basePath);
    console.log('Files downloaded');

    // Read documents && generate records
    const files = filesDownloaded.map((fileInfo) => {
      const { name } = fileInfo;
      const data = fs.readFileSync(`${basePath}${name}`, 'utf8');
      return { ...fileInfo, data };
    });
    const records = generateRecords(files);

    // Create Document
    const properties = {
      date: getDate(),
      records,
    };
    await createDocument(properties);
  } catch (error) {
    console.log(error);
  }
};

main();
