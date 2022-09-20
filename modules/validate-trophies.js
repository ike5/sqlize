const { db } = require("./initialize-models");

module.exports = async (interaction) => {
  const interactionUser = await interaction.guild.members.fetch(
    interaction.user.id
  );

  const userName = interactionUser.user.username;
  const userId = interactionUser.id;

  const user = await db.User.findByPk(userId);
  const userData = await user.getDataValue("user_data");
  const total_checkins = JSON.parse(userData).user.total_checkins;

  
  return total_checkins;
};
