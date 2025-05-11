module.exports = async (interaction) => {
  const userId = interaction.customId.split(':')[1];

  const [active] = await db.query(
    'SELECT * FROM fichajes WHERE user_id = ? AND end_time IS NULL',
    [userId]
  );

  if (active.length === 0) {
    return interaction.reply({ content: '❌ El usuario no tiene fichajes activos.', ephemeral: true });
  }

  await db.query(
    'UPDATE fichajes SET end_time = NOW() WHERE id = ?',
    [active[0].id]
  );

  return interaction.reply({ content: '⛔ Fichaje forzado cerrado.', ephemeral: true });
};
