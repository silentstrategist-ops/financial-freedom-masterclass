const fs = require('fs');

let updated = 0;
for (let i = 1; i <= 62; i++) {
  let file = 'module-'+i+'.html';
  if (!fs.existsSync(file)) continue;
  
  let html = fs.readFileSync(file, 'utf8');
  
  let whopMatch = html.match(/href="(https:\/\/whop\.com\/silent-strategist\/[^"]+)"/);
  let whopUrl = whopMatch ? whopMatch[1] : 'https://whop.com/silent-strategist/';
  
  let mainEndIndex = html.lastIndexOf('</main>');
  if (mainEndIndex === -1) continue;
  
  let contentBeforeMainEnd = html.substring(0, mainEndIndex);
  let lastDivIndex = contentBeforeMainEnd.lastIndexOf('<div');
  
  let newNav = '<div style="display:flex;justify-content:center;align-items:center;margin-top:60px;margin-bottom:20px;flex-wrap:wrap;gap:16px" class="sr">\n';
  
  if (i > 1) {
    newNav += '  <a href="module-'+(i-1)+'.html" class="whop-btn" style="text-decoration:none; background:transparent; color:var(--gold); border:1px solid var(--gold);">&#8592; Previous</a>\n';
  }
  
  newNav += '  <a href="'+whopUrl+'" class="whop-btn" style="text-decoration:none;">&#8617; Return to Course</a>\n';
  
  if (i < 62 && i !== 5) {
    newNav += '  <a href="module-'+(i+1)+'.html" class="whop-btn" style="text-decoration:none; background:transparent; color:var(--gold); border:1px solid var(--gold);">Next Module &#8594;</a>\n';
  }
  
  newNav += '</div>\n';
  
  if (lastDivIndex !== -1 && contentBeforeMainEnd.substring(lastDivIndex).includes('Return to Course')) {
     html = html.substring(0, lastDivIndex) + newNav + html.substring(mainEndIndex);
  } else {
     html = contentBeforeMainEnd + '\n' + newNav + html.substring(mainEndIndex);
  }
  
  fs.writeFileSync(file, html);
  updated++;
}
console.log('Updated ' + updated + ' modules.');
