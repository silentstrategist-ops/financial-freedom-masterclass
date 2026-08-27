const fs = require('fs');

const mData = [
  // CH 1
  {id:1, t:'The Foundation', d:'Understand the real meaning of rich vs. wealthy vs. free. Take the Fragility Test.'},
  {id:2, t:'The Fragility Trap', d:'Diagnose the four seasons of your financial life.'},
  {id:3, t:'The Mind Behind the Money', d:'Strategy without identity change is temporary.'},
  {id:4, t:'Your Internal Operating System', d:'Diagnose your financial OS.'},
  {id:5, t:'The Real Cost of Comfort', d:'Map your income concentration and reveal your true foundation.'},
  // CH 2
  {id:6, t:'Earn More (Inside)', d:'Master visibility and diagnose if you are a Workhorse, an Empty Suit, or a Linchpin.'},
  {id:7, t:'The Skills Audit', d:'Unbundle your job title into raw value. Avoid the Second Nature trap.'},
  {id:8, t:'The Late Bloomer Advantage', d:'Calculate your hidden moat and decrypt the overnight success myth.'},
  {id:9, t:'The Low-Risk Test', d:'Simulate the Dual Track approach and build your 30-day Micro-Test Blueprint.'},
  // CH 3
  {id:10, t:'Two Different Jobs', d:'Calculate your buffer, identify your idle surplus, and see the Silent Tax.'},
  {id:11, t:'The Debt Decoder', d:'Input your debts and map out the exact Avalanche and Snowball payoff paths.'},
  {id:12, t:'The Leak That Undoes Everything', d:'Automate the 50/30/20 split and simulate the 12-Month Freeze.'},
  {id:13, t:'Pressure Testing Defences', d:'The Bullshit Detector and the Structural Scam Visualizer.'},
  // CH 4
  {id:14, t:'The Bucket That Protects Everything Else', d:"Build your liquidity buffer to catch life's sudden shocks."},
  {id:15, t:'The Events Your Buffer Was Never Built For', d:'Close the protection gaps: Health, Life, Disability, and Asset Cover.'},
  {id:16, t:'Turning A Big Idea Into One Clear Number', d:'Calculate your exact Freedom Number and Partial Freedom target.'},
  // CH 5
  {id:17, t:'Why One Stock Is A Bet, And Many Is A Plan', d:'Spread your risk across industries, sizes, and countries.'},
  {id:18, t:'The Boring Tool That Actually Works', d:'Remove the guessing by owning the whole market through Index Funds and ETFs.'},
  {id:19, t:'The Familiar Route To Wealth', d:'Property and land are strong assets, but you must verify before you buy.'},
  {id:20, t:'The Financial World You Already Know', d:'SACCOs, table banking, and mobile money are trusted tools that quietly build wealth.'},
  {id:21, t:'The Mix Should Change As You Change', d:'Calculate your exact asset mix based on your age and timeline.'},
  // CH 6
  {id:22, t:'Why "Stealth" Is the Right Word', d:'Turn decades of accumulated experience into an actual second stream of income.'},
  {id:23, t:'A Word on Accuracy Before the Stories', d:'The average founder age for breakout companies is 45.0.'},
  {id:24, t:"Why This Module Isn't Optional", d:"Money habits are absorbed and negotiated inside a household. Talk to your partner."},
  {id:25, t:'Returning to Where This Course Started', d:'Freedom is structural autonomy. It changes your relationship to work.'},
  // CH 7
  {id:26, t:'Why This Chapter Exists', d:'You cannot sell what you have not named. Audit your expertise.'},
  {id:27, t:'The Phenomenon', d:'The sentence "I just did my job" is the most expensive sentence in your life.'},
  {id:28, t:'Tacit vs. Explicit Knowledge', d:'The market pays a premium for tacit knowledge.'},
  {id:29, t:'The Shadow Work Audit', d:'Extract your proof-of-work record from the hidden gaps in your role.'},
  {id:30, t:'The CCRI Framework', d:'Build your private database of Context, Complication, Resolution, and Impact.'},
  {id:31, t:'The Packaging Shift', d:'Turn raw experience into a named, priced offer and calculate your floor rate.'},
  {id:32, t:'The One-Line Value Statement', d:'Distill twenty years into a single sentence that makes the right people lean in.'},
  {id:33, t:'The Private Record', d:'The living document that acts as the operating manual for your own value.'},
  {id:34, t:'The Psychological Barrier', d:'Why this audit feels like lying, and how to reframe the Imposter Response.'},
  {id:35, t:'Connecting the Inventory to the Market', d:'You are not starting from zero. You are redirecting an existing asset.'},
  {id:36, t:'Chapter 7 Final Reflection', d:'Answer 12 foundational questions to lock in your offer before moving forward.'},
  // CH 8
  {id:37, t:'Why This Comes After Chapter 7', d:'Paper does not close deals. People do. Learn the expert posture.'},
  {id:38, t:'Where the Habit Comes From', d:'Identify and unlearn the reflexes that keep you acting like an employee.'},
  {id:39, t:'The Trap Almost Everyone Falls Into First', d:'Stop selling your hours and start selling your compressed pattern recognition.'},
  {id:40, t:"The Myth That's Been Sold to You", d:'Why clients actually prefer to hire founders and consultants in their 40s and 50s.'},
  {id:41, t:'The Old, Costly Definition', d:'How to overdeliver through clarity and foresight without sacrificing your weekends.'},
  {id:42, t:'Quiet Confidence Beats Loud Claims', d:'Master the quiet markers of real authority and hold the sales pause.'},
  // CH 9
  {id:43, t:'Why This Stage Of Life Fits Consulting Better', d:'Consulting sells judgment and pattern recognition, which only come from time.'},
  {id:44, t:"Why A Normal Resume Doesn't Work Here", d:'Translate your internal job responsibilities into specific, provable outcomes.'},
  {id:45, t:"Why Jumping To A Proposal Is A Beginner's Mistake", d:'Learn the four pillars of diagnostic questions to uncover the real problem.'},
  {id:46, t:'Why Hourly Pricing Quietly Punishes You', d:'Calculate your profit floor and escape the trap of selling your time.'},
  {id:47, t:'The Two Different Cost Pictures & Protecting The Practice', d:'Set written boundaries before scope creep turns a good deal into a loss.'},
  // CH 10
  {id:48, t:'The Line Most People Never Draw Clearly', d:'Understand the exact difference between consulting and coaching.'},
  {id:49, t:'Why "Life Coach" Is The Weakest Possible Starting Point', d:'Translate your lived experience into a specific, trust-earning lane.'},
  {id:50, t:'Why Structure Matters More Than Personality', d:'Build the repeatable session architecture that produces real change.'},
  {id:51, t:'Why Coaching Sells On Trust More Than Almost Anything Else', d:'Master the discovery call to earn trust before the first sale.'},
  {id:52, t:'The Real Ceiling Built Into One-On-One Coaching', d:'Package your work properly and calculate your true mathematical ceiling.'},
  // CH 11
  {id:53, t:'Why Warm Beats Cold, Almost Every Single Time', d:'Understand the transfer of trust that makes referrals so powerful.'},
  {id:54, t:'Give Before You Ask, Every Time', d:'Learn the four specific ways to give real value to your network.'},
  {id:55, t:'Referrals Rarely Just "Happen" On Their Own', d:'Master the timing and phrasing of the specific referral ask.'},
  {id:56, t:'Why The First Message Matters So Much', d:'Use the zero-agenda outreach template to reconnect naturally.'},
  {id:57, t:'Why Tracking Matters, Even For Something This Personal', d:'Build a minimalist tracking system that tests for genuine care.'},
  // CH 12
  {id:58, t:'Why "Get A Job" Is No Longer The Only Real Option', d:'Tour the modern menu: fractional, AI advisory, licensing, and board seats.'},
  {id:59, t:'Two Very Different Kinds Of Platforms', d:'Freelance marketplaces vs expert networks — mechanics, fit, and positioning.'},
  {id:60, t:'The Ceiling Every Time-For-Money Model Eventually Hits', d:'Build once, license many — escape the hourly cap with a documented framework.'},
  {id:61, t:'Getting Paid For Judgment, Not Hours', d:'Advisory board seats: compensation, traits, and how they are really won.'},
  {id:62, t:'Why This Matters More For You Than It Might Seem', d:'Use AI to protect your margins — drafting, research, and organizing without losing the judgment that makes you valuable.'}
];

let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard | Financial Freedom Masterclass</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root { --void:#030507; --gold:#C9A84C; --gold-l:#E8C97A; --gold-d:rgba(201,168,76,0.15); --gold-g:rgba(201,168,76,0.06); --border:rgba(255,255,255,0.07); --text:#EEF0F4; --muted:#7A8290; --surface:rgba(255,255,255,0.03); --r:20px; --rp:100px; --success:#2ECC71;}
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--void)}::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.3);border-radius:4px}
    body{background:var(--void);color:var(--text);font-family:'Cormorant Garamond',serif;overflow-x:hidden;min-height:100vh}
    .noise{position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999;opacity:0.07;mix-blend-mode:overlay;background-image:url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')}
    #ambient-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.25}
    main{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:80px 28px 80px}
    
    .hero{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 0}
    .hero-eyebrow{font-family:'Inter';font-size:0.68rem;letter-spacing:0.35em;color:var(--gold);text-transform:uppercase;margin-bottom:28px;}
    .hero-title{font-family:'Cinzel',serif;font-size:clamp(3rem,6vw,5.5rem);font-weight:900;line-height:1.05;color:#fff;margin-bottom:20px;}
    .hero-title .g{color:var(--gold)}
    .hero-sub{font-size:1.3rem;font-style:italic;color:var(--muted);max-width:580px;margin:0 auto;font-weight:300;}
    
    .chapter-wrap{margin-bottom:80px;}
    .chap-title{font-family:'Cinzel';font-size:2rem;color:#fff;margin-bottom:32px;display:flex;align-items:center;gap:24px;}
    .chap-title::after{content:'';flex:1;height:1px;background:var(--border);}

    .module-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;}
    .module-card{
      background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
      padding:36px 32px;cursor:pointer;transition:all 0.4s; text-decoration:none;display:flex;flex-direction:column;gap:12px;position:relative;overflow:hidden;
    }
    .module-card:hover{transform:translateY(-6px);border-color:rgba(201,168,76,0.3);background:var(--gold-g)}
    .mc-num{font-family:'Inter';font-size:0.6rem;letter-spacing:0.25em;color:var(--gold);text-transform:uppercase}
    .mc-title{font-family:'Cinzel';font-size:1.1rem;color:#fff;letter-spacing:0.04em}
    .mc-desc{font-size:1rem;color:var(--muted);line-height:1.6}
    .mc-arrow{font-family:'Inter';font-size:.7rem;color:var(--gold);margin-top:auto;padding-top:12px;letter-spacing:.1em;text-transform:uppercase}
    
    .mc-progress{margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
    .mc-prog-bar{width:100%;height:3px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:8px}
    .mc-prog-fill{height:100%;background:var(--gold);border-radius:3px;width:0%;transition:width .8s;}
    .mc-prog-labels{display:flex;justify-content:space-between;align-items:center}
    .mc-prog-text{font-family:'Inter';font-size:.6rem;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
    .mc-prog-decl{font-family:'Inter';font-size:.58rem;color:var(--success);letter-spacing:.08em;text-transform:uppercase;display:none}
    .mc-prog-decl.show{display:inline}
  </style>
</head>
<body>
<div class="noise"></div>
<canvas id="ambient-canvas"></canvas>
<main>
  <section class="hero">
    <p class="hero-eyebrow">Financial Freedom Masterclass</p>
    <h1 class="hero-title">Your Path to<br/><span class="g">Financial</span><br/>Freedom</h1>
    <p class="hero-sub">Select a module to begin its interactive infographic experience.</p>
  </section>

  <div class="chapter-wrap">
    <div class="chap-title">Chapter 1: The Foundation</div>
    <div class="module-grid">`;

for(let i=0;i<5;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 2: Earn More</div>
  <div class="module-grid">`;

for(let i=5;i<9;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 3: Manage Better</div>
  <div class="module-grid">`;

for(let i=9;i<13;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 4: The Ultimate Defence</div>
  <div class="module-grid">`;

for(let i=13;i<16;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 5: The Master Mix</div>
  <div class="module-grid">`;

for(let i=16;i<21;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 6: Stealth & Autonomy</div>
  <div class="module-grid">`;

for(let i=21;i<25;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 7: The Expertise Audit</div>
  <div class="module-grid">`;

for(let i=25;i<36;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 8: The Posture Shift</div>
  <div class="module-grid">`;

for(let i=36;i<42;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 9: The Consulting Offer</div>
  <div class="module-grid">`;

for(let i=42;i<47;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 10: The Coaching Architecture</div>
  <div class="module-grid">`;

for(let i=47;i<52;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 11: Relationships & Referrals</div>
  <div class="module-grid">`;

for(let i=52;i<57;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
<div class="chapter-wrap">
  <div class="chap-title">Chapter 12: The Modern Menu</div>
  <div class="module-grid">`;

for(let i=57;i<62;i++){
  const m = mData[i];
  html += `<a href="module-${m.id}.html" class="module-card">
    <div class="mc-num">Module ${m.id.toString().padStart(2,'0')}</div>
    <div class="mc-title">${m.t}</div>
    <div class="mc-desc">${m.d}</div>
    <div class="mc-arrow">Open Interactive →</div>
    <div class="mc-progress">
      <div class="mc-prog-bar"><div class="mc-prog-fill" id="prog-fill-${m.id}"></div></div>
      <div class="mc-prog-labels"><span class="mc-prog-text" id="prog-text-${m.id}">0 / 10 reflections</span><span class="mc-prog-decl" id="prog-decl-${m.id}">✓ Declared</span></div>
    </div>
  </a>`;
}

html += `</div></div>
</main>
<script>
  function checkModule(moduleId) {
    let numR = 10;
    if(moduleId===1) numR=3;
    if(moduleId===2) numR=4;
    
    let written = 0;
    for(let i=1; i<=numR; i++){
      if(localStorage.getItem('ffm'+moduleId+'_r'+i)) written++;
    }
    const pct = (written/numR)*100;
    
    const fillEl = document.getElementById('prog-fill-'+moduleId);
    if(fillEl) fillEl.style.width = pct + '%';
    
    const textEl = document.getElementById('prog-text-'+moduleId);
    if(textEl) {
      if(written === numR) {
         textEl.textContent = 'Completed';
         textEl.style.color = 'var(--gold)';
      } else {
         textEl.textContent = written + ' / ' + numR + ' reflections';
      }
    }
    
    const dec = localStorage.getItem('ffm'+moduleId+'_declaration');
    if(dec) {
      const declEl = document.getElementById('prog-decl-'+moduleId);
      if(declEl) declEl.classList.add('show');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    for(let i=1; i<=62; i++){
      checkModule(i);
    }
    
    const canvas = document.getElementById('ambient-canvas');
    if(canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles = [];
      for(let i=0;i<40;i++) particles.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*2+1, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5});
      function anim(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = 'rgba(201,168,76,0.3)';
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if(p.x<0||p.x>canvas.width) p.vx*=-1;
          if(p.y<0||p.y>canvas.height) p.vy*=-1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        });
        requestAnimationFrame(anim);
      }
      anim();
    }
  });
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
