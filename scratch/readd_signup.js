const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// Inject the Create Account toggle button back into index.html if it's missing
if (!html.includes('id="toggle-auth-mode"')) {
    const toggleHTML = `
            <div class="mt-8 pt-6 border-t border-gray-200/50">
                <p class="text-center text-xs font-bold text-gray-500 mb-4">
                    <span id="auth-prompt-text">New to Displine Memoranda?</span> 
                </p>
                <button id="toggle-auth-mode" class="w-full bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-black py-3.5 rounded-xl shadow-sm border border-emerald-100/50 transition-all focus:outline-none uppercase tracking-widest text-[10px]">Create New Account</button>
            </div>
    `;
    html = html.replace(/<\/form>[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\n\s*<!-- Dashboard View -->/, `</form>\n${toggleHTML}\n        </div>\n    </div>\n</div>\n\n    <!-- Dashboard View -->`);
    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
}

let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// Rebuild initAuth to support the toggle, handle Firebase creation, and fallback to local storage
const newInitAuth = `
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

    // Auto-login if session exists
    if (useLocalStorageFallback) {
        const session = localStorage.getItem('disciplineSession');
        if (session) {
            currentUser = { uid: session };
            showDashboard();
        }
    } else if (auth) {
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
            if(authTitle) authTitle.textContent = isLoginMode ? 'Displine Memoranda' : 'Create Account';
            if(authSubmitBtn) authSubmitBtn.innerHTML = isLoginMode 
                ? \`<span class="relative z-10 flex items-center justify-center gap-2">Unlock Vault <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i></span>\` 
                : \`<span class="relative z-10 flex items-center justify-center gap-2">Sign Up <i class="ph-bold ph-user-plus group-hover:scale-110 transition-transform"></i></span>\`;
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
                    // Firebase onAuthStateChanged will handle the transition
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
            } else if (auth) {
                auth.signOut().then(() => location.reload());
            }
        });
    }
}
`;

code = code.replace(/function initAuth\(\) \{[\s\S]*?\}\n\}\n/, newInitAuth);
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
