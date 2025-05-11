const db = require('../utils/db');

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has('Administrator')) {
    return interaction.reply({ content: '❌ No tienes permiso.', ephemeral: true });
  }

  const modal = {
    title: 'Agregar horas',
    customId: 'admin_add_hours_modal',
    components: [
      {
        type: 1,
        components: [{
          type: 4,
          custom_id: 'user_id',
          label: 'ID del usuario',
          style: 1,
          required: true,
        }],
      },
      {
        type: 1,
        components: [{
          type: 4,
          custom_id: 'horas',
          label: 'Cantidad de horas a agregar',
          style: 1,
          required: true,
        }],
      },
    ],
  };
  const [config] = await db.query('SELECT valor FROM configuracion WHERE clave = ?', ['canal_logs']);
const logChannelId = config[0]?.valor;
if (logChannelId) {
  const logChannel = interaction.client.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`📢 Log: Acción realizada por <@${interaction.user.id}>`);
  }
}


  await interaction.showModal(modal);
};
