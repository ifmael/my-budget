const dowloadDocuments = require('./scripts/download-documents');

const main = async () => {
  const filesDownloaded = await dowloadDocuments();
};

main();
