const { Client, GatewayIntentBits } = require('discord.js');
const createPanel = require('./utils/createPanel');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const channel = await client.channels.fetch('ID_DEL_CANAL'); // ← Reemplaza con tu canal

  const { embed, buttons } = createPanel({ id: '123456789' }); // se puede pasar interaction.user más adelante
  await channel.send({ embeds: [embed], components: [buttons] });

  console.log('✅ Panel de fichaje enviado');
  client.destroy();
});

client.login('TOKEN_DEL_BOT');
