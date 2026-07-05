const fs = require('fs');

let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// The card classes string:
// \${isSelected ? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-lg scale-105 border border-emerald-300' : 'bg-white/40 text-gray-600 hover:bg-white/80 border border-white/60'}
const newCardClasses = `\${isSelected ? 'bg-gradient-to-b from-gray-900 to-black shadow-xl scale-110 border border-gray-700 z-10' : 'bg-white/70 hover:bg-white border border-white/80'}`;
code = code.replace(/\$\{isSelected \? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-lg scale-105 border border-emerald-300' : 'bg-white\/40 text-gray-600 hover:bg-white\/80 border border-white\/60'\}/g, newCardClasses);

// The Day Name text:
// \${isSelected ? 'text-emerald-50' : 'text-gray-600'}
const newDayClasses = `\${isSelected ? 'text-emerald-400' : 'text-gray-500'}`;
code = code.replace(/\$\{isSelected \? 'text-emerald-50' : 'text-gray-600'\}/g, newDayClasses);

// The Date Number text:
// \${isSelected ? 'text-white' : 'text-gray-700'}
const newNumClasses = `\${isSelected ? 'text-white' : 'text-gray-900'}`;
code = code.replace(/\$\{isSelected \? 'text-white' : 'text-gray-700'\}/g, newNumClasses);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
