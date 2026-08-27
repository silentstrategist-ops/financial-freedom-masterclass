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
// MODULE 43 DATA
// ==========================================
const m43 = {
  id: 43,
  title: 'Why This Stage Of Life Fits Consulting Better',
  gTitle: 'Consulting <br/><span class="g">Rewards Age</span>',
  heroSub: 'A twenty-five year old consultant is selling potential. A fifty-five year old consultant is selling proof. Clients paying serious money are rarely looking for potential.',
  qs: [
    'Before reading this, did you believe your years of experience were an asset or a disadvantage for something like consulting? Where did that belief actually come from?',
    'Which of the four examples (Darwin, Ando, Moses, Freeman) feels closest to your own situation?',
    'List three things you\'ve built up over your working life that someone twenty years younger simply wouldn\'t have yet.',
    'What is one specific problem, in your own industry, that you\'ve personally seen fail more than once?',
    'If a younger colleague told you they thought they were too inexperienced to consult, what would you honestly tell them?',
    'Now read your own answer to question five back to yourself. Does it match what you\'ve actually been telling yourself?',
    'Write one sentence you\'re genuinely willing to believe about what your own years of experience are actually worth.'
  ],
  dec: 'I will stop apologizing for my age. I recognize that true consulting sells judgment, pattern recognition, and proof, all of which I have earned.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_Jfb11QKYQzjd7/',
  body: {
    css: `
      .asset-calc { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .ac-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); cursor: pointer; }
      .ac-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      .ac-check { width: 32px; height: 32px; border-radius: 8px; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; transition: 0.3s; }
      .ac-row.active .ac-check { background: var(--gold); border-color: var(--gold); color: var(--void); }
      .ac-text h4 { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 4px; }
      .ac-text p { font-size: 0.95rem; color: var(--muted); }
      .ac-hidden { max-height: 0; overflow: hidden; opacity: 0; transition: 0.4s; padding-left: 48px; color: var(--gold); font-style: italic; font-size: 0.95rem; }
      .ac-row.active + .ac-hidden { max-height: 100px; opacity: 1; margin-bottom: 24px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">What Actually Compounds Over A Working Life</h2>
        <p class="body-text">Consulting doesn't sell speed. It sells the ability to see a problem clearly because you've lived through a version of it before. Three specific things compound the longer you work, directly increasing what you can charge.</p>
      </div>
      
      <div class="asset-calc">
        <h2 class="sec-title" style="margin-bottom:32px; text-align:center">The Compound Effect Checklist</h2>
        
        <div class="ac-row" onclick="this.classList.toggle('active')">
          <div class="ac-check">✓</div>
          <div class="ac-text">
            <h4>1. Industry Experience</h4>
            <p>You've seen what fails up close, more than once.</p>
          </div>
        </div>
        <div class="ac-hidden">Result: Pattern recognition that saves a client from a catastrophic mistake they can't see coming.</div>
        
        <div class="ac-row" onclick="this.classList.toggle('active')">
          <div class="ac-check">✓</div>
          <div class="ac-text">
            <h4>2. Professional Network</h4>
            <p>15-20 years of honest relationships and trust earned.</p>
          </div>
        </div>
        <div class="ac-hidden">Result: A pipeline of referrals that a 25-year-old would have to spend thousands on ads to replicate.</div>
        
        <div class="ac-row" onclick="this.classList.toggle('active')">
          <div class="ac-check">✓</div>
          <div class="ac-text">
            <h4>3. Financial Steadiness</h4>
            <p>Even a modest cushion built over decades.</p>
          </div>
        </div>
        <div class="ac-hidden">Result: The ability to survive a slow month without panicking or dropping your prices out of fear.</div>
      </div>
    `
  }
};

// ==========================================
// MODULE 44 DATA
// ==========================================
const m44 = {
  id: 44,
  title: 'Why A Normal Resume Doesn\'t Work Here',
  gTitle: 'Translating the <br/><span class="g">Resume</span>',
  heroSub: 'A standard resume says what you were responsible for. A consulting offer says what changed because of you.',
  qs: [
    'Choose one real achievement from your own career and rewrite it using the action, scope, result shape.',
    'Read your new version back out loud. Does it sound like something a stranger would genuinely pay for, or does it still sound like a job description?',
    'Looking at the three worked examples (Teacher, Accountant, Sales), which one is closest to your own field?',
    'List three specific, recurring problems in your industry that you already know how to solve.',
    'Who are three people from your past working life you could reasonably reach out to first, simply to reconnect honestly?',
    'Draft a short message to one of them that reconnects first, referencing something real you shared, without asking for anything yet.',
    'What has actually been stopping you from sending a message like that until now?'
  ],
  dec: 'I will stop listing my responsibilities and start communicating my outcomes. I sell specific, provable changes.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_CP2VS96v5OHvd/',
  body: {
    css: `
      .trans-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .tb-header { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 24px; }
      .tb-title { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; }
      .tb-row { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px; }
      @media(max-width:768px) { .tb-row { flex-direction: column; gap: 12px; } }
      .tb-col { flex: 1; padding: 20px; border-radius: 12px; font-size: 0.95rem; line-height: 1.6; }
      .tb-col.internal { background: var(--surface); color: var(--muted); border: 1px dashed rgba(255,255,255,0.1); }
      .tb-col.consult { background: rgba(201,168,76,0.05); color: var(--gold); border: 1px solid var(--gold-d); font-style: italic; }
      .tb-label { font-family: 'Inter'; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; font-weight: bold; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Translation Shift</h2>
        <p class="body-text">Nothing is invented. The underlying work is identical. What changes is the frame, moving from "what I was assigned to do" to "what actually changed because I was involved."</p>
      </div>
      
      <div class="trans-box">
        <h2 class="sec-title" style="margin-bottom:32px; text-align:center">The Resume Translator</h2>
        
        <div class="tb-row">
          <div class="tb-col internal">
            <div class="tb-label" style="color:var(--muted)">Teacher (15 Years)</div>
            "Taught secondary school mathematics and managed classroom behaviour."
          </div>
          <div class="tb-col consult">
            <div class="tb-label" style="color:var(--gold)">Consulting Translation</div>
            "Designed structured curriculum that measurably improved performance across 30 students, managing complex dynamics under time pressure."
          </div>
        </div>
        
        <div class="tb-row">
          <div class="tb-col internal">
            <div class="tb-label" style="color:var(--muted)">Accountant (20 Years)</div>
            "Prepared monthly financial reports and managed the bookkeeping process."
          </div>
          <div class="tb-col consult">
            <div class="tb-label" style="color:var(--gold)">Consulting Translation</div>
            "Built and maintained the full financial reporting system for a mid-sized operation, identifying and correcting costly errors before leadership."
          </div>
        </div>
        
        <div class="tb-row">
          <div class="tb-col internal">
            <div class="tb-label" style="color:var(--muted)">Salesperson (12 Years)</div>
            "Responsible for client outreach and closing new accounts."
          </div>
          <div class="tb-col consult">
            <div class="tb-label" style="color:var(--gold)">Consulting Translation</div>
            "Built a repeatable outreach process that consistently converted cold leads into long-term accounts in a highly difficult market."
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 45 DATA
// ==========================================
const m45 = {
  id: 45,
  title: 'Why Jumping To A Proposal Is A Beginner\'s Mistake',
  gTitle: 'Diagnosis Before <br/><span class="g">Proposal</span>',
  heroSub: 'A generic package sold before any real diagnosis gets compared on price. A proposal built directly from a real diagnosis gets judged on relevance.',
  qs: [
    'Think of a problem you\'ve helped solve before. What did the person originally think the problem was, and what did you find it actually was once you looked closely?',
    'Write three real diagnostic questions you could genuinely ask a new client in your own field.',
    'Have you ever jumped straight to offering a solution before fully understanding the real problem? What actually happened?',
    'What assumption do you think most people in your industry carry that\'s never actually been properly tested?',
    'If someone came to you with a problem in your area of expertise today, what would your genuine first question be?',
    'Think of a time someone diagnosed a problem of yours correctly before offering a solution. How did that change how much you trusted them?'
  ],
  dec: 'I will not sell generic solutions off a shelf. I will diagnose the structural root of the problem before offering a proposal.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_RpW1C2xwOc04C/',
  body: {
    css: `
      .diag-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .diag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px; }
      @media(max-width:768px) { .diag-grid { grid-template-columns: 1fr; } }
      .dg-card { background: var(--surface); border: 1px solid var(--border); padding: 32px; border-radius: 12px; position: relative; overflow: hidden; }
      .dg-card::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--gold); }
      .dg-title { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 12px; }
      .dg-text { font-size: 0.95rem; color: var(--muted); font-style: italic; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Real Value of Diagnosis</h2>
        <p class="body-text">Clients are experts in their business, but rarely experts in their blind spots. "My team isn't performing" is a symptom. The real cause could be a broken process, a hiring mistake, or a complete lack of decision-making authority.</p>
      </div>
      
      <div class="diag-box">
        <h2 class="sec-title">The Four Pillars of Diagnostic Questions</h2>
        <p class="body-text" style="font-size:0.95rem">Instead of pitching, ask questions in these four categories.</p>
        
        <div class="diag-grid">
          <div class="dg-card">
            <div class="dg-title">1. Concrete Reality</div>
            <div class="dg-text">"Walk me through exactly what happened the last time a deadline was missed."</div>
          </div>
          <div class="dg-card">
            <div class="dg-title">2. Previous Attempts</div>
            <div class="dg-text">"What have you already tried to fix this, and why do you think it failed?"</div>
          </div>
          <div class="dg-card">
            <div class="dg-title">3. Untested Assumptions</div>
            <div class="dg-text">"Why do you believe lack of delegation is the problem rather than lack of a clear process?"</div>
          </div>
          <div class="dg-card">
            <div class="dg-title">4. Concrete Outcomes</div>
            <div class="dg-text">"If we fix this completely, what specific, measurable thing looks different in 90 days?"</div>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 46 DATA
// ==========================================
const m46 = {
  id: 46,
  title: 'Why Hourly Pricing Quietly Punishes You',
  gTitle: 'Escaping <br/><span class="g">Hourly Pricing</span>',
  heroSub: 'The better and faster you get at solving a problem, the less you earn. This is precisely backwards from how real expertise should be rewarded.',
  qs: [
    'If you were consulting today, which of the five pricing models would fit your first offer best, and why?',
    'Roughly add up your true monthly cost to properly serve one client (time, tools, overhead). Write your honest estimate.',
    'Using the floor price formula (Cost / (1 - Target Margin)), what is the lowest amount you could charge without losing money?',
    'Have you ever priced something based on fear of losing the client rather than on what the work genuinely required? What happened?',
    'As your track record grows, which pricing model would you want to move toward?',
    'Think of a specific result you\'ve delivered. How would you price that outcome if you were pricing the result instead of the hours?'
  ],
  dec: 'I will not underprice my first client out of fear. I will calculate my true floor and refuse to work unsustainably.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_j941s87dQzmxY/',
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
        <h2 class="sec-title">The Pricing Evolution</h2>
        <p class="body-text">Consultants evolve through pricing stages: Hourly &rarr; Deliverables-Based &rarr; Tiered Packages &rarr; Value-Based &rarr; Performance-Based. But before you can evolve, you must know your survival floor.</p>
      </div>
      
      <div class="floor-calc">
        <h2 class="sec-title" style="text-align:center; margin-bottom:24px">The Profit Floor Calculator</h2>
        <p class="body-text" style="text-align:center; font-size:0.95rem; margin-bottom:32px">Formula: Monthly Cost / (1 - Target Margin Decimal). If Cost = 2000 and Margin = 40% (0.40), Floor = 2000 / 0.60 = 3333.</p>
        
        <div class="fc-row">
          <div class="fc-label">Monthly Cost to Serve (Time + Tools)</div>
          <input type="number" class="fc-input" id="fc-cost" value="2000" oninput="calcPFloor()" />
        </div>
        <div class="fc-row">
          <div class="fc-label">Target Profit Margin (%)</div>
          <input type="number" class="fc-input" id="fc-margin" value="40" oninput="calcPFloor()" />
        </div>
        
        <div class="fc-total">
          <div class="fc-total-desc">MINIMUM SUSTAINABLE RETAINER</div>
          <div class="fc-total-num" id="fc-total">3333</div>
          <p class="body-text" style="font-size:0.9rem; color:var(--muted); margin-top:12px">Pricing below this floor actively punishes you for taking on clients, because more work simply means losing money faster.</p>
        </div>
      </div>
    `,
    js: `
      function calcPFloor() {
        const cost = parseFloat(document.getElementById('fc-cost').value) || 0;
        let margin = parseFloat(document.getElementById('fc-margin').value) || 0;
        if(margin >= 100) margin = 99; // Prevent division by zero
        
        const dec = margin / 100;
        const floor = Math.round(cost / (1 - dec));
        document.getElementById('fc-total').textContent = floor;
      }
    `
  }
};

// ==========================================
// MODULE 47 DATA
// ==========================================
const m47 = {
  id: 47,
  title: 'The Two Different Cost Pictures & Protecting The Practice',
  gTitle: 'Protecting <br/><span class="g">The Practice</span>',
  heroSub: 'Without clear, written boundaries, client requests naturally expand over time. A stream of open-ended, unpaid requests quietly eats into your profit until the engagement barely makes sense.',
  qs: [
    'Would your practice realistically be digital, physical, or mixed? What real costs would that involve?',
    'Write one clear boundary you would set with your first client regarding what is and isn\'t included in the price.',
    'Think of a time when a lack of a clear boundary let a request quietly expand. What happened, and what would a boundary have changed?',
    'What specific communication window would you set for client questions so the work stays sustainable?',
    'If your work grew to 5 clients at once, what\'s the first part of the process you\'d want to make repeatable?',
    'Have you ever kept a client/customer going past the point where they cost you more than they gave back? What did that cost you?'
  ],
  dec: 'I will build simple, repeatable systems early. I will establish clear boundaries in writing so my business remains sustainable and healthy.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_Xvx3MxRQBBP65/',
  body: {
    css: `
      .scope-sim { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .ss-bar-wrap { width: 100%; height: 32px; background: var(--surface2); border-radius: 16px; margin: 32px 0; overflow: hidden; position: relative; border: 1px solid var(--border); }
      .ss-bar { height: 100%; width: 100%; background: var(--success); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .ss-btn { padding: 12px 24px; background: var(--surface); border: 1px solid var(--border); color: #fff; font-family: 'Inter'; font-size: 0.8rem; letter-spacing: 0.1em; border-radius: 8px; cursor: pointer; transition: 0.3s; margin: 8px; }
      .ss-btn:hover { border-color: var(--gold); color: var(--gold); }
      .ss-msg { font-family: 'Cinzel'; font-size: 1.2rem; margin-top: 16px; color: var(--text); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Slow Erosion</h2>
        <p class="body-text">A client starts asking for input on unrelated things: a marketing email, a staffing decision. None of it was part of the original agreement. Without a written scope document, you quietly work for free.</p>
      </div>
      
      <div class="scope-sim">
        <h2 class="sec-title" style="margin-bottom:12px">The Scope Creep Simulator</h2>
        <p class="body-text" style="font-size:0.95rem">Click the buttons below as if you were saying "yes" to these small requests without pushing back.</p>
        
        <div class="ss-bar-wrap">
          <div class="ss-bar" id="ss-bar"></div>
        </div>
        <div class="ss-msg" id="ss-msg">100% Profit Margin Retained</div>
        
        <div style="margin-top:24px">
          <button class="ss-btn" onclick="creep(15)">"Can you look at this email?"</button>
          <button class="ss-btn" onclick="creep(25)">"Can you join this 90-min meeting?"</button>
          <button class="ss-btn" onclick="creep(20)">"Can you review this unrelated hire?"</button>
          <button class="ss-btn" onclick="resetCreep()" style="border-color:var(--gold-b)">Reset Scope</button>
        </div>
      </div>
    `,
    js: `
      let currentProf = 100;
      function creep(amt) {
        currentProf -= amt;
        if(currentProf < 0) currentProf = 0;
        updateBar();
      }
      function resetCreep() {
        currentProf = 100;
        updateBar();
      }
      function updateBar() {
        const bar = document.getElementById('ss-bar');
        const msg = document.getElementById('ss-msg');
        bar.style.width = currentProf + '%';
        
        if(currentProf > 60) { bar.style.background = 'var(--success)'; msg.style.color = 'var(--success)'; }
        else if(currentProf > 30) { bar.style.background = 'var(--gold)'; msg.style.color = 'var(--gold)'; }
        else { bar.style.background = 'var(--danger)'; msg.style.color = 'var(--danger)'; }
        
        if(currentProf <= 0) msg.textContent = "You are now working for free.";
        else msg.textContent = currentProf + "% Profit Margin Retained";
      }
    `
  }
};

const modules = [m43, m44, m45, m46, m47];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
