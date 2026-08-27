const fs = require('fs');

const raw = fs.readFileSync('raw_lessons_extracted.txt', 'utf8');

// Regex to capture module markers:
// Matches: 
// - CH 4 M1
// - MODULE 1
// - MODULE 3 CHAP 2
// - Module 1 (followed by title)
// - The Cost of Peace: Rich, Wealthy, or Free (at step boundaries)
// Let's first clean up STEP markers and parse it sequentially.

const steps = raw.split(/=== STEP \d+ ===/);
const moduleTexts = {};

// We will manually process each step to ensure perfect mapping
// Step 97 -> Module 1
moduleTexts[1] = steps[1].trim();

// Step 127 -> Module 2
moduleTexts[2] = steps[2].trim();

// Step 260 -> Module 3 (Becoming The Version...)
moduleTexts[3] = steps[3].trim();

// Step 275 -> Module 4
moduleTexts[4] = steps[4].trim();

// Step 296 -> Module 5
moduleTexts[5] = steps[5].trim();

// Step 319 -> Module 6
moduleTexts[6] = steps[6].trim();

// Step 337 -> Module 7
moduleTexts[7] = steps[7].trim();

// Step 354 -> Module 8
moduleTexts[8] = steps[8].trim();

// Step 366 -> Module 9
moduleTexts[9] = steps[9].trim();

// Now, steps that contain multiple modules:
// Step 405 (or 511) -> Modules 10-13 (Chapter 3)
// Let's split them by MODULE markers
function splitStepByMarkers(text, markers, startId) {
  let currentId = startId;
  const lines = text.split('\n');
  let currentContent = [];
  
  lines.forEach(line => {
    let matched = false;
    for (const m of markers) {
      if (line.trim().match(m.regex)) {
        if (currentContent.length > 0) {
          moduleTexts[currentId] = currentContent.join('\n').trim();
          currentContent = [];
        }
        currentId = m.id;
        matched = true;
        break;
      }
    }
    if (!matched) {
      currentContent.push(line);
    }
  });
  if (currentContent.length > 0) {
    moduleTexts[currentId] = currentContent.join('\n').trim();
  }
}

// Step 511 (Modules 10-13)
// Module 10: "Two Different Jobs"
// Module 11: "Debt Avalanche vs Debt Snowball"
// Module 12: "Lifestyle Inflation"
// Module 13: "Recognising Scams and Manipulation" (or similar)
splitStepByMarkers(steps[10], [
  { regex: /Two Different Jobs/i, id: 10 },
  { regex: /Debt Avalanche/i, id: 11 },
  { regex: /Lifestyle Inflation/i, id: 12 },
  { regex: /Recognising Scams|Why This Chapter Exists/i, id: 13 }
], 10);

// Step 574 (Modules 14-16)
splitStepByMarkers(steps[11], [
  { regex: /CH 4 M1|The Bucket That Protects/i, id: 14 },
  { regex: /CH 4 M2|The Events Your Buffer/i, id: 15 },
  { regex: /CH 4 M3|Turning A Big Idea/i, id: 16 }
], 14);

// Step 608 (Modules 17-21)
splitStepByMarkers(steps[12], [
  { regex: /CH 5 M1|Why One Stock Is A Bet/i, id: 17 },
  { regex: /CH 5 M2|The Boring Tool/i, id: 18 },
  { regex: /CH 5 M3|The Familiar Route/i, id: 19 },
  { regex: /CH 5 M4|The Financial World/i, id: 20 },
  { regex: /CH 5 M5|The Mix Should Change/i, id: 21 }
], 17);

// Step 630 (Modules 22-25)
splitStepByMarkers(steps[13], [
  { regex: /CH 6 M1|Why "Stealth" Is the Right Word/i, id: 22 },
  { regex: /CH 6 M2|A Word on Accuracy/i, id: 23 },
  { regex: /CH 6 M3|Why This Module Isn't Optional/i, id: 24 },
  { regex: /CH 6 M4|Returning to Where This Course/i, id: 25 }
], 22);

// Step 649 (Modules 26-30)
splitStepByMarkers(steps[14], [
  { regex: /CH 7 M1|Why This Chapter Exists/i, id: 26 },
  { regex: /CH 7 M2|The Phenomenon/i, id: 27 },
  { regex: /CH 7 M3|Tacit Knowledge vs/i, id: 28 },
  { regex: /CH 7 M4|The Shadow Work/i, id: 29 },
  { regex: /CH 7 M5|The CCRI Framework/i, id: 30 }
], 26);

// Step 667 (Modules 31-36)
splitStepByMarkers(steps[15], [
  { regex: /CH 7 M6|The Packaging Shift/i, id: 31 },
  { regex: /CH 7 M7|The One-Line Value/i, id: 32 },
  { regex: /CH 7 M8|The Private Record/i, id: 33 },
  { regex: /CH 7 M9|The Psychological Barrier/i, id: 34 },
  { regex: /CH 7 M10|Connecting the Inventory/i, id: 35 },
  { regex: /CH 7 M11|Step 7: The Full Skills Audit/i, id: 36 }
], 31);

// Step 684 (Modules 37-42)
splitStepByMarkers(steps[16], [
  { regex: /CH 8 M1|Why This Comes After/i, id: 37 },
  { regex: /CH 8 M2|The Habit of Asking/i, id: 38 },
  { regex: /CH 8 M3|Why You Must Stop Selling/i, id: 39 },
  { regex: /CH 8 M4|Your Age Is Not a Weakness/i, id: 40 },
  { regex: /CH 8 M5|Redefining What It Means/i, id: 41 },
  { regex: /CH 8 M6|How to Signal Real/i, id: 42 }
], 37);

// Step 711 (Modules 43-48)
splitStepByMarkers(steps[17], [
  { regex: /CH 9 M1|Why This Stage Of Life/i, id: 43 },
  { regex: /CH 9 M2|Repackaging Your Experience/i, id: 44 },
  { regex: /CH 9 M3|The Diagnostic First/i, id: 45 },
  { regex: /CH 9 M4|Pricing And Retainer/i, id: 46 },
  { regex: /CH 9 M5|Protecting Your Practice/i, id: 47 },
  { regex: /CH 9 M6|Why Coaching Is A Different/i, id: 48 }
], 43);

// Step 729 (Modules 49-52)
splitStepByMarkers(steps[18], [
  { regex: /CH 10 M1|Choosing Your Coaching Lane|Life Coach/i, id: 49 },
  { regex: /CH 10 M2|The Coaching Relationship/i, id: 50 },
  { regex: /CH 10 M3|Building Trust/i, id: 51 },
  { regex: /CH 10 M4|Pricing And Packaging Your Coaching/i, id: 52 }
], 49);

// Step 746 (Modules 53-57)
splitStepByMarkers(steps[19], [
  { regex: /CH 11 M1|Why Warm Beats Cold/i, id: 53 },
  { regex: /CH 11 M2|Give Before You Ask|Value-First/i, id: 54 },
  { regex: /CH 11 M3|Referrals Rarely Just/i, id: 55 },
  { regex: /CH 11 M4|The Low-Pressure First Message/i, id: 56 },
  { regex: /CH 11 M5|Tracking Without/i, id: 57 }
], 53);

// Step 764 (Modules 58-62)
splitStepByMarkers(steps[20], [
  { regex: /CH 12 M1|Why "Get A Job" Is No Longer/i, id: 58 },
  { regex: /CH 12 M2|Two Very Different Kinds Of Platforms|Freelance/i, id: 59 },
  { regex: /CH 12 M3|Licensing Frameworks/i, id: 60 },
  { regex: /CH 12 M4|Advisory Boards/i, id: 61 },
  { regex: /CH 12 M5|AI-Assisted/i, id: 62 }
], 58);

// Print validation report
for(let i=1; i<=62; i++){
  const txt = moduleTexts[i];
  if(txt) {
    console.log(`M${i}: Length = ${txt.length}, Preview = ${txt.substring(0, 100).replace(/\n/g, ' ')}`);
  } else {
    console.log(`M${i} MISSING`);
  }
}
