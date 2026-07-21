const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');
const js = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost" });

// Mock localStorage
dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

// Mock Firebase ES modules to prevent network issues
const script = dom.window.document.createElement('script');
script.textContent = js.replace(/import \{.*?\} from "https:\/\/.*?";/g, '');
dom.window.document.head.appendChild(script);

dom.window.addEventListener('error', (e) => {
  console.error("JSDOM Error:", e.error);
});

// manually trigger DOMContentLoaded
const event = dom.window.document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
dom.window.document.dispatchEvent(event);

setTimeout(() => {
    console.log("Tabs attached successfully? ", typeof dom.window.initTabs);
}, 1000);
