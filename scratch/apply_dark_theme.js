const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// 1. Change "Email" to "Username" in the UI
html = html.replace('<label class="block text-sm font-bold text-gray-800 ml-2">Email</label>', '<label class="block text-sm font-bold text-gray-800 ml-2">Username</label>');

// 2. Change auth-view background from solid teal to transparent
html = html.replace('<div id="auth-view" class="flex-1 flex items-center justify-center p-4 min-h-screen relative z-10 bg-[#07595E]">', '<div id="auth-view" class="flex-1 flex items-center justify-center p-4 min-h-screen relative z-10 bg-transparent">');

// 3. Update Body Background to Premium BG
html = html.replace(/<body class=".*?" style=".*?">/, `<body class="bg-cover bg-center bg-fixed bg-no-repeat text-white transition-colors duration-500 min-h-screen flex flex-col font-sans relative" style="background-image: url('assets/images/premium_bg.jpg');">`);

// 4. Update the Optional Overlay (Make it darker for contrast)
html = html.replace('<div class="fixed inset-0 bg-white/30 backdrop-blur-[2px] z-0 pointer-events-none"></div>', '<div class="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-0 pointer-events-none"></div>');

// 5. Update glassmorphism classes globally in the dashboard
// Replace solid white backgrounds or semi-white backgrounds with dark glass
html = html.replace(/bg-white\/60 backdrop-blur-md/g, 'bg-black/40 backdrop-blur-2xl border border-white/10');
html = html.replace(/bg-white\/60 backdrop-blur-2xl/g, 'bg-black/50 backdrop-blur-3xl border-b border-white/10');
html = html.replace(/bg-white\/40/g, 'bg-black/30 border border-white/10');
html = html.replace(/bg-white\/60/g, 'bg-black/40 border border-white/10');
html = html.replace(/bg-white\/80/g, 'bg-black/50 border border-white/10');
html = html.replace(/bg-white/g, 'bg-[#111827]'); 

// 6. Fix Text Colors for Dark Mode
html = html.replace(/text-gray-900/g, 'text-white');
html = html.replace(/text-gray-800/g, 'text-gray-100');
html = html.replace(/text-gray-700/g, 'text-gray-200');
html = html.replace(/text-gray-600/g, 'text-gray-300');
html = html.replace(/text-gray-500/g, 'text-gray-400');
html = html.replace(/text-emerald-700/g, 'text-amber-500'); // Convert emerald highlights to amber/gold
html = html.replace(/text-emerald-600/g, 'text-amber-400');

// 7. Fix borders and rings
html = html.replace(/border-white\/80/g, 'border-white/10');
html = html.replace(/border-gray-200\/50/g, 'border-white/10');
html = html.replace(/border-emerald-500/g, 'border-amber-500');

// Fix text-white replacement in auth card
html = html.replace('text-gray-800 ml-2">Username', 'text-gray-200 ml-2">Username');
html = html.replace('text-gray-800 ml-2">Password', 'text-gray-200 ml-2">Password');
html = html.replace('text-black mb-3" id="auth-title', 'text-white mb-3" id="auth-title');
html = html.replace('<div class="w-full max-w-sm p-8 bg-[#111827] rounded-[3rem] shadow-2xl relative z-10 flex flex-col items-center">', '<div class="w-full max-w-sm p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl relative z-10 flex flex-col items-center">');
html = html.replace('bg-[#E5E5EA]', 'bg-black/50 text-white placeholder-gray-400');
html = html.replace('bg-[#E5E5EA]', 'bg-black/50 text-white placeholder-gray-400');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);

// -- Fix app.js
let appJs = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// Also fix text toggles in app.js
appJs = appJs.replace(/text-emerald-700/g, 'text-amber-500');
appJs = appJs.replace(/border-emerald-500/g, 'border-amber-500');
appJs = appJs.replace(/bg-emerald-200/g, 'bg-amber-500/20');
appJs = appJs.replace(/text-emerald-800/g, 'text-amber-400');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', appJs);

console.log("Applied UI updates!");
