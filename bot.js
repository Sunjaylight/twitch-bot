import express from 'express';
import tmi from 'tmi.js';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

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

app.get('/verificar', async (req, res) => {
  exec('node verificar.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('❌ Error ejecutando verificador');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send('✅ Verificador ejecutado');
  });
});

app.post('/nuevo-post', async (req, res) => {
  const { link, plataforma } = req.body;

  const mensaje = `📢 ¡Nuevo post en ${plataforma}! Míralo aquí 👉 ${link}`;
  await client.say(process.env.CHANNEL, mensaje);

  res.status(200).send('✅ Mensaje enviado al chat');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor escuchando en el puerto ${PORT}`);
});
