const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Gets the server info"),
  async execute(interaction) {
    await interaction.reply({
      content: `Server name: ${interaction.guild.name}`,
      ephemeral: true,
    });
  },
};
