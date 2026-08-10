const express = require('express');
const cors = require('cors');

// 建立 App
const app = express();

app.use(cors());

// 定義 Route
app.get('/healthcheck', (req, res) => {
  res.send('OK')
})

module.exports = app;
