import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const json = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: { message } }));
};

// Answers /ai-proxy with a clear error instead of the SPA page when no target is set
const missingProxyTarget = () => {
  const handler = (req, res, next) => {
    if (!req.url.startsWith('/ai-proxy')) return next();
    json(res, 503, 'AI proxy is off. Restart with AI_PROXY_TARGET=http://host:port npm run dev');
  };
  return {
    name: 'ai-proxy-missing-target',
    configureServer: (server) => server.middlewares.use(handler),
    configurePreviewServer: (server) => server.middlewares.use(handler),
  };
};

export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd(), '').AI_PROXY_TARGET?.replace(/\/+$/, '');
  // Same-origin proxy for AI servers that do not send CORS headers
  const proxy = target && {
    '/ai-proxy': {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/ai-proxy/, ''),
      configure: (server) => {
        // Some local servers reject requests that carry a browser Origin
        server.on('proxyReq', (proxyReq) => {
          proxyReq.removeHeader('origin');
          proxyReq.removeHeader('referer');
        });
        server.on('error', (err, _req, res) => {
          if (!res.headersSent) json(res, 502, `AI proxy could not reach ${target}: ${err.code || err.message}`);
        });
      },
    },
  };

  if (target && mode !== 'test') console.log(`  AI proxy: /ai-proxy -> ${target}`);

  return {
    plugins: [react(), ...(target ? [] : [missingProxyTarget()])],
    server: { proxy: proxy || undefined },
    preview: { proxy: proxy || undefined },
    test: {
      environment: 'jsdom',
      setupFiles: './tests/setup.js',
    },
  };
});
