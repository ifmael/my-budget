const { google } = require('googleapis');
const credentials = require('../config/credentials.json');

// Set up the connection to Google drive
const scopes = ['https://www.googleapis.com/auth/drive'];

module.exports = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);
