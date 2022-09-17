const { db } = require('../modules/initialize-models');
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    db.sequelize.sync({ alter: false, force: false });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
