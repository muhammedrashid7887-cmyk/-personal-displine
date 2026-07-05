const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

// Reduce margins and padding in the header for mobile to maximize space for dates
html = html.replace(/max-w-xl mx-4 sm:mx-8 flex items-center justify-between/g, 'max-w-xl mx-1 sm:mx-8 flex items-center justify-between');
html = html.replace(/px-1 sm:px-2 overflow-x-auto no-scrollbar gap-2/g, 'px-0 sm:px-2 flex-1 gap-1 sm:gap-2'); // Remove overflow scrolling so it forces a fit

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);


// --- 2. Modify APP.JS ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf-8');

// The line generating the card:
// min-w-[4rem] py-3 rounded-2xl
code = code.replace(/min-w-\[4rem\] py-3 rounded-2xl/g, 'flex-1 min-w-[2rem] sm:min-w-[4rem] py-1.5 sm:py-3 rounded-xl sm:rounded-2xl');

// The day name span:
// text-[10px]
code = code.replace(/<span class="text-\[10px\]/g, '<span class="text-[8px] sm:text-[10px]');

// The date number span:
// text-2xl
code = code.replace(/<span class="text-2xl/g, '<span class="text-base sm:text-2xl');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
