const { db } = require("../modules/initialize-models");
module.exports = async (userId, userName) => {
 
  const { userData } = require("../modules/user-data");

  const ud = Object.assign(userData);
  ud.user.discord_data.discordId = userId;
  ud.user.discord_data.username = userName;

  await db.User.findOrCreate({
    where: {
      discordId: userId,
    },
    defaults: {
      user_data: JSON.stringify(ud),
    },
  });
};