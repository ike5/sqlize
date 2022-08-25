const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { fork } = require('worker_threads');

let counter = 100;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('Counts down from 30 minutes'),
  async execute(interaction) {
    const child = fork(__dirname + '/modules/count');
    child.send(interaction)
  },
};
