const fs = require('fs');
let code = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

// 1. Qada Persistence Logic in setPrayerState
code = code.replace(
    /window\.setPrayerState = \(key, status\) => \{[\s\S]*?dailyState\.spiritual\[key\] = status;/,
    `window.setPrayerState = (key, status) => {
    const oldStatus = dailyState.spiritual[key];
    dailyState.spiritual[key] = status;
    
    if (status === 'qada' && oldStatus !== 'qada') {
        globalState.qadaVault.push({
            name: key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()),
            date: selectedDate,
            completed: false
        });
        saveGlobalState();
    }
    commitDailyProgress();`
);

// 2. Firebase daily logs path update
code = code.replace(/collection\('daily'\)\.doc/g, "collection('dailyLogs').doc");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', code);
console.log("Qada persistence and Firebase paths fixed!");
