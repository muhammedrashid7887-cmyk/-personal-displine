const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Bypass initAuth and go straight to Dashboard
code = code.replace(
    /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?initAuth\(\);[\s\S]*?initTabs\(\);[\s\S]*?\}\);/,
    `document.addEventListener('DOMContentLoaded', async () => {
    // Bypass login, use local offline user
    currentUser = { uid: 'local_offline_user' };
    
    // Load local data and show dashboard
    await fetchGlobalData();
    await fetchDailyData(selectedDate);
    
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    sliderCenterDate = new Date();
    document.getElementById('save-progress-btn').addEventListener('click', commitDailyProgress);
    
    initDashboard();
    initTabs();
});`
);

// 2. Rewrite saveGlobalState for LocalStorage
code = code.replace(
    /async function saveGlobalState\(\)\s*\{[\s\S]*?catch\s*\(e\)\s*\{\s*console\.error\('Error saving global state',\s*e\);\s*\}[\s\S]*?\}/,
    `async function saveGlobalState() {
    if (!currentUser) return;
    localStorage.setItem(\`disciplineGlobal_\${currentUser.uid}\`, JSON.stringify(globalState));
}`
);

// 3. Rewrite fetchGlobalData for LocalStorage
code = code.replace(
    /async function fetchGlobalData\(\)\s*\{[\s\S]*?catch\s*\(e\)\s*\{\s*console\.error\('Error fetching global state',\s*e\);\s*\}[\s\S]*?\}/,
    `async function fetchGlobalData() {
    if (!currentUser) return;
    const gSaved = localStorage.getItem(\`disciplineGlobal_\${currentUser.uid}\`);
    if (gSaved) {
        try {
            let parsed = JSON.parse(gSaved);
            if (typeof parsed !== 'object' || parsed === null) parsed = {};
            globalState = { ...defaultGlobalState, ...parsed };
        } catch(e) { globalState = JSON.parse(JSON.stringify(defaultGlobalState)); }
    } else {
        globalState = JSON.parse(JSON.stringify(defaultGlobalState));
    }
}`
);

// 4. Rewrite fetchDailyData for LocalStorage
code = code.replace(
    /async function fetchDailyData\(dateStr\)\s*\{[\s\S]*?catch\s*\(e\)\s*\{\s*console\.error\('Error fetching daily state',\s*e\);\s*\}[\s\S]*?\}/,
    `async function fetchDailyData(dateStr) {
    if (!currentUser) return;
    const dSaved = localStorage.getItem(\`disciplineDaily_\${currentUser.uid}_\${dateStr}\`);
    if (dSaved) {
        try {
            let parsed = JSON.parse(dSaved);
            if (typeof parsed !== 'object' || parsed === null) parsed = {};
            dailyState = { ...defaultDailyState, ...parsed, spiritual: { ...defaultDailyState.spiritual, ...parsed.spiritual } };
        } catch(e) { dailyState = JSON.parse(JSON.stringify(defaultDailyState)); }
    } else {
        dailyState = JSON.parse(JSON.stringify(defaultDailyState));
    }
}`
);

// 5. Rewrite commitDailyProgress for LocalStorage
code = code.replace(
    /async function commitDailyProgress\(\)\s*\{[\s\S]*?const rate = calculateCompletionRate\(\);[\s\S]*?catch\s*\(e\)\s*\{\s*console\.error\('Error saving daily state',\s*e\);\s*\}[\s\S]*?\}/,
    `async function commitDailyProgress() {
    if (!currentUser) return;
    
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
        btn.classList.add('bg-amber-500/20', 'text-amber-400');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('bg-amber-500/20', 'text-amber-400'); }, 2000);
    }
}`
);

// 6. Fix changeDate to await data loading
code = code.replace(
    /async function changeDate\(newDateStr\)\s*\{\s*selectedDate = newDateStr;\s*updateSaveButtonText\(\);\s*await fetchDailyData\(selectedDate\);\s*initDashboard\(\);\s*\}/,
    `async function changeDate(newDateStr) {
    selectedDate = newDateStr;
    updateSaveButtonText();
    await fetchDailyData(selectedDate);
    initDashboard();
}`
);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Removed login option and restored Local Storage data management.");
