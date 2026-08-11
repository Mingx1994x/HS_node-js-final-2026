const app = require('../app');

const config = require('../config');
const AppDataSource = require('../db/data-source');

const port = config.get('web.port');

//啟動 Server
AppDataSource.initialize()
  .then(() => {
    app.listen(port, async () => {
      console.log(`app listening on port ${port}`);
    })
  }).catch((error) => {
    console.error(`something went wrong`, error);
    process.exit(1);
  })
