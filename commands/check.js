const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { isIdUnique } = require('../modules/helper-functions');
const {db} = require('../modules/initialize-models')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Command to check-in'),
  async execute(interaction) {
    // await interaction.reply('Check!');

    const ci_option = interaction.options.getString('description');
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username; // use interaction.user instead
    const userId = interactionUser.id;

    // Button used for CHECKOUT
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('checkout')
        .setLabel('Check-out')
        .setStyle(ButtonStyle.Primary)
    );

    // Create user if id isn't found in database
    await isIdUnique(userId).then((isUnique) => {
      if (isUnique) {
        const u = User.create({
          discordId: userId,
          discordNickname: nickName,
          username: userName,
          date_joined: new Date().getTime(),
        });
        console.log(`${u} has been created!`);
      }
    });

    try {
      // Create a Log entry
      const log_entry = await db.Log.create({
        // Get list delineated by commas
        ci_description: JSON.stringify(ci_option.split(',')),
        ci_timestamp: new Date().getTime(),
        UserDiscordId: userId,
      });

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
