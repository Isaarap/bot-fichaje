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
if (interaction.customId === 'admin_remove_hours_modal') {
  const userId = interaction.fields.getTextInputValue('user_id');
  let horasARestar = parseFloat(interaction.fields.getTextInputValue('horas'));

  if (isNaN(horasARestar) || horasARestar <= 0) {
    return interaction.reply({ content: '❌ Horas inválidas.', ephemeral: true });
  }

  const db = require('./utils/db');

  const [fichajes] = await db.query(
    `SELECT id, start_time, end_time FROM fichajes 
     WHERE user_id = ? AND end_time IS NOT NULL 
     ORDER BY end_time DESC`,
    [userId]
  );

  let horasRestadas = 0;

  for (const f of fichajes) {
    const inicio = new Date(f.start_time);
    const fin = new Date(f.end_time);
    const duracionHoras = (fin - inicio) / (1000 * 60 * 60);

    if (duracionHoras <= horasARestar) {
      // Borrar el registro entero
      await db.query('DELETE FROM fichajes WHERE id = ?', [f.id]);
      horasARestar -= duracionHoras;
      horasRestadas += duracionHoras;
    } else {
      // Acortar el registro
      const nuevoFin = new Date(fin.getTime() - horasARestar * 60 * 60 * 1000);
      await db.query('UPDATE fichajes SET end_time = ? WHERE id = ?', [nuevoFin, f.id]);
      horasRestadas += horasARestar;
      horasARestar = 0;
      break;
    }

    if (horasARestar <= 0) break;
  }

  await db.query(
    'INSERT INTO logs (action, user_id, executor_id) VALUES (?, ?, ?)',
    [`Admin restó ${horasRestadas.toFixed(2)}h`, userId, interaction.user.id]
  );

  return interaction.reply({ content: `➖ Se restaron ${horasRestadas.toFixed(2)}h a <@${userId}>`, ephemeral: true });
}
if (interaction.customId === 'admin_delete_all_hours_modal') {
  const userId = interaction.fields.getTextInputValue('user_id');

  const [registros] = await db.query('SELECT COUNT(*) AS total FROM fichajes WHERE user_id = ?', [userId]);
  const total = registros[0]?.total || 0;

  if (total === 0) {
    return interaction.reply({ content: '⚠️ El usuario no tiene horas registradas.', ephemeral: true });
  }

  await db.query('DELETE FROM fichajes WHERE user_id = ?', [userId]);

  await db.query(
    'INSERT INTO logs (action, user_id, executor_id) VALUES (?, ?, ?)',
    [`Admin eliminó todas las horas (${total} registros)`, userId, interaction.user.id]
  );

  return interaction.reply({ content: `🗑️ Se eliminaron ${total} registros de fichajes para <@${userId}>.`, ephemeral: true });
}

