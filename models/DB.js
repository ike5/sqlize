/**
 * Making a singleton: Keep the database instance (sequelize) static by keeping it
 * as a prototype. This way it can be accessed everywhere throughout
 * the application .
 */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const database = {};

let proto = {
  sequelize: sequelize,
};

database.prototype = proto;

module.exports = {
  DB: database,
};
