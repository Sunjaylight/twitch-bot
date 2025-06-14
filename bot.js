const express = require('express');
const tmi = require('tmi.js');

const app = express();
app.use(express.json()); // Para que Zapier envíe JSON

// Cliente de Twitch
const client = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.USERNAME,
    password: process.env.OAUTH
  },
  channels: [process.env.CHANNEL]
});

client.connect();

// Webhook: cuando Zapier envía una notificación
app.post('/nuevo-post', async (req, res) => {
  const { link, plataforma } = req.body;

  const mensaje = `📢 ¡Nuevo post en ${plataforma}! Míralo aquí 👉 ${link}`;
  await client.say(process.env.CHANNEL, mensaje);

  res.status(200).send('✅ Mensaje enviado al chat');
});

// Servidor en Render (puerto dinámico)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor escuchando en el puerto ${PORT}`);
});