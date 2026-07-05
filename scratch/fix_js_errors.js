const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Define renderSavingsVault before initFinance
const renderSavingsVaultCode = `
function renderSavingsVault() {
    const curEl = document.getElementById('savings-current');
    const goalEl = document.getElementById('savings-goal');
    const barEl = document.getElementById('savings-bar');
    
    if(!curEl || !goalEl || !barEl) return;
    
    const current = globalState.savings.current || 0;
    const goal = globalState.savings.goal || 100000;
    
    curEl.textContent = '₹' + current.toLocaleString('en-IN');
    goalEl.textContent = '₹' + goal.toLocaleString('en-IN');
    
    const pct = Math.min(100, Math.max(0, (current / goal) * 100));
    barEl.style.width = pct + '%';
}

function initFinance() {
`;

code = code.replace('function initFinance() {', renderSavingsVaultCode);

// 2. Add enter key listener and savings initialization logic
const initFinanceStart = `    renderSavingsVault();
    
    // Savings Logic
    const setGoalBtn = document.getElementById('edit-savings-goal');
    if (setGoalBtn) {
        setGoalBtn.onclick = () => {
            const newGoal = prompt('Enter new savings goal:');
            if (newGoal && !isNaN(newGoal)) {
                globalState.savings.goal = parseFloat(newGoal);
                renderSavingsVault();
                saveGlobalState();
            }
        };
    }
    
    const svAmtInput = document.getElementById('savings-input');
    const svAddBtn = document.getElementById('add-savings');
    
    const addSavings = () => {
        if(!svAmtInput) return;
        const amt = parseFloat(svAmtInput.value);
        if(!isNaN(amt) && amt > 0) {
            globalState.savings.current += amt;
            svAmtInput.value = '';
            renderSavingsVault();
            saveGlobalState();
        }
    };
    if (svAddBtn) svAddBtn.onclick = addSavings;
    if (svAmtInput) {
        svAmtInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSavings();
            }
        };
    }
`;

code = code.replace('    renderSavingsVault();', initFinanceStart);

// 3. Add enter key listeners for Add Transaction
const handleTxEnterCode = `    const addTransaction = (type) => {
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

    const handleTxEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTransaction('expense');
        }
    };
    if (amtInput) amtInput.onkeypress = handleTxEnter;
    if (descInput) descInput.onkeypress = handleTxEnter;
`;

code = code.replace(/    const addTransaction = \(type\) => \{[\s\S]*?commitDailyProgress\(\);\n        \}\n    \};/, handleTxEnterCode);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Fixed JS errors and added Enter key functionality!");
