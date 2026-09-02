const express = require('express');
const { createApp } = require('../dist/create-app');

const expressApp = express();
let bootstrapPromise;

module.exports = async (req, res) => {
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = createApp(expressApp);
    }

    await bootstrapPromise;
    expressApp(req, res);
  } catch (error) {
    bootstrapPromise = null;
    console.error('Serverless bootstrap failed:', error);

    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Internal server error',
      });
    }
  }
};
