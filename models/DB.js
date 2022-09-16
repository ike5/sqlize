const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});


const DB = {}

let proto = {
    sequelize: sequelize,
}

DB.prototype = proto;

module.exports = {
    DB
}
