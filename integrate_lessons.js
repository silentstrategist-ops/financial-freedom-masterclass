const fs = require('fs');
const path = require('path');

function parseCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const parsedRows = [];
  let currentField = [];
  let currentRow = [];
  let insideQuotes = false;
  
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    const nextChar = data[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField.push('"');
        i++; 
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.join(''));
      currentField = [];
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.join(''));
      currentField = [];
      parsedRows.push(currentRow);
      currentRow = [];
    } else {
      currentField.push(char);
    }
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.join(''));
    parsedRows.push(currentRow);
  }
  return parsedRows;
}

function parseInlineMarkdown(txt) {
  txt = txt.replace(/""([^"]+)""/g, '<span class="em">"$1"</span>');
  txt = txt.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  txt = txt.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  txt = txt.replace(/`([^`]+)`/g, '<code style="background:var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
  return txt;
}

function convertMarkdownToHTML(text) {
  const lines = text.split('\n').map(l => l.trim());
  let html = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const title = line.substring(3).trim();
      html += `<div class="sec-divider sr"><span>${title}</span></div>\n`;
      continue;
    }
    
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const title = line.substring(4).trim();
      html += `<h3 class="sec-title sr" style="font-size: 1.4rem; margin-top: 32px; margin-bottom: 16px; color: var(--gold);">${title}</h3>\n`;
      continue;
    }
    
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += `<ul style="list-style-type: none; padding-left: 20px; margin-bottom: 24px;">\n`;
        inList = true;
      }
      let itemText = line.substring(2).trim();
      itemText = parseInlineMarkdown(itemText);
      html += `  <li class="body-text sr" style="position: relative; padding-left: 15px; margin-bottom: 8px;">\n`;
      html += `    <span style="position: absolute; left: 0; color: var(--gold);">&bull;</span>\n`;
      html += `    ${itemText}\n`;
      html += `  </li>\n`;
      continue;
    }
    
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
    
    let pText = parseInlineMarkdown(line);
    if (pText.startsWith('<strong>') && pText.endsWith('</strong>') && pText.length < 180) {
      html += `<div class="card sr" style="margin-bottom: 28px; padding: 24px 32px; border-color: var(--gold-b); background: var(--gold-g);">\n`;
      html += `  <p class="body-text lg" style="margin: 0; text-align: center;">${pText}</p>\n`;
      html += `</div>\n`;
    } else {
      html += `<p class="body-text sr">${pText}</p>\n`;
    }
  }
  
  if (inList) {
    html += '</ul>\n';
  }
  
  return html;
}

const csvPath = 'C:/Users/KINGSLAY MIRIERI/.gemini/antigravity/brain/bb53db68-a699-47c7-9bef-afdee3a8c6aa/.user_uploaded/media_1787855836288.csv';
const parsed = parseCSV(csvPath);
parsed.shift(); // Remove header

let updated = 0;

parsed.forEach(row => {
  if (row.length < 3) return;
  const id = row[0].trim();
  const textContent = row[2].trim();
  
  const file = path.join('full-course', `module-${id}.html`);
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let html = fs.readFileSync(file, 'utf8');
  
  // Prevent double insertion
  if (html.includes('<!-- LESSON BODY -->')) {
    // Revert first to allow fresh insertion
    html = html.replace(/<!-- LESSON BODY -->[\s\S]*?<!-- END LESSON BODY -->/g, '');
  }
  
  const lessonHTML = convertMarkdownToHTML(textContent);
  
  const insertContent = `<!-- LESSON BODY -->\n<div class="lesson-body-container" style="max-width: 800px; margin: 40px auto 60px; padding: 0 10px;">\n${lessonHTML}\n</div>\n<!-- END LESSON BODY -->`;
  
  // Replace the first </section> occurrence
  html = html.replace('</section>', `</section>\n${insertContent}`);
  
  fs.writeFileSync(file, html);
  updated++;
});

console.log(`Successfully integrated written lessons into ${updated} cloned modules.`);
