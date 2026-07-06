const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Add saveGlobalState() to toggleLedger and removeLedger
code = code.replace(
    'window.toggleLedger = (index) => {\n    globalState.ledger[index].settled = !globalState.ledger[index].settled;\n     renderLedger();\n};',
    'window.toggleLedger = (index) => {\n    globalState.ledger[index].settled = !globalState.ledger[index].settled;\n    renderLedger();\n    saveGlobalState();\n};'
);

code = code.replace(
    'window.removeLedger = (index) => {\n    globalState.ledger.splice(index, 1);\n     renderLedger();\n};',
    'window.removeLedger = (index) => {\n    globalState.ledger.splice(index, 1);\n    renderLedger();\n    saveGlobalState();\n};'
);

// 2. Add Ledger Initialization Logic into initFinance()
const ledgerLogic = `
    // Ledger Logic
    const lName = document.getElementById('ledger-name');
    const lAmt = document.getElementById('ledger-amount');
    const lPayBtn = document.getElementById('add-payable');
    const lRecBtn = document.getElementById('add-receivable');

    const addLedgerEntry = (type) => {
        if(!lName || !lAmt) return;
        const name = lName.value.trim();
        const amt = parseFloat(lAmt.value);
        if(name && !isNaN(amt) && amt > 0) {
            globalState.ledger.push({
                name,
                amount: amt,
                type: type, // 'payable' or 'receivable'
                settled: false,
                date: new Date().toLocaleDateString('en-US')
            });
            lName.value = '';
            lAmt.value = '';
            renderLedger();
            saveGlobalState();
        }
    };

    if (lPayBtn) lPayBtn.onclick = () => addLedgerEntry('payable');
    if (lRecBtn) lRecBtn.onclick = () => addLedgerEntry('receivable');

    const handleLedgerEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addLedgerEntry('payable');
        }
    };
    if (lName) lName.onkeypress = handleLedgerEnter;
    if (lAmt) lAmt.onkeypress = handleLedgerEnter;
    
    // Original update routines...
    updateFinanceDisplay();`;

code = code.replace('    updateFinanceDisplay();', ledgerLogic);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Ledger logic successfully added!");
