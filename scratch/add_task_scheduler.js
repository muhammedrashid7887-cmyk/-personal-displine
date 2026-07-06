const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

const oldTodoInput = `<div class="flex gap-3 mb-5">
                        <input type="text" id="todo-input" placeholder="What needs to be done?" class="flex-1 bg-[#111827] border border-white shadow-inner rounded-xl px-4 py-3 sm:py-4 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none">
                        <button id="add-todo" class="bg-sky-500 hover:bg-sky-600 text-white w-12 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-sky-500/20"><i class="ph-bold ph-plus"></i></button>
                    </div>`;

const newTodoInput = `<div class="flex flex-col gap-3 mb-5">
                        <input type="text" id="taskName" placeholder="Enter Task Name" class="w-full p-3 bg-[#111827] text-white rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner text-sm font-bold">
                        <div class="flex gap-3">
                            <input type="date" id="taskDate" class="w-1/2 p-3 bg-[#111827] text-gray-400 rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-bold shadow-inner uppercase">
                            <input type="time" id="taskTime" class="w-1/2 p-3 bg-[#111827] text-gray-400 rounded-xl border border-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-bold shadow-inner uppercase">
                        </div>
                        <button onclick="scheduleTask()" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 px-4 rounded-xl transition-colors shadow-md shadow-sky-500/20 uppercase tracking-widest text-sm">
                            SCHEDULE TASK
                        </button>
                    </div>`;

html = html.replace(oldTodoInput, newTodoInput);
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);


// 2. Update app.js
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const oldInitTodos = `function initTodos() {
    const list = document.getElementById('todo-list');
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo');

    if (!list || !input) return;

    const renderTodos = () => {
        list.innerHTML = '';
        globalState.todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/80 shadow-sm';
            li.innerHTML = \`
                <input type="checkbox" class="w-5 h-5 accent-sky-500 rounded cursor-pointer shadow-sm" \${todo.done ? 'checked' : ''} onchange="window.toggleTodo(\${index})">
                <span class="flex-1 text-sm font-bold text-gray-700 \${todo.done ? 'line-through text-gray-600' : ''}">\${todo.text}</span>
                <button onclick="window.removeTodo(\${index})" class="text-gray-600 hover:text-rose-500 transition-colors"><i class="ph-fill ph-trash text-lg"></i></button>
            \`;
            list.appendChild(li);
        });
    };

    window.toggleTodo = (index) => {
        globalState.todos[index].done = !globalState.todos[index].done;
        saveGlobalState();
        renderTodos();
        updateRoutineProgress();
    };

    window.removeTodo = (index) => {
        globalState.todos.splice(index, 1);
        saveGlobalState();
        renderTodos();
        updateRoutineProgress();
    };

    const addTodo = () => {
        const text = input.value.trim();
        if (text) {
            globalState.todos.push({ text, done: false });
            input.value = '';
            saveGlobalState();
            renderTodos();
            updateRoutineProgress();
        }
    };

    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    newAddBtn.addEventListener('click', addTodo);
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodo();
        }
    };

    renderTodos();
}`;

const newInitTodos = `window.renderTodos = function() {
    const list = document.getElementById('todo-list');
    if (!list) return;
    list.innerHTML = '';
    
    // Sort array based on timestamp (earliest first) for tasks with dates
    globalState.todos.sort((a, b) => {
        if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
        if (a.timestamp) return -1;
        if (b.timestamp) return 1;
        return 0;
    });

    globalState.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/80 shadow-sm';
        li.innerHTML = \`
            <input type="checkbox" class="w-5 h-5 accent-sky-500 rounded cursor-pointer shadow-sm" \${todo.done ? 'checked' : ''} onchange="window.toggleTodo(\${index})">
            <div class="flex-1 flex flex-col">
                <span class="text-sm font-bold text-gray-700 \${todo.done ? 'line-through text-gray-600' : ''}">\${todo.text}</span>
                \${todo.date ? \`<span class="text-[10px] text-gray-500 font-bold">\${todo.date} \${todo.time ? 'at ' + todo.time : ''}</span>\` : ''}
            </div>
            <button onclick="window.removeTodo(\${index})" class="text-gray-600 hover:text-rose-500 transition-colors"><i class="ph-fill ph-trash text-lg"></i></button>
        \`;
        list.appendChild(li);
    });
};

window.toggleTodo = (index) => {
    globalState.todos[index].done = !globalState.todos[index].done;
    saveGlobalState();
    window.renderTodos();
    updateRoutineProgress();
};

window.removeTodo = (index) => {
    globalState.todos.splice(index, 1);
    saveGlobalState();
    window.renderTodos();
    updateRoutineProgress();
};

window.scheduleTask = function() {
    const title = document.getElementById('taskName').value;
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;

    if (!title || !date || !time) {
        alert("Dayavayi Task Name, Date, Time enniva purippikkuka!");
        return;
    }

    const dateTimeString = \`\${date}T\${time}\`;
    const taskTimestamp = new Date(dateTimeString).getTime(); 

    const newTask = {
        id: Date.now(),
        text: title,
        date: date,
        time: time,
        timestamp: taskTimestamp,
        done: false
    };

    globalState.todos.push(newTask);
    
    document.getElementById('taskName').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';

    saveGlobalState();
    window.renderTodos();
    updateRoutineProgress();
};

function initTodos() {
    window.renderTodos();
}`;

// I'll manually slice if the exact replace fails due to minor differences
const startIdx = code.indexOf('function initTodos() {');
const endIdx = code.indexOf('function initJournal() {');
if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newInitTodos + '\\n\\n' + code.substring(endIdx);
    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
    console.log("Task scheduling successfully added to app.js");
} else {
    console.log("Could not find initTodos or initJournal in app.js");
}
