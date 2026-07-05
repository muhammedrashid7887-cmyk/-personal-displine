const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const oldToggleText = `if(authSubmitBtn) authSubmitBtn.innerHTML = isLoginMode 
                ? '<span class="relative z-10 flex items-center justify-center gap-2">Unlock Vault <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i></span>' 
                : '<span class="relative z-10 flex items-center justify-center gap-2">Sign Up <i class="ph-bold ph-user-plus group-hover:scale-110 transition-transform"></i></span>';`;

const newToggleText = `if(authSubmitBtn) authSubmitBtn.innerHTML = isLoginMode 
                ? 'Sign In <i class="ph-bold ph-arrow-right text-xl"></i>' 
                : 'Sign Up <i class="ph-bold ph-user-plus text-xl"></i>';
            const authSubtitle = document.getElementById('auth-subtitle');
            if (authSubtitle) authSubtitle.style.display = isLoginMode ? 'block' : 'none';`;

code = code.replace(oldToggleText, newToggleText);

const oldTitleText = `if(authTitle) authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';`;
const newTitleText = `if(authTitle) authTitle.textContent = isLoginMode ? 'Sign In' : 'Sign Up';`;
code = code.replace(oldTitleText, newTitleText);

const oldPromptText = `if(authPromptText) authPromptText.textContent = isLoginMode ? "New to Displine Memoranda?" : "Already have an account?";
            if(toggleAuthModeBtn) toggleAuthModeBtn.textContent = isLoginMode ? "Create New Account" : "Sign In Here";`;
const newPromptText = `if(authPromptText) authPromptText.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
            if(toggleAuthModeBtn) toggleAuthModeBtn.textContent = isLoginMode ? "Create New Account" : "Sign In Here";`;
code = code.replace(oldPromptText, newPromptText);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
