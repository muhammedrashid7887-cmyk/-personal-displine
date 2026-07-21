const fs = require('fs');

let js = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

js = js.replace(
    /function getLocalYYYYMMDD\(dateObj\)\s*\{\s*const y = dateObj\.getFullYear\(\);\s*const m = String\(dateObj\.getMonth\(\) \+ 1\)\.padStart\(2, '0'\);\s*return `\$\{y\}-\$\{m\}-\$\{d\}`;/,
    `function getLocalYYYYMMDD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return \`\${y}-\${m}-\${d}\`;`
);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', js);
console.log("Fixed missing 'd' in getLocalYYYYMMDD");
