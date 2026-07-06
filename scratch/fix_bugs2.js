const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 2.2 Global Bank Balance & Date-Specific Transactions (addTransaction)
code = code.replace(
    /const addTransaction = \(type\) => \{[\s\S]*?commitDailyProgress\(\);\s*\}\s*\};/,
    `const addTransaction = (type) => {
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
    };`
);

// 2.3 removeTransaction adjustment for Bank Balance
code = code.replace(
    /window\.removeTransaction = \(id\) => \{[\s\S]*?renderTransactions\(\);\s*\};/,
    `window.removeTransaction = (id) => {
    const tx = dailyState.finances.transactions.find(t => t.id === id);
    if(tx) {
        globalState.bankBalance = (globalState.bankBalance || 0) + (tx.type === 'income' ? -tx.amount : tx.amount);
        saveGlobalState();
    }
    dailyState.finances.transactions = dailyState.finances.transactions.filter(t => t.id !== id);
    
    updateFinanceDisplay();
    renderTransactions();
    commitDailyProgress();
};`
);

// 2.4 updateFinanceDisplay for Bank Balance UI
code = code.replace(
    /function updateFinanceDisplay\(\) \{\s*const today = getTodayDate\(\);\s*let income = 0;\s*let expense = 0;/,
    `function updateFinanceDisplay() {
    const bbEl = document.getElementById('total-bank-balance');
    if (bbEl) bbEl.textContent = '₹' + (globalState.bankBalance || 0).toLocaleString('en-IN', {minimumFractionDigits:2});

    const today = selectedDate;
    let income = 0;
    let expense = 0;`
);

// 2.5 renderTransactions UI adjustment to show date
code = code.replace(
    /<span class="text-xs font-bold text-gray-800">\$\{t\.desc\}<\/span>/,
    `<span class="text-xs font-bold text-gray-800">\${t.desc}</span>\n                <span class="text-[9px] font-bold text-gray-500 tracking-wider uppercase">\${t.date}</span>`
);

// Fix date comparison in renderTransactions
code = code.replace(
    /const today = getTodayDate\(\);\s*const todayTxs = dailyState\.finances\.transactions\.filter\(t => t\.date === today\);/,
    `const today = selectedDate;\n    const todayTxs = dailyState.finances.transactions.filter(t => t.date === selectedDate);`
);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Bug fixes applied correctly with flexible regex!");
