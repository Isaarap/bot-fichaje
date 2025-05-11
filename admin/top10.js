const db = require('../utils/db');
const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
  const [result] = await db.query(`
    SELECT user_id, SUM(TIMESTAMPDIFF(SECOND, start_time, end_time)) AS total_seconds
    FROM fichajes
    WHERE MONTH(start_time) = MONTH(NOW())
    AND end_time IS NOT NULL
    GROUP BY user_id
    ORDER BY total_seconds DESC
    LIMIT 10
  `);

  const embed = new EmbedBuilder()
    .setTitle('🏆 Top 10 - Más horas este mes')
    .setColor(0xf1c40f);

  result.forEach((r, i) => {
    const horas = (r.total_seconds / 3600).toFixed(2);
    embed.addFields({ name: `${i + 1}. <@${r.user_id}>`, value: `🕒 ${horas} horas`, inline: false });
  });

  return interaction.reply({ embeds: [embed], ephemeral: true });
};
