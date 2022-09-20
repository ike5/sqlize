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
    // console.log(`Username: ${userName}`);
    // console.log(`UserId: ${userId}`);

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

      // 1) List online friends
      // 2) Increment # of check ins with them
      // 3) Log check in time with that friend (good in case forget to check out)
      // 4) When checking out, calculate total time with that friend
      let allMembers = await interaction.guild.members.fetch();
      let onlineUsers = allMembers.filter((member) => member.presence);

      // Get bot flag
      let memberMap = onlineUsers.map((m) => {
        return {
          bot: m.user.bot,
          status: m.presence.status,
          name: m.user.username,
          id: m.user.id,
        };
      });

      // Update user check-in amount
      const user = await db.User.findByPk(userId);
      const userData = JSON.parse(user.getDataValue("user_data"));
      userData.user.total_checkins += 1;
      // Set 'checked-in' value to TRUE
      userData.user.checked_in = true;
      // Set friends that are currently checked in
      for (let i = 0; i < memberMap.length; i++) {
        memberMap[i];
        const index = userData.user.friends.findIndex(
          (object) => object.id === memberMap[i].id
        );
        if (index === -1) {
          userData.user.friends.push({
            name: memberMap[i].name,
            id: memberMap[i].id,
          });
        }
      }


      await db.User.update(
        { user_data: JSON.stringify(userData) },
        {
          where: {
            discordId: userId,
          },
        }
      );
      // console.log(userData.user);

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
