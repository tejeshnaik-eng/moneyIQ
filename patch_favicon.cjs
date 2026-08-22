const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  /<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml,[^"]+" \/>/,
  '<link rel="icon" type="image/png" href="/logo.png" />'
);
fs.writeFileSync('index.html', html);
console.log('Favicon updated in index.html');
