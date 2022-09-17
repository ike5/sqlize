/**
 * Displays the total time studied
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');
const { db } = require('../modules/initialize-models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totaltime')
    .setDescription('Gets total time studied'),
  async execute(interaction) {
    const all_logs = await db.Log.findAll({
      where: {
        [Op.and]: [
          { UserDiscordId: interaction.user.id },
          {
            co_timestamp: {
              [Op.not]: null,
            },
          },
        ],
      },
    });

    const getsTime = (date) => {
      return new Date(date).getTime();
    };
    let total_time = 0;
    for (let i = 0; i < all_logs.length; i++) {
      total_time += getsTime(all_logs[i].time_studied);
    }

    let time_elapsed = total_time;
    let seconds = Math.floor((time_elapsed / 1000) % 60);
    let minutes = Math.floor((time_elapsed / 1000 / 60) % 60);
    let hours = Math.floor(time_elapsed / 1000 / 60 / 60);

    //FIXME: Fix time displayed in embed
    const timeStudiedEmbed = new EmbedBuilder()
      .setTitle('Time studied')
      .setDescription(`${hours}h:${minutes}m:${seconds}s`);

    interaction.reply({
      embeds: [timeStudiedEmbed],
      components: [],
    });
    console.log('/totaltime executed')
  },
};
