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

// Webhook para nuevas publicaciones
app.post('/nuevo-post', async (req, res) => {
  const { link, plataforma } = req.body;
  const mensaje = `📢 ¡Nuevo post en ${plataforma}! Míralo aquí 👉 ${link}`;
  await client.say(process.env.CHANNEL, mensaje);
  res.status(200).send('✅ Mensaje enviado al chat');
});

// Ruta para cronjob
app.get('/verificar', async (req, res) => {
  try {
    await client.say(process.env.CHANNEL, '🔄 El cron ha funcionado correctamente, iniciando verificación…');

    exec('node verificar.js', async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        await client.say(process.env.CHANNEL, '❌ Error ejecutando verificador');
        return res.status(500).send('❌ Error ejecutando verificador');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      await client.say(process.env.CHANNEL, '✅ Verificador ejecutado correctamente');
      res.send('✅ Verificador ejecutado');
    });
  } catch (err) {
    console.error(err);
    await client.say(process.env.CHANNEL, '❌ Fallo inesperado al ejecutar cron');
    res.status(500).send('❌ Fallo inesperado');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor escuchando en el puerto ${PORT}`);
});
