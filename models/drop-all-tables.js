const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: true,
  // SQLite only
  storage: 'database.sqlite',
});

sequelize.drop();
