const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

// Replace standard viewport with app-like viewport (prevents scaling on double tap, removes browser UI space)
html = html.replace(
    /<meta name="viewport" content="width=device-width, initial-scale=1.0">/,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">\n    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n    <meta name="theme-color" content="#10b981">\n    <link rel="manifest" href="manifest.json">`
);

// Ensure the title is exactly what the user wanted
html = html.replace(/<title>.*?<\/title>/, '<title>Displine Memoranda</title>');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);

// --- 2. Create Manifest.json ---
const manifest = {
  "name": "Displine Memoranda",
  "short_name": "Displine",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "https://img.icons8.com/color/192/leaf.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://img.icons8.com/color/512/leaf.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
};

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/manifest.json', JSON.stringify(manifest, null, 2));

console.log("PWA features added.");
