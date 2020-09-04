const { google } = require('googleapis');
const auth = require('../utils/auth.js');
const { myBudgetId } = require('../config/constants.js');

/*
  Take a look https://github.com/theoephraim/node-google-spreadsheet
  */

module.exports = async () => {
  let document;
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const requestParam = {
      spreadsheetId: myBudgetId,
    };
    // Get info for the spreadsheet
    document = await sheets.spreadsheets.get(requestParam);
    const requests = [
      {
        addSheet: {
          properties: {
            title: '09-20',
            tabColor: {
              red: 1.0,
              green: 0.3,
              blue: 0.4,
            },
          },
        },
      },
    ];

    const batchUpdateRequest = { requests };

    const sheetResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: myBudgetId,
      resource: batchUpdateRequest,
    });
    console.log(sheetResponse);
  } catch (error) {
    console.log(error);
  }
  return document;
};
