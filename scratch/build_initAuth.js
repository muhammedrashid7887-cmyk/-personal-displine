const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const lines = code.split('\\n');
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('function initAuth() {')) {
        startIdx = i;
    }
    if (lines[i].startsWith('async function saveGlobalState() {')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const newInitAuthLines = \`
function initAuth() {
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const authForm = document.getElementById('auth-form');
    const nameInput = document.getElementById('auth-name');
    const passInput = document.getElementById('auth-pass');
    const logoutBtn = document.getElementById('logout-btn');
    const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authPromptText = document.getElementById('auth-prompt-text');
    const errorBox = document.getElementById('auth-error-box');
    const errorText = document.getElementById('auth-error-text');

    let isLoginMode = true;

    if (useLocalStorageFallback) {
        const session = localStorage.getItem('disciplineSession');
        if (session) {
            currentUser = { uid: session };
            showDashboard();
        }
    } else if (typeof auth !== 'undefined' && auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                showDashboard();
            } else {
                currentUser = null;
                document.getElementById('auth-view').classList.remove('hidden');
                document.getElementById('dashboard-view').classList.add('hidden');
            }
        });
    }

    if (toggleAuthModeBtn) {
        toggleAuthModeBtn.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            if(authTitle) authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
            if(authSubmitBtn) authSubmitBtn.innerHTML = isLoginMode 
                ? '<span class="relative z-10 flex items-center justify-center gap-2">Unlock Vault <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i></span>' 
                : '<span class="relative z-10 flex items-center justify-center gap-2">Sign Up <i class="ph-bold ph-user-plus group-hover:scale-110 transition-transform"></i></span>';
            if(authPromptText) authPromptText.textContent = isLoginMode ? "New to Displine Memoranda?" : "Already have an account?";
            if(toggleAuthModeBtn) toggleAuthModeBtn.textContent = isLoginMode ? "Create New Account" : "Sign In Here";
            if(errorBox) errorBox.classList.add('hidden');
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const rawName = nameInput.value.trim();
            const password = passInput.value;
            if(errorBox) errorBox.classList.add('hidden');
            
            let email = rawName;
            if (!email.includes('@')) {
                email = rawName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@displine.local';
            }

            if (useLocalStorageFallback) {
                localStorage.setItem('disciplineSession', email);
                currentUser = { uid: email };
                nameInput.value = ''; passInput.value = '';
                showDashboard();
                return;
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
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (useLocalStorageFallback) {
                localStorage.removeItem('disciplineSession');
                location.reload();
            } else if (typeof auth !== 'undefined' && auth) {
                auth.signOut().then(() => location.reload());
            }
        });
    }
}
\`.trim().split('\\n');

    // Replace lines from startIdx to endIdx - 1
    const newCodeLines = [
        ...lines.slice(0, startIdx),
        ...newInitAuthLines,
        '',
        ...lines.slice(endIdx)
    ];

    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', newCodeLines.join('\\n'));
    console.log("Successfully rebuilt initAuth using line indices!");
} else {
    console.log("Failed to find start or end bounds.");
}
