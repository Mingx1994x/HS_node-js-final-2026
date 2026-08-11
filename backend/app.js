const express = require('express');
const cors = require('cors');
const AppDataSource = require('./db/data-source');

// 建立 App
const app = express();

app.use(cors());

// 定義 Route
app.get('/healthcheck', async (req, res) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.send('OK')
  } catch (error) {
    console.error(error);
    res.send('server is not working');
  }
})

module.exports = app;
