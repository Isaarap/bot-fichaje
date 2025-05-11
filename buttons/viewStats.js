const db = require('../utils/db');
const { EmbedBuilder } = require('discord.js');

function getStartOfDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay(); // 0 = domingo
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // lunes como inicio
  now.setDate(diff);
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

function getStartOfMonth() {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

function calcularHoras(ms) {
  const horas = ms / 1000 / 60 / 60;
  return horas.toFixed(2);
}

module.exports = async (interaction) => {
  const userId = interaction.user.id;

  const [fichajes] = await db.query(
    'SELECT * FROM fichajes WHERE user_id = ? AND end_time IS NOT NULL',
    [userId]
  );

  const dia = getStartOfDay();
  const semana = getStartOfWeek();
  const mes = getStartOfMonth();

  let totalDia = 0, totalSemana = 0, totalMes = 0;

  for (const f of fichajes) {
    const inicio = new Date(f.start_time);
    const fin = new Date(f.end_time);
    const duracion = fin - inicio;

    if (f.start_time >= dia) totalDia += duracion;
    if (f.start_time >= semana) totalSemana += duracion;
    if (f.start_time >= mes) totalMes += duracion;
  }

  const promedio = totalMes / new Date().getDate();

  const embed = new EmbedBuilder()
    .setTitle('📊 Tus estadísticas')
    .addFields(
      { name: 'Hoy', value: `🕒 ${calcularHoras(totalDia)} horas`, inline: true },
      { name: 'Esta semana', value: `🕒 ${calcularHoras(totalSemana)} horas`, inline: true },
      { name: 'Este mes', value: `🕒 ${calcularHoras(totalMes)} horas`, inline: true },
      { name: 'Promedio diario (mes)', value: `📈 ${calcularHoras(promedio)} horas`, inline: false }
    )
    .setColor(0x3498db);

  return interaction.reply({ embeds: [embed], ephemeral: true });
};
