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

module.exports = { formatWalletHeaderCsv, formatRevolutHeaderCsv };
