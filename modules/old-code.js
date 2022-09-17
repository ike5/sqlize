const Sequelize = require('sequelize');
const { textSpanContainsPosition } = require('typescript');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
  define: {
    timestamps: true,
  },
});

// Test connection to sql database
(async function testConnection() {
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// let Employee = sequelize.define('employees', {
//   name: Sequelize.STRING,
// });

// let Project = sequelize.define('projects', {
//   name: Sequelize.STRING,
// });

// Employee.belongsTo(Project);

// Employee.findAll({ include: [Project] })
//   .then((employees) => {
//     employees.forEach((employee) => {
//       console.log(`${employee.name} is in project ${employee.project.name}`);
//     });
//   })
//   .finally(() => {
//     sequelize.close();
//   });

// let employees = [
//   { name: 'Jane Brown' },
//   { name: 'Lucia Benner' },
//   { name: 'Peter Novak' },
//   { name: 'Janet Peterson' },
//   { name: 'Lucy in the Sky' },
//   { name: 'Marabel Peach' },
//   { name: 'Ike Maldonado' },
//   { name: 'Lamponela Samonela' },
// ];

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     // You can use an array of objects to bulk create in the database
//     return Employee.bulkCreate(employees);
//   })
//   .then((employees) => {
//     let works = [];
//     let i = 0;

//     employees.forEach((employee) => {
//       let pname = 'Project ' + String.fromCharCode('A'.charCodeAt() + i);
//       i++;

//       let work = Project.create({ name: pname }).then((project) => {
//         employee.setProject(project);
//       });

//       works.push(work);
//     });

//     Promise.all(works).then(() => sequelize.close());
//     console.log('finish');
//   });

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: true,
  // SQLite only
  storage: 'database.sqlite',
  define: {
    timestamps: true,
  },
});

let Dummy = sequelize.define('dummy', {
  description: Sequelize.STRING,
});

let Note = sequelize.define('notes', {
  description: Sequelize.STRING,
});

// Op.between (inclusive)
// async function getRows() {
//     let notes = await Note.findAll({ where: { id: { [Op.between]: [3, 6] } }});
//     notes.forEach(note => {
//         console.log(`${note.id}: ${note.description}`);
//     });
//     sequelize.close();
// }
// getRows();

// Op.IN operator
// async function getRows() {
//     // This selects all rows that match the list of ids
//     let notes = await Note.findAll({ where: { id: { [Op.in]: [3, 6] } } });
//     notes.forEach(note => {
//         console.log(`${note.id}: ${note.description}`);
//     });
//     sequelize.close();
// }
// getRows();

// order by
// async function getRows() {
//     let notes = await Note.findAll({
//         order: [['description', 'DESC']],
//         attributes: ['id', 'description'], raw: true
//     })
//     console.log(notes);
//     sequelize.close();
// }
// getRows();

// offset, limit
// async function getRows() {
//     let notes = await Note.findAll({ offset: 2, limit: 3,
//         attributes: ['id', 'description'], raw: true
//     });
//     console.log(notes);
//     sequelize.close();
// }
// getRows();

// select columns
// async function getTwoColumns() {
//     let notes = await Note.findAll({ attributes: ['id', 'description'], raw: true });
//     console.log(notes);
//     sequelize.close();
// }
// getTwoColumns();

// findAll()
// async function findAllRows() {
//     let notes = await Note.findAll({ raw: true });
//     console.log(notes);
//     sequelize.close();
// }
// findAllRows();

// update row
// async function updateRow() {
//     let id = await Note.update(
//         { description: 'Finished reading history book' },
//         { where: { id: 1 } });
//     sequelize.close();
// }
// updateRow();

// delete row
// async function deleteRow() {
//     let n = await Note.destroy({ where: { id: 2 } });
//     console.log(`number of deleted rows: ${n}`);
//     sequelize.close();
// }
// deleteRow();

// count
// async function countRows() {
//     let n = await Note.count();
//     console.log(`There are ${n} rows`);
//     sequelize.close();
// }
// countRows();

//async, await
// async function getOneNote() {
//     let user = await Note.findOne();
//     console.log(user.get('description'));
//     sequelize.close();
// }
// getOneNote();

// findOne() method
// Note.findOne({ where: { id: 1 } }).then(note => {
//     console.log(note.get({ plain: true }));
// }).finally(() => {
//     sequelize.close();
// });

// findById DOESN'T WORK
// Note.findById(2).then((note) => {
//     console.log(note.get({ plain: true }));
//     console.log('********************')
//     console.log(`id: ${note.id}, description: ${note.description}`);
// }).finally(() => {
//     sequelize.close();
// });

// add to the notes
// const note = Note.build({ description: 'Took a cold bath' });
// note.save().then(() => {
//     console.log('new task saved');
// }).finally(() => {
//     sequelize.close();
// });

// let notes = [
//     { description: 'Tai chi in the morning' },
//     { description: 'Visited friend' },
//     { description: 'Went to cinema' },
//     { description: 'Listened to music' },
//     { description: 'Watched TV all day' },
//     { description: 'Walked for a hour' },
// ];

sequelize.sync({ force: true }).then(() => {
  Note.bulkCreate(notes, { validate: true })
    .then(() => {
      console.log('notes created');
    })
    .catch((err) => {
      console.log('failed to create notes');
      console.log(err);
    })
    .finally(() => {
      sequelize.close();
    });
});

// sequelize.sync({ force: true }).then(() => {
//   Dummy.create({ description: 'test 1' })
//     .then(() => {
//       console.log('table created');
//     })
//     .finally(() => {
//       sequelize.close();
//     });
// });

// Dummy.sync()
//   .then(() => {
//     console.log('New table created');
//   })
//   .finally(() => {
//     sequelize.close();
//   });

// Dummy.drop()
//   .then(() => {
//     console.log('table deleted');
//   })
//   .finally(() => {
//     sequelize.close();
//   });

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
}




const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      description: DataTypes.TEXT,
      username: DataTypes.STRING,
      usage_count:{
        type:DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      } 
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};






const ButtonInteraction = {
    type: 3,
    id: '1015136516357496873',
    applicationId: '1009318061104439367',
    channelId: '998376260931686421',
    guildId: '992128683735269467',
    user: {
      id: '994666257548849222',
      bot: false,
      system: false,
      flags: { bitfield: 0 },
      username: 'ike3422',
      discriminator: '6866',
      avatar: null,
      banner: undefined,
      accentColor: undefined,
    },
    member: {
      guild: {
        id: '992128683735269467',
        name: 'Day Owls',
        icon: 'f0d6629c109cfe43327add09fb89f838',
        features: [Array],
        commands: [GuildApplicationCommandManager],
        members: [GuildMemberManager],
        channels: [GuildChannelManager],
        bans: [GuildBanManager],
        roles: [RoleManager],
        presences: {},
        voiceStates: [VoiceStateManager],
        stageInstances: [StageInstanceManager],
        invites: [GuildInviteManager],
        scheduledEvents: [GuildScheduledEventManager],
        available: true,
        shardId: 0,
        splash: null,
        banner: null,
        description:
          'Study together and keep each other accountable in the Day Owls study group.',
        verificationLevel: 1,
        vanityURLCode: null,
        nsfwLevel: 0,
        premiumSubscriptionCount: 0,
        discoverySplash: null,
        memberCount: 99,
        large: true,
        premiumProgressBarEnabled: false,
        applicationId: null,
        afkTimeout: 300,
        afkChannelId: null,
        systemChannelId: '992128684267950161',
        premiumTier: 0,
        widgetEnabled: null,
        widgetChannelId: null,
        explicitContentFilter: 2,
        mfaLevel: 1,
        joinedTimestamp: 1661927704283,
        defaultMessageNotifications: 1,
        systemChannelFlags: [SystemChannelFlagsBitField],
        maximumMembers: 500000,
        maximumPresences: null,
        maxVideoChannelUsers: 25,
        approximateMemberCount: null,
        approximatePresenceCount: null,
        vanityURLUses: null,
        rulesChannelId: '992146700015779900',
        publicUpdatesChannelId: '992146700015779901',
        preferredLocale: 'en-US',
        ownerId: '911428212565885008',
        emojis: [GuildEmojiManager],
        stickers: [GuildStickerManager],
      },
      joinedTimestamp: 1658102086291,
      premiumSinceTimestamp: null,
      nickname: null,
      pending: false,
      communicationDisabledUntilTimestamp: null,
      _roles: ['1001877682004447284'],
      user: {
        id: '994666257548849222',
        bot: false,
        system: false,
        flags: [UserFlagsBitField],
        username: 'ike3422',
        discriminator: '6866',
        avatar: null,
        banner: undefined,
        accentColor: undefined,
      },
      avatar: null,
    },
    version: 1,
    appPermissions: { bitfield: 1097468472897n },
    memberPermissions: { bitfield: 1071698529857n },
    locale: 'en-US',
    guildLocale: 'en-US',
    message: {
      channelId: '998376260931686421',
      guildId: '992128683735269467',
      id: '1015134489451692032',
      createdTimestamp: 1662097322572,
      type: 20,
      system: false,
      content: 'Click below to check-out',
      author: {
        id: '1009318061104439367',
        bot: true,
        system: false,
        flags: [UserFlagsBitField],
        username: 'Sequelize',
        discriminator: '0781',
        avatar: 'cabab7cba48f61524bdd3f5db3f1768c',
        banner: undefined,
        accentColor: undefined,
        verified: true,
        mfaEnabled: true,
      },
      pinned: false,
      tts: false,
      nonce: null,
      embeds: [],
      components: [[ActionRow]],
      attachments: {},
      stickers: {},
      editedTimestamp: null,
      reactions: { message: [Circular * 1] },
      mentions: {
        everyone: false,
        users: {},
        roles: {},
        _members: null,
        _channels: null,
        _parsedUsers: null,
        crosspostedChannels: {},
        repliedUser: null,
      },
      webhookId: '1009318061104439367',
      groupActivityApplication: null,
      applicationId: '1009318061104439367',
      activity: null,
      flags: { bitfield: 64 },
      reference: null,
      interaction: {
        id: '1015134484137525308',
        type: 2,
        commandName: 'check',
        user: [User],
      },
    },
    customId: 'checkout',
    componentType: 2,
    deferred: false,
    ephemeral: false,
    replied: true,
    webhook: { id: '1009318061104439367' },
  };
  
  client.on('interactionCreate', async (interaction) => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'myModal') {
      await interaction.reply({
        content: 'Your submission was received successfully!',
        ephemeral: true,
      });
    }
  });
  
  const modal = new ModalBuilder().setCustomId('myModal').setTitle('My Modal');
  
  // Create the text input components
  const notOwnerText = new TextInputBuilder()
    .setCustomId('notOwner')
    .setLabel("You're not the owner of this check-in!")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short);
  
  const firstActionRow = new ActionRowBuilder().addComponents(notOwnerText);
  modal.addComponents(firstActionRow);
  
  await interaction.showModal(modal);
  