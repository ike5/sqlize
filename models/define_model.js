const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: true,
  // SQLite only
  storage: 'database.sqlite',
});

let Dummy = sequelize.define('dummy', {
  description: Sequelize.STRING,
});

Dummy.sync()
  .then(() => {
    console.log('New table created');
  })
  .finally(() => {
    sequelize.close();
  });
