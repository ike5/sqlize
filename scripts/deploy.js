const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  new SlashCommandBuilder()
    .setName('server')
    .setDescription('Replies with server info!'),
  new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with user info!'),
  // new SlashCommandBuilder()
  //   .setName('addtag')
  //   .setDescription('Adds a tag')
  //   .addStringOption((option) =>
  //     option
  //       .setName('name')
  //       .setDescription('Enter the name of a tag')
  //       .setRequired(true)
  //   )
  //   .addStringOption((option) =>
  //     option
  //       .setName('description')
  //       .setDescription('Enter a description for the tag')
  //       .setRequired(true)
  //   ),
  // new SlashCommandBuilder()
  //   .setName('tag')
  //   .setDescription('See tag')
  //   .addStringOption((option) =>
  //     option
  //       .setName('name')
  //       .setDescription('Enter the name of a tag')
  //       .setRequired(true)
  //   ),
  // new SlashCommandBuilder()
  //   .setName('edittag')
  //   .setDescription('Edits a tag')
  //   .addStringOption((option) =>
  //     option
  //       .setName('name')
  //       .setDescription('Enter the name of a tag')
  //       .setRequired(true)
  //   )
  //   .addStringOption((option) =>
  //     option
  //       .setName('description')
  //       .setDescription('describe the change')
  //       .setRequired(true)
  //   ),
  // new SlashCommandBuilder()
  //   .setName('taginfo')
  //   .setDescription('Show tag info')
  //   .addStringOption((option) =>
  //     option
  //       .setName('name')
  //       .setDescription('Enter the name of a tag')
  //       .setRequired(true)
  //   ),
  // new SlashCommandBuilder().setName('showtags').setDescription('show all tags'),
  // new SlashCommandBuilder()
  //   .setName('deletetag')
  //   .setDescription('Deletes a tag'),
  // new SlashCommandBuilder()
  //   .setName('getonlineusers')
  //   .setDescription('show all online users'),
  new SlashCommandBuilder()
    .setName('check')
    .setDescription('Checks current user in')
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Check in description')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('list')
    .setDescription('Gets all check ins'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
