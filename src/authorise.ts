// src/authorize.ts
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// Load credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n🔗 Authorize this app by visiting the URL below:\n');
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nPaste the code here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err || !token) {
      console.error(' Error retrieving access token:', err?.message || 'Empty token');
      return;
    }

    oAuth2Client.setCredentials(token);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('\nAccess token saved to token.json');
  });
});
