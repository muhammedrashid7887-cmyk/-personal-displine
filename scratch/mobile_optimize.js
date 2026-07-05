const fs = require('fs');

let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf-8');

// 1. Fix panel paddings (p-8 -> p-4 sm:p-8)
html = html.replace(/p-8/g, 'p-4 sm:p-8');

// 2. Fix fixed heights on Task Manager and Journal (h-[500px] -> min-h-[400px] sm:h-[500px])
html = html.replace(/h-\[500px\]/g, 'min-h-[400px] sm:h-[500px] h-auto');

// 3. Make date slider scrollable on mobile if it overflows, instead of hidden
html = html.replace(/overflow-hidden gap-1 sm:gap-2/g, 'overflow-x-auto no-scrollbar gap-2');

// 4. Increase tap target / padding for inputs and buttons on mobile
html = html.replace(/px-4 py-3/g, 'px-4 py-3 sm:py-4'); // Inputs

// 5. Ensure grid gaps are smaller on mobile
html = html.replace(/gap-8/g, 'gap-4 sm:gap-8');
html = html.replace(/gap-6/g, 'gap-4 sm:gap-6');

// 6. Adjust text sizes for mobile
html = html.replace(/text-2xl font-black/g, 'text-xl sm:text-2xl font-black');

// 7. Ledger and transactions - ensure they aren't cramped
html = html.replace(/max-h-\[150px\]/g, 'max-h-[200px]');
html = html.replace(/max-h-\[160px\]/g, 'max-h-[250px]');

// 8. Fix "Today's Summary" Finance Tracker grid (3 columns might be cramped on very small phones)
html = html.replace(/grid grid-cols-3 gap-3/g, 'grid grid-cols-1 sm:grid-cols-3 gap-3');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
