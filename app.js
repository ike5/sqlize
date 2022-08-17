const Sequelize = require("sequelize");
const Tag = require("./models/tag");
const path = require("path");
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// get from events folder
const eventPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// const sequelize = new Sequelize("database_development", "sql", "login123!", {
//   host: "localhost",
//   dialect: "mysql",
//   loggin: false,
// });

console.log("test");
client.on("interactionCreate", interaction => {
  //   if (!interaction.isChatInputCommand()) return "not working";
  //   const { commandName } = interaction;

  //   console.log("Made it");

  //   if (commandName === "addtag") {
  //     const tagName = interaction.options.getString("name");
  //     const tagDescription = interaction.options.getString("description");

  //     try {
  //       // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
  //       const tag = await Tag.create({
  //         name: tagName,
  //         description: tagDescription,
  //         username: interaction.user.username,
  //       });

  //       return interaction.reply(`Tag ${tag.name} added.`);
  //     } catch (error) {
  //       if (error.name === "SequelizeUniqueConstraintError") {
  //         return interaction.reply("That tag already exists.");
  //       }

  //       return interaction.reply("Something went wrong with adding a tag.");
  //     }
  //   } else if (command === "tag") {
  //     const tagName = interaction.options.getString("name");

  //     // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  //     const tag = await Tags.findOne({ where: { name: tagName } });

  //     if (tag) {
  //       // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
  //       tag.increment("usage_count");

  //       return interaction.reply(tag.get("description"));
  //     }

  //     return interaction.reply(`Could not find tag: ${tagName}`);
  //   } else if (command === "edittag") {
  //     const tagName = interaction.options.getString("name");
  //     const tagDescription = interaction.options.getString("description");

  //     // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
  //     const affectedRows = await Tags.update(
  //       { description: tagDescription },
  //       { where: { name: tagName } }
  //     );

  //     if (affectedRows > 0) {
  //       return interaction.reply(`Tag ${tagName} was edited.`);
  //     }

  //     return interaction.reply(`Could not find a tag with name ${tagName}.`);
  //   } else if (commandName == "taginfo") {
  //     const tagName = interaction.options.getString("name");

  //     // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  //     const tag = await Tags.findOne({ where: { name: tagName } });

  //     if (tag) {
  //       return interaction.reply(
  //         `${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`
  //       );
  //     }

  //     return interaction.reply(`Could not find tag: ${tagName}`);
  //   } else if (command === "showtags") {
  //     // equivalent to: SELECT name FROM tags;
  //     const tagList = await Tags.findAll({ attributes: ["name"] });
  //     const tagString = tagList.map((t) => t.name).join(", ") || "No tags set.";

  //     return interaction.reply(`List of tags: ${tagString}`);
  //   } else if (command === "deletetag") {
  //     const tagName = interaction.options.getString("name");
  //     // equivalent to: DELETE from tags WHERE name = ?;
  //     const rowCount = await Tags.destroy({ where: { name: tagName } });

  //     if (!rowCount) return interaction.reply("That tag doesn't exist.");

  //     return interaction.reply("Tag deleted.");
  //   }

  //   if (!interaction.isChatInputCommand()) {
  //     console.log("not working");
  //     return;
  //   }
  //   if (interaction.commandName === "ping") {
  //     const row = new ActionRowBuilder().addComponents(
  //       new ButtonBuilder()
  //         .setCustomId("primary")
  //         .setLabel("Primary")
  //         .setStyle(ButtonStyle.Primary)
  //     );
  //     await interaction.reply({ content: "Pong!", components: [row] });
  //   }

  console.log(interaction);
});

client.login(
  "MTAwOTMxODA2MTEwNDQzOTM2Nw.GPbUnL.tlDlAglUVb1TqMqcuBwVOf22soYf4enU8gf2VE"
);
