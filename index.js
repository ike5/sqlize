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
const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const { isIdUnique } = require('./modules/helper-functions');

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
/**
 * Initialize database in SQLite
 */
const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

// const { Trophy } = require('./models/Trophy.js')(sequelize, DataTypes);
// const { User } = require('./models/User.js')(sequelize, DataTypes);
const { Log } = require('./models/Log.js')(sequelize, DataTypes);
// const { UserTrophies } = require('./models/UserTrophies.js')(
//   sequelize,
//   DataTypes
// );

client.once('ready', async () => {
  await sequelize.sync({ alter: false, force: false });
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


// } else if (commandName === 'list') {
//   //TODO: prevent system from crashing if a user doesn't exist
//   const interactionUser = await interaction.guild.members.fetch(
//     interaction.user.id
//   );
//   const nickName = interactionUser.nickname;
//   const userName = interactionUser.user.username;
//   const userId = interactionUser.id;

//   // creates a new user if id isn't found in database
//   await isIdUnique(userId).then((isUnique) => {
//     if (isUnique) {
//       const newUser = User.create({
//         discordId: userId,
//         discordNickname: nickName,
//         username: userName,
//         date_joined: new Date().getTime(),
//       });
//       console.log(`${newUser} has been created!`);
//     }
//   });

//   try {
//     // Find all check-ins with a specific userId
//     const user_check_ins = await Log.findAll({
//       where: {
//         UserDiscordId: `${userId}`,
//       },
//     });

//     // Create a string list of all check-in descriptions
//     let list = `\n`;
//     user_check_ins.forEach((element) => {
//       let l = `\n`;
//       JSON.parse(element.ci_description).forEach((e) => {
//         l += `\t- ${e.trim()}\n`;
//       });

//       // Get time posted
//       let date = new Date(element.ci_timestamp).toLocaleDateString('en-US');
//       let time = new Date(element.ci_timestamp).toLocaleTimeString('en-US');
//       list += `${date} *${time}* ${l}\n`;
//     });

//     interaction.reply({ content: list, ephemeral: true });

//     console.log(`${userName} called 'list'`);
//   } catch (err) {
//     console.error(err);
//     interaction.reply({
//       content: `Something went wrong.\nPlease wait a moment then try again.`,
//       ephemeral: true,
//     });
//   }

//   /**
//    * Displays list of all users who are currently online and aren't bots
//    */
// } else if (commandName === 'online') {
//   let allMembers = await interaction.guild.members.fetch();
//   let onlineUsers = allMembers.filter((member) => member.presence);

//   // Get bot flag
//   let memberMap = onlineUsers.map((m) => {
//     return {
//       bot: m.user.bot,
//       status: m.presence.status,
//       name: m.user.username,
//     };
//   });

//   let online = 'status\t\tusername\n-------\t\t-----------\n';
//   memberMap.forEach((element) => {
//     if (element.status === 'online' && element.bot === false) {
//       online += `${element.status}\t\t${element.name}\n`;
//     }
//   });
//   interaction.reply(online);

//   /**
//    * Shows all users, bots, and idle
//    */
// } else if (commandName === 'showallusers') {
//   let allMembers = await interaction.guild.members.fetch();
//   let onlineUsers = allMembers.filter((member) => member.presence);

//   // Get bot flag
//   let memberMap = onlineUsers.map((m) => {
//     return {
//       bot: m.user.bot,
//       status: m.presence.status,
//       name: m.user.username,
//     };
//   });

//   let online = '```type\tstatus\tusername\n';
//   online += '====\t======\t========\n';
//   memberMap.forEach((element) => {
//     let botOrUser = 'user';
//     if (element.bot === true) {
//       botOrUser = 'BOT';
//     }
//     online += `${botOrUser.padEnd(8)}${element.status.padEnd(6)}\t${
//       element.name
//     }\n`;
//   });

//   online += '```';

//   interaction.reply(online);
// } else if (commandName === 'showtotalcheckins') {
//   // Get logs for user
//   const amount = await Log.count({
//     where: {
//       UserDiscordId: interaction.user.id,
//     },
//   });
//   // Create embed
//   const totalCheckinsEmbed = new EmbedBuilder()
//     .setTitle('Total number of check-ins')
//     .setDescription(`${amount}`);

//   await interaction.reply({
//     embeds: [totalCheckinsEmbed],
//     ephemeral: true,
//   });
// } else if (commandName === 'totaltime') {
//   const all_logs = await Log.findAll({
//     where: {
//       [Op.and]: [
//         { UserDiscordId: interaction.user.id },
//         {
//           co_timestamp: {
//             [Op.not]: null,
//           },
//         },
//       ],
//     },
//   });

//   const getsTime = (date) => {
//     return new Date(date).getTime();
//   };
//   let total_time = 0;
//   for (let i = 0; i < all_logs.length; i++) {
//     total_time += getsTime(all_logs[i].time_studied);
//   }

//   let time_elapsed = total_time;
//   let seconds = Math.floor((time_elapsed / 1000) % 60);
//   let minutes = Math.floor((time_elapsed / 1000 / 60) % 60);
//   let hours = Math.floor(time_elapsed / 1000 / 60 / 60);

//   // Create embed
//   const timeStudiedEmbed = new EmbedBuilder()
//     .setTitle('Time studied')
//     .setDescription(`${hours}h:${minutes}m:${seconds}s`);

//   interaction.reply({
//     embeds: [timeStudiedEmbed],
//     components: [],
//   });
// } else {
//   return interaction.reply('Not a valid command');
// }
// });
//
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
