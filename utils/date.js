const fromWalletToDate = (dateToConvert) => {
  // 20200831
  const year = parseInt(dateToConvert.slice(0, 4), 10);
  const month = parseInt(dateToConvert.slice(4, 6), 10) - 1;
  const day = parseInt(dateToConvert.slice(6, 8), 10);
  return new Date(year, month, day);
};

const MONTH = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const fromRevolutToDate = (dateToConvert) => {
  const [day, month, year] = dateToConvert.split(' ');
  return new Date(parseInt(year, 10), MONTH[month], parseInt(day, 10));
};

module.exports = { fromWalletToDate, fromRevolutToDate };
