const formatWalletHeaderCsv = () => {
  return [
    'id',
    'currency',
    'amount',
    'category',
    'subcategory',
    'date',
    'out',
    '_in',
    'note',
    'periodic',
    'project',
    'payee_payer',
    'uid',
    'time',
  ];
};

const formatRevolutHeaderCsv = () => {
  return [
    'date',
    'description',
    'out',
    '_in',
    'exchangeOut',
    'exchangeIn',
    'balance',
    'category',
    'notes',
  ];
};

const headerValues = [
  'Date',
  'Category',
  'Subcategory',
  'Description',
  'Amount',
  'Is Expense',
  'Note',
];

module.exports = {
  formatWalletHeaderCsv,
  formatRevolutHeaderCsv,
  headerValues,
};
