const fs = require('fs');

const lines = fs.readFileSync('C:/Users/KINGSLAY MIRIERI/.gemini/antigravity/brain/bb53db68-a699-47c7-9bef-afdee3a8c6aa/.system_generated/logs/transcript_full.jsonl', 'utf8')
  .split('\n')
  .filter(Boolean);

const moduleSteps = {};

lines.forEach(l => {
  const p = JSON.parse(l);
  if (p.type === 'USER_INPUT' && p.content) {
    // Check for pattern like "MODULE 3" or "CH 1 M3" or headings
    const matches = p.content.match(/(?:MODULE|CH\s*\d+\s*M|CHAP)\s*(\d+)/gi);
    if (matches) {
      matches.forEach(m => {
        if (!moduleSteps[m]) moduleSteps[m] = [];
        moduleSteps[m].push({ step: p.step_index, len: p.content.length });
      });
    }
    // Also search for specific titles
    if (p.content.includes('Becoming The Version Of You')) {
      console.log(`Found Module 3 text in step ${p.step_index}`);
    }
    if (p.content.includes('Rewiring The Governor')) {
      console.log(`Found Module 4 text in step ${p.step_index}`);
    }
  }
});

console.log('Module references found in steps:', moduleSteps);
