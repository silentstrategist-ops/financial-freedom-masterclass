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
// MODULE 37 DATA
// ==========================================
const m37 = {
  id: 37,
  title: 'Why This Comes After Chapter 7',
  gTitle: 'Why This Comes <br/><span class="g">After Chapter 7</span>',
  heroSub: 'Paper does not close deals. People do. A client is never buying a perfectly worded PDF. A client is buying a feeling: the feeling that they are in safe hands.',
  qs: [
    'Think of a time you were buying a high-end service. What specifically made you trust the provider?',
    'When you explain your work to others, do you ever find yourself apologizing before you finish your sentence? Why?',
    'The Employee Posture vs Expert Posture: In what recent situation did you wait to be told what to do, instead of evaluating and stating what needed to happen?',
    'What is the cost (financially and emotionally) of carrying an "employee posture" into a consulting conversation?',
    'Who in your industry embodies the "expert posture"? What specifically do they do that signals certainty?'
  ],
  dec: 'I will learn to stand quietly and firmly in what I already know is true. I have real value, and I no longer need anyone\'s permission to charge for it.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_wb4mKMCiFh4UY/',
  body: {
    css: `
      .posture-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; display: flex; gap: 40px; }
      @media(max-width:768px) { .posture-box { flex-direction: column; } }
      .pb-col { flex: 1; }
      .pb-title { font-family: 'Cinzel'; font-size: 1.4rem; color: #fff; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
      .pb-title.danger { color: var(--danger); }
      .pb-title.gold { color: var(--gold); }
      .pb-item { font-size: 1.05rem; color: var(--muted); margin-bottom: 16px; padding-left: 20px; position: relative; }
      .pb-item::before { content: '×'; position: absolute; left: 0; top: 0; color: var(--danger); font-weight: bold; }
      .pb-item.good::before { content: '✓'; color: var(--success); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Gap Between Knowing and Carrying</h2>
        <p class="body-text">For decades, your sense of self-worth was shaped by a simple structure: someone gave you a job, and you did it to avoid trouble. The world you are stepping into now runs on a completely different question. Nobody is going to tell you what to do. You have to tell them.</p>
      </div>
      
      <div class="posture-box">
        <div class="pb-col">
          <div class="pb-title danger">The Employee Posture</div>
          <div class="pb-item">Waits to be handed the problem.</div>
          <div class="pb-item">Believes they are being paid for their effort and hours.</div>
          <div class="pb-item">Asks, "am I allowed to charge this much?"</div>
          <div class="pb-item">Over-explains and justifies their recommendations.</div>
        </div>
        <div class="pb-col">
          <div class="pb-title gold">The Expert Posture</div>
          <div class="pb-item good">Asks questions that uncover hidden problems.</div>
          <div class="pb-item good">Knows they are being paid for the result their judgment produces.</div>
          <div class="pb-item good">States, "this is what solving your problem is worth."</div>
          <div class="pb-item good">States the diagnosis, states the price, and stops talking.</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 38 DATA
// ==========================================
const m38 = {
  id: 38,
  title: 'Where the Habit Comes From',
  gTitle: 'Where the Habit <br/><span class="g">Comes From</span>',
  heroSub: 'Inside a company, staying safe usually means staying in line. You learn to soften bad news and ask permission. That reflex is not a character flaw. It is a costly training.',
  qs: [
    'Look back at your sent emails from this week. How many times did you write "Sorry to bother you" or "Just checking if"?',
    'When someone asks your price, do you state a number and stop, or do you follow it with three sentences defending why you deserve it?',
    'When was the last time you said yes to extra unpaid work because saying no felt like "failing a test"?',
    'Do you hold a quiet belief that outside forces (your boss, the market) decide what happens to you, or that you are the one steering?',
    'If you stripped the apologies and justifications from your client communications, what would they actually sound like?'
  ],
  dec: 'I am not in the room to be evaluated anymore. I am in the room to evaluate the situation, and to say clearly what needs to happen next.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_oMP9J1dzIW6FB/',
  body: {
    css: `
      .filter-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .filter-input { width: 100%; height: 120px; background: var(--void); border: 1px solid var(--gold-d); color: var(--muted); padding: 16px; border-radius: 8px; font-family: 'Cormorant Garamond'; font-size: 1.1rem; line-height: 1.6; margin-bottom: 24px; outline: none; resize: none; }
      .filter-btn { padding: 14px 28px; background: var(--gold); border: none; border-radius: var(--rp); font-family: 'Inter'; font-size: 0.75rem; letter-spacing: 0.15em; color: var(--void); cursor: pointer; transition: 0.3s; font-weight: 600; text-transform: uppercase; }
      .filter-btn:hover { background: #fff; transform: translateY(-2px); }
      .filter-result { margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--border); display: none; }
      .filter-result.active { display: block; }
      .fr-title { font-family: 'Inter'; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
      .fr-text { font-family: 'Cinzel'; font-size: 1.4rem; color: #fff; line-height: 1.5; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Reflex of Permission</h2>
        <p class="body-text">Inside an organization, you learn to ask first, act second, and brace to be judged either way. Once you start selling your own expertise, this same reflex becomes expensive. It shows up in unnecessary apologies, over-explaining your price, and saying yes to scope creep.</p>
      </div>
      
      <div class="filter-box">
        <h2 class="sec-title" style="margin-bottom:16px">The Apology Filter</h2>
        <p class="body-text" style="font-size:0.95rem; margin-bottom:24px">We have pre-filled a standard "employee posture" email. Click FILTER to see the expert translation.</p>
        
        <textarea class="filter-input" readonly>"Sorry to bother you, but I just wanted to check if maybe you had a budget for this? I know 8,000 sounds high, but I'll be spending a lot of hours on it and I really want to make sure you get value..."</textarea>
        
        <button class="filter-btn" onclick="document.getElementById('f-res').classList.add('active')">FILTER THE NOISE</button>
        
        <div class="filter-result" id="f-res">
          <div class="fr-title">The Expert Translation</div>
          <p class="fr-text">"I will build and install a structured onboarding process for your team over six weeks. The cost for this is 8,000."</p>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 39 DATA
// ==========================================
const m39 = {
  id: 39,
  title: 'The Trap Almost Everyone Falls Into First',
  gTitle: 'The Trap Almost <br/><span class="g">Everyone Falls Into</span>',
  heroSub: 'Charging by the hour punishes you for getting better at your job. People who earn real money from their expertise are not selling hours. They are selling access to their judgment.',
  qs: [
    'If you solve a client\'s massive problem in 18 minutes, what are they actually paying for?',
    'What is the hard physical ceiling on your income if you only bill by the hour?',
    'How does hourly billing invite clients to treat you like a pair of rented hands?',
    'Think of a time you used years of pattern recognition to fix something instantly. How much would an amateur have charged by the hour while taking ten times as long?',
    'Are you willing to divorce your pricing from your time spent?'
  ],
  dec: 'I will not sell my hours. I am selling the years of pattern recognition that allow me to see the answer instantly.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_JkJys317q1gFw/',
  body: {
    css: `
      .trap-vis { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .tv-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
      .tv-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      .tv-label { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; width: 40%; }
      .tv-chart { width: 50%; height: 24px; background: var(--void); border-radius: 12px; overflow: hidden; position: relative; }
      .tv-fill { height: 100%; position: absolute; left: 0; top: 0; border-radius: 12px; }
      .tv-fill.bad { background: var(--danger); width: 80%; }
      .tv-fill.good { background: var(--gold); width: 20%; }
      .tv-val { font-family: 'Inter'; font-size: 0.8rem; color: var(--muted); margin-left: 16px; width: 10%; text-align: right; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Three Problems with Hourly Billing</h2>
        <ul style="list-style:none; padding-left:0; margin-top:20px;">
          <li class="body-text" style="margin-bottom:12px"><strong>1. The Hard Ceiling:</strong> You only have so many hours in a week. Your income has a physical limit.</li>
          <li class="body-text" style="margin-bottom:12px"><strong>2. The Efficiency Punishment:</strong> If years of experience let you solve it in 30 minutes instead of 10 hours, you earn LESS the better you get.</li>
          <li class="body-text" style="margin-bottom:12px"><strong>3. The Micro-Management:</strong> Clients ask for timesheets. You stop being a trusted expert and become rented hands.</li>
        </ul>
      </div>
      
      <div class="trap-vis">
        <h2 class="sec-title" style="margin-bottom:32px; text-align:center">The Paradox of Expertise</h2>
        
        <div class="tv-row">
          <div class="tv-label">Amateur (Takes 10 Hours)</div>
          <div class="tv-chart"><div class="tv-fill bad"></div></div>
          <div class="tv-val">$500 Billed</div>
        </div>
        
        <div class="tv-row">
          <div class="tv-label">Expert (Takes 18 Minutes)</div>
          <div class="tv-chart"><div class="tv-fill good"></div></div>
          <div class="tv-val">$37 Billed?</div>
        </div>
        
        <p class="body-text" style="text-align:center; margin-top:32px; color:var(--gold); font-style:italic">"You aren't paying for 18 minutes. You are paying for the five years of experience that told me exactly what to fix."</p>
      </div>
    `
  }
};

// ==========================================
// MODULE 40 DATA
// ==========================================
const m40 = {
  id: 40,
  title: 'The Myth That\'s Been Sold to You',
  gTitle: 'The Myth That\'s <br/><span class="g">Been Sold to You</span>',
  heroSub: 'Real innovation belongs to the young? The data says the opposite. Business success in the real world is about execution, risk management, and handling complicated situations with real people.',
  qs: [
    'How has the "young genius founder" myth quietly convinced you that you missed your window?',
    'What does a 28-year-old with a slick website represent to a corporate client? (Hint: High Risk).',
    'What does a 52-year-old who has lived through supply chain breakdowns represent to that same client?',
    'Write down three specific hard situations you’ve lived through that a younger competitor simply hasn’t had time to experience yet.',
    'Are you willing to lean into your age as your primary differentiator of certainty?'
  ],
  dec: 'My age and years of experience are not something to apologize for. They are the exact reason a client should trust me.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_o9bioNNWdlDAP/',
  body: {
    css: `
      .cert-matrix { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0; }
      @media(max-width:768px) { .cert-matrix { grid-template-columns: 1fr; } }
      .cm-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; text-align: center; }
      .cm-icon { font-size: 2.5rem; margin-bottom: 20px; }
      .cm-title { font-family: 'Cinzel'; font-size: 1.4rem; color: #fff; margin-bottom: 16px; }
      .cm-desc { font-size: 1rem; color: var(--muted); line-height: 1.6; margin-bottom: 24px; }
      .cm-tag { display: inline-block; padding: 8px 16px; border-radius: 8px; font-family: 'Inter'; font-size: 0.75rem; letter-spacing: 0.1em; font-weight: bold; }
      .cm-tag.danger { background: rgba(232,72,85,0.1); color: var(--danger); border: 1px solid var(--danger); }
      .cm-tag.gold { background: var(--gold-g); color: var(--gold); border: 1px solid var(--gold); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The 45.0 Reality</h2>
        <p class="body-text">Among the fastest-growing 0.1% of new businesses, the average age of the founder is <strong>45, not 25.</strong> A fifty-year-old founder is about 1.8 times more likely to build a runaway success than a thirty-year-old.</p>
      </div>
      
      <div class="cert-matrix">
        <div class="cm-card">
          <div class="cm-icon">⚡</div>
          <div class="cm-title">The 25-Year-Old Pitch</div>
          <div class="cm-desc">Exciting ideas, flashy software, high energy. But they haven't fired anyone, recovered from a public mistake, or held a team together during a crisis.</div>
          <div class="cm-tag danger">REPRESENTS HIGH RISK</div>
        </div>
        
        <div class="cm-card">
          <div class="cm-icon">⚓</div>
          <div class="cm-title">The 50-Year-Old Pitch</div>
          <div class="cm-desc">Simple, three-step processes built after living through real systemic breakdowns. They know exactly what fails and why.</div>
          <div class="cm-tag gold">REPRESENTS CERTAINTY</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 41 DATA
// ==========================================
const m41 = {
  id: 41,
  title: 'The Old, Costly Definition',
  gTitle: 'The Old, <br/><span class="g">Costly Definition</span>',
  heroSub: 'Inside most companies, "going above and beyond" has quietly come to mean sacrificing yourself. If you carry that definition into your own work, you will burn out.',
  qs: [
    'How do you currently define "overdelivering"? Does it involve working weekends or answering emails at 2 AM?',
    'What happens if you train your clients to see you as a bottomless resource instead of a respected professional?',
    'How could you overdeliver through Clarity instead of hours? (e.g., a one-page summary instead of a 60-page report).',
    'How could you overdeliver through Foresight? What is a problem you can warn them about before it happens?',
    'Look at your schedule. Choose one boundary you need to set to protect your time, and write down exactly how you\'ll calmly enforce it.'
  ],
  dec: 'I will overdeliver through clarity, foresight, and boundaries. I will not overdeliver by sacrificing my time and energy.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_BcRzXL9Hvi0LM/',
  body: {
    css: `
      .od-list { margin: 40px 0; display: flex; flex-direction: column; gap: 16px; }
      .od-item { background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 24px 32px; display: flex; align-items: flex-start; gap: 20px; transition: 0.3s; cursor: pointer; }
      .od-item:hover { border-color: var(--gold-b); background: var(--surface); }
      .od-item.checked .od-check { background: var(--gold); color: var(--void); border-color: var(--gold); }
      .od-check { width: 32px; height: 32px; border-radius: 8px; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; transition: 0.3s; margin-top: 2px; }
      .od-text h4 { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 6px; }
      .od-text p { font-size: 0.95rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The New Definition of Overdelivering</h2>
        <p class="body-text">For an expert, overdelivering has almost nothing to do with working more hours. It's about the clarity, usefulness, and foresight of what you actually give the client. Click to acknowledge the new standards.</p>
      </div>
      
      <div class="od-list">
        <div class="od-item" onclick="this.classList.toggle('checked')">
          <div class="od-check">✓</div>
          <div class="od-text">
            <h4>1. Overdelivering through Clarity</h4>
            <p>Instead of a 60-page jargon-filled report to prove you worked hard, you send one clear page stating the problem, action, and result. Respecting their time is excellence.</p>
          </div>
        </div>
        
        <div class="od-item" onclick="this.classList.toggle('checked')">
          <div class="od-check">✓</div>
          <div class="od-text">
            <h4>2. Overdelivering through Foresight</h4>
            <p>"Now that this is fixed, you'll run into a different issue in 3 months. Here's a simple template to prevent it."</p>
          </div>
        </div>
        
        <div class="od-item" onclick="this.classList.toggle('checked')">
          <div class="od-check">✓</div>
          <div class="od-text">
            <h4>3. Overdelivering through Boundaries</h4>
            <p>Clients trust professionals with limits far more than someone bottomless. "I respond to messages within one business day."</p>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 42 DATA
// ==========================================
const m42 = {
  id: 42,
  title: 'Quiet Confidence Beats Loud Claims',
  gTitle: 'Quiet Confidence <br/><span class="g">Beats Loud Claims</span>',
  heroSub: 'Real authority is never something you demand from a client. It is something you build, quietly, through consistency, clarity, and calm.',
  qs: [
    'Read your one-line value statement out loud as if apologizing. Now read it as a plain, neutral fact (like a doctor\'s diagnosis). What changed in your body?',
    'Name three specific ways you currently ask for permission you don\'t actually need. Write the confident alternative you\'ll use this week.',
    'Write down three hard situations you\'ve lived through that a 20-something hasn\'t. How do these prove they can trust you?',
    'Write down three ways you could overdeliver through clarity, foresight, or firm boundaries, without adding a single extra working hour.',
    'Imagine a client asks, "what\'s your rate?" Write out your exact response, word for word. It must state your price and stop.',
    'Choose one boundary you need to set this week. Write exactly how you\'ll calmly enforce it if a client pushes against it.',
    'Who in your life already treats you like an expert? How could you bring that same dynamic into how you talk to new clients?',
    'Finish this sentence honestly: "The part of calling myself an expert that makes me most uncomfortable is ______, because ______."',
    'Write a 3-sentence intro of yourself (for LinkedIn/Email) stating your target, problem, and solution as simple facts. No buzzwords.',
    'Choose one small change to make this week that reinforces this new identity (e.g. updating profile, clean video background). What is it?'
  ],
  dec: 'I will speak less and pause more. I will ask sharp questions. I will state my price and hold the silence.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_ip0Z44jJNgtfO/',
  body: {
    css: `
      .pause-sim { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 60px 40px; margin: 40px 0; text-align: center; }
      .ps-text { font-family: 'Cormorant Garamond'; font-size: 1.4rem; color: #fff; margin-bottom: 32px; font-style: italic; }
      .ps-btn { padding: 16px 32px; background: transparent; border: 2px solid var(--gold); border-radius: var(--rp); font-family: 'Inter'; font-size: 0.8rem; letter-spacing: 0.15em; color: var(--gold); cursor: pointer; transition: 0.3s; font-weight: 600; outline: none; }
      .ps-btn:active { background: var(--gold-d); }
      .ps-bar-wrap { width: 100%; max-width: 400px; height: 4px; background: var(--void); margin: 32px auto 0; border-radius: 4px; overflow: hidden; }
      .ps-bar { height: 100%; width: 0%; background: var(--gold); transition: width 0.1s linear; }
      .ps-msg { font-family: 'Cinzel'; color: var(--success); font-size: 1.2rem; margin-top: 24px; display: none; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Markers of Real Authority</h2>
        <ul style="list-style:none; padding-left:0; margin-top:20px;">
          <li class="body-text" style="margin-bottom:12px"><strong>1. Speak less and pause more.</strong> The person talking the most feels the least secure.</li>
          <li class="body-text" style="margin-bottom:12px"><strong>2. Ask sharp questions.</strong> "Before we talk about solutions, what happens to your business if this isn't fixed in 6 months?"</li>
          <li class="body-text" style="margin-bottom:12px"><strong>3. Use 'I' for delivery, 'We' for shared work.</strong> Signals you are leading the engagement.</li>
        </ul>
      </div>
      
      <div class="pause-sim">
        <h2 class="sec-title" style="margin-bottom:16px">The Sales Pause Simulator</h2>
        <p class="ps-text">"My fee to fix this is 15,000. I can start Monday."</p>
        
        <p class="body-text" style="font-size:0.9rem; color:var(--muted)">Click and HOLD the button for 3 full seconds to resist the urge to justify your price.</p>
        
        <button class="ps-btn" id="ps-btn">HOLD THE SILENCE</button>
        
        <div class="ps-bar-wrap"><div class="ps-bar" id="ps-bar"></div></div>
        <div class="ps-msg" id="ps-msg">Client: "Send me the agreement."</div>
      </div>
    `,
    js: `
      let holdTimer;
      let holdProgress = 0;
      const btn = document.getElementById('ps-btn');
      const bar = document.getElementById('ps-bar');
      const msg = document.getElementById('ps-msg');
      
      btn.addEventListener('mousedown', startHold);
      btn.addEventListener('touchstart', startHold);
      window.addEventListener('mouseup', endHold);
      window.addEventListener('touchend', endHold);
      
      function startHold() {
        if(holdProgress >= 100) return;
        holdTimer = setInterval(() => {
          holdProgress += 3.33; // ~3 seconds to hit 100
          bar.style.width = holdProgress + '%';
          if(holdProgress >= 100) {
            clearInterval(holdTimer);
            msg.style.display = 'block';
            btn.style.borderColor = 'var(--success)';
            btn.style.color = 'var(--success)';
            btn.textContent = 'SILENCE HELD';
          }
        }, 100);
      }
      
      function endHold() {
        if(holdProgress < 100) {
          clearInterval(holdTimer);
          holdProgress = 0;
          bar.style.width = '0%';
        }
      }
    `
  }
};

const modules = [m37, m38, m39, m40, m41, m42];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
