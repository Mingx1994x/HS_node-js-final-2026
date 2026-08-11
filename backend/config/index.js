require('dotenv').config();

const db = require("./db");
const secret = require('./secret');
const web = require("./web");

const config = {
  db,
  secret,
  web,
  get: (path) => {
    if (!path || typeof path !== 'string') {
      throw new Error(`incorrect path: ${path}`)
    }
    const keys = path.split('.');
    let configValue = config;

    for (const key of keys) {
      configValue = configValue[key];
    }

    if (configValue === undefined || configValue === null) {
      throw new Error(`config ${path} not found`);
    }

    return configValue
  }
}

module.exports = config