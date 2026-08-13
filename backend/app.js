const express = require('express');
const cors = require('cors');
const createHttpError = require('http-errors');

const AppDataSource = require('./db/data-source');
const logger = require('./utils/logger').child({ module: 'app' });

// Router
const skillsRouter = require('./routes/skills.route');
const creditPackagesRouter = require('./routes/creditPackages.route');
const usersRouter = require('./routes/users.route');

// 建立 App
const app = express();
app.use(cors());
app.use(express.json());

// 定義 Route
app.get('/healthcheck', async (req, res, next) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.send('OK')
  } catch (error) {
    logger.error({ err: error }, 'healthcheck 查詢失敗');
    res.status(500).send('server is not working');
  }
});

app.use('/api/coaches/skill', skillsRouter);
app.use('/api/credit-package', creditPackagesRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
  next(createHttpError(404, '無此路由'));
});

app.use((error, req, res, next) => {
  const statusCode = error.status || error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error({ err: error }, error.message);
  } else {
    logger.warn({ err: error }, error.message);
  }

  res.status(statusCode).json({
    status: statusCode === 500 ? "error" : "failed",
    message: error.expose ? error.message : '伺服器錯誤'
  })
});

module.exports = app;
