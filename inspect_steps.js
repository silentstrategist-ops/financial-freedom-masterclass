const fs = require('fs');

const content = fs.readFileSync('raw_lessons_extracted.txt', 'utf8');
const steps = content.split('=== STEP ');

steps.forEach(stepBlock => {
  if (!stepBlock.trim()) return;
  const lines = stepBlock.split('\n').filter(l => l.trim());
  const header = lines[0]; // e.g. "97 ==="
  console.log(`STEP ${header}:`);
  for (let i = 1; i < Math.min(lines.length, 10); i++) {
    console.log(`  L${i}: ${lines[i]}`);
  }
  console.log('---');
});
