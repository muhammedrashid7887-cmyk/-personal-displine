const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf-8');
code = code.split('\\\\`').join('`');
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
