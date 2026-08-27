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
// MODULE 58 — The Modern Menu
// ==========================================
const m58 = {
  id: 58,
  title: 'Why "Get A Job" Is No Longer The Only Real Option',
  gTitle: 'The Modern <br/><span class="g">Menu</span>',
  heroSub: 'Between full-time employment and full retirement now sits an entire spectrum of ways to be paid for expertise. None of these existed fifteen years ago.',
  qs: [
    'Which functional area did you spend the most real years in? Could you picture a part-time version of that role for a smaller company?',
    'How comfortable are you honestly with newer AI tools right now? Is this genuine curiosity or a stretch?',
    'Of trading time directly for money vs. building something once to sell repeatedly — which appeals to you more right now, and why?',
    'Think of a smaller company that could genuinely use a senior executive part-time. What would that role look like for them?',
    'What\'s one skill from your career you assumed was "just part of the job" that you now realize is genuinely rare in the market?'
  ],
  dec: 'I will stop thinking in the old binary of "employee or retired." I will deliberately choose from the modern menu that was built for someone with my experience.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_OqpNs8B6qO78Z/',
  body: {
    css: `
      .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
      @media(max-width:700px){ .menu-grid { grid-template-columns: 1fr; } }
      .menu-card { background: var(--deep); border: 1px solid var(--border); border-radius: 16px; padding: 32px; transition: 0.3s; cursor: default; }
      .menu-card:hover { border-color: var(--gold-d); transform: translateY(-3px); }
      .mc-tag { font-family: 'Inter'; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
      .mc-title { font-family: 'Cinzel'; font-size: 1.15rem; color: #fff; margin-bottom: 10px; }
      .mc-desc { font-size: 0.92rem; color: var(--muted); line-height: 1.65; }
      .mc-badge { display: inline-block; margin-top: 14px; padding: 4px 12px; border-radius: 20px; font-family: 'Inter'; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; }
      .mc-badge.time { background: rgba(232,72,85,0.15); color: var(--danger); }
      .mc-badge.scale { background: rgba(46,204,113,0.15); color: var(--success); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Binary Has Broken Apart</h2>
        <p class="body-text">For most of the last century, a late-career professional had two tracks: stay employed, or fully retire. That binary has quietly shattered. A whole spectrum now exists between those two poles — and it was built specifically for people with real, accumulated experience.</p>
      </div>
      <div class="menu-grid">
        <div class="menu-card">
          <div class="mc-tag">Time-for-Money</div>
          <div class="mc-title">Fractional Executive</div>
          <div class="mc-desc">Real senior-level work — COO, CFO, CMO — for smaller companies that need the judgment but can't afford the full-time salary.</div>
          <span class="mc-badge time">Trades Hours</span>
        </div>
        <div class="menu-card">
          <div class="mc-tag">Time-for-Money</div>
          <div class="mc-title">AI-Adjacent Advisory</div>
          <div class="mc-desc">Help companies roll out AI tools sensibly. They don't need a technologist — they need someone who understands their real operations.</div>
          <span class="mc-badge time">Trades Hours</span>
        </div>
        <div class="menu-card">
          <div class="mc-tag">Scalable</div>
          <div class="mc-title">Licensed Frameworks</div>
          <div class="mc-desc">A proprietary process, template, or system, documented once and sold or licensed to many without your time in every transaction.</div>
          <span class="mc-badge scale">Scales Beyond Hours</span>
        </div>
        <div class="menu-card">
          <div class="mc-tag">Reputation-Based</div>
          <div class="mc-title">Advisory Board Seats</div>
          <div class="mc-desc">Paid periodically for your judgment alone. No execution required — only honest, outside perspective from earned experience.</div>
          <span class="mc-badge scale">Compounds Over Time</span>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 59 — Platforms
// ==========================================
const m59 = {
  id: 59,
  title: 'Two Very Different Kinds Of Platforms',
  gTitle: 'Freelance Markets <br/>vs. <span class="g">Expert Networks</span>',
  heroSub: 'Confusing these two categories leads to a lot of wasted time. They have different mechanics, different buyers, and suit different kinds of experience.',
  qs: [
    'Which specific industry, function, or type of problem do you have deep, real, lived experience in — specific enough for an expert network?',
    'Draft two or three sentences describing your expertise as it would appear on a freelance or expert-network profile. Does it sound specific or generic?',
    'Think of one concrete, measurable outcome from your career — a number, a specific result — that is real evidence of your expertise.',
    'Which platform type feels like a better initial fit for your background: an open freelance marketplace or an expert-call network?',
    'How would you realistically want these platforms to fit into your income mix — primary, supplement, or something to stay sharp while other things build?'
  ],
  dec: 'I will stop presenting myself as a generalist. I will position my specific experience precisely on whichever platform I choose, because specificity is what wins.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_RFORfDEE8cmVn/',
  body: {
    css: `
      .platform-compare { display: flex; gap: 24px; margin: 40px 0; }
      @media(max-width:700px){ .platform-compare { flex-direction: column; } }
      .pc-col { flex: 1; background: var(--deep); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
      .pc-head { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 8px; }
      .pc-sub { font-family: 'Inter'; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; }
      .pc-list { list-style: none; padding: 0; }
      .pc-list li { display: flex; gap: 10px; margin-bottom: 12px; font-size: 0.95rem; color: var(--muted); }
      .pc-list li::before { content: '→'; color: var(--gold); flex-shrink: 0; }
      .pc-list li.pro::before { color: var(--success); }
      .pc-list li.con::before { content: '!'; color: var(--danger); }
      .profile-box { background: var(--deep); border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-top: 24px; }
      .pb-label { font-family: 'Inter'; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
      .pb-bad { background: rgba(232,72,85,0.1); border: 1px solid var(--danger); border-radius: 8px; padding: 16px 20px; font-style: italic; color: var(--danger); font-size: 1rem; margin-bottom: 16px; }
      .pb-good { background: rgba(46,204,113,0.1); border: 1px solid var(--success); border-radius: 8px; padding: 16px 20px; font-style: italic; color: var(--success); font-size: 1rem; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Why Specificity Wins on Both</h2>
        <p class="body-text">Whether it's an open marketplace or a curated expert network, the same principle applies: a profile that names a specific industry, a specific function, and specific kinds of problems solved will consistently outperform a vague "business consultant" positioning.</p>
      </div>
      <div class="platform-compare">
        <div class="pc-col">
          <div class="pc-head">Open Freelance Markets</div>
          <div class="pc-sub">e.g. Upwork, Toptal</div>
          <ul class="pc-list">
            <li class="pro">No gatekeeper — you can start immediately</li>
            <li class="pro">Track record builds over time through reviews</li>
            <li class="con">Open competition — specificity is essential to stand out</li>
            <li class="con">Clients found, not matched — you need to apply actively</li>
          </ul>
        </div>
        <div class="pc-col">
          <div class="pc-head">Expert-Call Networks</div>
          <div class="pc-sub">e.g. GLG, AlphaSights, Catalant</div>
          <ul class="pc-list">
            <li class="pro">Platform matches you — no cold applications to clients</li>
            <li class="pro">Strong hourly rates for targeted, deep expertise</li>
            <li class="con">Application-based — prior industry depth required</li>
            <li class="con">Call volume varies by market demand for your topic</li>
          </ul>
        </div>
      </div>
      <div class="profile-box">
        <div class="pb-label">Profile Positioning — Before vs. After</div>
        <div class="pb-bad">"Experienced business consultant with 20+ years in various industries."</div>
        <div class="pb-good">"I help mid-size manufacturing companies restructure regional distribution, reducing delivery delays and freeing operational capital."</div>
      </div>
    `
  }
};

// ==========================================
// MODULE 60 — Licensing & Frameworks
// ==========================================
const m60 = {
  id: 60,
  title: 'The Ceiling Every Time-For-Money Model Eventually Hits',
  gTitle: 'Build Once, <br/><span class="g">License Many</span>',
  heroSub: 'What feels like "common sense" to you after twenty years of practice is often the exact missing piece someone five years into their career is struggling to find.',
  qs: [
    'What\'s one process, method, or approach that feels completely obvious to you, but that you\'ve noticed other people genuinely struggle with?',
    'Have you ever actually written that process down, step by step, so someone else could follow it without you explaining it? If not, what would it take?',
    'Which format feels most natural as a starting point — a written template, a checklist, a short recorded course, or something else?',
    'Is there a real instance where you\'ve already proven this framework works — a real client, a real situation — you could point to as evidence?',
    'Realistically, how much upfront time could you commit to documenting and packaging your first framework, and over what timeframe?',
    'Does licensing a framework to an organization on an ongoing basis appeal to you as a longer-term goal once your reputation grows?'
  ],
  dec: 'I will identify the one framework I have already proven in real life and commit to documenting it properly — transforming invisible expertise into a real, sellable asset.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_mlBdqk4cFpYQK/',
  body: {
    css: `
      .ceiling-vis { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .cv-bars { display: flex; align-items: flex-end; justify-content: center; gap: 32px; height: 200px; margin: 40px 0; }
      .cv-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
      .cv-bar { width: 80px; border-radius: 8px 8px 0 0; position: relative; transition: height 1s ease; }
      .cv-bar-label { font-family: 'Cinzel'; font-size: 0.85rem; color: var(--text); text-align: center; }
      .cv-bar-val { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-family: 'Inter'; font-size: 0.75rem; font-weight: bold; white-space: nowrap; }
      .cv-note { font-family: 'Inter'; font-size: 0.75rem; color: var(--muted); letter-spacing: 0.05em; margin-top: 8px; }
      .fmt-grid { display: flex; gap: 16px; flex-wrap: wrap; margin: 32px 0; }
      .fmt-card { flex: 1; min-width: 160px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; }
      .fmt-icon { font-size: 1.6rem; margin-bottom: 10px; }
      .fmt-title { font-family: 'Cinzel'; font-size: 0.9rem; color: #fff; margin-bottom: 6px; }
      .fmt-desc { font-size: 0.8rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Hourly Ceiling Is a Mathematical Fact</h2>
        <p class="body-text">Every time-for-money model — coaching, fractional work, expert calls — hits the same ceiling. You only have so many hours. A licensed framework or documented process breaks that link entirely: the same knowledge reaches hundreds of buyers without requiring your direct presence for each.</p>
      </div>
      <div class="ceiling-vis">
        <h2 class="sec-title" style="margin-bottom:8px">Income Potential Comparison</h2>
        <p class="cv-note" style="margin-bottom:0">Same knowledge. Different packaging.</p>
        <div class="cv-bars">
          <div class="cv-bar-wrap">
            <div class="cv-bar" style="height:80px; background: linear-gradient(180deg, var(--danger), rgba(232,72,85,0.4));">
              <div class="cv-bar-val" style="color:var(--danger)">CAPPED</div>
            </div>
            <div class="cv-bar-label">1-on-1 Only</div>
          </div>
          <div class="cv-bar-wrap">
            <div class="cv-bar" style="height:140px; background: linear-gradient(180deg, var(--gold), rgba(201,168,76,0.4));">
              <div class="cv-bar-val" style="color:var(--gold)">MIXED</div>
            </div>
            <div class="cv-bar-label">1-on-1 + Products</div>
          </div>
          <div class="cv-bar-wrap">
            <div class="cv-bar" style="height:190px; background: linear-gradient(180deg, var(--success), rgba(46,204,113,0.4));">
              <div class="cv-bar-val" style="color:var(--success)">UNCAPPED</div>
            </div>
            <div class="cv-bar-label">Products + Licensing</div>
          </div>
        </div>
      </div>
      <h2 class="sec-title" style="text-align:center; margin-bottom: 24px">Choose Your Starting Format</h2>
      <div class="fmt-grid">
        <div class="fmt-card"><div class="fmt-icon">📋</div><div class="fmt-title">Template</div><div class="fmt-desc">A structured document someone fills in themselves.</div></div>
        <div class="fmt-card"><div class="fmt-icon">✅</div><div class="fmt-title">Checklist</div><div class="fmt-desc">A repeatable process with explanations for each step.</div></div>
        <div class="fmt-card"><div class="fmt-icon">🎙️</div><div class="fmt-title">Short Course</div><div class="fmt-desc">Your voice walking through the method with real examples.</div></div>
        <div class="fmt-card"><div class="fmt-icon">📜</div><div class="fmt-title">Licensed SOP</div><div class="fmt-desc">Standard operating procedures an org adopts on retainer.</div></div>
      </div>
    `
  }
};

// ==========================================
// MODULE 61 — Advisory Boards
// ==========================================
const m61 = {
  id: 61,
  title: 'Getting Paid For Judgment, Not Hours',
  gTitle: 'The Advisory <br/><span class="g">Board Seat</span>',
  heroSub: 'You\'re not being hired to do the work. You\'re being trusted to see clearly — and to say honestly what you think, even when it\'s not what leadership wants to hear.',
  qs: [
    'Think of an industry or type of company where your career experience would genuinely make you a valuable outside perspective. Be specific.',
    'Do you already know anyone, even loosely, running a company in that space? If not, who in your network might know someone like that?',
    'When someone asks for your advice, do you tend to ask clarifying questions first, or jump to telling them what to do? What would it take to lean more toward the former?',
    'How would you feel about being compensated partly or entirely in equity for an early-stage advisory role — genuinely comfortable, or cautious?',
    'What\'s one honest, uncomfortable truth you\'ve told a leader in the past that turned out to be genuinely valuable, even though it wasn\'t what they wanted to hear?'
  ],
  dec: 'I will offer honest judgment, not comfortable agreement. The most valuable advisory board members say the difficult truth. I will be one of them.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_6jRIAdWhtiaYV/',
  body: {
    css: `
      .advisor-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .ab-spectrum { display: flex; gap: 0; margin: 32px 0; border-radius: 12px; overflow: hidden; }
      .ab-seg { flex: 1; padding: 24px 16px; text-align: center; transition: 0.3s; cursor: pointer; }
      .ab-seg:hover { filter: brightness(1.2); }
      .ab-seg-title { font-family: 'Cinzel'; font-size: 0.9rem; font-weight: bold; margin-bottom: 6px; }
      .ab-seg-desc { font-size: 0.78rem; }
      .traits-list { list-style: none; padding: 0; margin-top: 32px; }
      .traits-list li { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
      .traits-list li:last-child { border-bottom: none; }
      .tl-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
      .tl-title { font-family: 'Cinzel'; font-size: 0.95rem; color: #fff; margin-bottom: 4px; }
      .tl-desc { font-size: 0.88rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Why Advisory Board Seats Are Almost Never Won Cold</h2>
        <p class="body-text">Advisory board seats come overwhelmingly from the same warm-relationship engine covered in Chapter 11. A founder hears about you through a mutual contact, or remembers your reputation. Everything about warm networking applies here — arguably more directly than anywhere else in this course.</p>
      </div>
      <div class="advisor-box">
        <h2 class="sec-title" style="text-align:center; margin-bottom:8px">Compensation Spectrum</h2>
        <p class="body-text" style="text-align:center; font-size:0.9rem; color:var(--muted); margin-bottom:0">Click a segment to understand each model.</p>
        <div class="ab-spectrum" id="ab-spec">
          <div class="ab-seg" style="background:rgba(232,72,85,0.2)" onclick="showComp(0)">
            <div class="ab-seg-title" style="color:var(--danger)">Equity Only</div>
            <div class="ab-seg-desc" style="color:var(--danger)">Early-stage startups</div>
          </div>
          <div class="ab-seg" style="background:rgba(201,168,76,0.15)" onclick="showComp(1)">
            <div class="ab-seg-title" style="color:var(--gold)">Equity + Cash</div>
            <div class="ab-seg-desc" style="color:var(--gold)">Growth-stage companies</div>
          </div>
          <div class="ab-seg" style="background:rgba(46,204,113,0.15)" onclick="showComp(2)">
            <div class="ab-seg-title" style="color:var(--success)">Cash Retainer</div>
            <div class="ab-seg-desc" style="color:var(--success)">Established companies</div>
          </div>
        </div>
        <div id="comp-detail" style="margin-top:20px; padding:20px; background:var(--void); border-radius:12px; font-style:italic; color:var(--muted); display:none;"></div>
        <ul class="traits-list">
          <li><div class="tl-icon">💬</div><div><div class="tl-title">Honest, Even When Uncomfortable</div><div class="tl-desc">Say the difficult truth. Companies pay for outside perspective, not comfortable agreement.</div></div></li>
          <li><div class="tl-icon">❓</div><div><div class="tl-title">Ask First, Opine Second</div><div class="tl-desc">Useful advice depends on genuinely understanding the real situation before offering a view.</div></div></li>
          <li><div class="tl-icon">🚧</div><div><div class="tl-title">Respect the Boundary of the Role</div><div class="tl-desc">You are there to advise, not direct. The decision and its responsibility belong to the people actually running the company.</div></div></li>
        </ul>
      </div>
    `,
    js: `
      const compData = [
        "Equity-only is common at early-stage startups with limited cash. It can become very valuable — or worthless. Don't rely on it as primary income. Treat it as a long-term option, not guaranteed pay.",
        "A blended model gives you some immediate cash while maintaining an ownership stake. This is a reasonable middle ground as the company scales, balancing risk and immediate reward.",
        "A cash retainer from an established company is the most predictable form of advisory income. Typically monthly or quarterly, for a defined number of hours of availability and structured meetings."
      ];
      function showComp(n) {
        const el = document.getElementById('comp-detail');
        el.style.display = 'block';
        el.textContent = compData[n];
      }
    `
  }
};

// ==========================================
// MODULE 62 — AI Tools
// ==========================================
const m62 = {
  id: 62,
  title: 'Why This Matters More For You Than It Might Seem',
  gTitle: 'AI As Your <br/><span class="g">Leverage Engine</span>',
  heroSub: 'AI doesn\'t replace what makes you valuable. It removes friction from the parts that were never where your value lived — the drafting, the formatting, the administrative overhead.',
  qs: [
    'Of drafting, research, organizing, and building digital products — which would save you the most real time right now?',
    'What\'s one piece of sensitive client information you\'d want to be especially careful about? What would a sensible boundary look like?',
    'Honestly assess your current comfort level with AI tools. What\'s one small, low-stakes task you could practice on this week?',
    'Think of a recent piece of writing or preparation that took you a long time. Which part was genuine judgment, and which was mechanical work that could be sped up?',
    'If meaningful administrative time were freed up, what would you actually want to do with it — more client conversations, more rest, more relationship-building?'
  ],
  dec: 'I will use AI tools to protect my margins and my time — treating them as a fast assistant for mechanical work while keeping my genuine judgment and lived experience central to everything.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_8MDn1TWig1Q80/',
  body: {
    css: `
      .ai-sort { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .as-cols { display: flex; gap: 24px; }
      @media(max-width:700px){ .as-cols { flex-direction: column; } }
      .as-col { flex: 1; }
      .as-col-title { font-family: 'Cinzel'; font-size: 1rem; margin-bottom: 16px; text-align: center; padding: 10px; border-radius: 8px; }
      .as-task { background: var(--void); border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; font-size: 0.9rem; cursor: grab; transition: 0.3s; user-select: none; }
      .as-task:hover { border-color: var(--gold-d); }
      .as-task.dragging { opacity: 0.4; }
      .as-drop { min-height: 80px; border: 2px dashed var(--border); border-radius: 8px; padding: 8px; margin-top: 12px; transition: 0.3s; }
      .as-drop.over { border-color: var(--gold); background: var(--gold-g); }
      .usage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
      @media(max-width:700px){ .usage-grid { grid-template-columns: 1fr; } }
      .ug-card { background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
      .ug-tag { font-family: 'Inter'; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
      .ug-title { font-family: 'Cinzel'; font-size: 1rem; color: #fff; margin-bottom: 8px; }
      .ug-desc { font-size: 0.88rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Honest Framing</h2>
        <p class="body-text">AI tools multiply your output and protect your time. They let you deliver more value to more people without simply working more hours. Used well, they are a direct, practical lever on the profitability of the practice you're building.</p>
      </div>
      <div class="usage-grid">
        <div class="ug-card">
          <div class="ug-tag" style="color:var(--success)">✓ High Value Use</div>
          <div class="ug-title">Drafting & Writing</div>
          <div class="ug-desc">Turn rough client notes into a clean summary. Draft a first version of an outreach message you'll then personalize. Remove blank-page friction without removing your judgment.</div>
        </div>
        <div class="ug-card">
          <div class="ug-tag" style="color:var(--success)">✓ High Value Use</div>
          <div class="ug-title">Research & Preparation</div>
          <div class="ug-desc">Get up to speed on an industry or company before a call. Your limited preparation time goes further. Show up more informed without hours of manual research.</div>
        </div>
        <div class="ug-card">
          <div class="ug-tag" style="color:var(--success)">✓ High Value Use</div>
          <div class="ug-title">Organizing & Summarizing</div>
          <div class="ug-desc">Turn long, messy session notes or call transcripts into a clean, organized summary you can actually use — without spending your own time doing the organizing by hand.</div>
        </div>
        <div class="ug-card">
          <div class="ug-tag" style="color:var(--danger)">⚠ Treat with Caution</div>
          <div class="ug-title">Client-Facing Judgment</div>
          <div class="ug-desc">A framework generated entirely by AI with no real input from your experience will feel generic — because it is. Clients paying for expertise can sense the difference. Your wisdom does the packaging; AI speeds up the delivery.</div>
        </div>
      </div>
      <div class="ai-sort">
        <h2 class="sec-title" style="text-align:center; margin-bottom:8px">The Confidentiality Rule</h2>
        <p class="body-text" style="font-size:0.95rem; color:var(--muted); text-align:center; max-width:600px; margin:0 auto 24px;">Never share a client's sensitive information with an AI tool without understanding how it handles data — and without the client's knowledge where appropriate. Protecting client trust matters here as much as anywhere.</p>
        <div style="background:rgba(232,72,85,0.08); border:1px solid var(--danger); border-radius:12px; padding:24px; text-align:center;">
          <p style="font-family:'Cinzel'; color:var(--danger); font-size:1rem; letter-spacing:0.05em;">The simple test: would you be comfortable if your client could see exactly what you pasted in?</p>
          <p style="font-size:0.9rem; color:var(--muted); margin-top:10px;">If not — remove it, anonymize it, or don't use an AI tool for that task at all.</p>
        </div>
      </div>
    `
  }
};

const modules = [m58, m59, m60, m61, m62];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
