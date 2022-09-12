const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('online')
    .setDescription('Finds all users who are currently online. Excludes bots.'),
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

    let online = 'status\t\tusername\n-------\t\t-----------\n';
    memberMap.forEach((element) => {
      if (element.status === 'online' && element.bot === false) {
        online += `${element.status}\t\t${element.name}\n`;
      }
    });
    interaction.reply(online);
    console.log("/online executed")
  },
};
