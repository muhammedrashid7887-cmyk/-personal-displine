const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const dateHelpers = `
// 1. Getting today's date for transactions (DD/MM/YYYY)
function getFormattedDate(d) {
    return d.toLocaleDateString('en-GB');
}
function getTodayDate() {
    return getFormattedDate(new Date());
}

`;

if (!code.includes('function getTodayDate')) {
    code = dateHelpers + code;
}

code = code.replace(/new Date\(\)\.toLocaleDateString\('en-US'\)/g, "getTodayDate()");
code = code.replace(/today\.toLocaleDateString\('en-US'\)/g, "getTodayDate()");
code = code.replace(/new Date\(year, month, i\)\.toLocaleDateString\('en-US'\)/g, "getFormattedDate(new Date(year, month, i))");
code = code.replace(/d\.toLocaleDateString\('en-US'\)/g, "getFormattedDate(d)");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Date formatting updated!");
