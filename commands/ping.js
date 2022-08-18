const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .addStringOption((option) =>
      option.setName("input").setDescription("Enter a string")
    )
    .addIntegerOption((option) =>
      option.setName("int").setDescription("Enter an integer")
    )
    .addBooleanOption((option) =>
      option.setName("choice").setDescription("Select a boolean")
    )
    .addUserOption((option) =>
      option.setName("target").setDescription("Select a user")
    )
    .addChannelOption((option) =>
      option.setName("destination").setDescription("Select a channel")
    )
    .addRoleOption((option) =>
      option.setName("muted").setDescription("Select a role")
    )
    .addNumberOption((option) =>
      option.setName("num").setDescription("Enter a number")
    )
    .addMentionableOption((option) =>
      option.setName("mentionable").setDescription("Mention something")
    )
    .addAttachmentOption((option) =>
      option.setName("attachment").setDescription("Attach something")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await wait(4000);
    await interaction.editReply("Pong!");
    await interaction.followUp("Pong again!");

    const string = interaction.options.getString("input");
    const integer = interaction.options.getInteger("int");
    const boolean = interaction.options.getBoolean("choice");
    const user = interaction.options.getUser("target");
    const member = interaction.options.getMember("target");
    const channel = interaction.options.getChannel("destination");
    const role = interaction.options.getRole("muted");
    const number = interaction.options.getNumber("num");
    const mentionable = interaction.options.getMentionable("mentionable");
    const attachment = interaction.options.getAttachment("attachment");

    console.log({
      string,
      integer,
      boolean,
      user,
      member,
      channel,
      role,
      mentionable,
      attachment,
      number,
    });
  },
};
