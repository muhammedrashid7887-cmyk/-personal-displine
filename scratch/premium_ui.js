const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

// 1. Add Google Fonts
const fontLinks = `
    <!-- Google Fonts: Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
`;
html = html.replace(/<title>/, fontLinks + '\n    <title>');

// 2. Set Default Font in Tailwind Theme
const themeFont = `
        @theme {
            --font-sans: 'Outfit', sans-serif;
            --color-primary-500: #10b981;
`;
html = html.replace(/@theme \{[\s\n]*--color-primary-500: #10b981;/, themeFont);

// 3. Upgrade Login Interface (Premium aesthetic)
const premiumAuth = `
    <!-- Authentication View -->
    <div id="auth-view" class="flex-1 flex items-center justify-center p-4 min-h-screen relative z-10 overflow-hidden">
        
        <!-- Premium Ambient Background Glows -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-400/20 rounded-full blur-[100px]"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-400/20 rounded-full blur-[100px]"></div>
        </div>

        <!-- Premium Auth Card -->
        <div class="w-full max-w-md p-10 bg-white/40 backdrop-blur-[50px] border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] transform transition-all duration-500 relative z-10">
            <div class="text-center mb-10">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] mb-6">
                    <i class="ph-fill ph-leaf text-4xl text-white"></i>
                </div>
                <h2 class="text-4xl font-black text-gray-900 tracking-tight" id="auth-title">Displine Memoranda</h2>
                <p class="text-[11px] text-emerald-700/80 mt-2 font-bold tracking-[0.2em] uppercase">Your Private Sanctuary</p>
            </div>
            
            <form id="auth-form" class="space-y-5">
                <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Username</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <i class="ph-bold ph-user text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                        </div>
                        <input type="text" id="auth-name" required placeholder="Enter username" class="w-full bg-white/50 border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all placeholder-gray-400">
                    </div>
                </div>
                
                <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2">Password</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <i class="ph-bold ph-lock-key text-gray-400 group-focus-within:text-emerald-500 transition-colors"></i>
                        </div>
                        <input type="password" id="auth-pass" required placeholder="••••••••" class="w-full bg-white/50 border border-white/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all placeholder-gray-400">
                    </div>
                </div>
                
                <button type="submit" class="relative overflow-hidden group w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-black text-sm tracking-widest uppercase py-4 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98] mt-8" id="auth-submit-btn">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        Unlock Vault <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </button>
            </form>
            
            <div class="mt-8 pt-6 border-t border-gray-200/40 text-center flex flex-col gap-3">
                <p class="text-xs font-medium text-gray-500">
                    <span id="auth-prompt-text">New to Displine Memoranda?</span> 
                </p>
                <button id="toggle-auth-mode" class="w-full bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-black py-3.5 rounded-xl shadow-sm border border-emerald-100/50 transition-all focus:outline-none uppercase tracking-widest text-[10px]">Create New Account</button>
            </div>
        </div>
    </div>
`;
const oldAuthRegex = /<!-- Authentication View -->[\s\S]*?<!-- Dashboard View -->/;
html = html.replace(oldAuthRegex, premiumAuth + "\n    <!-- Dashboard View -->");

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
