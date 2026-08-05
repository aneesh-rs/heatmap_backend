/**
 * One-time OAuth helper for Gmail API send scope.
 *
 * Prereqs:
 * 1. Enable Gmail API in Google Cloud Console
 * 2. Add OAuth Web client redirect URI: http://localhost:3333/oauth2callback
 * 3. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env
 *
 * Run: node scripts/gmail-get-refresh-token.mjs
 */
import http from 'node:http';
import { URL } from 'node:url';
import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3333/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  // gmail.send alone is enough for messages.send; mail.google.com is fuller fallback
  scope: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://mail.google.com/',
  ],
});

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost:3333');
    if (url.pathname !== '/oauth2callback') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400);
      res.end('Missing code');
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Success. Copy GMAIL_REFRESH_TOKEN from the terminal.');

    console.log('\nAdd these to Vercel / .env:\n');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GMAIL_SENDER=<google-account-used-in-consent>`);
  } catch (error) {
    res.writeHead(500);
    res.end('OAuth failed');
    console.error(error);
  } finally {
    server.close();
  }
});

server.listen(3333, () => {
  console.log('Open this URL in a browser and approve Gmail send access:\n');
  console.log(authUrl);
});
