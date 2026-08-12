const app = require('../app');

const config = require('../config');
const AppDataSource = require('../db/data-source');
const logger = require('../utils/logger').child({ module: "www" });

const port = config.get('web.port');

//啟動 Server
AppDataSource.initialize()
  .then(() => {
    logger.info('資料庫連線成功');
    app.listen(port, async () => {
      logger.info(`app listening on port ${port}`);
    })
  }).catch((error) => {
    logger.fatal({ err: error }, '伺服器錯誤');
    process.exit(1);
  })
