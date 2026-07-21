const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// 1. Remove Authentication View completely
html = html.replace(/<!-- Authentication View -->[\s\S]*?<!-- Dashboard View -->/, '<!-- Dashboard View -->');

// 2. Remove 'hidden' from dashboard-view
html = html.replace(/<div id="dashboard-view" class="hidden flex-1/, '<div id="dashboard-view" class="flex-1');

// 3. Remove Logout button
html = html.replace(/<button id="logout-btn"[\s\S]*?<\/button>/, '');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
console.log("Auth UI fully removed from HTML.");

let js = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');
// Remove any left over document.getElementById('auth-view').classList.add('hidden');
// since the div doesn't exist anymore, it might throw an error if not checked, but app.js has it.
js = js.replace(/document\.getElementById\('auth-view'\)\.classList\.add\('hidden'\);/g, '');
js = js.replace(/document\.getElementById\('dashboard-view'\)\.classList\.remove\('hidden'\);/g, '');
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', js);
console.log("Auth UI references removed from JS.");
