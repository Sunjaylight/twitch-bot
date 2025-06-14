//Sunjay
//Sunjay
const tmi = require('tmi.js');

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.OAUTH
  },
  channels: [process.env.CHANNEL]
});

client.connect();

client.on('connected', () => {
  console.log('✅ Conectado al chat');
  setTimeout(() => {
    client.say(process.env.CHANNEL, '🚀 Bot activo desde Railway');
  }, 5000);
});