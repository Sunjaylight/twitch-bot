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
<<<<<<< HEAD
});
=======
});
>>>>>>> de9a3b1ada25be53837697c079b066678412558c
