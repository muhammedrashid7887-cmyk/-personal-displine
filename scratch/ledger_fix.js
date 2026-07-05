const fs = require('fs');

let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

code = code.replace(/window\.toggleLedger = \(index\) \=\> \{\n\s+globalState\.ledger\[index\]\.settled = !globalState\.ledger\[index\]\.settled;\n\s+renderLedger\(\);\n\};/, "window.toggleLedger = (index) => {\n    globalState.ledger[index].settled = !globalState.ledger[index].settled;\n    saveGlobalState();\n    renderLedger();\n};");

code = code.replace(/window\.removeLedger = \(index\) \=\> \{\n\s+globalState\.ledger\.splice\(index, 1\);\n\s+renderLedger\(\);\n\};/, "window.removeLedger = (index) => {\n    globalState.ledger.splice(index, 1);\n    saveGlobalState();\n    renderLedger();\n};");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
