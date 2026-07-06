const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const replacement = `            if (useLocalStorageFallback) {
                let accounts = JSON.parse(localStorage.getItem('disciplineAccounts') || '{}');
                
                if (!isLoginMode) {
                    if (accounts[email]) {
                        if (errorBox && errorText) { errorBox.classList.remove('hidden'); errorText.textContent = "Account already exists! Please Sign In."; }
                        return;
                    }
                    accounts[email] = { password: password };
                    localStorage.setItem('disciplineAccounts', JSON.stringify(accounts));
                } else {
                    if (!accounts[email] || accounts[email].password !== password) {
                        if (errorBox && errorText) { errorBox.classList.remove('hidden'); errorText.textContent = "Invalid username or password."; }
                        return;
                    }
                }

                localStorage.setItem('disciplineSession', email);
                currentUser = { uid: email };
                nameInput.value = ''; passInput.value = '';
                showDashboard();
                return;
            }

            try {`;

code = code.replace(/            try \{/g, replacement);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Restored local storage fallback logic for account creation and login.");
