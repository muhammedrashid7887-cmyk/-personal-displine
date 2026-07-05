const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

// Replace old footer
const oldFooter = /<footer class="text-center py-6 mt-8 text-xs font-black text-gray-500\/80 uppercase tracking-widest bg-white\/40 backdrop-blur-md border-t border-white\/50 w-full rounded-t-\[2rem\]">\s*Created by mhd rashid ps\s*<\/footer>/g;

html = html.replace(oldFooter, "");

// Insert fixed bottom right text just before </body>
html = html.replace(/<\/body>/, `<div class="fixed bottom-2 right-4 text-[10px] font-black text-gray-500/60 uppercase tracking-widest z-50 pointer-events-none">\n    Developer Mhd Rashid ps\n</div>\n</body>`);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);

// --- 2. Modify APP.JS ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf-8');

code = code.replace(/min-w-\[3\.5rem\] py-2/g, 'min-w-[4rem] py-3');
code = code.replace(/text-xl font-black/g, 'text-2xl font-black');
code = code.replace(/text-gray-400/g, 'text-gray-600'); // Make unselected text darker

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
