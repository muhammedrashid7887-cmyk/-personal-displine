const fs = require('fs');

// --- 1. Modify HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

const oldToggleSection = `            <div class="mt-8 pt-6 border-t border-gray-200/50">
                <p class="text-center text-xs font-bold text-gray-500 mb-4">
                    <span id="auth-prompt-text">New to Displine Memoranda?</span> 
                </p>
                <button id="toggle-auth-mode" class="w-full bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-black py-3.5 rounded-xl shadow-sm border border-emerald-100/50 transition-all focus:outline-none uppercase tracking-widest text-[10px]">Create New Account</button>
            </div>`;

html = html.replace(oldToggleSection, '');
html = html.replace(/<span id="auth-error-text"[\s\S]*?<\/span>/, '<span id="auth-error-text" class="text-xs font-bold text-rose-500"></span>');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);


// --- 2. Modify app.js ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// Completely replace initAuth with a simple, frictionless bypass
const simpleInitAuth = `
function initAuth() {
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const authForm = document.getElementById('auth-form');
    const nameInput = document.getElementById('auth-name');
    const passInput = document.getElementById('auth-pass');
    const logoutBtn = document.getElementById('logout-btn');

    // Auto-login if session exists
    const session = localStorage.getItem('disciplineSession');
    if (session) {
        currentUser = { uid: session };
        showDashboard();
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawName = nameInput.value.trim() || 'Guest';
            
            // ANY name and password lets them in instantly.
            localStorage.setItem('disciplineSession', rawName);
            currentUser = { uid: rawName };
            
            nameInput.value = ''; 
            passInput.value = '';
            
            showDashboard();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('disciplineSession');
            location.reload();
        });
    }
}
`;

code = code.replace(/function initAuth\(\) \{[\s\S]*?logoutBtn\.addEventListener\('click'[\s\S]*?\}\);\n\s+\}/, simpleInitAuth.replace(/function initAuth\(\) \{\n/, 'function initAuth() {\n').replace(/\}\n$/, '}'));

// Also force loadData and saveGlobalState to ONLY use local storage to avoid firebase errors interrupting the simple experience
const simpleSaveLoad = `
async function saveGlobalState() {
    if (!currentUser) return;
    localStorage.setItem(\`disciplineGlobal_\${currentUser.uid}\`, JSON.stringify(globalState));
}

async function loadData() {
    if (!currentUser) return;
    const gSaved = localStorage.getItem(\`disciplineGlobal_\${currentUser.uid}\`);
    if (gSaved) {
        let parsed = {};
        try {
            parsed = JSON.parse(gSaved);
            if (typeof parsed !== 'object' || parsed === null) parsed = {};
        } catch(e) {}
        globalState = { ...defaultGlobalState, ...parsed };
    } else {
        globalState = JSON.parse(JSON.stringify(defaultGlobalState));
    }
}
`;
code = code.replace(/async function saveGlobalState\(\) \{[\s\S]*?async function changeDate\(dateStr\) \{/, simpleSaveLoad + "\nasync function changeDate(dateStr) {\n");

// Force changeDate and commitDailyProgress to local storage
const simpleDaily = `
async function changeDate(dateStr) {
    selectedDate = dateStr;
    const dSaved = localStorage.getItem(\`disciplineDaily_\${currentUser.uid}_\${dateStr}\`);
    if (dSaved) {
        let parsed = {};
        try {
            parsed = JSON.parse(dSaved);
            if (typeof parsed !== 'object' || parsed === null) parsed = {};
        } catch(e) {}
        dailyState = { ...defaultDailyState, ...parsed, spiritual: { ...defaultDailyState.spiritual, ...parsed.spiritual } };
    } else {
        dailyState = JSON.parse(JSON.stringify(defaultDailyState));
    }
    initDashboard();
}

async function commitDailyProgress() {
    if (!currentUser) return;
    try {
        localStorage.setItem(\`disciplineDaily_\${currentUser.uid}_\${selectedDate}\`, JSON.stringify(dailyState));
        
        const rate = calculateCompletionRate();
        const hIdx = globalState.history.findIndex(h => h.date === selectedDate);
        if (hIdx >= 0) {
            globalState.history[hIdx].rate = rate;
        } else {
            globalState.history.push({ date: selectedDate, rate });
        }
        
        await saveGlobalState();
        
        const btn = document.getElementById('save-progress-btn');
        if(btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = \`<span><i class="ph-bold ph-check"></i> Saved!</span>\`;
            btn.classList.add('bg-emerald-200', 'text-emerald-800');
            setTimeout(() => { 
                btn.innerHTML = orig; 
                btn.classList.remove('bg-emerald-200', 'text-emerald-800');
            }, 2000);
        }
    } catch (e) { console.error("Error saving daily progress", e); }
}
`;
code = code.replace(/async function changeDate\(dateStr\) \{[\s\S]*?\} catch \(e\) \{ console\.error\("Error saving daily progress", e\); \}\n\}/, simpleDaily.trim());

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
