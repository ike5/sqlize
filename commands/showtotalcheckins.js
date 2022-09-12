const { SlashCommandBuilder } = require('discord.js');
const { DB } = require('../models/DB');
const { Log } = require('../models/Log');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('showtotalcheckins')
    .setDescription('Shows all your check-ins'),
  async execute(interaction) {
    // Get logs for user

    //FIXME: Fix undefined 'count' method
    const amount = await Log.count({
      where: {
        UserDiscordId: interaction.user.id,
      },
    });
    // Create embed
    const totalCheckinsEmbed = new EmbedBuilder()
      .setTitle('Total number of check-ins')
      .setDescription(`${amount}`);

    await interaction.reply({
      embeds: [totalCheckinsEmbed],
      ephemeral: true,
    });
    console.log('/showtotalcheckins executed');
  },
};
