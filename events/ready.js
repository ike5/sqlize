const { db } = require("../modules/initialize-models");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    db.sequelize.sync({ force: false, alter: false }); // DO NOT CHANGE THIS VALUE
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
