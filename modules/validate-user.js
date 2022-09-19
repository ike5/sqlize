const { db } = require("../modules/initialize-models");
module.exports = async (interaction) => {
  const interactionUser = await interaction.guild.members.fetch(
    interaction.user.id
  );

  const userName = interactionUser.user.username;
  const userId = interactionUser.id;

  const user = await db.User.findOrCreate({
    where: {
      discordId: userId,
    },
  });

  // Get user_data field
  const userDataFields = await db.User.findByPk(userId);
  if (userDataFields === null) {
    console.log("Not found!");
  } else {
    console.log(userDataFields instanceof db.User);
  }

  const ud = JSON.parse(userDataFields.user_data);
  ud.user.discord_data.discordId = userId;
  ud.user.discord_data.username = userName;
  ud.user.discord_data.discordNickname = interactionUser.nickname;

  const updatedUser = await db.User.update(
    { user_data: JSON.stringify(ud) },
    {
      where: {
        discordId: userId,
      },
    }
  );

};
