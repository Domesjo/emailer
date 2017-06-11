const clientId = process.env.GMAIL_CLIENT_ID;
const secret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/token';
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oAuth2Client = new OAuth2(
  clientId,
  secret,
  redirectUri
);

google.options({
  auth: oAuth2Client
});

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/', 'https://www.googleapis.com/auth/userinfo.email']
});

module.exports = { url, oAuth2Client};
