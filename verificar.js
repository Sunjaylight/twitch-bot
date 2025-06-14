const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs/promises');
const express = require('express');

const app = express();

const INSTAGRAM_URL = 'https://www.instagram.com/mochi.9706/';
const TIKTOK_URL = 'https://www.tiktok.com/@mochi9706';
const WEBHOOK_URL = 'https://twitch-bot-k7zs.onrender.com/nuevo-post';

// Leer último enlace desde archivo
async function leerUltimo(nombre) {
  try {
    const data = await fs.readFile(`./${nombre}.txt`, 'utf-8');
    return data.trim();
  } catch {
    return '';
  }
}

// Guardar último enlace en archivo
async function guardarUltimo(nombre, link) {
  await fs.writeFile(`./${nombre}.txt`, link);
}

async function verificarInstagram() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(INSTAGRAM_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('article a');

  const enlace = await page.$eval('article a', el => el.href);
  await browser.close();

  const ultimoInstagram = await leerUltimo('ultimoInstagram');

  if (enlace !== ultimoInstagram) {
    await axios.post(WEBHOOK_URL, {
      link: enlace,
      plataforma: 'Instagram'
    });
    await guardarUltimo('ultimoInstagram', enlace);
    console.log('📸 Nuevo post de Instagram detectado y enviado');
  } else {
    console.log('✅ Instagram sin cambios');
  }
}

async function verificarTikTok() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto(TIKTOK_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('a[href*="/video/"]');

  const enlace = await page.$$eval('a[href*="/video/"]', el => el[0]?.href);
  await browser.close();

  const ultimoTikTok = await leerUltimo('ultimoTikTok');

  if (enlace && enlace !== ultimoTikTok) {
    await axios.post(WEBHOOK_URL, {
      link: enlace,
      plataforma: 'TikTok'
    });
    await guardarUltimo('ultimoTikTok', enlace);
    console.log('🎵 Nuevo video de TikTok detectado y enviado');
  } else {
    console.log('✅ TikTok sin cambios');
  }
}

async function ejecutar() {
  try {
    await verificarInstagram();
    await verificarTikTok();
    console.log('🚀 Verificación completada');
  } catch (err) {
    console.error('❌ Error durante verificación:', err.message);
  }
}

// Ejecutar al iniciar
ejecutar();

// También servir como endpoint opcional para cron por URL
app.get('/verificar', async (req, res) => {
  await ejecutar();
  res.send('✅ Verificación ejecutada correctamente');
});

// Escuchar en puerto (para Render o servicios similares)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en puerto ${PORT}`);
});