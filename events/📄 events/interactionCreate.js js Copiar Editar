module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const handler = require(`../buttons/${interaction.customId}`);
      return handler(interaction, client);
    }
  },
};
