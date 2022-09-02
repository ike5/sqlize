const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    ci_timestamp: DataTypes.TIME,
    co_timestamp: DataTypes.TIME,
    messageId: DataTypes.STRING,
    messageReplyId: DataTypes.STRING
  },
  { sequelize, modelName: 'Log', timestamps: false }
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
  await sequelize.sync({ alter: false , force: false });
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

  // The ADDTAG command needs to be removed. No use
  if (commandName === 'addtag') {
    const tagName = interaction.options.getString('name');
    const tagDescription = interaction.options.getString('description');
    try {
      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const tag = await Tags.create({
        name: tagName,
        description: tagDescription,
        username: interaction.user.username,
      });

      return interaction.reply(`Tag ${tag.name} added.`);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return interaction.reply('That tag already exists.');
      }

      return interaction.reply('Something went wrong with adding a tag.');
    }

    /**
     * discordInfo = {discordId, ci_description, ci_timestamp}
     * if user exists
     *  if check-in doesn't exist
     *    create check-in
     *      increment number of check-ins by 1
     *      total_time = co_time - ci_time
     *      time_studied += total_time
     */
  } else if (commandName === 'check') {
    const ci_option = interaction.options.getString('description');
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username;
    const userId = interactionUser.id;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('checkout')
        .setLabel('Check-out')
        .setStyle(ButtonStyle.Primary)
    );

    console.log(`Username: ${userName}\nUserId: ${userId}`);

    // creates a new user if id isn't found in database
    await isIdUnique(userId).then((isUnique) => {
      if (isUnique) {
        const u = User.create({
          discordId: userId,
          discordNickname: nickName,
          username: userName,
          date_joined: new Date(),
        });
        console.log(`${u} has been created!`);
      }
    });

    try {
      const u = await Log.create({
        ci_description: JSON.stringify(ci_option.split(',')),
        ci_timestamp: new Date(),
        UserDiscordId: userId,
      });
      let parsedDescription = `CHECK-IN: ${interaction.user}\n`;
      JSON.parse(u.ci_description).forEach((element) => {
        parsedDescription += `- ${element.trim()}\n`;
      });
      await interaction.channel.send({
        content: `${parsedDescription}`,
      });
      await interaction.reply({
        content: 'When you are done studying, click below',
        components: [row],
        ephemeral: true,
      });

      console.log(`${userName} called the 'check' slash command`);
    } catch (e) {
      console.log(e);
    }
  } else if (commandName === 'list') {
    const interactionUser = await interaction.guild.members.fetch(
      interaction.user.id
    );
    const nickName = interactionUser.nickname;
    const userName = interactionUser.user.username;
    const userId = interactionUser.id;

    // creates a new user if id isn't found in database
    await isIdUnique(userId).then((isUnique) => {
      if (isUnique) {
        const u = User.create({
          discordId: userId,
          discordNickname: nickName,
          username: userName,
          date_joined: new Date(),
        });
        console.log(`${u} has been created!`);
      }
    });

    try {
      // Find all check-ins with a specific userId
      const u = await Log.findAll({
        where: {
          UserDiscordId: `${userId}`,
        },
      });

      // Create a string list of all check-in descriptions
      let list = `\n`;
      u.forEach((element) => {
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

      console.log(`${userName} called the 'list' slash command`);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: `Something went wrong.\nPlease wait a moment then try again.`,
        ephemeral: true,
      });
    }
  } else if (commandName === 'tag') {
    const tagName = interaction.options.getString('name');

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });

    if (tag) {
      // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      tag.increment('usage_count');

      return interaction.reply(tag.get('description'));
    }

    return interaction.reply(`Could not find tag: ${tagName}`);
  } else if (commandName === 'edittag') {
    const tagName = interaction.options.getString('name');
    const tagDescription = interaction.options.getString('description');

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Tags.update(
      { description: tagDescription },
      { where: { name: tagName } }
    );

    if (affectedRows > 0) {
      return interaction.reply(`Tag ${tagName} was edited.`);
    }

    return interaction.reply(`Could not find a tag with name ${tagName}.`);
  } else if (commandName === 'taginfo') {
    const tagName = interaction.options.getString('name');

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });

    if (tag) {
      return interaction.reply(
        `${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
      );
    }

    return interaction.reply(`Could not find tag: ${tagName}`);
  } else if (commandName === 'showtags') {
    //DEPRECATED
    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map((t) => t.name).join(', ') || 'No tags set.';

    return interaction.reply(`List of tags: ${tagString}`);
  } else if (commandName === 'deletetag') {
    // DEPRECATED, please remove
    const tagName = interaction.options.getString('name');
    // equivalent to: DELETE from tags WHERE name = ?;
    const rowCount = await Tags.destroy({ where: { name: tagName } });

    if (!rowCount) return interaction.reply("That tag doesn't exist.");

    return interaction.reply('Tag deleted.');
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
    const amount = await Log.count({
      where: {
        UserDiscordId: interaction.user.id,
      },
    });
    interaction.reply(`Total check-ins: ${amount}`);
  } else {
    return interaction.reply('Not a valid command');
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  const previousCheckin = await Log.findOne({
    where: {
      UserDiscordId: interaction.user.id,
    },
    order: [['ci_timestamp', 'DESC']],
  });
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
  let date1 = previousCheckin.ci_timestamp;
  let date2 = new Date();

  let res = Math.abs(date1 - date2) / 1000;
  let days = Math.floor(res / 86400);
  let hours = Math.floor(res / 3600) % 24;
  let minutes = Math.floor(res / 60) % 60;
  let seconds = res % 60;
  let datetime = `${hours.toFixed(0)}h:${minutes.toFixed(0)}m:${seconds.toFixed(
    0
  )}s`;

  str += `${datetime}`;
  await interaction.reply({
    content: str,
    ephemeral: false,
  });

  let reply = await interaction.fetchReply();
  
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    console.log('a bot');
  } else {
    console.log('not a bot');
  }

  if (message.content === '!online') {
    let allMembers = await message.guild.members.fetch();
    let onlineUsers = allMembers.filter((member) => member.presence);

    let mOnlineUsers = onlineUsers.map((m) => {
      return {
        status: m.presence.status,
        name: m.user.username,
      };
    });

    let online = 'status\t\tusername\n-------\t\t-----------\n';
    mOnlineUsers.forEach((element) => {
      online += `${element.status}\t\t${element.name}\n`;
    });
    message.reply(online);
  }

  // Lists all users who've made checkins
  if (message.content === '!allusers') {
    let registeredUsers = 'Registered users:\n';

    const u = await User.findAll({
      attributes: ['username'],
    });

    u.forEach((element) => {
      registeredUsers += `${element.username}\n`;
    });

    await message.reply({ content: `${registeredUsers}` });
  }
});

client.login(token);
