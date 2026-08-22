const fs = require('fs');
let content = fs.readFileSync('server/index.js', 'utf8');

// Replace app.get('*', ...) with app.use(...) for Express 5 catch-all
content = content.replace("app.get('*', (req, res) => {", "app.use((req, res) => {");

fs.writeFileSync('server/index.js', content);
