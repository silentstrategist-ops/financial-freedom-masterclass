const fs = require('fs');

const steps = [97, 127, 260, 275, 296, 319, 337, 354, 366, 405, 574, 608, 630, 649, 667, 684, 711, 729, 746, 764];

const lines = fs.readFileSync('C:/Users/KINGSLAY MIRIERI/.gemini/antigravity/brain/bb53db68-a699-47c7-9bef-afdee3a8c6aa/.system_generated/logs/transcript_full.jsonl', 'utf8')
  .split('\n')
  .filter(Boolean);

let rawText = '';

steps.forEach(idx => {
  const step = lines.find(l => JSON.parse(l).step_index === idx);
  if (step) {
    const content = JSON.parse(step).content;
    // Strip user request tags if present
    const cleanContent = content.replace(/<USER_REQUEST>|<\/USER_REQUEST>|<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '').trim();
    rawText += `=== STEP ${idx} ===\n${cleanContent}\n\n`;
  }
});

fs.writeFileSync('raw_lessons_extracted.txt', rawText, 'utf8');
console.log('Successfully saved raw_lessons_extracted.txt. Size: ' + fs.statSync('raw_lessons_extracted.txt').size);
