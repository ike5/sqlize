// module.exports = {
//   name: "interactionCreate",
//   async execute(interaction) {
//     if (!interaction.isChatInputCommand()) return;
//     const command = interaction.client.commands.get(interaction.commandName);
//     if (!command) {
//       return;
//     }
//     const filter = (m) => m.content.includes("discord");
//     const collector = interaction.channel.createMessageCollector({
//       filter,
//       time: 1000,
//     });

//     collector.on("collect", (m) => {
//       console.log(`Collected ${m.content}`);
//     });
//     collector.on("end", (collected) => {
//       console.log(`Collected ${collected.size} items`);
//     });
//     try {
//       await command.execute(interaction);
//     } catch (error) {
//       console.error(error);
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         ephemeral: true,
//       });
//     }
//   },
// };
