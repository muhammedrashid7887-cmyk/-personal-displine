const fs = require('fs');

let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const newInit = `
let auth, db;
let useLocalStorageFallback = (firebaseConfig.apiKey === "AIzaSyDummyKeyForNowPleaseReplace");

try {
    if (typeof firebase !== 'undefined' && !useLocalStorageFallback) {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase initialized. Waiting for Auth state...");
    } else if (useLocalStorageFallback) {
        console.log("Using Local Storage Fallback due to placeholder API key.");
    }
} catch (e) {
    console.error("Firebase init error.", e);
}
`;

code = code.replace(/let auth, db;\n\ntry \{[\s\S]*?console\.error\("Firebase init error\.", e\);\n\}/, newInit.trim());


const newInitAuth = `
    let isLoginMode = true;

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
`;
code = code.replace(/let isLoginMode = true;\n\s+if \(auth\) \{[\s\S]*?\}\);\n\s+\}/, newInitAuth.trim());


const newAuthSubmit = `
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
`;
code = code.replace(/let email = rawName;\n\s+if \(\!email\.includes\('@'\)\) \{[\s\S]*?\}\n\n\s+try \{/, newAuthSubmit.trim());


const newLogout = `
    logoutBtn.addEventListener('click', () => {
        if (useLocalStorageFallback) {
            localStorage.removeItem('disciplineSession');
            location.reload();
        } else {
            auth.signOut().then(() => location.reload());
        }
    });
`;
code = code.replace(/logoutBtn\.addEventListener\('click', \(\) \=\> \{[\s\S]*?\}\);/, newLogout.trim());


const newSaveLoad = `
async function saveGlobalState() {
    if (!currentUser) return;
    if (useLocalStorageFallback) {
        localStorage.setItem(\`disciplineGlobal_\${currentUser.uid}\`, JSON.stringify(globalState));
    } else {
        try {
            await db.collection('users').doc(currentUser.uid).collection('global').doc('data').set(globalState, { merge: true });
        } catch (e) { console.error("Error saving global state", e); }
    }
}

async function loadData() {
    if (!currentUser) return;
    if (useLocalStorageFallback) {
        const gSaved = localStorage.getItem(\`disciplineGlobal_\${currentUser.uid}\`);
        if (gSaved) {
            let parsed = {};
            try {
                parsed = JSON.parse(gSaved);
                if (typeof parsed !== 'object' || parsed === null) parsed = {};
            } catch(e) {}
            globalState = { ...defaultGlobalState, ...parsed };
        }
    } else {
        try {
            const doc = await db.collection('users').doc(currentUser.uid).collection('global').doc('data').get();
            if (doc.exists) {
                globalState = { ...defaultGlobalState, ...doc.data() };
            }
        } catch (e) { console.error("Error loading global state", e); }
    }
}
`;
code = code.replace(/async function saveGlobalState\(\) \{[\s\S]*?\} catch \(e\) \{ console\.error\("Error loading global state", e\); \}\n\s+\}\n\}/, newSaveLoad.trim());

const newChangeDateContent = `
    selectedDate = dateStr;
    if (useLocalStorageFallback) {
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
    } else {
        const dSavedObj = await db.collection('users').doc(currentUser.uid).collection('daily').doc(dateStr).get();
        if (dSavedObj.exists) {
            dailyState = { ...defaultDailyState, ...dSavedObj.data() };
        } else {
            dailyState = JSON.parse(JSON.stringify(defaultDailyState));
        }
    }
    initDashboard();
`;
code = code.replace(/selectedDate = dateStr;\n\s+const dSavedObj = await db\.collection\('users'\)[\s\S]*?initDashboard\(\);/, newChangeDateContent.trim());

const newCommitDaily = `
async function commitDailyProgress() {
    if (!currentUser) return;
    try {
        if (useLocalStorageFallback) {
            localStorage.setItem(\`disciplineDaily_\${currentUser.uid}_\${selectedDate}\`, JSON.stringify(dailyState));
        } else {
            await db.collection('users').doc(currentUser.uid).collection('daily').doc(selectedDate).set(dailyState, { merge: true });
        }
`;
code = code.replace(/async function commitDailyProgress\(\) \{\n\s+if \(\!currentUser\) return;\n\s+try \{\n\s+await db\.collection\('users'\)[\s\S]*?\.set\(dailyState, \{ merge: true \}\);/, newCommitDaily.trim());

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
