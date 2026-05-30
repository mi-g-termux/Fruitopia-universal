import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const express = require('express');
const PORT = process.env.PORT || 3005;
const isProd = process.env.NODE_ENV === 'production';

async function start() {
  const app = await createApp();

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`[OK] Server running → http://localhost:${PORT}`));
}

start().catch(err => { console.error('[CRITICAL]', err); process.exit(1); });
