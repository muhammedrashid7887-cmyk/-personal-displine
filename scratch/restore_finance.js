const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const missingInitFinance = `
function initFinance() {
    renderSavingsVault();
    
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
    
    updateFinanceDisplay();
    renderTransactions();
    renderLedger();
}

`;

// Insert it right before updateFinanceDisplay
code = code.replace(/function updateFinanceDisplay\(\) \{/, missingInitFinance + "function updateFinanceDisplay() {");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
