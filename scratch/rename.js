const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

html = html.replace(/<title>DeenVault Pro<\/title>/g, "<title>Personal Discipline</title>");
html = html.replace(/id="auth-title">DeenVault Pro<\/h2>/g, 'id="auth-title">Personal Discipline</h2>');
html = html.replace(/New to DeenVault Pro\?/g, "New to Personal Discipline?");
html = html.replace(/DeenVault<span class="text-emerald-500 font-medium">Pro<\/span>/g, 'Personal<span class="text-emerald-500 font-medium">Discipline</span>');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);

// --- 2. Modify APP.JS ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf-8');

code = code.replace(/@deenvault\.local/g, '@personaldiscipline.local');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
