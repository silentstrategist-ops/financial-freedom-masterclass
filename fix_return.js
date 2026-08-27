const fs = require('fs');

let updated = 0;
for (let i = 1; i <= 62; i++) {
  let file = 'module-'+i+'.html';
  if (!fs.existsSync(file)) continue;
  
  let html = fs.readFileSync(file, 'utf8');
  
  // Replace the "Return to Course" link with index.html
  // The new button should link to index.html (local dashboard)
  html = html.replace(
    /(<a [^>]*class="whop-btn"[^>]*style="text-decoration:none;">&#8617; Return to Course<\/a>)/g,
    '<a href="index.html" class="whop-btn" style="text-decoration:none;">&#8617; Return to Course</a>'
  );
  
  fs.writeFileSync(file, html);
  updated++;
}
console.log('Updated ' + updated + ' modules.');
