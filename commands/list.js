/**
 * Lists all check-ins
 */
const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../modules/initialize-models.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lists all check-ins'),
  async execute(interaction) {
    //TODO: prevent system from crashing if a user doesn't exist
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username;
    const userId = interactionUser.id;

    // creates a new user if id isn't found in database
    // await isIdUnique(userId).then((isUnique) => {
    //   if (isUnique) {
    //     const newUser = User.create({
    //       discordId: userId,
    //       discordNickname: nickName,
    //       username: userName,
    //       date_joined: new Date().getTime(),
    //     });
    //     console.log(`${newUser} has been created!`);
    //   }
    // });

    const [user, created] = await db.User.findOrCreate({
      where: { discordId: userId },
      defaults: {
        discordNickname: nickName,
        username: userName,
        date_joined: new Date().getTime(),
      },
    });

    if (created) {
      console.log(user.username);
      console.log(user.discordNickname);
      console.log(user.date_joined);
    }

    try {
      // Find all check-ins with a specific userId
      const user_check_ins = await db.Log.findAll({
        where: {
          UserDiscordId: `${userId}`,
        },
      });

      // Create a string list of all check-in descriptions
      let list = `\n`;
      user_check_ins.forEach((element) => {
        let l = `\n`;
        JSON.parse(element.ci_description).forEach((e) => {
          l += `\t- ${e.trim()}\n`;
        });

        // Get time posted
        let date = new Date(element.ci_timestamp).toLocaleDateString('en-US');
        let time = new Date(element.ci_timestamp).toLocaleTimeString('en-US');
        list += `${date} *${time}* ${l}\n`;
      });

      interaction.reply({ content: list, ephemeral: true });

      console.log(`${userName} called 'list'`);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: `Something went wrong.\nPlease wait a moment then try again.`,
        ephemeral: true,
      });
    }
  },
};
