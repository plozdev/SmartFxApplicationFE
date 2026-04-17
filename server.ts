import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8080';

  app.use(express.json());

  // --- Proxy API requests to real backend ---
  app.use('/api/v1', (req, res) => {
    const backendUrl = new URL(`${BACKEND_URL}${req.originalUrl}`);
    const protocol = backendUrl.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(backendUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: backendUrl.host,
      },
    }, (proxyRes) => {
      // Copy response headers
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    });

    // Handle errors
    proxyReq.on('error', (err) => {
      console.error('Backend proxy error:', err);
      res.status(503).json({ 
        error: 'Backend service unavailable',
        message: `Cannot connect to backend at ${BACKEND_URL}`,
        details: err.message 
      });
    });

    // Forward request body
    if (req.body && Object.keys(req.body).length > 0) {
      proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
  });

  // --- Vite / Static Files ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
