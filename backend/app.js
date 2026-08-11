const express = require('express');
const cors = require('cors');
const createHttpError = require('http-errors');

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
    res.status(500).send('server is not working');
  }
});

app.use((req, res, next) => {
  next(createHttpError(404, '無此路由'));
});

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode === 500 ? "error" : "failed",
    message: err.expose ? err.message : '伺服器錯誤'
  })
});

module.exports = app;
