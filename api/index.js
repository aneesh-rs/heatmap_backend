const fs = require('fs');
const path = require('path');

const serverlessPath = path.join(__dirname, '..', 'dist', 'serverless.js');

if (!fs.existsSync(serverlessPath)) {
  module.exports = async (_req, res) => {
    console.error(`Missing compiled handler at ${serverlessPath}`);
    res.status(500).json({
      statusCode: 500,
      message:
        'Server build incomplete: dist/serverless.js missing. Check Vercel build logs.',
    });
  };
} else {
  module.exports = require('../dist/serverless.js').default;
}
