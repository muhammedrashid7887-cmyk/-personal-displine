const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

html = html.replace(/Personal Discipline/g, "Displine Memoranda");
html = html.replace(/>DeenVault Pro<\/h1>/g, ">Displine Memoranda</h1>");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);

// --- 2. Modify APP.JS ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf-8');

code = code.replace(/@personaldiscipline\.local/g, '@displine.local');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
