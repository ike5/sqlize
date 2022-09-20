/**
 * Shows current server name (should be Day Owls)
 */
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Gets the server info"),
  async execute(interaction) {
    // validate user
    await require("../modules/validate-user")(interaction);
    
    await interaction.reply({
      content: `Server name: ${interaction.guild.name}`,
      ephemeral: true,
    });
    console.log("/server executed");
  },
};
