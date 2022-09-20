/**
 * Allows a user to check-in, or a new user to create
 * an account then check-in.
 */
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { db } = require("../modules/initialize-models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Command to check-in"),
  async execute(interaction) {
    // validate user
    await require("../modules/validate-user")(interaction);

    const ci_option = interaction.options.getString("description");
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );

    const userName = interactionUser.user.username; // use this instead of an object
    const userId = interactionUser.id;
    console.log(`Username: ${userName}`);
    console.log(`UserId: ${userId}`);

    // Button used for CHECKOUT
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("checkout")
        .setLabel("Check-out")
        .setStyle(ButtonStyle.Primary)
    );

    try {
      // Create a Log entry
      const log_entry = await db.Log.create({
        // Get list delineated by commas
        ci_description: JSON.stringify(ci_option.split(",")),
        ci_timestamp: new Date().getTime(),
        UserDiscordId: userId,
      });

      // Update user check-in amount
      const user = await db.User.findByPk(userId);
      const userData = JSON.parse(user.getDataValue("user_data"));
      userData.user.total_checkins += 1;
      await db.User.update(
        { user_data: JSON.stringify(userData) },
        {
          where: {
            discordId: userId,
          },
        }
      );
      console.log(userData.user);

      // validate check-in trophies

      // Build string to display on Discord publicly
      // Changing the position of interaction.user here can break the button substring() method
      let parsedDescription = `${interaction.user} CHECK-IN\n`;
      JSON.parse(log_entry.ci_description).forEach((element) => {
        parsedDescription += `- ${element.trim()}\n`;
      });

      // Display checkin
      await interaction.reply({
        content: `${parsedDescription}`,
        components: [row],
        ephemeral: false,
      });

      console.log(`${userName} called '/check'`);
    } catch (e) {
      console.log(e);
    }
  },
};
