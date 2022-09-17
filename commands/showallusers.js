const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('showallusers')
    .setDescription('Shows all users and bots with their statii'),
  async execute(interaction) {
    let allMembers = await interaction.guild.members.fetch();
    let onlineUsers = allMembers.filter((member) => member.presence);

    // Get bot flag
    let memberMap = onlineUsers.map((m) => {
      return {
        bot: m.user.bot,
        status: m.presence.status,
        name: m.user.username,
      };
    });

    let online = '```type\tstatus\tusername\n';
    online += '====\t======\t========\n';
    memberMap.forEach((element) => {
      let botOrUser = 'user';
      if (element.bot === true) {
        botOrUser = 'BOT';
      }
      online += `${botOrUser.padEnd(8)}${element.status.padEnd(6)}\t${
        element.name
      }\n`;
    });

    online += '```';

    interaction.reply(online);
    console.log("/showallusers executed")
  },
};
