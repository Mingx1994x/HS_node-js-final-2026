require('dotenv').config();
const app = require('../app');

//啟動 Server
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})