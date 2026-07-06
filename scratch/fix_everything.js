const fs = require('fs');

// 1. Fix index.html
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// Find the Savings Vault section and remove it
const svStart = html.indexOf('<!-- Savings Vault -->');
const dbStart = html.indexOf('<!-- Debt Ledger -->');
if (svStart !== -1 && dbStart !== -1) {
    html = html.substring(0, svStart) + html.substring(dbStart);
    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
    console.log("Removed Savings Vault from index.html");
} else {
    console.log("Could not find Savings Vault bounds in index.html");
}

// 2. Fix app.js
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// The new clean initFinance
const cleanInitFinance = `
function initFinance() {
    const addIncBtn = document.getElementById('add-income');
    const addExpBtn = document.getElementById('add-expense');
    const amtInput = document.getElementById('tx-amount');
    const descInput = document.getElementById('tx-desc');

    const addTransaction = (type) => {
        if(!amtInput || !descInput) return;
        const amount = parseFloat(amtInput.value);
        const desc = descInput.value.trim() || (type === 'income' ? 'Income' : 'Expense');
        if (!isNaN(amount) && amount > 0) {
            dailyState.finances.transactions.push({
                id: Date.now(),
                type,
                amount,
                desc,
                date: new Date().toLocaleDateString('en-US')
            });
            amtInput.value = '';
            descInput.value = '';
            updateFinanceDisplay();
            renderTransactions();
            commitDailyProgress();
        }
    };

    if (addIncBtn) {
        const newAddInc = addIncBtn.cloneNode(true);
        addIncBtn.parentNode.replaceChild(newAddInc, addIncBtn);
        newAddInc.addEventListener('click', () => addTransaction('income'));
    }
    
    if (addExpBtn) {
        const newAddExp = addExpBtn.cloneNode(true);
        addExpBtn.parentNode.replaceChild(newAddExp, addExpBtn);
        newAddExp.addEventListener('click', () => addTransaction('expense'));
    }

    const handleTxEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTransaction('expense');
        }
    };
    if (amtInput) amtInput.onkeypress = handleTxEnter;
    if (descInput) descInput.onkeypress = handleTxEnter;

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
    
    updateFinanceDisplay();
    renderTransactions();
    renderLedger();
}

function updateFinanceDisplay`;

// I will find where the old initFinance starts and where updateFinanceDisplay starts, and replace everything in between!
const initFinanceStart = code.indexOf('function initFinance() {');
const updateFinanceDisplayStart = code.indexOf('function updateFinanceDisplay() {');

if (initFinanceStart !== -1 && updateFinanceDisplayStart !== -1) {
    code = code.substring(0, initFinanceStart) + cleanInitFinance + code.substring(updateFinanceDisplayStart + 29);
    // Note: "+ 29" removes "function updateFinanceDisplay" so we don't duplicate it. 
    // Actually, I put "function updateFinanceDisplay" at the end of cleanInitFinance so I just need to match it!
    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
    console.log("Successfully rebuilt initFinance in app.js");
} else {
    console.log("Could not find bounds in app.js");
}
