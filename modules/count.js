const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const {fork} = require('worker_threads')


let counter = 100;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("countdown")
    .setDescription("Counts down from 30 minutes"),
  async execute(interaction) {
    await interaction.reply({ content: `Starting timer...`, ephemeral: false });
    await wait(2000);
    interaction.editReply({
      content: `Timer: ${counter}min`,
      ephemeral: false,
    });

    // Every minute edit the message to count down
    const i = setInterval(function () {
      counter--;
      console.log(counter);
      interaction.editReply({
        content: `Timer: ${counter}min`,
        ephemeral: false,
      });

      // When reaches 0, conclude the timer
      if (counter < 0) {
        clearInterval(i);
        interaction.editReply({ content: `Done!`, ephemeral: false });
      }
    }, 1000);
  },
};