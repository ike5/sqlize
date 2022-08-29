const { Client,  GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})



client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    console.log('a bot');
  } else {
    console.log('not a bot')
  }

  console.log(message.channel.toJSON());

  if (message.content === '!online') {
    console.log('online stuff');
  }
});

console.log('afterwards');

/** Bulding the friendList */
let friendList = [];

let friend = {
  id: '',
  name: '',
  time_spent_together: 0,
  ci_timestamp: '',
  checked_in: false,
};

friendList.push(friend);

client.login(token);
