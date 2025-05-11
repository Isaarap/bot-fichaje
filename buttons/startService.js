const db = require('../utils/db');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;

  // Verifica si ya está fichado
  const [active] = await db.query(
    'SELECT * FROM fichajes WHERE user_id = ? AND end_time IS NULL',
    [userId]
  );

  if (active.length > 0) {
    return interaction.reply({ content: '❌ Ya tienes un fichaje activo.', ephemeral: true });
  }

  // Inicia un nuevo fichaje
  await db.query('INSERT INTO fichajes (user_id, start_time) VALUES (?, NOW())', [userId]);

  return interaction.reply({ content: '✅ Has iniciado tu jornada.', ephemeral: true });
};
