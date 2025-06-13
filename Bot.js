const tmi = require('tmi.js');

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: 'Sunjay_q',
    password: 'oauth:djfrow9mh446gqkihe7fd53dbk1bfe'
  },
  channels: ['sunjaylight']
});

client.connect();

// Enviar mensaje cada vez que se conecte
client.on('connected', () => {
  console.log('✅ Conectado al chat');
  setTimeout(() => {
  client.say('sunjaylight', '🚀 Prueba manual de mensaje desde el bot');
}, 5000);
});

// Puedes escribir mensajes cuando quieras así:
function anunciarNuevoPost(link) {
  client.say('sunjaylight', `🎉 ¡Nuevo post! Mira aquí 👉 ${link}`);
}
