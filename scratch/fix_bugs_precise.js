const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Fix updateFinanceDisplay filter
const oldFinanceDisplay = `function updateFinanceDisplay() {
    const today = new Date().toLocaleDateString('en-US');
    let income = 0;
    let expense = 0;

    dailyState.finances.transactions.forEach(t => {
        if (t.date === today) {
            if (t.type === 'income') income += t.amount;
            else if (t.type === 'expense') expense += t.amount;
        }
    });`;

const newFinanceDisplay = `function updateFinanceDisplay() {
    let income = 0;
    let expense = 0;

    dailyState.finances.transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expense += t.amount;
    });`;
code = code.replace(oldFinanceDisplay, newFinanceDisplay);


// 2. Fix renderTransactions filter
const oldRenderTxs = `function renderTransactions() {
    const container = document.getElementById('transaction-list');
    const emptyMsg = document.getElementById('empty-transactions');
    if (!container) return;

    const today = new Date().toLocaleDateString('en-US');
    const todayTxs = dailyState.finances.transactions.filter(t => t.date === today);`;

const newRenderTxs = `function renderTransactions() {
    const container = document.getElementById('transaction-list');
    const emptyMsg = document.getElementById('empty-transactions');
    if (!container) return;

    const todayTxs = dailyState.finances.transactions;`;
code = code.replace(oldRenderTxs, newRenderTxs);


// 3. Fix addTransaction saving
const oldAddTx = `            dailyState.finances.transactions.push({
                id: Date.now(),
                type,
                amount,
                desc,
                date: new Date().toLocaleDateString('en-US')
            });
            amtInput.value = '';
            descInput.value = '';
            updateFinanceDisplay();
            renderTransactions();`;

const newAddTx = `            dailyState.finances.transactions.push({
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
            commitDailyProgress();`;
code = code.replace(oldAddTx, newAddTx);


// 4. Fix addTodo saving
const oldAddTodo = `    const addTodo = () => {
        const text = input.value.trim();
        if(text) {
            globalState.todos.push({ text, done: false });
            input.value = '';
             renderTodos();
        }
    };`;

const newAddTodo = `    const addTodo = () => {
        const text = input.value.trim();
        if(text) {
            globalState.todos.push({ text, done: false });
            input.value = '';
            saveGlobalState();
            renderTodos();
        }
    };`;
code = code.replace(oldAddTodo, newAddTodo);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
