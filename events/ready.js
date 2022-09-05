module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    sequelize.sync({ alter: false, force: false });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
