const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const User = require('../models/User');
const Log = require('../models/Log');
const Friends = require('../models/Friends');
const Trophy = require('../models/Trophy');
const UserTrophies = require('../models/UserTrophies');

const models = {
  User: User.init(sequelize, Sequelize),
  Log: Log.init(sequelize, Sequelize),
  Friends: Friends.init(sequelize, Sequelize),
  Trophy: Trophy.init(sequelize, Sequelize),
  UserTrophies: UserTrophies.init(sequelize, Sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
};

module.exports = { db };
