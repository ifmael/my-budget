/* eslint-disable no-console */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');
const credentials = require('../config/credentials.json');
const { myBudgetId } = require('../config/constants.js');
const { headerValues } = require('../utils/format-headers.js');

const totalByCategory = (records) => {
  return  records.reduce((acc, currentRecord) =>{
    const { Category: category, Amount: amount } = currentRecord;
    const quantity = parseFloat(amount.replace(',', '.'));

    if (acc[category]) {
      return { ...acc, [category]: acc[category] + quantity };
    }
    return { ...acc, [category]: quantity };
  }, {});
};

module.exports = async ({ date, records }) => {
  try {
    const doc = new GoogleSpreadsheet(myBudgetId);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[date];
    if (!sheet) {
      const properties = {
        title: date,
        tabColor: {
          red: 1.0,
          green: 0.3,
          blue: 0.4,
        },
        headerValues,
      };
      const newSheet = await doc.addSheet(properties);
      const rows = records.map((record) => {
        return {
          ...record,
          Date: moment(record.Date).format('DD/MM/YYYY'),
          'Is Expense': record['Is Expense'] ? 'Yes' : 'No',
        };
      });
      await newSheet.addRows(rows);

      // Add Total by Category (J!), Total Amount (K1)
/*       const byCategory = totalByCategory(records);
      const countCategories = Object.keys(byCategory).length;
      await newSheet.loadCells(`J1:K${countCategories + 2}`);
      const cellJ1 = newSheet.getCell(0, 0);
      const cellK1 = newSheet.getCell(0, 1);
      cellJ1.value = 'Total by Category';
      cellK1.value = 'Total Amount';
      await newSheet.saveUpdatedCells();

      console.log(byCategory); */
    } else {
      console.log('The sheet exists');
    }
  } catch (error) {
    console.log(error);
  }
};
