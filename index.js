const {
  Client,
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
const { token } = require('./config.json');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');

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

// Start Section: Build Tables //
//***************************************************/

/**
 * Associations:
 * - 1:M with UserTrophies
 */
class Trophy extends Model {
  getAllTrophies() {}
}
Trophy.init(
  {
    trophy_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_earned: DataTypes.DATE,
  },
  { sequelize, modelName: 'Trophy', timestamps: false }
);

/**
 * Associations:
 * - 1:M with Logs
 * - 1:M with Friends
 */
class User extends Model {
  getAllUsers() {}
}
User.init(
  {
    discordId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    discordNickname: DataTypes.STRING,
    date_joined: DataTypes.DATE,
    time_studied: DataTypes.TIME,
    phone: DataTypes.TEXT,
    checkins: DataTypes.INTEGER,
    friendList: DataTypes.TEXT,
  },
  { sequelize, modelName: 'User', timestamps: false }
);

/**
 * Associations:
 * - 1:M with User
 */
class Log extends Model {}
Log.init(
  {
    ci_description: DataTypes.TEXT,
    co_description: DataTypes.TEXT,
    ci_timestamp: {
      type: DataTypes.TIME,
      set(value) {
        this.setDataValue('ci_timestamp', value);
      },
    },
    co_timestamp: {
      type: DataTypes.TIME,
      set(value) {
        this.setDataValue('co_timestamp', value);
      },
    },
    messageId: DataTypes.STRING,
    messageReplyId: DataTypes.STRING,
    time_studied: {
      // in unix epoch time
      type: DataTypes.VIRTUAL,
      get() {
        return `${new Date(this.co_timestamp) - new Date(this.ci_timestamp)}`;
      },
      set(value) {
        throw new Error('Do not try to set the `time_studied` value!');
      },
    },
  },
  { sequelize, modelName: 'Log', timestamps: true }
);

class UserTrophies extends Model {}
UserTrophies.init(
  {
    UserId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'discordId',
      },
    },
    TrophyId: {
      type: DataTypes.INTEGER,
      references: {
        model: Trophy,
        key: 'id',
      },
    },
  },
  { sequelize, modelName: 'UserTrophies', timestamps: false }
);
Trophy.belongsToMany(User, { through: UserTrophies });
User.belongsToMany(Trophy, { through: UserTrophies });

User.hasMany(Log);
Log.belongsTo(User);

class Friends extends Model {}
Friends.init(
  {
    UserId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'discordId',
      },
    },
    FriendId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'discordId',
      },
    },
  },
  { sequelize, modelName: 'Friends', timestamps: false }
);
User.belongsToMany(User, { as: 'Parent', through: Friends });
User.belongsToMany(User, { as: 'Sibling', through: Friends });

// End Section: Build Tables //
//***************************************************/

// START: INITIATE SERVER
//---------------------------------------------------/
client.once('ready', async () => {
  await sequelize.sync({ alter: false, force: false });
  console.log(`Logged in as ${client.user.tag}`);
});
// END: INITIATE SERVER
//---------------------------------------------------/

// START HELPER FUNCTIONS //
//--------------------------------------------------//

/**
 * Checks to see if a user already exists in the database.
 *
 * Parameters:
 *  - discordId
 *
 * Returns:
 *  - true if user doesn't exist
 */
async function isIdUnique(id) {
  return User.count({
    where: {
      discordId: id,
    },
  }).then((count) => {
    if (count != 0) {
      return false;
    }
    return true;
  });
}

// END HELPER FUNCTIONS //
//--------------------------------------------------//

// START INTERACTION SECTION //
//***************************************************/

// Create interaction variable for slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;

  /**
   * discordInfo = {discordId, ci_description, ci_timestamp}
   * if user exists
   *  if check-in doesn't exist
   *    create check-in
   *      increment number of check-ins by 1
   *      total_time = co_time - ci_time
   *      time_studied += total_time
   */
  if (commandName === 'check') {
    const ci_option = interaction.options.getString('description');
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username; // use interaction.user instead
    const userId = interactionUser.id;

    // Button used for CHECKOUT
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('checkout')
        .setLabel('Check-out')
        .setStyle(ButtonStyle.Primary)
    );

    // Create user if id isn't found in database
    await isIdUnique(userId).then((isUnique) => {
      if (isUnique) {
        const u = User.create({
          discordId: userId,
          discordNickname: nickName,
          username: userName,
          date_joined: new Date().getTime(),
        });
        console.log(`${u} has been created!`);
      }
    });

    try {
      // Create a Log entry
      const log_entry = await Log.create({
        // Get list delineated by commas
        ci_description: JSON.stringify(ci_option.split(',')),
        ci_timestamp: new Date().getTime(),
        UserDiscordId: userId,
      });

      // Build string to display on Discord publicly
      // Changing the position of interaction.user here can break the button substring() method
      let parsedDescription = `${interaction.user} CHECK-IN\n`;
      JSON.parse(log_entry.ci_description).forEach((element) => {
        parsedDescription += `- ${element.trim()}\n`;
      });

      // Display checkin
      await interaction.reply({
        content: `${parsedDescription}`,
        components: [row],
        ephemeral: false,
      });

      console.log(`${userName} called '/check'`);
    } catch (e) {
      console.log(e);
    }

    /**
     * List all check-ins
     */
  } else if (commandName === 'list') {
    //TODO: prevent system from crashing if a user doesn't exist
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username;
    const userId = interactionUser.id;

    // creates a new user if id isn't found in database
    await isIdUnique(userId).then((isUnique) => {
      if (isUnique) {
        const newUser = User.create({
          discordId: userId,
          discordNickname: nickName,
          username: userName,
          date_joined: new Date().getTime(),
        });
        console.log(`${newUser} has been created!`);
      }
    });

    try {
      // Find all check-ins with a specific userId
      const user_check_ins = await Log.findAll({
        where: {
          UserDiscordId: `${userId}`,
        },
      });

      // Create a string list of all check-in descriptions
      let list = `\n`;
      user_check_ins.forEach((element) => {
        let l = `\n`;
        JSON.parse(element.ci_description).forEach((e) => {
          l += `\t- ${e.trim()}\n`;
        });

        // Get time posted
        let date = new Date(element.ci_timestamp).toLocaleDateString('en-US');
        let time = new Date(element.ci_timestamp).toLocaleTimeString('en-US');
        list += `${date} *${time}* ${l}\n`;
      });

      interaction.reply({ content: list, ephemeral: true });

      console.log(`${userName} called 'list'`);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: `Something went wrong.\nPlease wait a moment then try again.`,
        ephemeral: true,
      });
    }

    /**
     * Displays list of all users who are currently online and aren't bots
     */
  } else if (commandName === 'online') {
    let allMembers = await interaction.guild.members.fetch();
    let onlineUsers = allMembers.filter((member) => member.presence);

    // Get bot flag
    let memberMap = onlineUsers.map((m) => {
      return {
        bot: m.user.bot,
        status: m.presence.status,
        name: m.user.username,
      };
    });

    let online = 'status\t\tusername\n-------\t\t-----------\n';
    memberMap.forEach((element) => {
      if (element.status === 'online' && element.bot === false) {
        online += `${element.status}\t\t${element.name}\n`;
      }
    });
    interaction.reply(online);

    /**
     * Shows all users, bots, and idle
     */
  } else if (commandName === 'showallusers') {
    let allMembers = await interaction.guild.members.fetch();
    let onlineUsers = allMembers.filter((member) => member.presence);

    // Get bot flag
    let memberMap = onlineUsers.map((m) => {
      return {
        bot: m.user.bot,
        status: m.presence.status,
        name: m.user.username,
      };
    });

    let online = '```type\tstatus\tusername\n';
    online += '====\t======\t========\n';
    memberMap.forEach((element) => {
      let botOrUser = 'user';
      if (element.bot === true) {
        botOrUser = 'BOT';
      }
      online += `${botOrUser.padEnd(8)}${element.status.padEnd(6)}\t${
        element.name
      }\n`;
    });

    online += '```';

    interaction.reply(online);
  } else if (commandName === 'showtotalcheckins') {
    // Get logs for user
    const amount = await Log.count({
      where: {
        UserDiscordId: interaction.user.id,
      },
    });
    // Create embed
    const totalCheckinsEmbed = new EmbedBuilder()
      .setTitle('Total number of check-ins')
      .setDescription(`${amount}`);

    await interaction.reply({
      embeds: [totalCheckinsEmbed],
      ephemeral: true,
    });
  } else {
    return interaction.reply('Not a valid command');
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
