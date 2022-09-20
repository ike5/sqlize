const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { db } = require('./modules/initialize-models');

// Set Discord intents for client
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

// Map command files to command names
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Reading event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/**
 * Slash command interactions
 */
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    // display an ephemeral message to user
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

  //TODO: Refactor button events such as 'checkout' to the events folder
  if (customId === 'checkout') {
    console.log(interaction.message.content);

    // Cross-checks user id of person who pressed the button
    // against the person who created the check-in Log. If they match,
    // finds the current user's previous check-in Log.
    if (interaction.message.content.substring(2, 20) === interaction.user.id) {
      const previousCheckin = await db.Log.findOne({
        where: {
          UserDiscordId: interaction.user.id,
        },
        order: [['createdAt', 'DESC']],
      });

      previousCheckin.setDataValue('co_timestamp', new Date().getTime());
      previousCheckin.reload(); // May not be necessary
      previousCheckin.save();

      let checkin = previousCheckin.ci_description;
      let parsedCheckinArray = JSON.parse(checkin);

      let str = `CHECK-OUT: ${interaction.user}\n`;
      for (const key in parsedCheckinArray) {
        if (Object.hasOwnProperty.call(parsedCheckinArray, key)) {
          const element = parsedCheckinArray[key];
          str += `- ${element.trim()}\n`;
        }
      }

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
