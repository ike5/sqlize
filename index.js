const fs = require("node:fs");
const path = require("node:path");
// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token, pingCommandId } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// access 'commands' in other files by attaching a commands property
client.commands = new Collection();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(`Server name: ${interaction.guild.name}`);
  } else if (commandName === "user") {
    await interaction.reply(`Your tag: ${interaction.user.tag}`);
  }
});

client.login(token);
