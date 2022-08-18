module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;
    console.log(interaction);

    const filter = (i) =>
      i.customId === "primary" && i.user.id === "911428212565885008";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      await i.update({ content: "A button was clicked!", components: [] });
    });

    collector.on("end", (collected) =>
      console.log(`Collected ${collected.size} items`)
    );
  },
};
