const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Command to check-in'),
  async execute(interaction) {
    await interaction.reply('Check!');
  },
};
