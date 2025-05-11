const db = require('../utils/db');

module.exports = async (interaction) => {
  if (!interaction.member.permissions.has('Administrator')) {
    return interaction.reply({ content: '❌ No tienes permiso.', ephemeral: true });
  }

  const modal = {
    title: 'Eliminar todas las horas',
    customId: 'admin_delete_all_hours_modal',
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
    ],
  };

  await interaction.showModal(modal);
};
