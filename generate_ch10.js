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
// MODULE 48 DATA
// ==========================================
const m48 = {
  id: 48,
  title: 'The Line Most People Never Draw Clearly',
  gTitle: 'Consulting vs. <br/><span class="g">Coaching</span>',
  heroSub: 'They are genuinely different jobs, built on different promises. Confusing the two leads to a confused offer that doesn\'t clearly serve anyone.',
  qs: [
    'Think of a time you helped someone by giving them a direct answer, versus asking the right question. How did each interaction feel?',
    'Based on the distinction, does your own natural instinct lean more toward consulting (answers) or coaching (drawing out)?',
    'What is one real, difficult experience from your own life that would help you sit calmly with someone going through something similar?',
    'Have you ever been coached by someone who created real psychological safety for you? What specifically did they do?',
    'Is there a topic or situation you\'d feel genuinely unqualified to coach someone through? Name it clearly.',
    'If a potential client wanted a direct answer but you only offered coaching, how would you explain the difference in one sentence?'
  ],
  dec: 'I will draw the line clearly. I will not sell coaching to someone who needs consulting, and I will not consult when they need coaching.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_Q81Mhvtaf9PlL/',
  body: {
    css: `
      .dist-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .db-nav { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 32px; }
      .db-tab { flex: 1; text-align: center; padding: 16px; font-family: 'Inter'; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: 0.3s; }
      .db-tab.active { color: var(--gold); border-bottom: 2px solid var(--gold); }
      .db-content { display: none; }
      .db-content.active { display: block; animation: fadeIn 0.4s; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .db-title { font-family: 'Cinzel'; font-size: 1.6rem; color: #fff; margin-bottom: 16px; }
      .db-text { font-size: 1.1rem; color: var(--text); line-height: 1.7; font-style: italic; margin-bottom: 24px; }
      .db-list { list-style: none; padding: 0; }
      .db-list li { padding-left: 24px; position: relative; margin-bottom: 12px; color: var(--muted); }
      .db-list li::before { content: '→'; position: absolute; left: 0; top: 0; color: var(--gold); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Foundation of Psychological Safety</h2>
        <p class="body-text">The single most important skill in coaching isn't having clever advice. It's creating an environment where someone feels safe enough to say the true, difficult thing out loud without fear of being judged.</p>
      </div>
      
      <div class="dist-box">
        <div class="db-nav">
          <div class="db-tab active" onclick="switchTab(0)">The Consultant</div>
          <div class="db-tab" onclick="switchTab(1)">The Coach</div>
        </div>
        
        <div class="db-content active" id="db-c0">
          <div class="db-title">"I will build the answer for you."</div>
          <div class="db-text">Hired to diagnose a problem and hand over an answer. The client is paying for your judgement applied to their situation.</div>
          <ul class="db-list">
            <li>Best for: Tactical process, structural setups, technical audits.</li>
            <li>Failure mode: Giving them an answer they don't have the internal clarity to actually execute.</li>
          </ul>
        </div>
        
        <div class="db-content" id="db-c1">
          <div class="db-title">"I will help you find the answer."</div>
          <div class="db-text">Hired to help someone think more clearly and find their own answer with structure and accountability.</div>
          <ul class="db-list">
            <li>Best for: Career pivots, leadership blind spots, overwhelming transitions.</li>
            <li>Failure mode: Just telling them what to do, preventing them from genuinely growing.</li>
          </ul>
        </div>
      </div>
    `,
    js: `
      function switchTab(n) {
        document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.db-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.db-tab')[n].classList.add('active');
        document.getElementById('db-c'+n).classList.add('active');
      }
    `
  }
};

// ==========================================
// MODULE 49 DATA
// ==========================================
const m49 = {
  id: 49,
  title: 'Why "Life Coach" Is The Weakest Possible Starting Point',
  gTitle: 'Choosing Your <br/><span class="g">Lane</span>',
  heroSub: 'Calling yourself a general life coach feels safe because it doesn\'t rule anyone out. In practice, a potential client has no clear reason to choose you.',
  qs: [
    'What specific kind of change have you personally gone through, and genuinely come out the other side of?',
    'What do people already, unprompted, come to you for advice about?',
    'What professional world do you understand fluently from the inside?',
    'Draft your own narrow lane in one clear sentence, naming exactly who it\'s for and what changes.',
    'Does your sentence sound like it could describe anyone, or one very specific kind of person?',
    'Who is one real person in your life right now who fits that exact description?',
    'What fear do you have about narrowing your focus? Is it based on real evidence?'
  ],
  dec: 'I will not hide behind a generic title. I will claim a specific lane based on my real, lived experience and the specific people I know how to help.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_xMIyIjPJM7R9L/',
  body: {
    css: `
      .niche-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; display: flex; flex-direction: column; align-items: center; }
      .nb-step { width: 100%; max-width: 600px; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 24px; text-align: center; cursor: pointer; transition: 0.3s; position: relative; }
      .nb-step:hover { border-color: var(--gold-d); }
      .nb-step::after { content: '↓'; position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); color: var(--gold); font-size: 1.2rem; opacity: 0; transition: 0.3s; }
      .nb-step:not(:last-child).active::after { opacity: 1; }
      .nb-step.active { border-color: var(--gold); background: rgba(201,168,76,0.05); }
      .nb-title { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 8px; }
      .nb-desc { font-size: 0.95rem; color: var(--muted); }
      .nb-hidden { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; opacity: 0; }
      .nb-hidden.show { max-height: 300px; opacity: 1; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Where A Real Lane Comes From</h2>
        <p class="body-text">Your strongest lane isn't invented from scratch. It sits inside your Skills Audit and your own lived experience of change, struggle, and hard transition.</p>
      </div>
      
      <div class="niche-box">
        <h2 class="sec-title" style="margin-bottom:32px">The Niche Narrower</h2>
        <p class="body-text" style="font-size:0.95rem; margin-bottom:24px; color:var(--muted)">Click to step away from the generic and toward the specific.</p>
        
        <div class="nb-step active" onclick="revealNiche(1)">
          <div class="nb-title">"Life Coach"</div>
          <div class="nb-desc">Too broad. Competing with millions. Means nothing.</div>
        </div>
        
        <div class="nb-hidden" id="niche-1">
          <div class="nb-step active" onclick="revealNiche(2)">
            <div class="nb-title">"Business Coach"</div>
            <div class="nb-desc">Better, but still generic. Which business? What problem?</div>
          </div>
        </div>
        
        <div class="nb-hidden" id="niche-2">
          <div class="nb-step active" style="border-color:var(--gold); background:rgba(201,168,76,0.1)">
            <div class="nb-title">"Transition Coach for Mid-Career Managers"</div>
            <div class="nb-desc" style="color:var(--gold)">"I help corporate managers plan a transition into running their own business without burning their safety net."</div>
          </div>
        </div>
      </div>
    `,
    js: `
      function revealNiche(n) {
        document.getElementById('niche-'+n).classList.add('show');
      }
    `
  }
};

// ==========================================
// MODULE 50 DATA
// ==========================================
const m50 = {
  id: 50,
  title: 'Why Structure Matters More Than Personality In Coaching',
  gTitle: 'Structure Beats <br/><span class="g">Personality</span>',
  heroSub: 'Warmth matters, but it\'s not the actual engine. What actually produces real, measurable change is structure: intake, goals, and accountability.',
  qs: [
    'Think of a goal you\'ve set that stayed vague. What would it look like rewritten as something specific enough that someone else could tell if you achieved it?',
    'If you were coaching someone, what three or four questions would you want to cover in an intake conversation?',
    'Have you ever been part of a relationship that lacked real structure? What did that actually feel like over time?',
    'Sketch what a real first session might look like for a client in your specific lane.',
    'What\'s one way you could realistically follow up with a client between sessions to reinforce accountability?',
    'If you had to write a simple coaching agreement right now, what would you write?'
  ],
  dec: 'I will not rely on being pleasant in the room. I will build and enforce the structure that actually allows my clients to change.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_DFf1aas5d5KSh/',
  body: {
    css: `
      .timeline-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .tl-item { display: flex; gap: 24px; margin-bottom: 32px; position: relative; }
      .tl-item:last-child { margin-bottom: 0; }
      .tl-item::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: -32px; width: 2px; background: var(--border); }
      .tl-item:last-child::before { display: none; }
      .tl-num { width: 40px; height: 40px; border-radius: 20px; background: var(--void); border: 2px solid var(--gold); color: var(--gold); display: flex; align-items: center; justify-content: center; font-family: 'Cinzel'; font-weight: bold; font-size: 1.1rem; z-index: 1; flex-shrink: 0; }
      .tl-content { background: var(--surface); padding: 24px; border-radius: 12px; flex: 1; border: 1px solid transparent; transition: 0.3s; }
      .tl-content:hover { border-color: var(--gold-d); }
      .tl-title { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 8px; }
      .tl-desc { font-size: 0.95rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Real Product is Accountability</h2>
        <p class="body-text">Most people already know what they need to do differently. They lack the structure that makes follow-through likely. A coach who simply listens well without follow-up is offering warmth without genuine structure.</p>
      </div>
      
      <div class="timeline-box">
        <h2 class="sec-title" style="margin-bottom:32px; text-align:center">The Repeatable Session Architecture</h2>
        
        <div class="tl-item">
          <div class="tl-num">1</div>
          <div class="tl-content">
            <div class="tl-title">The Check-In (Accountability)</div>
            <div class="tl-desc">Review what has happened since the last session, specifically related to whatever was committed to.</div>
          </div>
        </div>
        
        <div class="tl-item">
          <div class="tl-num">2</div>
          <div class="tl-content">
            <div class="tl-title">The Main Work (The Challenge)</div>
            <div class="tl-desc">Focus the bulk of the time on the client's most pressing real challenge right now.</div>
          </div>
        </div>
        
        <div class="tl-item">
          <div class="tl-num">3</div>
          <div class="tl-content">
            <div class="tl-title">The Close (The Commitment)</div>
            <div class="tl-desc">End every single session with a clear, specific commitment for what they will do before you meet next.</div>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 51 DATA
// ==========================================
const m51 = {
  id: 51,
  title: 'Why Coaching Sells On Trust More Than Almost Anything Else',
  gTitle: 'Earning Trust <br/><span class="g">Before The Sale</span>',
  heroSub: 'A potential client is evaluating whether they are willing to be genuinely honest with you about things they haven\'t said out loud yet.',
  qs: [
    'If you ran a discovery call today, what three or four genuine questions would you actually ask?',
    'Think of a time you were sold something with pressure vs honesty. Which made you trust them more?',
    'Who are two or three people who might be willing to be an early client in exchange for honest feedback?',
    'If you asked a satisfied client directly for a referral, what would you say in your own words?',
    'Write one honest sentence describing who your coaching is genuinely for.',
    'What real, honest outcome would you want a future testimonial to actually describe?'
  ],
  dec: 'I will not use pressure tactics. I will earn trust through genuine discovery, clear communication, and honest boundaries.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_OgNSIAf0BsRVf/',
  body: {
    css: `
      .flow-box { display: flex; flex-wrap: wrap; gap: 16px; margin: 40px 0; }
      .fb-card { flex: 1; min-width: 200px; background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 24px; text-align: center; }
      .fb-icon { font-size: 2rem; margin-bottom: 16px; color: var(--gold); }
      .fb-title { font-family: 'Cinzel'; font-size: 1rem; color: #fff; margin-bottom: 8px; }
      .fb-desc { font-size: 0.85rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Discovery Call</h2>
        <p class="body-text">This isn't a sales pitch dressed up as a favour. It's a low-pressure conversation where the potential client gets an honest taste of what working with you actually feels like.</p>
      </div>
      
      <div class="flow-box">
        <div class="fb-card">
          <div class="fb-icon">1</div>
          <div class="fb-title">Ask & Listen</div>
          <div class="fb-desc">Ask genuine questions about their real situation and listen without waiting to pitch.</div>
        </div>
        <div class="fb-card">
          <div class="fb-icon">2</div>
          <div class="fb-title">Reflect</div>
          <div class="fb-desc">Reflect back what you're hearing so they feel truly understood, not just heard.</div>
        </div>
        <div class="fb-card">
          <div class="fb-icon">3</div>
          <div class="fb-title">Determine Fit</div>
          <div class="fb-desc">If it's a fit, explain how you help. If it isn't, say so honestly and walk away.</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 52 DATA
// ==========================================
const m52 = {
  id: 52,
  title: 'The Real Ceiling Built Into One-On-One Coaching',
  gTitle: 'The Ceiling of <br/><span class="g">One-on-One</span>',
  heroSub: 'You only have a certain number of hours available each week. Your income from pure one-on-one work is mathematically capped.',
  qs: [
    'Would a single session, a multi-session package, or an ongoing relationship best fit the change your clients need?',
    'Sketch what your own shorter, standard, and premium packages might realistically look like.',
    'How many hours a week would you honestly dedicate to 1-on-1 coaching? What does that tell you about your ceiling?',
    'Does the idea of running group coaching genuinely appeal to you, or does the value come from individual attention?',
    'Looking at your Freedom Number, how many clients at what price are needed to make a meaningful difference?',
    'What price would you start at for your first clients, and what needs to be true before raising it?'
  ],
  dec: 'I accept that my time has a mathematical ceiling. I will package my work to provide real value and predictable income, while planning for what comes next.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_gIo6fG5IlJpqc/',
  body: {
    css: `
      .ceil-calc { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .cc-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
      .cc-row:last-child { border-bottom: none; }
      .cc-label { font-family: 'Cinzel'; font-size: 1.1rem; color: var(--text); }
      .cc-input { background: var(--void); border: 1px solid var(--gold-d); color: var(--gold); padding: 8px 16px; border-radius: 8px; width: 140px; text-align: center; font-family: 'Inter'; outline: none; }
      .cc-input:focus { border-color: var(--gold); }
      .cc-result { margin-top: 32px; padding: 24px; background: var(--surface); border: 1px dashed var(--danger); border-radius: 12px; text-align: center; }
      .cc-res-title { font-family: 'Inter'; font-size: 0.75rem; letter-spacing: 0.15em; color: var(--danger); text-transform: uppercase; margin-bottom: 8px; }
      .cc-res-val { font-family: 'Cinzel'; font-size: 2.5rem; color: #fff; font-weight: bold; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Packaging The Work</h2>
        <p class="body-text">Selling coaching by the single session undersells the results and your time. A simple three-tier structure gives clear choices: A shorter focused package, a standard ongoing package, and a premium high-access package.</p>
      </div>
      
      <div class="ceil-calc">
        <h2 class="sec-title" style="text-align:center; margin-bottom:32px">The Time Ceiling Calculator</h2>
        
        <div class="cc-row">
          <div class="cc-label">Max Hours You Will Coach Per Week</div>
          <input type="number" class="cc-input" id="cc-hrs" value="10" oninput="calcCeil()" />
        </div>
        <div class="cc-row">
          <div class="cc-label">Average Hourly Value (Derived from Packages)</div>
          <input type="number" class="cc-input" id="cc-rate" value="150" oninput="calcCeil()" />
        </div>
        
        <div class="cc-result">
          <div class="cc-res-title">THE MATHEMATICAL CEILING (PER MONTH)</div>
          <div class="cc-res-val" id="cc-total">6000</div>
          <p class="body-text" style="font-size:0.9rem; color:var(--muted); margin-top:12px">No matter how much demand exists, your income cannot exceed this number without Group Coaching or raising prices significantly.</p>
        </div>
      </div>
    `,
    js: `
      function calcCeil() {
        const hrs = parseFloat(document.getElementById('cc-hrs').value) || 0;
        const rate = parseFloat(document.getElementById('cc-rate').value) || 0;
        // Assume 4 weeks in a month
        const total = Math.round(hrs * rate * 4);
        document.getElementById('cc-total').textContent = total;
      }
    `
  }
};

const modules = [m48, m49, m50, m51, m52];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
