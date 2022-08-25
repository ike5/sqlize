const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("creates a button"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel("Primary")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("danger")
        .setLabel("Danger")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setURL("https://google.com")
        .setLabel("Link")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setCustomId("success")
        .setLabel("Success")
        .setStyle(ButtonStyle.Success)
    );

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Some title")
      .setURL("https://discord.js.org")
      .setDescription("Some description here");

    await interaction.reply({
      content: {
        interaction
      },
      components: [row],
      ephemeral: true,
      embeds: [embed],
    });
  },
};
