const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, pingCommandId } = require('./config.json');

const Sequelize = require('sequelize');
const { checkServerIdentity } = require('node:tls');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// // access 'commands' in other files by attaching a commands property
// client.commands = new Collection();
// const commandsPath = path.join(__dirname, "commands");
// const commandFiles = fs
//   .readdirSync(commandsPath)
//   .filter((file) => file.endsWith(".js"));
// for (const file of commandFiles) {
//   const filePath = path.join(commandsPath, file);
//   const command = require(filePath);
//   // Set a new item in the Collection
//   // With the key as the command name and the value as the exported module
//   client.commands.set(command.data.name, command);
// }

// // events
// const eventsPath = path.join(__dirname, "events");
// const eventFiles = fs
//   .readdirSync(eventsPath)
//   .filter((file) => file.endsWith(".js"));
// for (const file of eventFiles) {
//   const filePath = path.join(eventsPath, file);
//   const event = require(filePath);
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args));
//   } else {
//     client.on(event.name, (...args) => event.execute(...args));
//   }
// }

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
const Tags = sequelize.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

/**
 * A CHECK should have the following attributes:
 * - id
 * - description of check-in
 * - description of check-out
 * - timestamp of check-in
 * - timestamp of check-out
 * - username
 *
 * Total time should be a calculated query on: (timestamp2 -
 * timestamp1)
 *
 * CATCH ERROR
 * If you already checked in you will not be able to check
 * in again and will receive an error message asking for you
 * to check out.
 */
const Checks = sequelize.define(
  'check',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ci_description: Sequelize.TEXT,
    co_description: Sequelize.TEXT,
    ci_timestamp: Sequelize.TIME,
    co_timestamp: Sequelize.TIME,
    username: Sequelize.STRING,
  },
  {
    timestamps: true,
  },
  {
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  }
);

const checkins = [
  {
    username: 'ike5',
    ci_description: 'Working on stuff',
    ci_timestamp: new Date(),
  },
  {
    username: 'ike3422',
    ci_description: 'hello world',
    ci_timestamp: new Date(),
  },
  {
    username: 'joel',
    ci_description: 'another message',
    ci_timestamp: new Date(),
  },
];

// Default
sequelize.sync({ force: true }).then(() => {
  Checks.bulkCreate(checkins, { validate: true })
    .then(() => {
      console.log('checkins created');
    })
    .catch((err) => {
      console.log('failed to create checkins');
    })
    // .finally(() => {
    //   sequelize.close();
    // });
});

client.once('ready', () => {
  Tags.sync();
  Checks.sync();
  // sequelize.drop()
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

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
  } else if (commandName === 'checkin') {
    const ci_option = interaction.options.getString('ci_description');
    try {
      const check = await Checks.create({
        ci_description: ci_option,
        ci_timestamp: new Date(),
      });
    } catch (e) {}
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
    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map((t) => t.name).join(', ') || 'No tags set.';

    return interaction.reply(`List of tags: ${tagString}`);
  } else if (commandName === 'deletetag') {
    const tagName = interaction.options.getString('name');
    // equivalent to: DELETE from tags WHERE name = ?;
    const rowCount = await Tags.destroy({ where: { name: tagName } });

    if (!rowCount) return interaction.reply("That tag doesn't exist.");

    return interaction.reply('Tag deleted.');
  } else if (commandName === 'getonlineusers') {
    interaction.guild.members.fetch().then((members) => {
      members.forEach((m) => console.log(m.user.username));
    });
  } else {
    return interaction.reply('Not a valid command');
  }
});

client.login(token);
