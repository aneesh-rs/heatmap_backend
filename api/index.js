const express = require('express');
const { createApp } = require('../dist/create-app');

const expressApp = express();
let bootstrapPromise;

module.exports = async (req, res) => {
  if (!bootstrapPromise) {
    bootstrapPromise = createApp(expressApp);
  }

  await bootstrapPromise;
  expressApp(req, res);
};
