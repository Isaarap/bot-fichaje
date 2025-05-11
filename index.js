// Archivo principal: index.js
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

// Base de datos
client.db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fichajes_bot'
});

// Cargar eventos
fs.readdirSync('./events').forEach(file => {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
});
const verificadorFichajes = require('./sistemas/verificadorFichajes');

client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);

  setInterval(() => {
    verificadorFichajes(client);
  }, 15 * 60 * 1000); // cada 15 minutos
});

client.login('TOKEN');
