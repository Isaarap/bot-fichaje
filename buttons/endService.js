const db = require('../utils/db');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;

  // Busca el fichaje activo
  const [active] = await db.query(
    'SELECT * FROM fichajes WHERE user_id = ? AND end_time IS NULL',
    [userId]
  );

  if (active.length === 0) {
    return interaction.reply({ content: '❌ No tienes un fichaje activo.', ephemeral: true });
  }

  await db.query(
    'UPDATE fichajes SET end_time = NOW() WHERE id = ?',
    [active[0].id]
  );

  return interaction.reply({ content: '📤 Has finalizado tu jornada.', ephemeral: true });
};
new ButtonBuilder()
  .setCustomId('viewStats')
  .setLabel('📊 Ver estadísticas')
  .setStyle(ButtonStyle.Primary),
new ButtonBuilder()
  .setCustomId('viewStats')
  .setLabel('📊 Ver estadísticas')
  .setStyle(ButtonStyle.Primary),
const [config] = await db.query('SELECT valor FROM configuracion WHERE clave = ?', ['canal_logs']);
const logChannelId = config[0]?.valor;
if (logChannelId) {
  const logChannel = interaction.client.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`📢 Log: Acción realizada por <@${interaction.user.id}>`);
  }
}
