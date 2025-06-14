import puppeteer from 'puppeteer';
import axios from 'axios';

const INSTAGRAM_URL = 'https://www.instagram.com/mochi.9706/';
const TIKTOK_URL = 'https://www.tiktok.com/@mochi9706';
const WEBHOOK_URL = 'https://twitch-bot-k7zs.onrender.com/nuevo-post';

let ultimoInstagram = '';
let ultimoTikTok = '';

async function verificarInstagram() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(INSTAGRAM_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('article a');

  const enlace = await page.$eval('article a', el => el.href);
  await browser.close();

  if (enlace !== ultimoInstagram) {
    ultimoInstagram = enlace;
    await axios.post(WEBHOOK_URL, {
      link: enlace,
      plataforma: 'Instagram'
    });
  }
}

async function verificarTikTok() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(TIKTOK_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('a[href*="/video/"]');

  const enlace = await page.$$eval('a[href*="/video/"]', el => el[0]?.href);
  await browser.close();

  if (enlace && enlace !== ultimoTikTok) {
    ultimoTikTok = enlace;
    await axios.post(WEBHOOK_URL, {
      link: enlace,
      plataforma: 'TikTok'
    });
  }
}

async function ejecutar() {
  try {
    await verificarInstagram();
    await verificarTikTok();
    console.log('✅ Verificación completada');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

ejecutar();
