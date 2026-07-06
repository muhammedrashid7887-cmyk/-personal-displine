const fs = require('fs');

// 1. UPDATE index.html (Add Total Bank Balance UI)
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

const bankBalanceHtml = `
                    <!-- Total Bank Balance -->
                    <div class="bg-[#111827] p-5 rounded-2xl border border-gray-100 shadow-sm mb-4">
                        <h3 class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Total Bank Balance</h3>
                        <div class="text-2xl sm:text-3xl font-black text-white" id="total-bank-balance">₹0</div>
                    </div>
                    
                    <!-- Add Transaction Inline Form -->
`;

html = html.replace('<!-- Add Transaction Inline Form -->', bankBalanceHtml);
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
console.log("Added Total Bank Balance to index.html");

// 2. UPDATE app.js
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 2.1 Qada Persistence Logic in setPrayerState
code = code.replace(
    'window.setPrayerState = (key, status) => {\n    // If setting to Qada, push to ledger\n    dailyState.spiritual[key] = status;',
    `window.setPrayerState = (key, status) => {
    const oldStatus = dailyState.spiritual[key];
    dailyState.spiritual[key] = status;
    
    if (status === 'qada' && oldStatus !== 'qada') {
        globalState.qadaVault.push({
            name: key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()),
            date: selectedDate,
            completed: false
        });
        saveGlobalState();
    }
    commitDailyProgress();`
);

// 2.2 Global Bank Balance & Date-Specific Transactions (addTransaction)
const oldAddTx = `    const addTransaction = (type) => {
        if(!amtInput || !descInput) return;
        const amount = parseFloat(amtInput.value);
        const desc = descInput.value.trim() || (type === 'income' ? 'Income' : 'Expense');
        if (!isNaN(amount) && amount > 0) {
            dailyState.finances.transactions.push({
                id: Date.now(),
                type,
                amount,
                desc,
                date: getTodayDate()
            });
            amtInput.value = '';
            descInput.value = '';
            updateFinanceDisplay();
            renderTransactions();
            commitDailyProgress();
        }
    };`;

const newAddTx = `    const addTransaction = (type) => {
        if(!amtInput || !descInput) return;
        const amount = parseFloat(amtInput.value);
        const desc = descInput.value.trim() || (type === 'income' ? 'Income' : 'Expense');
        if (!isNaN(amount) && amount > 0) {
            dailyState.finances.transactions.push({
                id: Date.now(),
                type,
                amount,
                desc,
                date: selectedDate
            });
            
            globalState.bankBalance = (globalState.bankBalance || 0) + (type === 'income' ? amount : -amount);
            saveGlobalState();
            
            amtInput.value = '';
            descInput.value = '';
            updateFinanceDisplay();
            renderTransactions();
            commitDailyProgress();
        }
    };`;
code = code.replace(oldAddTx, newAddTx);

// 2.3 removeTransaction adjustment for Bank Balance
const oldRemoveTx = `window.removeTransaction = (id) => {
    dailyState.finances.transactions = dailyState.finances.transactions.filter(t => t.id !== id);
    
    updateFinanceDisplay();
    renderTransactions();
};`;
const newRemoveTx = `window.removeTransaction = (id) => {
    const tx = dailyState.finances.transactions.find(t => t.id === id);
    if(tx) {
        globalState.bankBalance = (globalState.bankBalance || 0) + (tx.type === 'income' ? -tx.amount : tx.amount);
        saveGlobalState();
    }
    dailyState.finances.transactions = dailyState.finances.transactions.filter(t => t.id !== id);
    
    updateFinanceDisplay();
    renderTransactions();
    commitDailyProgress();
};`;
code = code.replace(oldRemoveTx, newRemoveTx);

// 2.4 updateFinanceDisplay for Bank Balance UI
const oldUpdateFin = `function updateFinanceDisplay() {
    const today = getTodayDate();
    let income = 0;
    let expense = 0;`;
const newUpdateFin = `function updateFinanceDisplay() {
    const bbEl = document.getElementById('total-bank-balance');
    if (bbEl) bbEl.textContent = '₹' + (globalState.bankBalance || 0).toLocaleString('en-IN', {minimumFractionDigits:2});

    const today = selectedDate; // Ensure we display data for selected date
    let income = 0;
    let expense = 0;`;
code = code.replace(oldUpdateFin, newUpdateFin);

// 2.5 renderTransactions UI adjustment to show date
const oldRenderTxHtml = `<span class="text-xs font-bold text-gray-800">\${t.desc}</span>`;
const newRenderTxHtml = `<span class="text-xs font-bold text-gray-800">\${t.desc}</span>\n                  <span class="text-[9px] font-bold text-gray-500 tracking-wider uppercase">\${t.date}</span>`;
code = code.replace(oldRenderTxHtml, newRenderTxHtml);

// Fix date comparison in renderTransactions
code = code.replace(`const todayTxs = dailyState.finances.transactions.filter(t => t.date === today);`, `const todayTxs = dailyState.finances.transactions.filter(t => t.date === selectedDate);`);
code = code.replace(`const today = getTodayDate();\n    const todayTxs`, `// const today = getTodayDate();\n    const todayTxs`);


fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Successfully implemented Bug Fixes in app.js");
