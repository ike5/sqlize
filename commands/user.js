const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get the tag of the current user"),
  async execute(interaction) {
    await interaction.reply({
      content: `User: ${interaction.user.tag}`,
      ephemeral: true,
    });
    console.log("/user command executed")
  },
};
