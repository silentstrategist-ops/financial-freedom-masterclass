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
  for(let i=1;i<=10;i++){
    const saved = localStorage.getItem('ffm${id}_r'+i);
    if(saved) document.getElementById('j${id}_'+i).value = saved;
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
// MODULE 17 DATA
// ==========================================
const m17 = {
  id: 17,
  title: 'Why One Stock Is A Bet',
  gTitle: 'Why One Stock Is A Bet,<br/>And Many Is A <span class="g">Plan</span>',
  heroSub: 'Imagine two people. One puts all savings into one company. The other spreads it across many. If one company fails, the first loses everything. The second barely feels it.',
  qs: [
    'Right now, how much of your invested money, if any, sits in a single company, a single industry, or a single country?',
    'If that one company, industry, or country had a very bad year, what would actually happen to your overall financial plan?',
    'Think of a time you heard about someone losing a large amount of money in an investment. Was it because everything rested on one company?',
    'Have you ever avoided investing because trying to pick "the right company" felt too hard or too risky?',
    'List three completely different industries (e.g. farming, banking, tech). If you had money in all three at once, would a bad year in one worry you?',
    'Have you ever put money into something mainly because it felt exciting rather than because it was part of a spread out plan?',
    'Thinking about your own country\'s economy, what would happen to your finances if it went through a difficult few years?',
    'Is there any other part of your financial life (not just investing) where you\'re currently resting everything on one single thing?',
    'What has stopped you, until now, from spreading your investments the way this chapter describes?',
    'Write one sentence describing what a properly spread out, diversified plan would actually look like for you, in your own situation.'
  ],
  dec: 'I will not bet my future on a single point of failure. I build resilient plans, not concentrated bets.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_3c0ruoDsb1tN0/',
  body: {
    css: `
      .farm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0; }
      @media(max-width:768px) { .farm-grid { grid-template-columns: 1fr; } }
      .farm-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px; text-align: center; }
      .farm-visual { display: grid; gap: 8px; margin: 24px 0; }
      .farm-1 { grid-template-columns: 1fr; }
      .farm-10 { grid-template-columns: repeat(5, 1fr); }
      .crop { background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 8px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: 0.3s; cursor: pointer; }
      .crop.fail { background: rgba(232, 72, 85, 0.1); border-color: rgba(232, 72, 85, 0.5); filter: grayscale(1); opacity: 0.5; }
      .farm-title { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; }
      .farm-desc { font-size: 0.9rem; color: var(--muted); margin-top: 16px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title" style="text-align:center">The Two Kinds of Risk</h2>
        <p class="body-text">The first kind affects everything at once (interest rates, global slowdown). You can't avoid it. The second kind affects one company alone (factory fire, bad leadership). <strong>This kind of risk can be almost completely removed.</strong></p>
      </div>

      <div class="farm-grid">
        <div class="farm-box" id="fb1">
          <div class="farm-title">One Concentrated Bet</div>
          <div class="farm-visual farm-1">
            <div class="crop" onclick="this.classList.toggle('fail')">🌾</div>
          </div>
          <div class="farm-desc">Click the crop. If it fails, everything is gone. 100% loss.</div>
        </div>
        
        <div class="farm-box" id="fb10">
          <div class="farm-title">Real Diversification</div>
          <div class="farm-visual farm-10">
            <div class="crop" onclick="this.classList.toggle('fail')">🌾</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🌽</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🍎</div>
            <div class="crop" onclick="this.classList.toggle('fail')">☕</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🥔</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🥕</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🍇</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🍋</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🍉</div>
            <div class="crop" onclick="this.classList.toggle('fail')">🥑</div>
          </div>
          <div class="farm-desc">Click a crop to simulate a local failure. The overall portfolio barely feels it.</div>
        </div>
      </div>
      
      <p class="body-text">Real diversification means spreading across <strong>industries</strong>, <strong>company sizes</strong>, and <strong>places (geography)</strong>.</p>
    `
  }
};

// ==========================================
// MODULE 18 DATA
// ==========================================
const m18 = {
  id: 18,
  title: 'The Boring Tool That Actually Works',
  gTitle: 'The Boring Tool <br/>That Actually <span class="g">Works</span>',
  heroSub: 'It\'s not exciting. It won\'t make you rich overnight. But it\'s one of the most proven, reliable ways ordinary people have built real wealth over time.',
  qs: [
    'Have you ever invested in an index fund or ETF before? If yes, what was it like? If no, what stopped you?',
    'Based on this chapter, would you rather try to pick individual companies yourself, or own a broad spread through one simple fund?',
    'If you were to start today, how much could you realistically commit to a fixed, repeating monthly purchase?',
    'What does the idea of "leaving it alone" for many years feel like to you? Comfortable or anxious?',
    'Think of the last time prices of something dropped suddenly. What was your instinct, and would it have helped or hurt you?',
    'Do you currently have any surplus that\'s sitting idle and could realistically start moving into something like this?',
    'What questions do you still have about how to actually open an account and start buying an index fund/ETF where you live?',
    'If you planted ten different trees, and three had a bad year, would that change your plan for the other seven?',
    'What fee level would you consider acceptable for a fund, and have you actually compared a few options?',
    'Write down the exact fixed amount and the exact date you\'ll start your first repeating purchase.'
  ],
  dec: 'I choose proven, steady growth over the illusion of getting rich quick. I will automate my wealth building and let time do the heavy lifting.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_rqPD2TTVx7mZS/',
  body: {
    css: `
      .etf-box { background: var(--deep); border: 1px solid var(--gold-b); border-radius: var(--r); padding: 40px; margin: 40px 0; text-align:center; position:relative; overflow:hidden; }
      .etf-basket { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin: 24px 0; }
      .etf-share { width: 12px; height: 12px; background: var(--surface2); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; }
      .etf-share.g { background: rgba(46,204,113,0.4); border-color: var(--success); }
      .etf-share.r { background: rgba(232,72,85,0.4); border-color: var(--danger); }
      
      .step-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      @media(max-width:640px) { .step-grid { grid-template-columns: 1fr; } }
      .step-card { background: var(--void); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
      .step-num { font-family: 'Inter'; font-size: 0.7rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
      .step-title { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 12px; }
      .step-desc { font-size: 0.95rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">What An Index Fund Actually Is</h2>
        <p class="body-text">An index fund or ETF holds hundreds, sometimes thousands of companies in one single purchase. It removes the guessing entirely. You're not betting on one company; you're owning a piece of the whole market.</p>
      </div>

      <div class="etf-box">
        <div class="sec-title" style="font-size:1.5rem">The ETF Basket</div>
        <p class="body-text" style="font-size:1rem; margin-bottom:0">Instead of buying 100 individual stocks, you buy 1 unit of the basket.</p>
        <div class="etf-basket" id="etf-basket"></div>
        <p class="body-text" style="font-size:0.9rem; color:var(--muted)">Visualizing 300 companies. Even if some flash red (fail), the green (growth) over time heavily outweighs the concentrated risk.</p>
      </div>

      <h2 class="sec-title" style="margin-top:60px">How To Actually Start</h2>
      <div class="step-grid">
        <div class="step-card">
          <div class="step-num">Step One</div>
          <div class="step-title">Pick A Broad Market</div>
          <div class="step-desc">A broad fund holds companies across many industries. Narrow funds (e.g. only tech) give you less real protection.</div>
        </div>
        <div class="step-card">
          <div class="step-num">Step Two</div>
          <div class="step-title">Check The Fee</div>
          <div class="step-desc">Lower fees matter massively over time. A fee that looks small quietly eats into your compound growth every year.</div>
        </div>
        <div class="step-card">
          <div class="step-num">Step Three</div>
          <div class="step-title">Fixed, Repeating Purchase</div>
          <div class="step-desc">Buy a fixed amount regularly, regardless of the price. You naturally buy more when prices are low and fewer when high.</div>
        </div>
        <div class="step-card">
          <div class="step-num">Step Four</div>
          <div class="step-title">Leave It Alone</div>
          <div class="step-desc">When prices drop, don't panic. The entire strength of this tool comes from holding steadily through ups and downs.</div>
        </div>
      </div>
    `,
    js: `
      const basket = document.getElementById('etf-basket');
      if(basket) {
        for(let i=0; i<300; i++) {
          const el = document.createElement('div');
          el.className = 'etf-share';
          basket.appendChild(el);
        }
        setInterval(() => {
          const shares = document.querySelectorAll('.etf-share');
          const rand = Math.floor(Math.random() * shares.length);
          const isGreen = Math.random() > 0.3; // 70% chance green
          shares[rand].className = 'etf-share ' + (isGreen ? 'g' : 'r');
          setTimeout(() => { shares[rand].className = 'etf-share'; }, 2000);
        }, 100);
      }
    `
  }
};

// ==========================================
// MODULE 19 DATA
// ==========================================
const m19 = {
  id: 19,
  title: 'The Familiar Route To Wealth',
  gTitle: 'The Familiar Route <br/>To <span class="g">Wealth</span>',
  heroSub: 'For a lot of people, land and property feel more real than a fund on a screen. But getting this wrong can be very costly. Let\'s treat it honestly.',
  qs: [
    'Do you currently own any property or land? Walk through honestly whether it\'s grown in value, produced income, or simply sat there.',
    'If you don\'t own property, is it an active plan, or something you\'ve assumed you should want without thinking it through?',
    'Before this chapter, did you know the full checklist for confirming a title deed properly? Which step would you have skipped?',
    'Do you personally know anyone who lost money through a land or property issue? What actually happened?',
    'If you needed cash quickly, could you turn property into cash within a few weeks? What does that tell you about emergency funds?',
    'If considering property to rent out, have you actually calculated the full honest costs against realistic rent (including empty months)?',
    'Is your interest in property coming from a genuine plan, or partly from the feeling that "everyone" should own land?',
    'What percentage of your overall wealth is tied up in property versus other assets?',
    'If that percentage is very high, does that concentration concern you now?',
    'Write one clear next step for how property fits into your own plan.'
  ],
  dec: 'I will not let emotions or social pressure force me into a bad purchase. I verify before I buy, and I calculate before I build.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_c8eevSdJP7OhH/',
  body: {
    css: `
      .chk-list { display: flex; flex-direction: column; gap: 16px; margin: 40px 0; }
      .chk-item { background: var(--deep); border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; align-items: flex-start; gap: 20px; cursor: pointer; transition: 0.3s; }
      .chk-item:hover { border-color: var(--gold-b); background: var(--surface); }
      .chk-box { width: 32px; height: 32px; flex-shrink: 0; border: 2px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
      .chk-box::after { content: '✓'; color: var(--deep); font-weight: bold; font-size: 1.2rem; opacity: 0; transform: scale(0); transition: 0.3s; }
      .chk-item.checked .chk-box { background: var(--gold); border-color: var(--gold); }
      .chk-item.checked .chk-box::after { opacity: 1; transform: scale(1); }
      .chk-text h4 { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 8px; }
      .chk-text p { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
      .chk-item.checked .chk-text h4 { color: var(--gold); text-decoration: line-through; opacity: 0.6; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Part People Often Get Wrong</h2>
        <p class="body-text"><strong>Property is not spread out.</strong> It's a single, concentrated bet on one specific place. <strong>Property is not liquid.</strong> You cannot sell a plot of land overnight to cover an emergency.</p>
        <p class="body-text">More people lose money in land through unclear ownership, fake deeds, and boundary disputes than through the land itself losing value.</p>
      </div>

      <h2 class="sec-title" style="margin-top:60px">The Buyer's Checklist</h2>
      <p class="body-text">Work through this fully before any money changes hands, every time, even if the seller is someone you trust. Click to check off.</p>
      
      <div class="chk-list">
        <div class="chk-item" onclick="this.classList.toggle('checked')">
          <div class="chk-box"></div>
          <div class="chk-text">
            <h4>1. Official Title Search</h4>
            <p>Confirm the title deed is genuine through an official government search, not just by looking at the paper the seller hands you.</p>
          </div>
        </div>
        <div class="chk-item" onclick="this.classList.toggle('checked')">
          <div class="chk-box"></div>
          <div class="chk-text">
            <h4>2. Consent of All Owners</h4>
            <p>Confirm the seller is the legal owner and there are no other names on the title that haven't given their formal consent.</p>
          </div>
        </div>
        <div class="chk-item" onclick="this.classList.toggle('checked')">
          <div class="chk-box"></div>
          <div class="chk-text">
            <h4>3. Physical Boundary Verification</h4>
            <p>Physically visit the land with a licensed surveyor to confirm the boundaries match the official records.</p>
          </div>
        </div>
        <div class="chk-item" onclick="this.classList.toggle('checked')">
          <div class="chk-box"></div>
          <div class="chk-text">
            <h4>4. Debt & Dispute Check</h4>
            <p>Check whether there are any existing debts, disputes, or claims tied to that specific piece of land or property.</p>
          </div>
        </div>
        <div class="chk-item" onclick="this.classList.toggle('checked')">
          <div class="chk-box"></div>
          <div class="chk-text">
            <h4>5. Legal Transfer</h4>
            <p>Use a qualified lawyer to handle the transfer properly, rather than trying to save a small fee informally.</p>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 20 DATA
// ==========================================
const m20 = {
  id: 20,
  title: 'The Financial World You Already Know',
  gTitle: 'The Financial World <br/><span class="g">You Already Know</span>',
  heroSub: 'SACCOs, groups, table banking, and mobile money are not a backup plan. They are trusted tools that quietly build real wealth for millions.',
  qs: [
    'Are you currently part of a SACCO, group, or table banking group? Describe honestly how well it\'s run.',
    'If part of a group, does it have clear written rules and clear records every member can see?',
    'Do you use mobile money savings? Do you know how quickly you could access it in an emergency?',
    'Have you ever had a bad experience with an informal savings group? What went wrong?',
    'If you\'re not in any group, what has stopped you (trust, lack of a group, never considered)?',
    'Is all of your current saving/investing held in one single currency? Have you noticed the real buying power changing?',
    'Of SACCOs, groups, table banking, mobile money, which feels most realistic and useful for you right now?',
    'How could you use local tools alongside the more formal tools (ETFs) rather than choosing one over the other?',
    'Who in your life could you trust to start a properly run group with, using the checklist from this chapter?',
    'Write one concrete step you\'ll take this month to strengthen a group you\'re in, or start using one properly.'
  ],
  dec: 'I will use the tools around me with clear eyes, demanding transparency and accountability to protect my surplus.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_okQ6smjZJkLt5/',
  body: {
    css: `
      .tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0; }
      @media(max-width:768px) { .tool-grid { grid-template-columns: 1fr; } }
      .tool-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px; position:relative; overflow:hidden; }
      .tool-icon { font-size: 2.5rem; margin-bottom: 16px; color: var(--gold); }
      .tool-title { font-family: 'Cinzel'; font-size: 1.3rem; color: #fff; margin-bottom: 12px; }
      .tool-desc { font-size: 1rem; color: var(--text); line-height: 1.6; margin-bottom: 20px; }
      .tool-check { font-family: 'Inter'; font-size: 0.75rem; color: var(--gold); background: var(--gold-g); border: 1px solid var(--gold-b); padding: 12px 16px; border-radius: 8px; line-height: 1.5; }
    `,
    html: `
      <p class="body-text" style="max-width:800px; margin:0 auto 40px; text-align:center;">This chapter treats local tools with the seriousness they deserve, while being honest about where the real risks sit. They work brilliantly—when governed by strict rules, not just blind trust.</p>

      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-icon">🤝</div>
          <div class="tool-title">SACCOs</div>
          <div class="tool-desc">Builds steady saving discipline and gives access to credit based on multiplier rules, better than banks.</div>
          <div class="tool-check"><strong>CHECK:</strong> Is it properly registered? Does it publish clear financial reports? Can members easily exit?</div>
        </div>
        <div class="tool-card">
          <div class="tool-icon">👥</div>
          <div class="tool-title">Informal Groups</div>
          <div class="tool-desc">Creates real accountability. It allows people to pool resources for bigger investments (land/business).</div>
          <div class="tool-check"><strong>CHECK:</strong> Are rules written down? Are records fully transparent to everyone, not just one leader?</div>
        </div>
        <div class="tool-card">
          <div class="tool-icon">🪑</div>
          <div class="tool-title">Table Banking</div>
          <div class="tool-desc">Simple, local, transparent. Members borrow directly from the pot, and the interest benefits the group.</div>
          <div class="tool-check"><strong>CHECK:</strong> Everyone must be in the room. Clear limits on borrowing ratios relative to contributions.</div>
        </div>
        <div class="tool-card">
          <div class="tool-icon">📱</div>
          <div class="tool-title">Mobile Money Savings</div>
          <div class="tool-desc">Small, steady amounts directly from your phone. Easiest way to build the early stages of a liquidity buffer.</div>
          <div class="tool-check"><strong>CHECK:</strong> How fast can you actually withdraw in an emergency? Convenience in must match convenience out.</div>
        </div>
      </div>
      
      <div class="card" style="border-color:rgba(232,72,85,0.3); background:rgba(232,72,85,0.02)">
        <h2 class="sec-title" style="color:var(--danger); font-size:1.3rem;">The Risk Worth Naming: Currency Risk</h2>
        <p class="body-text" style="margin:0">If your local currency regularly loses value against stronger currencies, your savings quietly lose buying power even as the number grows. This is why you must eventually spread some wealth into international assets (like broad ETFs) to protect your real purchasing power.</p>
      </div>
    `
  }
};

// ==========================================
// MODULE 21 DATA
// ==========================================
const m21 = {
  id: 21,
  title: 'The Mix Should Change As You Change',
  gTitle: 'The Mix Should Change <br/><span class="g">As You Change</span>',
  heroSub: 'The right mix of assets shifts as you move through life. A bad year at age 25 is a blip. A bad year at age 58 is a crisis.',
  qs: [
    'Using the 110-minus-your-age guide, calculate your own rough starting mix (Growth vs Steadier).',
    'Roughly, what does your actual current mix look like right now across all your savings and assets?',
    'Is your current mix carrying more risk than the guide suggests, less, or roughly in line?',
    'If it is carrying more risk, what specifically would need to shift, and how?',
    'How many years do you honestly expect before you\'d want to start drawing real income from these assets?',
    'Does anyone currently depend on your income? Should that make you lean slightly more toward steady assets?',
    'Of everything you hold, which pieces do the job of growth, and which pieces do steadiness? Is the split clear?',
    'If markets had a genuinely bad year tomorrow, would you be forced to sell growth assets at a loss to live?',
    'What is one specific adjustment you could make this year to bring your mix closer to where it should be?',
    'Write down the date you\'ll review this mix again, at least a year from now.'
  ],
  dec: 'I will adjust my risk as my timeline shortens. I will protect what I have built by letting math, not greed, dictate my mix.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_sCQDcD4LgAgyI/',
  body: {
    css: `
      .mix-calc { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align:center; }
      .mix-input { background: var(--void); border: 1px solid var(--gold-b); color: var(--gold); font-family: 'Cinzel'; font-size: 2.5rem; text-align: center; width: 140px; padding: 12px; border-radius: 12px; outline: none; margin: 24px 0; transition: 0.3s; }
      .mix-input:focus { border-color: var(--gold); }
      .mix-bar-wrap { height: 40px; background: var(--surface2); border-radius: 20px; overflow: hidden; display: flex; margin-top: 32px; border: 1px solid var(--border); }
      .mix-growth { background: var(--cyan); height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Inter'; font-size: 0.8rem; font-weight: bold; color: var(--void); transition: 0.8s cubic-bezier(0.16,1,0.3,1); }
      .mix-steady { background: var(--gold); height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Inter'; font-size: 0.8rem; font-weight: bold; color: var(--void); transition: 0.8s cubic-bezier(0.16,1,0.3,1); }
      .mix-labels { display: flex; justify-content: space-between; margin-top: 16px; }
      .mix-lbl { font-family: 'Inter'; font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
      .mix-lbl span { font-size: 1.1rem; color: #fff; font-family: 'Cinzel'; display: block; margin-top: 4px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The "110 Minus Age" Rule</h2>
        <p class="body-text">A simple starting guide: take 110 and subtract your current age. The result is the rough percentage you should hold in higher-growth/higher-risk assets. The rest sits in steady, lower-risk holdings (bonds, cash, fixed deposits) as your "dry powder".</p>
      </div>

      <div class="mix-calc">
        <div class="sec-title" style="font-size:1.4rem">Enter Your Age</div>
        <input type="number" id="age-input" class="mix-input" value="50" oninput="updateMix()" />
        
        <div class="mix-bar-wrap">
          <div class="mix-growth" id="bar-growth" style="width: 60%">60%</div>
          <div class="mix-steady" id="bar-steady" style="width: 40%">40%</div>
        </div>
        
        <div class="mix-labels">
          <div class="mix-lbl" style="text-align:left; color:var(--cyan)">Growth Assets (ETFs, Stocks) <span id="txt-growth" style="color:var(--cyan)">60%</span></div>
          <div class="mix-lbl" style="text-align:right; color:var(--gold)">Steady Assets (Bonds, Cash) <span id="txt-steady" style="color:var(--gold)">40%</span></div>
        </div>
      </div>
      
      <p class="body-text" style="text-align:center; max-width:700px; margin:0 auto;">This ensures you are never forced to sell your growth investments at a loss just to cover living costs during a bad year. <strong>It’s not retreating from wealth building—it’s protecting it.</strong></p>
    `,
    js: `
      function updateMix() {
        let age = parseInt(document.getElementById('age-input').value) || 0;
        if(age < 18) age = 18;
        if(age > 100) age = 100;
        
        let growth = 110 - age;
        if(growth < 0) growth = 0;
        if(growth > 100) growth = 100;
        let steady = 100 - growth;
        
        document.getElementById('bar-growth').style.width = growth + '%';
        document.getElementById('bar-steady').style.width = steady + '%';
        
        document.getElementById('bar-growth').textContent = growth > 10 ? growth + '%' : '';
        document.getElementById('bar-steady').textContent = steady > 10 ? steady + '%' : '';
        
        document.getElementById('txt-growth').textContent = growth + '%';
        document.getElementById('txt-steady').textContent = steady + '%';
      }
      window.addEventListener('DOMContentLoaded', updateMix);
    `
  }
};

const modules = [m17, m18, m19, m20, m21];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
