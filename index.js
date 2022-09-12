const {
  Client,
  Collection,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { Sequelize, DataTypes } = require('sequelize');
const { isIdUnique } = require('./modules/helper-functions');
const { DB } = require('./models/DB');

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
client.commands = new Collection();

// Reading command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// // Reading event files
// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs
//   .readdirSync(eventsPath)
//   .filter((file) => file.endsWith('.js'));

// for (const file of eventFiles) {
//   const filePath = path.join(eventsPath, file);
//   const event = require(filePath);
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args));
//   } else {
//     client.on(event.name, (...args) => event.execute(...args));
//   }
// }


const { Log } = require('./models/Log.js')(DB.prototype.sequelize, DataTypes);

client.once('ready', async () => {
  await DB.prototype.sequelize.sync({ alter: false, force: false });
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command',
      ephemeral: true,
    });
  }
});


/**
 * Button interactions
 */
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;
  console.log(customId);
  if (customId === 'checkout') {
    console.log(interaction.message.content);
    // console.log(`user id: s${interaction.user.id}`)

    // Checks the user id for who created the message
    if (interaction.message.content.substring(2, 20) === interaction.user.id) {
      const previousCheckin = await Log.findOne({
        where: {
          UserDiscordId: interaction.user.id,
        },
        order: [['createdAt', 'DESC']],
      });
      // console.log(previousCheckin);
      previousCheckin.setDataValue('co_timestamp', new Date().getTime());
      previousCheckin.reload();
      previousCheckin.save();
      // console.log(previousCheckin);
      let val = previousCheckin.ci_description;
      let arr = JSON.parse(val);

      let str = `CHECK-OUT: ${interaction.user}\n`;
      for (const key in arr) {
        if (Object.hasOwnProperty.call(arr, key)) {
          const element = arr[key];
          str += `- ${element.trim()}\n`;
        }
      }

      //TODO: total time studying
      let time_elapsed = previousCheckin.time_studied;
      let seconds = Math.floor((time_elapsed / 1000) % 60);
      let minutes = Math.floor((time_elapsed / 1000 / 60) % 60);
      let hours = Math.floor(time_elapsed / 1000 / 60 / 60);

      // Create embed
      const timeStudiedEmbed = new EmbedBuilder()
        .setTitle('Time studied')
        .setDescription(`${hours}h:${minutes}m:${seconds}s`);

      interaction.update({
        embeds: [timeStudiedEmbed],
        components: [],
      });

      // console.log(interaction.message.id);
      // let lastmsg = interaction.message.interaction.id;
    } else {
      interaction.reply({
        content: `You can't check-out someone else!`,
        ephemeral: true,
      });
      console.log(
        `${interaction.user.username} is trying to checkout someone else.\nSMS me if someone is trying to check out someone else`
      );
    }
  }
});

client.login(token);
