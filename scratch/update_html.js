const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// 1. Task Manager Time and Date
html = html.replace(
    /<div class="flex gap-3 mb-5">[\s\S]*?id="add-todo"[\s\S]*?<\/div>/,
    `<div class="flex flex-col gap-3 mb-5 bg-[#111827] p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <input type="text" id="taskName" placeholder="Enter Task Name" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 sm:py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-sky-500 transition-all">
                        <div class="flex gap-3">
                            <input type="date" id="taskDate" class="w-1/2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-sky-500 transition-all uppercase">
                            <input type="time" id="taskTime" class="w-1/2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-300 outline-none focus:ring-2 focus:ring-sky-500 transition-all uppercase">
                        </div>
                        <button onclick="scheduleTask()" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 px-4 rounded-xl transition-colors shadow-md shadow-sky-500/20 uppercase tracking-widest text-xs flex justify-center items-center gap-2">
                            <i class="ph-bold ph-calendar-plus"></i> SCHEDULE TASK
                        </button>
                    </div>`
);

// 2. Build Once Premium Daily Update (Journal)
const premiumJournal = `<!-- Premium Daily Update -->
                <section class="bg-gradient-to-br from-[#1a1c29] to-[#0f111a] border border-amber-500/30 backdrop-blur-3xl rounded-[2rem] p-4 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col min-h-[400px] sm:h-[500px] h-auto relative overflow-hidden group">
                    <!-- Decorative Premium Elements -->
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-400/30 transition-all duration-700"></div>
                    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <h2 class="text-xl sm:text-2xl font-black flex items-center gap-3 text-white border-b border-amber-500/30 pb-4 mb-4 relative z-10">
                        <i class="ph-fill ph-crown text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"></i> 
                        <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">Premium Daily Update</span>
                    </h2>
                    
                    <textarea id="journal-entry" class="flex-1 w-full bg-black/40 border border-amber-500/20 shadow-inner rounded-2xl p-6 text-sm font-bold text-amber-50 focus:ring-2 focus:ring-amber-500 outline-none resize-none placeholder:text-amber-500/40 relative z-10 transition-all duration-300" placeholder="Chronicle your legendary achievements, goals, and mindset for today..."></textarea>
                    
                    <div class="flex justify-between items-center mt-5 relative z-10">
                        <span class="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em]" id="journal-status"></span>
                        <button id="save-journal" class="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-3 transform hover:-translate-y-1">
                            <i class="ph-bold ph-paper-plane-tilt"></i> Commit Update
                        </button>
                    </div>
                </section>`;

html = html.replace(
    /<!-- Journal -->[\s\S]*?<\/section>/,
    premiumJournal
);

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
console.log("HTML successfully updated with Task Scheduler UI and Premium Daily Update!");
