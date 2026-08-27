const fs = require('fs');

const cssTemplate = `
    :root {
      --void: #030507; --deep: #060A12; --surface: rgba(255, 255, 255, .03); --surface2: rgba(255, 255, 255, .06);
      --gold: #C9A84C; --gold-l: #E8C97A; --gold-d: rgba(201, 168, 76, .15); --gold-g: rgba(201, 168, 76, .06); --gold-b: rgba(201, 168, 76, .25);
      --text: #EEF0F4; --muted: #7A8290; --muted2: #4A5260; --danger: #E84855; --success: #2ECC71; --cyan: #4FC3F7; --purple: #9B7FE8;
      --border: rgba(255, 255, 255, .07); --r: 20px; --rp: 100px;
    }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--void); } ::-webkit-scrollbar-thumb { background: var(--gold-b); border-radius: 4px; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--void); color: var(--text); font-family: 'Cormorant Garamond', serif; overflow-x: hidden; line-height: 1.7; }
    .noise { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999; opacity: .08; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
    main { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 0 28px 180px; }
    @media(max-width:640px) { main { padding: 0 18px 180px; } }
    .tag { font-family: 'Inter'; font-size: .65rem; letter-spacing: .3em; color: var(--gold); text-transform: uppercase; display: inline-block; margin-bottom: 14px; }
    .sec-title { font-family: 'Cinzel', serif; font-size: clamp(1.4rem, 3vw, 2.2rem); font-weight: 700; color: #fff; letter-spacing: .05em; margin-bottom: 1rem; line-height: 1.2; }
    .body-text { font-size: 1.18rem; font-weight: 300; color: var(--text); margin-bottom: 1rem; line-height: 1.85; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 44px 48px; margin-bottom:24px;}
    .sec-divider { display: flex; align-items: center; gap: 16px; margin: 80px 0 32px; }
    .sec-divider::before, .sec-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .sec-divider span { font-family: 'Inter'; font-size: .6rem; letter-spacing: .25em; color: var(--gold); text-transform: uppercase; white-space: nowrap; }
    .hero { min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 0 60px; }
    .hero-eyebrow { font-family: 'Inter'; font-size: .68rem; letter-spacing: .35em; color: var(--gold); text-transform: uppercase; margin-bottom: 28px; }
    .hero-title { font-family: 'Cinzel', serif; font-size: clamp(2.8rem, 6vw, 4.5rem); font-weight: 900; line-height: 1.1; color: #fff; margin-bottom: 24px; max-width:900px; }
    .hero-title .g { color: var(--gold); font-style: italic; }
    .hero-sub { font-size: 1.3rem; font-style: italic; color: var(--muted); max-width: 680px; margin: 0 auto 56px; font-weight: 300; }
    
    .journal-section { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
    .journal-item { background: var(--deep); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: .3s; }
    .journal-item:focus-within { border-color: var(--gold-b); }
    .journal-q { padding: 24px 28px 16px; font-size: 1.1rem; font-style: italic; color: var(--text); line-height: 1.6; }
    .journal-q strong { font-style: normal; font-family: 'Inter'; font-size: .58rem; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 8px; }
    .journal-item textarea { width: 100%; padding: 16px 28px 24px; background: none; border: none; border-top: 1px solid var(--border); color: var(--text); font-family: 'Cormorant Garamond'; font-size: 1.05rem; line-height: 1.7; resize: vertical; min-height: 100px; outline: none; }
    .journal-item textarea:focus { background: var(--surface); }
    .journal-item textarea::placeholder { color: var(--muted2); font-style: italic; }
    
    .decl-box { text-align: center; padding: 80px 48px; border: 1px dashed var(--gold-b); border-radius: var(--r); background: radial-gradient(circle at 50% 0%, rgba(201,168,76,.06) 0%, transparent 65%); margin-top: 60px; }
    .decl-text { font-size: clamp(1.2rem, 2.5vw, 1.7rem); font-style: italic; font-weight: 300; line-height: 1.65; color: var(--text); max-width: 680px; margin: 0 auto 40px; }
    .decl-input-wrap { display: flex; gap: 12px; justify-content: center; max-width: 480px; margin: 0 auto; }
    .decl-input { flex: 1; padding: 14px 20px; background: var(--void); border: 1px solid var(--gold-b); border-radius: var(--rp); color: var(--gold); font-family: 'Cinzel'; font-size: 1rem; text-align: center; outline: none; transition: .3s; }
    .decl-input:focus { border-color: var(--gold); }
    .decl-btn { padding: 14px 28px; border-radius: var(--rp); border: 1px solid var(--gold-b); background: none; color: var(--gold); font-family: 'Inter'; font-size: .72rem; letter-spacing: .15em; text-transform: uppercase; cursor: pointer; transition: .3s; }
    .decl-btn:hover { background: var(--gold); color: var(--void); }
    .decl-hint { font-family: 'Inter'; font-size: .65rem; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; margin-top: 12px; }
    .decl-sealed-msg { display: none; margin-top: 28px; } .decl-sealed-msg.show { display: block; }
    
    .whop-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: rgba(3,5,7,.95); border-top: 1px solid var(--border); backdrop-filter: blur(14px); padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .wb-left { display: flex; align-items: center; gap: 16px; }
    .wb-module { display: flex; flex-direction: column; }
    .wb-m-label { font-family: 'Inter'; font-size: .6rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
    .wb-m-name { font-family: 'Cinzel'; font-size: .78rem; color: var(--text); letter-spacing: .05em; }
    .wb-progress-wrap { display: flex; align-items: center; gap: 10px; }
    .wb-p-label { font-family: 'Inter'; font-size: .62rem; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
    .wb-p-track { width: 120px; height: 3px; background: var(--border); border-radius: 3px; overflow: hidden; }
    .wb-p-fill { height: 100%; background: var(--gold); width: 0%; transition: width .2s; border-radius: 3px; }
    .whop-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: var(--rp); background: var(--gold); color: var(--void); font-family: 'Inter'; font-size: .72rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; border: none; text-decoration: none; transition: .3s; white-space: nowrap; }
    .whop-btn:hover { background: #fff; transform: translateY(-1px); }
`;

function generateModule(id, title, gTitle, heroSub, bodyHtml, qs, decText, whopLink) {
  let journalHtml = '';
  qs.forEach((q, i) => {
    journalHtml += `
      <div class="journal-item">
        <div class="journal-q"><strong>Question ${(i+1).toString().padStart(2,'0')}</strong>${q}</div>
        <textarea id="j${id}_${i+1}" placeholder="Write your reflection here..." oninput="saveJ(${i+1})"></textarea>
      </div>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Module ${id}: ${title} | Financial Freedom Masterclass</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    ${cssTemplate}
    ${bodyHtml.css || ''}
  </style>
</head>
<body>
<div class="noise"></div>

<div class="whop-bar">
  <div class="wb-left">
    <div class="wb-module">
      <div class="wb-m-label">Currently Viewing</div>
      <div class="wb-m-name">Module ${id} · ${title}</div>
    </div>
    <div class="wb-progress-wrap">
      <span class="wb-p-label">Progress</span>
      <div class="wb-p-track"><div class="wb-p-fill" id="pfill"></div></div>
    </div>
  </div>
  <div style="display:flex;gap:12px">
    <a href="index.html" class="whop-btn" style="background:var(--surface);color:#fff;border:1px solid var(--border)">← Dashboard</a>
    <a href="${whopLink}" class="whop-btn">↩ Return to Course</a>
  </div>
</div>

<main>
  <section class="hero">
    <p class="hero-eyebrow">Financial Freedom Masterclass · Module ${id}</p>
    <h1 class="hero-title">${gTitle}</h1>
    <p class="hero-sub">${heroSub}</p>
  </section>

  <section>
    ${bodyHtml.html}
  </section>

  <div class="sec-divider"><span>Step ${id-1} Integration</span></div>

  <section>
    <h2 class="sec-title" style="text-align:center">Plan Your Own Approach</h2>
    <div class="journal-section">
      ${journalHtml}
    </div>

    <div class="decl-box">
      <p class="tag" style="margin-bottom:16px;letter-spacing:0.2em">SEAL YOUR COMMITMENT</p>
      <p class="decl-text">"${decText}"</p>
      <div class="decl-input-wrap" id="d-wrap">
        <input type="text" class="decl-input" id="d-input" placeholder="Type &quot;I ACCEPT&quot; to seal this" />
        <button class="decl-btn" id="d-btn" onclick="seal()">SEAL</button>
      </div>
      <p class="decl-hint" id="d-hint">TYPE "I ACCEPT" AND PRESS SEAL</p>
      <div class="decl-sealed-msg" id="d-msg">
        <p style="font-family:'Cinzel';color:var(--gold);font-size:.9rem;letter-spacing:.1em">✓ DECLARATION SEALED</p>
        <div id="d-date" style="font-family:'Inter';font-size:.65rem;color:var(--muted);margin-top:8px;letter-spacing:.1em"></div>
      </div>
    </div>
  </section>

</main>

<script>
${bodyHtml.js || ''}
function saveJ(n){
  const v = document.getElementById('j${id}_'+n).value;
  localStorage.setItem('ffm${id}_r'+n, v);
}

function loadJ(){
  for(let i=1;i<=${qs.length};i++){
    const saved = localStorage.getItem('ffm${id}_r'+i);
    const el = document.getElementById('j${id}_'+i);
    if(saved && el) el.value = saved;
  }
  const dec = localStorage.getItem('ffm${id}_declaration');
  if(dec){
    document.getElementById('d-wrap').style.display='none';
    const hint = document.getElementById('d-hint'); if(hint) hint.style.display='none';
    document.getElementById('d-msg').classList.add('show');
    document.getElementById('d-date').textContent = dec;
  }
}

function seal(){
  const input = document.getElementById('d-input');
  if(input.value.trim().toUpperCase() !== 'I ACCEPT'){
    input.style.borderColor = 'var(--danger)';
    setTimeout(() => input.style.borderColor = '', 500);
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const sig = 'Declared on ' + dateStr;
  localStorage.setItem('ffm${id}_declaration', sig);
  document.getElementById('d-wrap').style.display='none';
  const hint = document.getElementById('d-hint'); if(hint) hint.style.display='none';
  document.getElementById('d-msg').classList.add('show');
  document.getElementById('d-date').textContent = sig;
}

window.addEventListener('scroll', () => {
  const pfill = document.getElementById('pfill');
  if(pfill) {
    let scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    pfill.style.width = scrollPct + '%';
  }
});

window.addEventListener('DOMContentLoaded', loadJ);
</script>
</body>
</html>`;
}

// ==========================================
// MODULE 31 DATA
// ==========================================
const m31 = {
  id: 31,
  title: 'The Packaging Shift',
  gTitle: 'The Packaging <br/><span class="g">Shift</span>',
  heroSub: 'Turning Raw Experience Into a Named, Priced Offer. Moving from "here\'s what I can do" to "here\'s what changes for you if you work with me."',
  qs: [
    'Write down a generic "skill" you have. Now rewrite it as an "offer" containing the specific problem, outcome, and mechanism.',
    'What is the specific, painful "Before" state your ideal client is currently experiencing?',
    'What is the tangible, quantifiable "After" state they will experience after working with you?',
    'What is the descriptive name of your offer? (e.g., "The 90-Day Delivery Reset")',
    'Calculate your floor price using the formula. How does that number feel to you?'
  ],
  dec: 'I will package my value as a specific solution to a specific problem. I will not accept engagements below my floor rate.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_5YJRtzV61ljU3/',
  body: {
    css: `
      .floor-calc { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; margin: 40px 0; }
      .fc-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
      .fc-row:last-child { border-bottom: none; }
      .fc-label { font-family: 'Cinzel'; font-size: 1.1rem; color: var(--text); }
      .fc-input { background: var(--void); border: 1px solid var(--gold-d); color: var(--gold); padding: 8px 16px; border-radius: 8px; width: 140px; text-align: center; font-family: 'Inter'; outline: none; }
      .fc-input:focus { border-color: var(--gold); }
      .fc-total { margin-top: 32px; padding-top: 24px; border-top: 2px dashed var(--gold-d); text-align: center; }
      .fc-total-num { font-family: 'Cinzel'; font-size: 3rem; color: var(--gold); font-weight: 700; line-height: 1; margin: 12px 0; }
      .fc-total-desc { font-family: 'Inter'; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">A skill is what you can do. An offer is what they buy.</h2>
        <p class="body-text">"I'm good at project management" is a skill. It's impossible to price. "I help Series B SaaS companies hit 90%+ sprint completion within two quarters without adding headcount" is an offer. It names the buyer, the problem, the outcome, the timeline, and the constraint.</p>
      </div>
      
      <div class="floor-calc">
        <h2 class="sec-title" style="text-align:center; margin-bottom:24px">The Floor-Price Calculator</h2>
        <p class="body-text" style="text-align:center; font-size:0.95rem; margin-bottom:32px">Establish the absolute minimum you will accept for your time and judgment. (Formula: Total Comp / Billable Hours × 2.5)</p>
        
        <div class="fc-row">
          <div class="fc-label">Current Salary & Benefits ($)</div>
          <input type="number" class="fc-input" id="fc-comp" value="160000" oninput="calcFloor()" />
        </div>
        <div class="fc-row">
          <div class="fc-label">Annual Billable Hours (e.g. 1200)</div>
          <input type="number" class="fc-input" id="fc-hours" value="1200" oninput="calcFloor()" />
        </div>
        
        <div class="fc-total">
          <div class="fc-total-desc">YOUR MINIMUM FLOOR RATE (PER HOUR)</div>
          <div class="fc-total-num" id="fc-total">$333</div>
          <p class="body-text" style="font-size:0.9rem; color:var(--muted); margin-top:12px">This is not your market rate. Your market rate may be significantly higher. But this is the number below which you do not go. Ever.</p>
        </div>
      </div>
    `,
    js: `
      function calcFloor() {
        const comp = parseFloat(document.getElementById('fc-comp').value) || 0;
        const hours = parseFloat(document.getElementById('fc-hours').value) || 1200;
        if(hours > 0) {
          const rate = Math.round((comp / hours) * 2.5);
          document.getElementById('fc-total').textContent = '$' + rate;
        }
      }
    `
  }
};

// ==========================================
// MODULE 32 DATA
// ==========================================
const m32 = {
  id: 32,
  title: 'The One-Line Value Statement',
  gTitle: 'The One-Line <br/><span class="g">Value Statement</span>',
  heroSub: 'Distilling twenty years of experience into one sentence. This is not a marketing slogan. It is a conversation tool designed to make the right people lean in.',
  qs: [
    'Write the [Specific Target] component of your statement. Who specifically do you help?',
    'Write the [Specific, Measurable Outcome]. What exactly changes?',
    'Write [Your Unique Mechanism]. How do you get them from Before to After?',
    'Read your combined statement out loud. Does it feel uncomfortably specific? (If yes, you are on the right track).',
    'Who in your network needs to hear this exact sentence this week?'
  ],
  dec: 'I will replace my job title with my value statement. I will be specific enough to be immediately understood by the right buyer.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_MsJeXK2xlAmgx/',
  body: {
    css: `
      .gen-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; margin: 40px 0; }
      .gen-input { width: 100%; background: var(--surface); border: 1px solid var(--border); color: #fff; padding: 14px; border-radius: 8px; font-family: 'Inter'; font-size: 0.95rem; margin-bottom: 20px; outline: none; }
      .gen-input:focus { border-color: var(--gold); }
      .gen-label { font-family: 'Inter'; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block; }
      .gen-result { background: rgba(201,168,76,0.05); border: 1px dashed var(--gold-d); padding: 32px; border-radius: 12px; margin-top: 24px; text-align: center; }
      .gr-text { font-family: 'Cinzel'; font-size: 1.5rem; color: #fff; line-height: 1.5; }
      .gr-text span { color: var(--gold); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Filter</h2>
        <p class="body-text">If your answer to "what do you do?" is a job title, the conversation dies. If your answer is a one-line value statement that names a specific problem and a specific outcome, the conversation lives. Specificity does not shrink your market. It makes you legible within it.</p>
      </div>
      
      <div class="gen-box">
        <h2 class="sec-title" style="margin-bottom:24px">The Statement Generator</h2>
        
        <label class="gen-label">1. Specific Target</label>
        <input type="text" class="gen-input" id="g-target" placeholder="e.g., Series B SaaS companies" oninput="updGen()" />
        
        <label class="gen-label">2. Specific, Measurable Outcome</label>
        <input type="text" class="gen-input" id="g-outcome" placeholder="e.g., hit 90%+ sprint completion within two quarters" oninput="updGen()" />
        
        <label class="gen-label">3. Your Unique Mechanism</label>
        <input type="text" class="gen-input" id="g-mech" placeholder="e.g., implementing a structured change-request protocol" oninput="updGen()" />
        
        <div class="gen-result">
          <p class="gr-text">I help <span id="r-target">[Specific Target]</span> achieve <span id="r-outcome">[Specific Outcome]</span> by <span id="r-mech">[Unique Mechanism]</span>.</p>
        </div>
      </div>
    `,
    js: `
      function updGen() {
        const t = document.getElementById('g-target').value || '[Specific Target]';
        const o = document.getElementById('g-outcome').value || '[Specific Outcome]';
        const m = document.getElementById('g-mech').value || '[Unique Mechanism]';
        document.getElementById('r-target').textContent = t;
        document.getElementById('r-outcome').textContent = o;
        document.getElementById('r-mech').textContent = m;
      }
    `
  }
};

// ==========================================
// MODULE 33 DATA
// ==========================================
const m33 = {
  id: 33,
  title: 'The Private Record',
  gTitle: 'The <br/><span class="g">Private Record</span>',
  heroSub: 'Your operating manual for your own value. It is the source of truth about what you actually do, what you produce, and what you are worth.',
  qs: [
    'Where exactly will you store your Private Record so you can access it before every negotiation or discovery call?',
    'Looking at Section B (CCRI Database), when was the last time you achieved something significant that you haven\'t documented yet?',
    'What "Market Signal" (someone asking for your advice) did you receive this month that you brushed off?',
    'How often will you commit to updating this living document?',
    'What old story about your value does maintaining this document help you dismantle?'
  ],
  dec: 'I will maintain my Private Record as a living document. I refuse to let my value become invisible to myself again.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_xPbDUQ3xZlH5x/',
  body: {
    css: `
      .pr-list { margin: 40px 0; display: flex; flex-direction: column; gap: 16px; }
      .pr-item { background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 24px 32px; display: flex; align-items: center; gap: 20px; transition: 0.3s; cursor: pointer; }
      .pr-item:hover { border-color: var(--gold-b); background: var(--surface); }
      .pr-item.checked .pr-check { background: var(--gold); color: var(--void); border-color: var(--gold); }
      .pr-check { width: 32px; height: 32px; border-radius: 8px; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; transition: 0.3s; }
      .pr-text h4 { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 4px; }
      .pr-text p { font-size: 0.95rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Not for Public Consumption</h2>
        <p class="body-text">This is not your LinkedIn profile. It is the document you open before a negotiation, before a discovery call, before writing a proposal. It prevents you from having to "remember" your achievements under pressure.</p>
      </div>
      
      <h2 class="sec-title" style="margin-top:60px">The Living Document Structure</h2>
      <p class="body-text">Click to acknowledge the required sections of your Private Record.</p>
      
      <div class="pr-list">
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>A. The One-Line Value Statement</h4>
            <p>One sentence. Updated quarterly as your focus sharpens.</p>
          </div>
        </div>
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>B. The CCRI Database</h4>
            <p>12-15 records spanning 5 years. Your proof-of-work archive.</p>
          </div>
        </div>
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>C. The Shadow Work Inventory</h4>
            <p>Your tacit-knowledge contributions outside formal job descriptions.</p>
          </div>
        </div>
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>D. The Floor-Price Calculation</h4>
            <p>Your minimum viable rate, recalculated annually.</p>
          </div>
        </div>
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>E. The Tacit Knowledge Map</h4>
            <p>Your deepest domain of pattern recognition and translation.</p>
          </div>
        </div>
        <div class="pr-item" onclick="this.classList.toggle('checked')">
          <div class="pr-check">✓</div>
          <div class="pr-text">
            <h4>F. The "Market Signal" Log</h4>
            <p>A running list of every time someone asks you for advice.</p>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 34 DATA
// ==========================================
const m34 = {
  id: 34,
  title: 'The Psychological Barrier',
  gTitle: 'The Psychological <br/><span class="g">Barrier</span>',
  heroSub: 'Why this audit feels like lying (and why it isn\'t). The discomfort is not evidence that you are being arrogant. It is evidence that you are making an invisible transaction visible.',
  qs: [
    'When you write down your achievements, does a voice tell you "The team did it, not you"? What specifically was YOUR contribution?',
    'The Imposter Response is prevalent among high achievers. When has being aware of complexity made you feel less qualified?',
    'Why does it feel wrong to charge for advice that comes naturally to you? Trace that belief to your salary history.',
    'What organizational mediation currently obscures the direct link between your specific intervention and your compensation?',
    'What is the difference between charging for "four minutes of advice" and "twenty years of compressed pattern recognition"?'
  ],
  dec: 'I will recognize the imposter response as a signal of growth. I am not monetizing common sense; I am monetizing twenty years of hard-won experience.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_Sigps2z2IAcLD/',
  body: {
    css: `
      .reframe-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 60px; margin: 40px 0; text-align: center; }
      .reframe-title { font-family: 'Cinzel'; font-size: 1.4rem; color: var(--gold); margin-bottom: 32px; }
      .reframe-cards { position: relative; height: 160px; max-width: 600px; margin: 0 auto; perspective: 1000px; cursor: pointer; }
      .rc-card { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); backface-visibility: hidden; transform-style: preserve-3d; font-size: 1.2rem; color: #fff; line-height: 1.5; }
      .rc-front { transform: rotateX(0deg); }
      .rc-back { transform: rotateX(-180deg); background: rgba(201,168,76,0.1); border-color: var(--gold); }
      .reframe-cards.flipped .rc-front { transform: rotateX(180deg); }
      .reframe-cards.flipped .rc-back { transform: rotateX(0deg); }
      .flip-hint { font-family: 'Inter'; font-size: 0.65rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; margin-top: 32px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Imposter Response</h2>
        <p class="body-text">The imposter feeling is not evidence that you are unqualified. It is evidence that you are aware of complexity in a way that less experienced people are not. Writing down what you did is factual, not boastful.</p>
      </div>
      
      <div class="reframe-box">
        <div class="reframe-title">The Value Reframe</div>
        <p class="body-text" style="font-size:0.95rem; margin-bottom:40px">For most of your career, your expertise was bundled into a fixed paycheck. Making the transaction visible feels uncomfortable. Click to reframe.</p>
        
        <div class="reframe-cards" onclick="this.classList.toggle('flipped')">
          <div class="rc-card rc-front">
            "It feels wrong to charge for this. It feels like I'm just monetizing a friendship or common sense."
          </div>
          <div class="rc-card rc-back">
            "I am charging for twenty years of compressed pattern recognition that allows me to see in four minutes what takes others four months."
          </div>
        </div>
        <div class="flip-hint">CLICK TO REFRAME</div>
      </div>
    `
  }
};

// ==========================================
// MODULE 35 DATA
// ==========================================
const m35 = {
  id: 35,
  title: 'Connecting the Inventory to the Market',
  gTitle: 'Connecting to <br/><span class="g">the Market</span>',
  heroSub: 'You are not starting from zero. You are repackaging and redirecting an existing asset—yourself—into a new market configuration.',
  qs: [
    'What is the biggest difference between starting a business at 25 with no history, and starting one now with 20 years of tacit knowledge?',
    'Look at your professional network. How many people in it already trust your reliability?',
    'What is the specific, named, priced form your value is taking now, compared to a generic W-2 salary?',
    'Which of the next paths (Consulting, Coaching, Network Activation) feels most aligned with your assets?',
    'What was missing before? Was it the skills themselves, or the act of writing them down and naming them?'
  ],
  dec: 'I am not starting over. I am starting from a position of enormous strength and pointing that strength in a new direction.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_eqon4iA666gkh/',
  body: {
    css: `
      .asset-map { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; }
      .am-node { width: 180px; height: 180px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; transition: 0.3s; }
      .am-node:hover { border-color: var(--gold); box-shadow: 0 0 30px rgba(201,168,76,0.1); transform: translateY(-5px); }
      .am-icon { font-size: 2rem; margin-bottom: 12px; }
      .am-title { font-family: 'Cinzel'; font-size: 1rem; color: #fff; font-weight: 700; }
      .am-desc { font-family: 'Inter'; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 8px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">What Comes Next</h2>
        <p class="body-text">The inventory you just built is not a wish list. It is a record of things that already happened. You already solved these problems. The only thing that has changed is the structure through which that value is delivered.</p>
      </div>
      
      <h2 class="sec-title" style="margin-top:60px; text-align:center">Your Existing Asset Base</h2>
      <div class="asset-map">
        <div class="am-node">
          <div class="am-icon">🧠</div>
          <div class="am-title">Tacit Knowledge</div>
          <div class="am-desc">20 YEARS BUILT</div>
        </div>
        <div class="am-node">
          <div class="am-icon">🤝</div>
          <div class="am-title">Professional Network</div>
          <div class="am-desc">HUNDREDS OF CONTACTS</div>
        </div>
        <div class="am-node">
          <div class="am-icon">📈</div>
          <div class="am-title">Track Record</div>
          <div class="am-desc">MEASURABLE IMPACT</div>
        </div>
        <div class="am-node">
          <div class="am-icon">🛡️</div>
          <div class="am-title">Reputation</div>
          <div class="am-desc">PROVEN RELIABILITY</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 36 DATA (Final Reflection - 12 Questions)
// ==========================================
const m36 = {
  id: 36,
  title: 'Chapter 7 Final Reflection',
  gTitle: 'Chapter 7 <br/><span class="g">Final Reflection</span>',
  heroSub: 'This is a mirror, and the quality of the reflection determines the quality of the income you generate in the next five chapters. Answer in full sentences.',
  qs: [
    '1. Write down your current job title. Now, in three to four sentences, describe what you actually do on a typical Tuesday when no one is watching. What is the gap between the title and the reality? What are you doing that the title doesn\'t capture?',
    '2. Think of the last three times a colleague, manager, or client came to you in a state of confusion, urgency, or panic and asked for your specific help. For each one, write: (a) what they brought you, (b) what you did, (c) what would have happened if you hadn\'t been available. What pattern do you see across the three?',
    '3. List three pieces of "shadow work" you perform regularly that are not in your official job description but are critical to your team\'s or organization\'s functioning. For each one, estimate how many hours per week it takes, and what would happen if you stopped doing it tomorrow.',
    '4. Write out three full CCRI records from the last five years, using the exact Context-Complication-Resolution-Impact structure from Module 7.4. Be ruthlessly specific with the numbers. If you cannot find a number, estimate conservatively and note that it is an estimate.',
    '5. Of the four tacit knowledge categories (Pattern Recognition Under Ambiguity, Relational and Political Navigation, Judgment Under Incomplete Information, Translation Between Domains), which one is your deepest? What is the specific evidence from your career that tells you this? Which one do people come to you for most often?',
    '6. Calculate your floor price using the formula in Module 7.5. Write down the number. Now write down how you feel looking at that number. Does it feel too high? Too low? About right? What story is your mind telling you about whether you are "worth" that number?',
    '7. If you had to charge a stranger $5,000 to solve one specific problem for them in the next 30 days, what would that problem be? Don\'t overthink. What is the first specific, concrete problem that comes to mind? Who is the stranger (what type of company, what role, what situation)? What would you actually do for them?',
    '8. Look at the three CCRI records you wrote in question 4. What is the common thread? Are you primarily a revenue generator, a cost reducer, a risk mitigator, a friction remover, a translator, a system builder, or a relationship stabilizer? Name it in one sentence.',
    '9. Draft three different versions of your One-Line Value Statement using the formula: I help [Specific Target] achieve [Specific, Measurable Outcome] by [Your Unique Mechanism]. Make each one more specific than the last. The first can be broad. The third should make you slightly uncomfortable with its specificity.',
    '10. Read your three One-Line Value Statements out loud. Which one generates the most imposter response? Which one makes you think "who am I to claim that?" Write that one down as your working draft.',
    '11. Open your phone\'s contacts or your LinkedIn connections. Scroll for five minutes. How many people in there know what you actually do at the level of specificity you just wrote down? How many of them know your CCRI-level impact, versus just your job title? Write down three names of people who should know what you actually offer but currently don\'t.',
    '12. Complete this sentence honestly, without editing: "If I fully believed that my twenty years of experience made me genuinely, specifically, measurably valuable to people outside my current employer, the first thing I would do differently this week is ______."'
  ],
  dec: 'The inventory was never missing. I was just never asked to open the drawer and look. I have looked. Now we move.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_w88xur7bVDy1S/',
  body: {
    css: ``,
    html: `
      <div class="card">
        <h2 class="sec-title">The Foundation Document</h2>
        <p class="body-text">Keep everything you write here. Print it out or keep it in a dedicated document you open weekly. This is not homework you submit and forget. This is the foundation document of your monetization engine.</p>
        <p class="body-text">Your one-line statement becomes your LinkedIn headline. Your CCRI database becomes your proposal library. Your floor price becomes your non-negotiable boundary.</p>
      </div>
    `
  }
};

const modules = [m31, m32, m33, m34, m35, m36];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
