const fs = require('fs');
const path = require('path');

let updated = 0;
for (let i = 1; i <= 62; i++) {
  let file = path.join('full-course', `module-${i}.html`);
  if (!fs.existsSync(file)) continue;
  
  let html = fs.readFileSync(file, 'utf8');
  
  // Replace Whop links inside whop-btn for Return to Course to local index.html
  html = html.replace(
    /href="https:\/\/whop\.com\/[^"]+"([^>]*class="whop-btn"[^>]*>&#8617; Return to Course)/g,
    'href="index.html"$1'
  );
  
  // Let's also make sure the top bar Return to Course button links to index.html
  html = html.replace(
    /href="https:\/\/whop\.com\/[^"]+"([^>]*class="whop-btn"[^>]*>↩ Return to Course)/g,
    'href="index.html"$1'
  );
  
  fs.writeFileSync(file, html);
  updated++;
}
console.log(`Updated Return to Course buttons in ${updated} files inside full-course/.`);
