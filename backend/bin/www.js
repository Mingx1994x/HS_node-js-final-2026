const app = require('../app');

const config = require('../config');
const port = config.get('web.port');

//啟動 Server
app.listen(port, () => {
  try {
    console.log(`app listening on port ${port}`);
  } catch (error) {
    console.error(`something went wrong`, error);
    process.exit(1);
  }
})