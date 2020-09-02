const { google } = require('googleapis');
const auth = require('../utils/auth.js');

module.exports = async () => {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const document = await sheets.spreadsheets.values.get({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    });
    console.log(document);
  } catch (error) {
    console.log(error);
  }
};
