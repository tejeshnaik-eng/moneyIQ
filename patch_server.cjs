const fs = require('fs');
let content = fs.readFileSync('server/index.js', 'utf8');

// Fix 1: PORT binding
content = content.replace('const PORT = 3000;', 'const PORT = process.env.PORT || 3000;');
content = content.replace('http://localhost:${PORT}', '0.0.0.0:${PORT}');

// Fix 2: Remove Vite Dev Server in Production
const oldViteBlock = /const vite = await createViteServer\(\{[\s\S]*?app\.use\(vite\.middlewares\);/;
const newViteBlock = `if (process.env.NODE_ENV === 'production') {
  console.log('Serving production build from /dist...');
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    // Exclude API routes from falling through to React's index.html
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
} else {
  console.log('Running Vite in dev middleware mode...');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}`;

content = content.replace(oldViteBlock, newViteBlock);

fs.writeFileSync('server/index.js', content);
