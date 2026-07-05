const fs = require('fs');

// --- 1. UPDATE HTML ---
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// Add the auth error box above the submit button
const errorBoxUI = `
                <div id="auth-error-box" class="hidden w-full bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center mt-4 backdrop-blur-md">
                    <span id="auth-error-text" class="text-xs font-bold text-rose-500">Invalid credentials</span>
                </div>
                <button type="submit"
`;
html = html.replace(/<button type="submit"/, errorBoxUI);
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);


// --- 2. UPDATE APP.JS ---
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// Remove useLocalStorageFallback variable
code = code.replace(/let useLocalStorageFallback = true;\n/, '');

// Remove useLocalStorageFallback from Firebase init
code = code.replace(/} catch \(e\) {\n    console\.error\("Firebase init error\. Falling back to local storage\.", e\);\n}/, `} catch (e) {\n    console.error("Firebase init error.", e);\n}`);

// Refactor initAuth
const newInitAuth = `
function initAuth() {
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
    const authPromptText = document.getElementById('auth-prompt-text');
    const nameInput = document.getElementById('auth-name');
    const passInput = document.getElementById('auth-pass');
    const logoutBtn = document.getElementById('logout-btn');
    const errorBox = document.getElementById('auth-error-box');
    const errorText = document.getElementById('auth-error-text');

    let isLoginMode = true;

    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                showDashboard();
            } else {
                currentUser = null;
                // Force user to login screen
                document.getElementById('auth-view').classList.remove('hidden');
                document.getElementById('dashboard-view').classList.add('hidden');
            }
        });
    }

    toggleAuthModeBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
        authSubmitBtn.innerHTML = isLoginMode 
            ? \`<span class="relative z-10 flex items-center justify-center gap-2">Unlock Vault <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i></span>\` 
            : \`<span class="relative z-10 flex items-center justify-center gap-2">Sign Up <i class="ph-bold ph-user-plus group-hover:scale-110 transition-transform"></i></span>\`;
        authPromptText.textContent = isLoginMode ? "New to Displine Memoranda?" : "Already have an account?";
        toggleAuthModeBtn.textContent = isLoginMode ? "Create New Account" : "Sign In Here";
        if(errorBox) errorBox.classList.add('hidden');
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawName = nameInput.value.trim();
        const password = passInput.value;
        if(errorBox) errorBox.classList.add('hidden');
        
        let email = rawName;
        if (!email.includes('@')) {
            email = rawName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@displine.local';
        }

        try {
            if (!isLoginMode) {
                await auth.createUserWithEmailAndPassword(email, password);
                nameInput.value = ''; passInput.value = '';
            } else {
                await auth.signInWithEmailAndPassword(email, password);
                nameInput.value = ''; passInput.value = '';
            }
        } catch (error) {
            console.error("Auth Error:", error);
            if(errorBox && errorText) {
                errorBox.classList.remove('hidden');
                errorText.textContent = error.message;
            } else {
                alert(error.message);
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => location.reload());
    });
}
`;
code = code.replace(/function initAuth\(\) \{[\s\S]*?async function saveGlobalState\(\) \{/, newInitAuth + "\nasync function saveGlobalState() {\n");


// Refactor saveGlobalState and loadData to remove local storage
const newSaveLoad = `
async function saveGlobalState() {
    if (currentUser) {
        try {
            await db.collection('users').doc(currentUser.uid).collection('global').doc('data').set(globalState, { merge: true });
        } catch (e) { console.error("Error saving global state", e); }
    }
}

async function loadData() {
    if (currentUser) {
        try {
            const doc = await db.collection('users').doc(currentUser.uid).collection('global').doc('data').get();
            if (doc.exists) {
                globalState = { ...defaultGlobalState, ...doc.data() };
            }
        } catch (e) { console.error("Error loading global state", e); }
    }
}
`;
code = code.replace(/async function saveGlobalState\(\) \{[\s\S]*?async function changeDate\(dateStr\) \{/, newSaveLoad + "\nasync function changeDate(dateStr) {\n");

// Refactor changeDate to remove local storage daily fetching
const newChangeDateContent = `
    selectedDate = dateStr;
    const dSavedObj = await db.collection('users').doc(currentUser.uid).collection('daily').doc(dateStr).get();
    
    if (dSavedObj.exists) {
        dailyState = { ...defaultDailyState, ...dSavedObj.data() };
    } else {
        dailyState = JSON.parse(JSON.stringify(defaultDailyState));
    }
    initDashboard();
`;
code = code.replace(/selectedDate = dateStr;\n[\s\S]*?initDashboard\(\);/, newChangeDateContent);


// Refactor commitDailyProgress to remove local storage
const newCommitDaily = `
async function commitDailyProgress() {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).collection('daily').doc(selectedDate).set(dailyState, { merge: true });
        
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
code = code.replace(/async function commitDailyProgress\(\) \{[\s\S]*?\} catch \(e\)/, newCommitDaily.replace(/\} catch \(e\)/, '} catch (e)'));

// Fix Reflection (Journal)
code = code.replace(/dailyState\.journal = input\.value;\n\s+journalStatus\.textContent = 'Saved at ' \+ new Date\(\)\.toLocaleTimeString\(\);/, "dailyState.journal = input.value;\n            commitDailyProgress().then(() => {\n                journalStatus.textContent = 'Saved at ' + new Date().toLocaleTimeString();\n            });");

// Fix Todos
code = code.replace(/window\.toggleTodo = \(index\) \=\> \{\n\s+globalState\.todos\[index\]\.done = !globalState\.todos\[index\]\.done;\n\s+renderTodos\(\);\n\s+\};/, "window.toggleTodo = (index) => {\n        globalState.todos[index].done = !globalState.todos[index].done;\n        saveGlobalState();\n        renderTodos();\n    };");
code = code.replace(/window\.removeTodo = \(index\) \=\> \{\n\s+globalState\.todos\.splice\(index, 1\);\n\s+renderTodos\(\);\n\s+\};/, "window.removeTodo = (index) => {\n        globalState.todos.splice(index, 1);\n        saveGlobalState();\n        renderTodos();\n    };");
code = code.replace(/globalState\.todos\.push\(\{ text, done: false \}\);\n\s+input\.value = '';\n\s+renderTodos\(\);/, "globalState.todos.push({ text, done: false });\n            input.value = '';\n            saveGlobalState();\n            renderTodos();");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
