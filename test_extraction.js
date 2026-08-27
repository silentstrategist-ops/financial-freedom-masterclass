const fs = require('fs');

const steps = [97, 127, 275, 296, 319, 337, 354, 366, 405, 511, 574, 608, 630, 649, 667, 684, 711, 729, 746, 764];

const lines = fs.readFileSync('C:/Users/KINGSLAY MIRIERI/.gemini/antigravity/brain/bb53db68-a699-47c7-9bef-afdee3a8c6aa/.system_generated/logs/transcript_full.jsonl', 'utf8')
  .split('\n')
  .filter(Boolean);

steps.forEach(idx => {
  const step = lines.find(l => JSON.parse(l).step_index === idx);
  if (step) {
    const content = JSON.parse(step).content;
    console.log(`Step ${idx}: Length = ${content.length}, Preview = ${content.substring(0, 100).replace(/\n/g, ' ')}`);
  } else {
    console.log(`Step ${idx} not found`);
  }
});
