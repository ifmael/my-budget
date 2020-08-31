const fs = require('fs');
const dowloadDocuments = require('./scripts/download-documents.js');
const generateDocument = require('./scripts/generate-document.js');

const main = async () => {
  try {
    const basePath = 'reports/';
    const filesDownloaded = await dowloadDocuments(basePath);

    const files = filesDownloaded.map((fileInfo) => {
      const { name } = fileInfo;
      const data = fs.readFileSync(`${basePath}${name}`, 'utf8');
      return { ...fileInfo, data };
    });
    generateDocument(files);
  } catch (error) {
    console.log(error);
  }
};

main();
