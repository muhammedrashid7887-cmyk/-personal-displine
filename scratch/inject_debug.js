const fs = require('fs');
const html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

// Debug script to be injected into index.html to catch any errors globally
const debugScript = `
<script>
window.addEventListener('error', function(e) {
    alert("JS Error: " + e.message + " at " + e.filename + ":" + e.lineno);
});
window.addEventListener('unhandledrejection', function(e) {
    alert("Promise Error: " + e.reason);
});
</script>
`;

// Inject into head
const newHtml = html.replace('</head>', debugScript + '</head>');
fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', newHtml);
