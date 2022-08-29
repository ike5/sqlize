const { Client, GatewayIntentBits, Partials, Intents } = require('discord.js');
const { token } = require('../config.json');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let friendList = [];

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    console.log('a bot');
  } else {
    console.log('not a bot');
  }

  let friend = {
    user: message.author.id,
    total_time_spent: 0,
    ci_time: new Date(),
    total_time: 0,
    checked_in: false,
  };

  friend.checked_in = true;
  friendList.push(friend);

  console.log(friendList);

  console.log(message.content);
});

client.login(token);
