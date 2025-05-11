module.exports = async (interaction) => {
  const db = require('./utils/db');

  // BOTONES
  if (interaction.isButton()) {
    const customId = interaction.customId;

    // Usuario normal
    if (customId === 'startService') return require('./buttons/startService')(interaction);
    if (customId === 'endService') return require('./buttons/endService')(interaction);
    if (customId === 'viewStats') return require('./buttons/viewStats')(interaction);

    // Admin
    if (customId === 'admin:addHours') return require('./admin/addHours')(interaction);
    if (customId === 'admin:top10') return require('./admin/top10')(interaction);
    if (customId.startsWith('admin:forceEnd:')) return require('./admin/forceEnd')(interaction);
  }

  // MODALES
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'admin_add_hours_modal') {
      const userId = interaction.fields.getTextInputValue('user_id');
      const horas = parseFloat(interaction.fields.getTextInputValue('horas'));

      if (isNaN(horas) || horas <= 0) {
        return interaction.reply({ content: '❌ Horas inválidas.', ephemeral: true });
      }

      const ahora = new Date();
      const fin = new Date(ahora.getTime() + horas * 60 * 60 * 1000);

      await db.query(
        'INSERT INTO fichajes (user_id, start_time, end_time) VALUES (?, ?, ?)',
        [userId, ahora, fin]
      );

      await db.query(
        'INSERT INTO logs (action, user_id, executor_id) VALUES (?, ?, ?)',
        [`Admin agregó ${horas}h`, userId, interaction.user.id]
      );

      return interaction.reply({ content: `✅ Se agregaron ${horas}h a <@${userId}>`, ephemeral: true });
    }
  }
};
