const fs = require('fs');

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

const parsed = parseCSV('C:/Users/KINGSLAY MIRIERI/.gemini/antigravity/brain/bb53db68-a699-47c7-9bef-afdee3a8c6aa/.user_uploaded/media_1787855836288.csv');

const header = parsed.shift();
console.log('Headers:', header);
console.log('Total parsed rows:', parsed.length);

parsed.forEach((row, index) => {
  if (row.length >= 3) {
    console.log(`Row ${index + 1}: Module ID = "${row[0]}", Title = "${row[1]}", Content Length = ${row[2].length}`);
  } else {
    console.log(`Row ${index + 1} has invalid length:`, row);
  }
});
