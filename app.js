// --- Firebase Configuration (Placeholder) ---
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForNowPleaseReplace",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

let auth, db;
let useLocalStorageFallback = true;

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase initialized. Waiting for Auth state...");
    }
} catch (e) {
    console.error("Firebase init error. Falling back to local storage.", e);
}

// --- App State ---
const defaultGlobalState = {
    streak: 0,
    history: [],
    qadaVault: [],
    quranBookmark: { surah: '', ayah: '' },
    todos: [],
    savings: { current: 0, goal: 100000 },
    ledger: []
};

const defaultDailyState = {
    spiritual: {
        fajrSunnah: false, fajrSalah: 'pending', yaseen: false,
        duha: false, dhuhr: 'pending', asr: 'pending',
        maghrib: 'pending', isha: 'pending', ishaSunnah: false, ratibHaddad: false, mulk: false, witr: false, tahajjud: false,
        kahf: false,
        fridaySalawat: false
    },
    counters: { salawat: 0, asmaul: 0, istighfar: 0 },
    water: 0,
    sleep: 0,
    hygiene: { brushMorning: false, brushNight: false },
    finances: { transactions: [] },
    journal: ''
};

let globalState = JSON.parse(JSON.stringify(defaultGlobalState));
let dailyState = JSON.parse(JSON.stringify(defaultDailyState));
let currentUser = null;

function getLocalYYYYMMDD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
const todayStr = getLocalYYYYMMDD(new Date());
let selectedDate = todayStr;


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initTabs();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-emerald-700', 'font-black', 'border-emerald-500');
                b.classList.add('text-gray-500', 'border-transparent');
            });
            tabContents.forEach(c => c.classList.add('hidden'));

            btn.classList.add('active', 'text-emerald-700', 'font-black', 'border-emerald-500');
            btn.classList.remove('text-gray-500', 'border-transparent');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

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

    let isLoginMode = true;

    const session = localStorage.getItem('disciplineSession');
    if (session) {
        currentUser = { uid: session }; 
        showDashboard();
    }

    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                useLocalStorageFallback = false;
                showDashboard();
            }
        });
    }

    toggleAuthModeBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
        authSubmitBtn.innerHTML = isLoginMode 
            ? `<span class="relative z-10 flex items-center justify-center gap-2">Sign In <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i></span>` 
            : `<span class="relative z-10 flex items-center justify-center gap-2">Sign Up <i class="ph-bold ph-user-plus group-hover:scale-110 transition-transform"></i></span>`;
        authPromptText.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
        toggleAuthModeBtn.textContent = isLoginMode ? "Sign Up Here" : "Sign In Here";
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawName = nameInput.value.trim();
        const password = passInput.value;
        
        // Convert username to a dummy email for Firebase Auth if no @ is present
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
                alert("Account created successfully!");
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }
        } catch (error) {
            console.warn("Falling back to local storage auth...");
            useLocalStorageFallback = true;
            localStorage.setItem('disciplineSession', email);
            currentUser = { uid: email };
            showDashboard();
        }
    });

    logoutBtn.addEventListener('click', () => {
        if (useLocalStorageFallback) {
            localStorage.removeItem('disciplineSession');
            location.reload();
        } else {
            auth.signOut().then(() => location.reload());
        }
    });
}


async function saveGlobalState() {
    if (useLocalStorageFallback) {
        localStorage.setItem(`disciplineGlobal_${currentUser.uid}`, JSON.stringify(globalState));
    } else {
        try {
            await db.collection('users').doc(currentUser.uid).collection('global').doc('data').set(globalState, { merge: true });
        } catch (e) {}
    }
}

async function loadData() {
    if (useLocalStorageFallback) {
        const gSaved = localStorage.getItem(`disciplineGlobal_${currentUser.uid}`);
        if (gSaved) {
            
            let parsed = {};
            try {
                parsed = JSON.parse(gSaved);
                if (typeof parsed !== 'object' || parsed === null) parsed = {};
            } catch(e) { console.error("Corrupted global state, resetting"); }

            globalState = { ...defaultGlobalState, ...parsed };
        }
        const dSaved = localStorage.getItem(`disciplineDaily_${currentUser.uid}_${selectedDate}`);
        if (dSaved) {
            
            let parsed = {};
            try {
                parsed = JSON.parse(dSaved);
                if (typeof parsed !== 'object' || parsed === null) parsed = {};
            } catch(e) { console.error("Corrupted daily state, resetting"); }

            dailyState = { ...defaultDailyState, ...parsed, spiritual: { ...defaultDailyState.spiritual, ...parsed.spiritual } };
        } else {
            dailyState = JSON.parse(JSON.stringify(defaultDailyState));
        }
    } else {
        try {
            const gDoc = await db.collection('users').doc(currentUser.uid).collection('global').doc('data').get();
            if (gDoc.exists) globalState = { ...defaultGlobalState, ...gDoc.data() };
            
            const dDoc = await db.collection('users').doc(currentUser.uid).collection('dailyLogs').doc(selectedDate).get();
            if (dDoc.exists) {
                const parsed = dDoc.data();
                dailyState = { ...defaultDailyState, ...parsed, spiritual: { ...defaultDailyState.spiritual, ...parsed.spiritual } };
            } else {
                dailyState = JSON.parse(JSON.stringify(defaultDailyState));
            }
        } catch (e) { console.error(e); }
    }
}

async function commitDailyProgress() {
    const btn = document.getElementById('save-progress-btn');
    if(btn) btn.innerHTML = `<span><i class="ph-bold ph-spinner animate-spin"></i> Saving...</span>`;

    const rate = calculateCompletionRate();
    const historyIndex = globalState.history.findIndex(h => h.date === selectedDate);
    if(historyIndex >= 0) {
        globalState.history[historyIndex].rate = rate;
    } else {
        globalState.history.push({ date: selectedDate, rate: rate });
    }

    // --- QADA SYNC RECONCILIATION ---
    // If user changed a prayer to 'ada' on a past date, remove it from Qada Vault
    const obligatories = ['fajrSalah', 'dhuhr', 'asr', 'maghrib', 'isha'];
    obligatories.forEach(k => {
        if (dailyState.spiritual[k] === 'ada') {
            const pName = k === 'dhuhr' && new Date(selectedDate).getDay() === 5 ? "Jumu'ah Salah" : 
                          k === 'fajrSalah' ? 'Fajr Salah' : 
                          k.charAt(0).toUpperCase() + k.slice(1) + " Salah";
            
            // Find in qadaVault and remove
            const qIdx = globalState.qadaVault.findIndex(q => q.date === selectedDate && q.name === pName);
            if (qIdx >= 0) {
                globalState.qadaVault.splice(qIdx, 1);
            }
        }
        // If changed TO qada on a past date, add it if not exists
        if (dailyState.spiritual[k] === 'qada') {
            const pName = k === 'dhuhr' && new Date(selectedDate).getDay() === 5 ? "Jumu'ah Salah" : 
                          k === 'fajrSalah' ? 'Fajr Salah' : 
                          k.charAt(0).toUpperCase() + k.slice(1) + " Salah";
            
            const qIdx = globalState.qadaVault.findIndex(q => q.date === selectedDate && q.name === pName);
            if (qIdx === -1) {
                globalState.qadaVault.push({ name: pName, date: selectedDate, completed: false });
            }
        }
    });
    // ---------------------------------

    if (useLocalStorageFallback) {
        localStorage.setItem(`disciplineGlobal_${currentUser.uid}`, JSON.stringify(globalState));
        localStorage.setItem(`disciplineDaily_${currentUser.uid}_${selectedDate}`, JSON.stringify(dailyState));
    } else {
        try {
            await db.collection('users').doc(currentUser.uid).collection('global').doc('data').set(globalState, { merge: true });
            await db.collection('users').doc(currentUser.uid).collection('dailyLogs').doc(selectedDate).set(dailyState, { merge: true });
        } catch (e) {}
    }
    
    updateRoutineProgress();
    updateAnalytics();
    renderCalendar();
    renderQadaVault();

    if(btn) {
        setTimeout(() => {
            btn.innerHTML = `<span>✅ Saved!</span>`;
            setTimeout(() => { 
                updateSaveButtonText();
            }, 2000);
        }, 500);
    }
}


let sliderCenterDate = new Date(); // Controls the 7-day window

function updateSaveButtonText() {
    const btn = document.getElementById('save-progress-btn');
    if (!btn) return;
    if (selectedDate === todayStr) {
        btn.innerHTML = `<span>🚀 Save Today's Progress</span>`;
    } else {
        const dateObj = new Date(selectedDate);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        const localDate = new Date(dateObj.getTime() + tzOffset);
        const shortDate = localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        btn.innerHTML = `<span>✏️ Update Progress for ${shortDate}</span>`;
    }
}

function renderDateSlider() {
    const container = document.getElementById('date-slider-container');
    if (!container) return;
    container.innerHTML = '';
    
    // We want 7 days centered around sliderCenterDate
    for (let i = -3; i <= 3; i++) {
        const d = new Date(sliderCenterDate);
        d.setDate(d.getDate() + i);
        const dStr = getLocalYYYYMMDD(d);
        
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dateNum = d.getDate();
        
        const isSelected = (dStr === selectedDate);
        
        const card = document.createElement('div');
        card.className = `flex flex-col items-center justify-center flex-1 min-w-[2rem] sm:min-w-[4rem] py-1.5 sm:py-3 rounded-xl sm:rounded-2xl cursor-pointer transition-all \${isSelected ? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white shadow-lg scale-105 border border-emerald-300' : 'bg-white/40 text-gray-600 hover:bg-white/80 border border-white/60'}`;
        
        card.innerHTML = `
            <span class="text-[8px] sm:text-[10px] font-black uppercase tracking-wider \${isSelected ? 'text-emerald-50' : 'text-gray-600'}">${dayName}</span>
            <span class="text-base sm:text-2xl font-black \${isSelected ? 'text-white' : 'text-gray-700'}">${dateNum}</span>
        `;
        
        card.addEventListener('click', () => {
            if (dStr !== selectedDate) {
                changeDate(dStr);
            }
        });
        container.appendChild(card);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            sliderCenterDate.setDate(sliderCenterDate.getDate() - 7);
            renderDateSlider();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            sliderCenterDate.setDate(sliderCenterDate.getDate() + 7);
            renderDateSlider();
        });
    }
});

async function changeDate(newDateStr) {
    selectedDate = newDateStr;
    
    updateSaveButtonText();
    
    // Adjust slider center if selected date is out of bounds (optional, but let's keep slider center where it is unless explicitly changed)
    renderDateSlider();

    await loadData();
    initDashboard();
}

async function showDashboard() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    
    sliderCenterDate = new Date(); // Reset to today
    
    document.getElementById('save-progress-btn').addEventListener('click', commitDailyProgress);

    await changeDate(todayStr);
}



function calculateCompletionRate() {
    const keys = Object.keys(dailyState.spiritual);
    let completed = 0;
    let total = 0;
    
    keys.forEach(k => {
        if (k !== 'kahf' || new Date().getDay() === 5) {
            total++;
            if (['fajrSalah', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(k)) {
                if (dailyState.spiritual[k] === 'ada') completed++;
            } else {
                if (dailyState.spiritual[k] === true) completed++;
            }
        }
    });
    
    return total === 0 ? 0 : Math.round((completed / total) * 100);
}

function initDashboard() {
    updateAnalytics();
    initSpiritual();
    initCounters();
    initHabits();
    initFinance();
    initTodos();
    initJournal();
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthLabel = document.getElementById('calendar-month-label');
    if (!grid || !monthLabel) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthLabel.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = '';

    // Empty cells before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        grid.appendChild(emptyCell);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const cellDateStr = new Date(year, month, i).toLocaleDateString('en-US');
        const historyEntry = globalState.history.find(h => h.date === cellDateStr);
        
        // If it's today, we use current real-time completion rate
        const isToday = today.toLocaleDateString('en-US') === cellDateStr;
        let rate = null;

        if (isToday) {
            rate = calculateCompletionRate();
        } else if (historyEntry) {
            rate = historyEntry.rate;
        }

        let bgClass = "bg-white border-gray-100 text-gray-600";
        if (rate !== null) {
            if (rate >= 80) bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-sm font-black";
            else if (rate >= 40) bgClass = "bg-amber-400 border-amber-500 text-white shadow-sm font-black";
            else bgClass = "bg-rose-500 border-rose-600 text-white shadow-sm font-black";
        }

        const cell = document.createElement('div');
        cell.className = `w-full aspect-square rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${bgClass} ${isToday ? 'ring-4 ring-sky-300 ring-offset-2' : ''}`;
        cell.textContent = i;
        grid.appendChild(cell);
    }
}

function updateAnalytics() {
    document.getElementById('streak-count').textContent = globalState.streak;
    
    if (globalState.history.length === 0) {
        document.getElementById('weekly-avg').textContent = "0%";
        document.getElementById('weekly-progress-bar').style.width = "0%";
    } else {
        const sum = globalState.history.reduce((acc, val) => acc + val.rate, 0);
        const avg = Math.round(sum / globalState.history.length);
        document.getElementById('weekly-avg').textContent = `${avg}%`;
        document.getElementById('weekly-progress-bar').style.width = `${avg}%`;
    }

    const daysContainer = document.getElementById('weekly-days');
    daysContainer.innerHTML = '';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toLocaleDateString('en-US');
        const dayLabel = dayNames[d.getDay()];
        
        const hist = globalState.history.find(h => h.date === dStr);
        const rate = hist ? hist.rate : 0;
        
        let color = 'text-gray-600';
        if (rate >= 80) color = 'text-emerald-600 font-black';
        else if (rate >= 40) color = 'text-amber-500 font-bold';
        
        daysContainer.innerHTML += `<span class="${color}">${dayLabel}</span>`;
    }
}

// --- 1. Spiritual & Quran ---
function initSpiritual() {
    // Dynamic Friday Logic
    const dObj = new Date(selectedDate);
    const tzOffset = dObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dObj.getTime() + tzOffset);
    const isFriday = localDate.getDay() === 5;
    
    const dhuhrLabel = document.getElementById('dhuhr-label');
    const fridaySpecial = document.getElementById('friday-special');
    const fridaySalawatBox = document.getElementById('friday-salawat-container');
    const ratibHaddadBox = document.getElementById('ratib-haddad-container');

    if (isFriday) {
        if (dhuhrLabel) dhuhrLabel.textContent = "Jumu'ah Salah";
        if (fridaySpecial) fridaySpecial.classList.remove('hidden');
        if (fridaySalawatBox) fridaySalawatBox.classList.remove('hidden');
        if (ratibHaddadBox) ratibHaddadBox.classList.add('hidden');
    } else {
        if (dhuhrLabel) dhuhrLabel.textContent = "Dhuhr Salah";
        if (fridaySpecial) fridaySpecial.classList.add('hidden');
        if (fridaySalawatBox) fridaySalawatBox.classList.add('hidden');
        if (ratibHaddadBox) ratibHaddadBox.classList.remove('hidden');
    }

    // Setup 3-State Obligatory Prayers
    const obligatories = ['fajrSalah', 'dhuhr', 'asr', 'maghrib', 'isha'];
    obligatories.forEach(k => {
        renderPrayerState(k);
    });

    // Setup Checkboxes (Sunnah & Adhkar)
    const checkboxes = ['fajrSunnah', 'yaseen', 'duha', 'ishaSunnah', 'ratibHaddad', 'mulk', 'witr', 'tahajjud', 'kahf', 'fridaySalawat'];
    checkboxes.forEach(k => {
        const elId = k === 'fajrSunnah' ? 'fajr-sunnah' : 
                     k === 'ishaSunnah' ? 'isha-sunnah' : 
                     k === 'ratibHaddad' ? 'ratib-haddad' : 
                     k === 'fridaySalawat' ? 'friday-salawat' : k;
        const el = document.getElementById(elId);
        if (el) {
            el.checked = dailyState.spiritual[k] || false;
            // Use clone to remove old event listeners to prevent duplicate triggers on date change
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
            newEl.addEventListener('change', (e) => {
                dailyState.spiritual[k] = e.target.checked;
                updateRoutineProgress();
            });
        }
    });

    // Quran Bookmark
    const surahInput = document.getElementById('quran-surah');
    const ayahInput = document.getElementById('quran-ayah');
    if (surahInput && ayahInput) {
        surahInput.value = globalState.quranBookmark.surah;
        ayahInput.value = globalState.quranBookmark.ayah;
        
        const saveBtn = document.getElementById('save-bookmark');
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        
        newSaveBtn.addEventListener('click', () => {
            globalState.quranBookmark.surah = surahInput.value.trim();
            globalState.quranBookmark.ayah = ayahInput.value.trim();
            saveGlobalState();
            
            newSaveBtn.innerHTML = '<i class="ph-bold ph-check"></i> Saved';
            newSaveBtn.classList.add('bg-emerald-100', 'text-emerald-700');
            setTimeout(() => {
                newSaveBtn.innerHTML = '<i class="ph-bold ph-floppy-disk"></i> Save Position';
                newSaveBtn.classList.remove('bg-emerald-100', 'text-emerald-700');
            }, 1500);
        });

    }

    renderQadaVault();
    updateRoutineProgress();
}

window.setPrayerState = (key, status) => {
    // If setting to Qada, push to ledger
    dailyState.spiritual[key] = status;
    
    renderPrayerState(key);
    renderQadaVault();
    updateRoutineProgress();
};

function renderPrayerState(key) {
    const container = document.getElementById(`ctrl-${key}`);
    if (!container) return;
    const current = dailyState.spiritual[key];
    
    const pendingCls = current === 'pending' ? 'border-gray-500 text-gray-700 bg-gray-100 font-bold shadow-inner' : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white/50';
    const adaCls = current === 'ada' ? 'bg-emerald-500 text-white font-bold shadow-md' : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100';
    const qadaCls = current === 'qada' ? 'bg-rose-500 text-white font-bold shadow-md' : 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100';

    container.innerHTML = `
        <button onclick="setPrayerState('${key}', 'pending')" class="px-2 py-1 text-[10px] rounded border ${pendingCls} transition-all uppercase tracking-wider">Pending</button>
        <button onclick="setPrayerState('${key}', 'ada')" class="px-3 py-1 text-[10px] rounded border ${adaCls} transition-all uppercase tracking-wider">Ada</button>
        <button onclick="setPrayerState('${key}', 'qada')" class="px-3 py-1 text-[10px] rounded border ${qadaCls} transition-all uppercase tracking-wider">Qada</button>
    `;
}

function renderQadaVault() {
    const container = document.getElementById('qada-list');
    if (!container) return;
    
    container.innerHTML = '';
    const activeQadas = globalState.qadaVault.filter(q => !q.completed);
    
    if (activeQadas.length === 0) {
        container.innerHTML = '<div class="text-xs text-gray-600 italic">No pending Qada prayers. Alhamdulillah!</div>';
        return;
    }
    
    activeQadas.forEach((q, idx) => {
        const realIdx = globalState.qadaVault.indexOf(q);
        const el = document.createElement('div');
        el.className = 'flex justify-between items-center bg-rose-50 border border-rose-100 p-2 rounded-lg';
        el.innerHTML = `
            <div>
                <span class="text-sm font-bold text-rose-800">${q.name}</span>
                <span class="text-[8px] sm:text-[10px] text-rose-500 ml-2">${q.date}</span>
            </div>
            <button onclick="completeQada(${realIdx})" class="text-[10px] bg-rose-200 text-rose-800 hover:bg-emerald-500 hover:text-white px-2 py-1 rounded transition-colors font-bold">Make Up</button>
        `;
        container.appendChild(el);
    });
}

window.completeQada = (idx) => {
    globalState.qadaVault[idx].completed = true;
    
    renderQadaVault();
};

function updateRoutineProgress() {
    const rate = calculateCompletionRate();
    const progressText = document.getElementById('routine-progress-text');
    if (progressText) progressText.textContent = `${rate}%`;
}

// --- 3. Dhikr Counters ---
function initCounters() {
    const counters = ['salawat', 'asmaul', 'istighfar'];
    counters.forEach(c => {
        const btn = document.getElementById(`btn-${c}`);
        const reset = document.getElementById(`reset-${c}`);
        if (btn && reset) {
            btn.textContent = dailyState.counters[c];
            
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                dailyState.counters[c]++;
                newBtn.textContent = dailyState.counters[c];
            });
            
            const newReset = reset.cloneNode(true);
            reset.parentNode.replaceChild(newReset, reset);
            newReset.addEventListener('click', () => {
                dailyState.counters[c] = 0;
                newBtn.textContent = 0;
            });
        }
    });
}

// --- 4. Habits & Wellness ---
function initHabits() {
    const brushMorn = document.getElementById('brush-morning');
    const brushNight = document.getElementById('brush-night');
    if(brushMorn) brushMorn.checked = dailyState.hygiene.brushMorning;
    if(brushNight) brushNight.checked = dailyState.hygiene.brushNight;
    
    if(brushMorn) {
        const nbMorn = brushMorn.cloneNode(true);
        brushMorn.parentNode.replaceChild(nbMorn, brushMorn);
        nbMorn.addEventListener('change', (e) => { dailyState.hygiene.brushMorning = e.target.checked; });
    }
    if(brushNight) {
        const nbNight = brushNight.cloneNode(true);
        brushNight.parentNode.replaceChild(nbNight, brushNight);
        nbNight.addEventListener('change', (e) => { dailyState.hygiene.brushNight = e.target.checked; });
    }

    const glassesContainer = document.getElementById('water-glasses');
    const waterCount = document.getElementById('water-count');
    
    const renderWater = () => {
        if(!glassesContainer) return;
        glassesContainer.innerHTML = '';
        for(let i=1; i<=8; i++) {
            const isFilled = i <= dailyState.water;
            const icon = document.createElement('i');
            icon.className = `text-2xl cursor-pointer transition-colors ${isFilled ? 'ph-fill ph-drop text-sky-500 drop-shadow-md' : 'ph ph-drop text-gray-300'}`;
            icon.onclick = () => {
                dailyState.water = dailyState.water === i ? i - 1 : i; 
                renderWater();
            };
            glassesContainer.appendChild(icon);
        }
        waterCount.textContent = `${dailyState.water} / 8 glasses`;
    };
    renderWater();

    const sleepRange = document.getElementById('sleep-range');
    const sleepDisplay = document.getElementById('sleep-display');
    if(sleepRange && sleepDisplay) {
        sleepRange.value = dailyState.sleep;
        sleepDisplay.textContent = `${dailyState.sleep} hrs`;

        const newSleepRange = sleepRange.cloneNode(true);
        sleepRange.parentNode.replaceChild(newSleepRange, sleepRange);
        
        newSleepRange.addEventListener('input', (e) => {
            sleepDisplay.textContent = `${e.target.value} hrs`;
        });
        newSleepRange.addEventListener('change', (e) => {
            dailyState.sleep = parseFloat(e.target.value);
        });
    }
}

function updateFinanceDisplay() {
    const today = new Date().toLocaleDateString('en-US');
    let income = 0;
    let expense = 0;

    dailyState.finances.transactions.forEach(t => {
        if (t.date === today) {
            if (t.type === 'income') income += t.amount;
            else if (t.type === 'expense') expense += t.amount;
        }
    });

    const balance = income - expense;

    if (document.getElementById('today-income')) {
        document.getElementById('today-income').textContent = `₹${income.toLocaleString('en-IN')}`;
        document.getElementById('today-expense').textContent = `₹${expense.toLocaleString('en-IN')}`;
        
        const balEl = document.getElementById('today-balance');
        balEl.textContent = `₹${balance.toLocaleString('en-IN')}`;
        balEl.className = `text-lg font-black ${balance >= 0 ? 'text-sky-600' : 'text-rose-600'}`;
    }
}

function renderTransactions() {
    const container = document.getElementById('transaction-list');
    const emptyMsg = document.getElementById('empty-transactions');
    if (!container) return;

    const today = new Date().toLocaleDateString('en-US');
    const todayTxs = dailyState.finances.transactions.filter(t => t.date === today);

    if(todayTxs.length === 0) {
        emptyMsg.classList.remove('hidden');
        Array.from(container.children).forEach(c => { if(c.id !== 'empty-transactions') c.remove(); });
        return;
    }

    emptyMsg.classList.add('hidden');
    Array.from(container.children).forEach(c => { if(c.id !== 'empty-transactions') c.remove(); });

    todayTxs.reverse().forEach((t) => {
        const isIncome = t.type === 'income';
        const color = isIncome ? 'emerald' : 'rose';
        const sign = isIncome ? '+' : '-';
        
        const el = document.createElement('div');
        el.className = `bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center`;
        el.innerHTML = `
            <div class="flex flex-col">
                <span class="text-xs font-bold text-gray-800">${t.desc}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-sm font-black text-${color}-600">${sign}₹${t.amount.toLocaleString('en-IN')}</span>
                <button onclick="window.removeTransaction(${t.id})" class="text-gray-300 hover:text-rose-500 transition-colors"><i class="ph-fill ph-trash text-base"></i></button>
            </div>
        `;
        container.insertBefore(el, emptyMsg);
    });
}

window.removeTransaction = (id) => {
    dailyState.finances.transactions = dailyState.finances.transactions.filter(t => t.id !== id);
    
    updateFinanceDisplay();
    renderTransactions();
};

function renderLedger() {
    const container = document.getElementById('ledger-list');
    const emptyMsg = document.getElementById('empty-ledger');
    
    if (!container) return;

    if(globalState.ledger.length === 0) {
        emptyMsg.classList.remove('hidden');
        Array.from(container.children).forEach(c => { if(c.id !== 'empty-ledger') c.remove(); });
        return;
    }

    emptyMsg.classList.add('hidden');
    Array.from(container.children).forEach(c => { if(c.id !== 'empty-ledger') c.remove(); });

    globalState.ledger.forEach((item, index) => {
        const isPayable = item.type === 'payable';
        const color = isPayable ? 'rose' : 'emerald';
        const icon = isPayable ? 'ph-arrow-up-right' : 'ph-arrow-down-left';
        const typeText = isPayable ? 'I Owe' : 'Owed to Me';
        
        const el = document.createElement('div');
        el.className = `bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center ${item.settled ? 'opacity-50 grayscale' : ''}`;
        el.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-${color}-50 text-${color}-600 flex items-center justify-center text-sm shadow-sm border border-${color}-100">
                    <i class="ph-bold ${icon}"></i>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-bold text-gray-800 ${item.settled ? 'line-through text-gray-600' : ''}">${item.name}</span>
                    <span class="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest">${typeText}</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs font-black text-${color}-600 ${item.settled ? 'line-through text-gray-600' : ''}">₹${item.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                <button onclick="window.toggleLedger(${index})" class="text-gray-300 hover:text-sky-500 transition-colors"><i class="ph-fill ph-check-circle text-lg"></i></button>
                <button onclick="window.removeLedger(${index})" class="text-gray-300 hover:text-rose-500 transition-colors"><i class="ph-fill ph-trash text-lg"></i></button>
            </div>
        `;
        container.insertBefore(el, emptyMsg);
    });
}

window.toggleLedger = (index) => {
    globalState.ledger[index].settled = !globalState.ledger[index].settled;
     renderLedger();
};

window.removeLedger = (index) => {
    globalState.ledger.splice(index, 1);
     renderLedger();
};

// --- Todo List ---
function initTodos() {
    const list = document.getElementById('todo-list');
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo');

    if (!list || !input) return;

    const renderTodos = () => {
        list.innerHTML = '';
        globalState.todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/80 shadow-sm';
            li.innerHTML = `
                <input type="checkbox" class="w-5 h-5 accent-sky-500 rounded cursor-pointer shadow-sm" ${todo.done ? 'checked' : ''} onchange="window.toggleTodo(${index})">
                <span class="flex-1 text-sm font-bold text-gray-700 ${todo.done ? 'line-through text-gray-600' : ''}">${todo.text}</span>
                <button onclick="window.removeTodo(${index})" class="text-gray-600 hover:text-rose-500 transition-colors"><i class="ph-fill ph-trash text-lg"></i></button>
            `;
            list.appendChild(li);
        });
    };

    window.toggleTodo = (index) => {
        globalState.todos[index].done = !globalState.todos[index].done;
         renderTodos();
    };

    window.removeTodo = (index) => {
        globalState.todos.splice(index, 1);
         renderTodos();
    };

    const addTodo = () => {
        const text = input.value.trim();
        if(text) {
            globalState.todos.push({ text, done: false });
            input.value = '';
             renderTodos();
        }
    };

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTodo(); });

    renderTodos();
}

// --- Journal ---
function initJournal() {
    const journalInput = document.getElementById('journal-input');
    const journalStatus = document.getElementById('journal-status');
    if(journalInput) {
        journalInput.value = dailyState.journal;
        
        const saveJ = document.getElementById('save-journal');
        const nSaveJ = saveJ.cloneNode(true);
        saveJ.parentNode.replaceChild(nSaveJ, saveJ);
        
        nSaveJ.addEventListener('click', () => {
            const input = document.getElementById('journal-input');
            dailyState.journal = input.value;
            journalStatus.textContent = 'Saved at ' + new Date().toLocaleTimeString();
        });
    }
}
