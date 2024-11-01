import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Set up proxy to fetch from the API as if coming from www.zenithpay.com
app.use('/api/forex', createProxyMiddleware({
  target: 'https://fcsapi.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/forex': '/api-v3/forex/list?type=forex&access_key=LiBQmb3yIywHvzNYz203',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Set a custom host header
    proxyReq.setHeader('Host', 'www.zenithpay.com');
  },
}));

// Start the server
app.listen(3000, () => {
  console.log(`Proxy server running on http://www.zenithpay.com:3000`);
});
