/**
 * This module establishes the database connection and initializes
 * the models.
 */
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

const models = {
  User: User.init(sequelize, Sequelize),
  Log: Log.init(sequelize, Sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
};

module.exports = { db };
