const fs = require('fs');
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// Fix input styles globally for dark mode
html = html.replace(/bg-gray-50/g, 'bg-black/50');
html = html.replace(/border-gray-200/g, 'border-white/10');
html = html.replace(/text-gray-100/g, 'text-white');
// Ensure placeholders are visible
html = html.replace(/placeholder-gray-400/g, 'placeholder-gray-500');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
console.log("Fixed HTML CSS");
