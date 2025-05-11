const db = require('../utils/db');

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has('Administrator')) {
    return interaction.reply({ content: '❌ No tienes permisos.', ephemeral: true });
  }

  await db.query('REPLACE INTO configuracion (clave, valor) VALUES (?, ?)', [
    'canal_logs',
    interaction.channel.id,
  ]);

  return interaction.reply({
    content: `✅ Canal de logs establecido a <#${interaction.channel.id}>.`,
    ephemeral: true,
  });
};
