const { DataSource } = require("typeorm");
const config = require("../config");

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  entities: [ /* 你的 Entity */],
  synchronize: config.get('db.synchronize') === 'true',
  ssl: config.get('db.ssl') === 'true'
});

module.exports = AppDataSource;