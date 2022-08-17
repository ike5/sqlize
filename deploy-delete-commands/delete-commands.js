const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token, pingCommandId } = require('../config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, pingCommandId))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, pingCommandId))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);