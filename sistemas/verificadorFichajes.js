const db = require('../utils/db');

module.exports = async (client) => {
  const [abiertos] = await db.query('SELECT * FROM fichajes WHERE end_time IS NULL');
  const ahora = new Date();

  for (const f of abiertos) {
    const inicio = new Date(f.start_time);
    const horasTranscurridas = (ahora - inicio) / (1000 * 60 * 60);

    if (horasTranscurridas >= 6) { // ajustá el umbral a lo que desees
      const [premium] = await db.query('SELECT valor FROM configuracion WHERE clave = "premium"');
      const esPremium = premium[0]?.valor === 'true';

      if (esPremium) {
        await db.query('UPDATE fichajes SET end_time = ? WHERE id = ?', [ahora, f.id]);

        const user = await client.users.fetch(f.user_id).catch(() => null);
        if (user) {
          user.send('⚠️ Tu fichaje fue cerrado automáticamente por pasar más de 6 horas sin cerrarlo.');
        }

        const [config] = await db.query('SELECT valor FROM configuracion WHERE clave = ?', ['canal_logs']);
        const canalLogId = config[0]?.valor;
        const canal = client.channels.cache.get(canalLogId);
        if (canal) {
          canal.send(`🕓 Auto cierre de fichaje para <@${f.user_id}> por superar las 6 horas sin cerrar.`);
        }
      }
    }
  }
};
