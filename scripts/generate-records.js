const parse = require('csv-parse/lib/sync');
const { fromWalletToDate, fromRevolutToDate } = require('../utils/date.js');
const {
  formatWalletHeaderCsv,
  formatRevolutHeaderCsv,
} = require('../utils/format-headers.js');

const formatWalletRecords = (records) => {
  const walletRevolut = records.reduce((accRecords, currentRecord) => {
    const { date, category, subcategory, note, amount, out } = currentRecord;
    const dateFormated = fromWalletToDate(date);

    return [
      ...accRecords,
      {
        date: dateFormated,
        category,
        subcategory,
        description: note,
        amount,
        isExpense: !!out,
        note: '',
      },
    ];
  }, []);
  return walletRevolut;
};

const formatRevolutRecord = (records) => {
  const revolutRecord = records.reduce((accRecords, currentRecord) => {
    const { date, description, out, _in, category, notes } = currentRecord;
    const dateFormated = fromRevolutToDate(date);
    const isExpense = !!out.trim();
    return [
      ...accRecords,
      {
        date: dateFormated,
        category: category.trim(),
        subcategory: '',
        description: description.trim(),
        amount: isExpense ? out.trim() : _in.trim(),
        isExpense,
        notes: notes.trim(),
      },
    ];
  }, []);
  return revolutRecord;
};

const processDocument = (document) => {
  const { data, name } = document;
  const isRevolut = !!name.includes('revolut');
  const delimiter = isRevolut ? ';' : ',';
  const documentRecords = parse(data, {
    delimiter,
    columns: isRevolut ? formatRevolutHeaderCsv : formatWalletHeaderCsv,
  });
  return isRevolut
    ? formatRevolutRecord(documentRecords)
    : formatWalletRecords(documentRecords);
};

module.exports = (documents) => {
  const records = documents.map((document) => processDocument(document));
  return records.flat();
};
