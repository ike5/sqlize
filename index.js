const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Sequelize, DataTypes, Model } = require('sequelize');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    username: DataTypes.TEXT,
    date_joined: DataTypes.DATE,
    time_studied: DataTypes.TIME,
    phone: DataTypes.TEXT,
    checkins: DataTypes.INTEGER,
    checkouts: DataTypes.INTEGER,
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
  },
  { sequelize, modelName: 'Log', timestamps: false }
);

class UserTrophies extends Model {}
UserTrophies.init(
  {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
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
Trophy.belongsToMany(User, {
  through: UserTrophies,
});
User.belongsToMany(Trophy, {
  through: UserTrophies,
});

User.hasMany(Log);
Log.belongsTo(User);

class Friends extends Model {}
Friends.init(
  {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    FriendId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { sequelize, modelName: 'Friends', timestamps: false }
);
User.belongsToMany(User, { as: 'Parent', through: Friends });
User.belongsToMany(User, { as: 'Sibling', through: Friends });

// End Section: Build Tables //
//***************************************************/

(async () => {
  await sequelize.sync({ force: true });
})();

// client.once('ready', () => {
//   Tags.sync();
//   Checks.sync();
//   // sequelize.drop()
//   console.log(`Logged in as ${client.user.tag}`);
// });

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   const { commandName } = interaction;

//   if (commandName === 'addtag') {
//     const tagName = interaction.options.getString('name');
//     const tagDescription = interaction.options.getString('description');
//     try {
//       // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
//       const tag = await Tags.create({
//         name: tagName,
//         description: tagDescription,
//         username: interaction.user.username,
//       });

//       return interaction.reply(`Tag ${tag.name} added.`);
//     } catch (error) {
//       if (error.name === 'SequelizeUniqueConstraintError') {
//         return interaction.reply('That tag already exists.');
//       }

//       return interaction.reply('Something went wrong with adding a tag.');
//     }
//   } else if (commandName === 'checkin') {
//     const ci_option = interaction.options.getString('ci_description');
//     try {
//       const check = await Checks.create({
//         ci_description: ci_option,
//         ci_timestamp: new Date(),
//       });
//     } catch (e) {}
//   } else if (commandName === 'tag') {
//     const tagName = interaction.options.getString('name');

//     // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
//     const tag = await Tags.findOne({ where: { name: tagName } });

//     if (tag) {
//       // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
//       tag.increment('usage_count');

//       return interaction.reply(tag.get('description'));
//     }

//     return interaction.reply(`Could not find tag: ${tagName}`);
//   } else if (commandName === 'edittag') {
//     const tagName = interaction.options.getString('name');
//     const tagDescription = interaction.options.getString('description');

//     // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
//     const affectedRows = await Tags.update(
//       { description: tagDescription },
//       { where: { name: tagName } }
//     );

//     if (affectedRows > 0) {
//       return interaction.reply(`Tag ${tagName} was edited.`);
//     }

//     return interaction.reply(`Could not find a tag with name ${tagName}.`);
//   } else if (commandName === 'taginfo') {
//     const tagName = interaction.options.getString('name');

//     // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
//     const tag = await Tags.findOne({ where: { name: tagName } });

//     if (tag) {
//       return interaction.reply(
//         `${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
//       );
//     }

//     return interaction.reply(`Could not find tag: ${tagName}`);
//   } else if (commandName === 'showtags') {
//     // equivalent to: SELECT name FROM tags;
//     const tagList = await Tags.findAll({ attributes: ['name'] });
//     const tagString = tagList.map((t) => t.name).join(', ') || 'No tags set.';

//     return interaction.reply(`List of tags: ${tagString}`);
//   } else if (commandName === 'deletetag') {
//     const tagName = interaction.options.getString('name');
//     // equivalent to: DELETE from tags WHERE name = ?;
//     const rowCount = await Tags.destroy({ where: { name: tagName } });

//     if (!rowCount) return interaction.reply("That tag doesn't exist.");

//     return interaction.reply('Tag deleted.');
//   } else if (commandName === 'getonlineusers') {
//     interaction.guild.members.fetch().then((members) => {
//       members.forEach((m) => console.log(m.user.username));
//     });
//   } else {
//     return interaction.reply('Not a valid command');
//   }
// });

// client.login(token);
