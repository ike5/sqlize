/**
 * Displays the current username
 */
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get the tag of the current user"),
  async execute(interaction) {
    // validate user
    require("../modules/validate-user")(interaction);

    await interaction.reply({
      content: `User: ${interaction.user.tag}`,
      ephemeral: true,
    });
    console.log("/user command executed");
  },
};
