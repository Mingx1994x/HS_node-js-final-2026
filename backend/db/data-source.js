const { DataSource } = require("typeorm");

const config = require("../config");
const Skill = require("../entities/skills.entity");
const CreditPackage = require("../entities/creditPackages.entity");
const User = require("../entities/users.entity");

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  entities: [Skill, CreditPackage, User],
  synchronize: config.get('db.synchronize') === 'true',
  ssl: config.get('db.ssl') === 'true'
});

module.exports = AppDataSource;