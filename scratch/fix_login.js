const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Add try-catch around JSON.parse in loadData
const safeJSONParse = `
            let parsed = {};
            try {
                parsed = JSON.parse(gSaved);
                if (typeof parsed !== 'object' || parsed === null) parsed = {};
            } catch(e) { console.error("Corrupted global state, resetting"); }
`;
code = code.replace(/const parsed = JSON\.parse\(gSaved\);/g, safeJSONParse);

const safeDailyJSONParse = `
            let parsed = {};
            try {
                parsed = JSON.parse(dSaved);
                if (typeof parsed !== 'object' || parsed === null) parsed = {};
            } catch(e) { console.error("Corrupted daily state, resetting"); }
`;
code = code.replace(/const parsed = JSON\.parse\(dSaved\);/g, safeDailyJSONParse);

// 2. Wrap showDashboard in try-catch to ensure we at least render something
const safeShowDashboard = `
async function showDashboard() {
    try {
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
        
        sliderCenterDate = new Date();
        
        const saveBtn = document.getElementById('save-progress-btn');
        if (saveBtn) {
            // Remove old listener if exists by cloning
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            newSaveBtn.addEventListener('click', commitDailyProgress);
        }

        await changeDate(todayStr);
    } catch(e) {
        console.error("Error showing dashboard:", e);
        alert("There was an error loading your data. We have reset it to keep the app working.");
        globalState = JSON.parse(JSON.stringify(defaultGlobalState));
        dailyState = JSON.parse(JSON.stringify(defaultDailyState));
        initDashboard();
    }
}
`;
code = code.replace(/async function showDashboard\(\) \{[\s\S]*?await changeDate\(todayStr\);\n\}/, safeShowDashboard);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);


// Fix HTML Head just in case
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');
if (!html.includes('</head>')) {
    html = html.replace(/<body/, '</head>\n<body');
    fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
}
