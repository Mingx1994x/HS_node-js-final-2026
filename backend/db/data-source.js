const { DataSource } = require("typeorm");

const config = require("../config");
const Skill = require("../entities/skills.entity");
const CreditPackage = require("../entities/creditPackages.entity");
const User = require("../entities/users.entity");
const Coach = require("../entities/coaches.entity");
const CoachSkill = require("../entities/coachSkills.entity");
const Course = require("../entities/courses.entity");
const creditPackageOrders = require("../entities/creditPackageOrders.entity");

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  entities: [Skill, CreditPackage, creditPackageOrders, User, Coach, CoachSkill, Course],
  synchronize: config.get('db.synchronize') === 'true',
  ssl: config.get('db.ssl') === 'true'
});

module.exports = AppDataSource;