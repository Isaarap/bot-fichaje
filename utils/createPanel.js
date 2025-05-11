const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createPanel(user, estado = 'Fuera de servicio') {
  const embed = new EmbedBuilder()
    .setTitle('🕒 Panel de Fichaje')
    .setDescription(`👤 Usuario: <@${user.id}>\n📌 Estado actual: **${estado}**`)
    .setColor(estado === 'En servicio' ? 0x2ecc71 : 0xe74c3c)
    .setFooter({ text: 'Usa los botones para iniciar o finalizar tu jornada.' });

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('startService')
      .setLabel('📥 Iniciar')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('endService')
      .setLabel('📤 Finalizar')
      .setStyle(ButtonStyle.Danger)
  );

  return { embed, buttons };
}

module.exports = createPanel;
