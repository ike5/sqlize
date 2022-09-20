const { db } = require("../modules/initialize-models");
module.exports = async (interaction) => {
  const interactionUser = await interaction.guild.members.fetch(
    interaction.user.id
  );

  const userName = interactionUser.user.username;
  const userId = interactionUser.id;

  const { userData } = require("../modules/user-data");

  const ud = Object.assign(userData);
  ud.user.discord_data.discordId = userId;
  ud.user.discord_data.username = userName;
  ud.user.discord_data.discordNickname = interactionUser.nickname;

  const user = await db.User.findOrCreate({
    where: {
      discordId: userId,
    },
    defaults: {
      user_data: JSON.stringify(ud),
    },
  });

  //TEST
  console.log(user[0])
};
