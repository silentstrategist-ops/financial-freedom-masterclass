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
// MODULE 53 DATA
// ==========================================
const m53 = {
  id: 53,
  title: 'Why Warm Beats Cold, Almost Every Single Time',
  gTitle: 'Warm Beats <br/><span class="g">Cold</span>',
  heroSub: 'When someone already trusts the person who introduced you, a huge chunk of the work is already done before you\'ve said a single word.',
  qs: [
    'List five people from your past working life who you haven\'t spoken to in over a year. What\'s one honest reason you haven\'t reached out?',
    'Think of a time someone was personally referred to you. How differently did you treat that conversation compared to a cold pitch?',
    'Have you ever "spent" your own trust by referring someone to a friend? What made you comfortable doing that?',
    'Which of the five people from question one would you feel most comfortable reaching out to first, with no agenda?',
    'What\'s one thing you\'re currently waiting to "have" before you reach back out? Is that wait necessary or avoidance?',
    'Think honestly about your career. How many real, working relationships did you build without realizing they were an asset? Name three.'
  ],
  dec: 'I will stop waiting until I "have something to offer." Reconnecting now keeps trust warm; waiting turns it transactional.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_sKKkR9OKwNrJ0/',
  body: {
    css: `
      .trust-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .tb-header { display: flex; justify-content: center; gap: 24px; margin-bottom: 32px; }
      .tb-btn { padding: 12px 32px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--rp); font-family: 'Inter'; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--text); cursor: pointer; transition: 0.3s; }
      .tb-btn.active { background: var(--gold); border-color: var(--gold); color: var(--void); font-weight: bold; }
      .tb-vis { position: relative; height: 120px; border-radius: 12px; background: var(--void); border: 1px dashed var(--border); overflow: hidden; }
      .tb-track { position: absolute; left: 0; top: 0; height: 100%; width: 0%; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: flex-end; padding-right: 20px; font-family: 'Cinzel'; font-weight: bold; color: var(--void); }
      .tb-desc { margin-top: 24px; font-size: 0.95rem; color: var(--muted); text-align: center; font-style: italic; min-height: 48px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Transfer of Trust</h2>
        <p class="body-text">A referral isn't just a name passed along. The person making the introduction is quietly putting a small amount of their own credibility on the line. That risk is exactly why a referral carries so much weight.</p>
      </div>
      
      <div class="trust-box">
        <h2 class="sec-title" style="text-align:center; margin-bottom:24px">The Trust Deficit Visualizer</h2>
        
        <div class="tb-header">
          <button class="tb-btn active" id="btn-cold" onclick="setTrust('cold')">Cold Outreach</button>
          <button class="tb-btn" id="btn-warm" onclick="setTrust('warm')">Warm Referral</button>
        </div>
        
        <div class="tb-vis">
          <div class="tb-track" id="tb-track" style="width:10%; background:var(--danger);">10% Trust</div>
        </div>
        
        <div class="tb-desc" id="tb-desc">"You are starting from zero. The entire interaction is spent proving you aren't wasting their time."</div>
      </div>
    `,
    js: `
      function setTrust(type) {
        const btnC = document.getElementById('btn-cold');
        const btnW = document.getElementById('btn-warm');
        const track = document.getElementById('tb-track');
        const desc = document.getElementById('tb-desc');
        
        if (type === 'cold') {
          btnC.classList.add('active'); btnW.classList.remove('active');
          track.style.width = '10%'; track.style.background = 'var(--danger)';
          track.textContent = '10% Trust';
          desc.textContent = '"You are starting from zero. The entire interaction is spent proving you aren\\'t wasting their time."';
        } else {
          btnW.classList.add('active'); btnC.classList.remove('active');
          track.style.width = '85%'; track.style.background = 'var(--success)';
          track.textContent = '85% Trust (Borrowed)';
          desc.textContent = '"The approval does more work in the first ten seconds than a well-crafted pitch could do on its own."';
        }
      }
    `
  }
};

// ==========================================
// MODULE 54 DATA
// ==========================================
const m54 = {
  id: 54,
  title: 'Give Before You Ask, Every Time',
  gTitle: 'Give Before <br/><span class="g">You Ask</span>',
  heroSub: 'Asking first frames the entire interaction as transactional. Giving first flips that entirely. It lets them form an honest opinion based on something real.',
  qs: [
    'Of the four types of value (Answer, Introduction, Resource, Endorsement), which comes most naturally to you?',
    'Think of someone in your network with a problem you could genuinely help with right now. What would helping actually look like?',
    'Are there two people in your network who don\'t know each other but genuinely should? What would introducing them sound like?',
    'Recall a time someone gave you real, unasked-for value. How did it change the way you felt about them?',
    'Has your instinct leaned more toward asking first, or giving first? What\'s one thing you could give this week?',
    'Think of a time you received something that felt like a "disguised pitch." What specifically made it feel that way?'
  ],
  dec: 'I will give real value without a hidden angle. I understand that genuine goodwill builds trust, and disguised pitches destroy it.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_VhNSVp1mwUX6z/',
  body: {
    css: `
      .val-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0; }
      @media(max-width:768px) { .val-grid { grid-template-columns: 1fr; } }
      .val-card { background: var(--deep); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; transition: 0.3s; cursor: pointer; position: relative; overflow: hidden; }
      .val-card:hover { border-color: var(--gold-d); transform: translateY(-4px); }
      .val-icon { font-size: 2rem; color: var(--gold); margin-bottom: 16px; }
      .val-title { font-family: 'Cinzel'; font-size: 1.1rem; color: #fff; margin-bottom: 8px; }
      .val-desc { font-size: 0.9rem; color: var(--muted); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">What You Actually Have To Offer</h2>
        <p class="body-text">A common worry is thinking you have nothing worth giving yet—no products, no case studies, no big offer. This misses what people actually value most in a relationship.</p>
      </div>
      
      <h2 class="sec-title" style="text-align:center; margin-top:40px">The Value Arsenal</h2>
      <div class="val-grid">
        <div class="val-card">
          <div class="val-icon">💡</div>
          <div class="val-title">A Useful Answer</div>
          <div class="val-desc">Taking 15 minutes to help someone think through a problem you understand well from your career costs almost nothing.</div>
        </div>
        <div class="val-card">
          <div class="val-icon">🤝</div>
          <div class="val-title">A Helpful Introduction</div>
          <div class="val-desc">Connecting two people who should know each other, with nothing in it for you, is incredibly high-value.</div>
        </div>
        <div class="val-card">
          <div class="val-icon">📚</div>
          <div class="val-title">A Specific Resource</div>
          <div class="val-desc">An article, tool, or template that solves a problem they explicitly mentioned.</div>
        </div>
        <div class="val-card">
          <div class="val-icon">⭐</div>
          <div class="val-title">A Genuine Endorsement</div>
          <div class="val-desc">Publicly or privately saying something true and specific about someone's work when deserved.</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 55 DATA
// ==========================================
const m55 = {
  id: 55,
  title: 'Referrals Rarely Just "Happen" On Their Own',
  gTitle: 'Engineering <br/><span class="g">Referrals</span>',
  heroSub: 'Most people have every intention of helping, right up until the moment they\'d need to actually stop, think, and act on it. Your job is to make that moment easy.',
  qs: [
    'Think of a past client where you delivered real value. Did you ever directly ask them if they knew anyone else? Why or why not?',
    'Write out exactly what you\'d say to that person if you reached out today using the specific-ask format.',
    'What\'s the actual fear underneath your hesitation to ask directly? Is it based on a real past experience?',
    'Think of the last time you referred someone else\'s business. What specifically made that easy for you to do?',
    'If someone told you "no one comes to mind right now," how would you respond to keep the door open without pressure?',
    'Write one or two sentences describing specifically who you\'re looking to help.'
  ],
  dec: 'I will stop waiting for referrals to magically appear. I will gently, specifically, and calmly ask for them at the right moment.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_RANhovO63jK1I/',
  body: {
    css: `
      .timing-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .tm-scale { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; position: relative; }
      .tm-line { position: absolute; left: 10%; right: 10%; height: 2px; background: var(--border); top: 50%; z-index: 0; }
      .tm-node { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 33%; }
      .tm-dot { width: 24px; height: 24px; border-radius: 12px; background: var(--void); border: 2px solid var(--muted); margin-bottom: 12px; transition: 0.3s; }
      .tm-node:first-child .tm-dot { border-color: var(--success); background: var(--success); }
      .tm-node:last-child .tm-dot { border-color: var(--danger); }
      .tm-label { font-family: 'Cinzel'; font-size: 0.9rem; color: #fff; text-align: center; }
      .tm-sub { font-size: 0.75rem; color: var(--muted); text-align: center; margin-top: 4px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Specific Ask</h2>
        <p class="body-text">"Let me know if you hear of anyone" is the referral equivalent of "we should catch up sometime." It gives them nothing to act on. A specific ask works: "Is there anyone in your world right now going through something similar to what you were dealing with?"</p>
      </div>
      
      <div class="timing-box">
        <h2 class="sec-title" style="text-align:center">The Referral Timing Scale</h2>
        <p class="body-text" style="text-align:center; font-size:0.95rem; color:var(--muted)">Timing matters more than most people realize.</p>
        
        <div class="tm-scale">
          <div class="tm-line"></div>
          <div class="tm-node">
            <div class="tm-dot"></div>
            <div class="tm-label">The Breakthrough</div>
            <div class="tm-sub">High Leverage. Ask right after a win.</div>
          </div>
          <div class="tm-node">
            <div class="tm-dot" style="border-color:var(--gold)"></div>
            <div class="tm-label">Unprompted Praise</div>
            <div class="tm-sub">Strong Opening. They brought up the value naturally.</div>
          </div>
          <div class="tm-node">
            <div class="tm-dot"></div>
            <div class="tm-label">6 Months Later</div>
            <div class="tm-sub">Weakest. The specific feeling has cooled into vague goodwill.</div>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 56 DATA
// ==========================================
const m56 = {
  id: 56,
  title: 'Why The First Message Matters So Much',
  gTitle: 'The First <br/><span class="g">Message</span>',
  heroSub: 'The first message earns the reconnection. The ask comes later, once real warmth has been re-established.',
  qs: [
    'Pick one real person from your network and fill in the template with actual details from your history.',
    'Read your filled-in message back. Does it sound like you, or does it sound like a template?',
    'What\'s the actual worst realistic outcome if you send this message? Could you live with it?',
    'Think of a "no agenda" message you\'ve received. How did it make you feel compared to a disguised pitch?',
    'Pick three people from your list and commit to sending this message to one of them this week. Who and when?',
    'For each of those three, is the relationship casual or formal? How should that change the tone?'
  ],
  dec: 'I will reach out with zero agenda. I will focus entirely on genuine reconnection, letting the relationship exist as the asset it is.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_8HE1PHfpj6H6K/',
  body: {
    css: `
      .msg-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; margin: 40px 0; }
      .mb-text { font-family: 'Cormorant Garamond'; font-size: 1.15rem; color: var(--text); line-height: 1.8; padding: 24px; background: var(--void); border-radius: 12px; border: 1px dashed var(--gold-d); }
      .hl { background: rgba(201,168,76,0.2); padding: 2px 6px; border-radius: 4px; cursor: pointer; transition: 0.3s; color: var(--gold-l); }
      .hl:hover { background: var(--gold); color: var(--void); }
      .hl-tooltip { font-family: 'Inter'; font-size: 0.8rem; color: var(--gold); margin-top: 16px; min-height: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; text-align: center; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Separating Reconnection From The Pitch</h2>
        <p class="body-text">Trying to combine a reconnection and a pitch into a single message weakens both. The reconnection feels fake, and the pitch feels rushed.</p>
      </div>
      
      <div class="msg-box">
        <h2 class="sec-title" style="margin-bottom:24px; text-align:center">The Outreach Deconstructor</h2>
        <p class="body-text" style="font-size:0.9rem; text-align:center; margin-bottom:32px; color:var(--muted)">Hover over the highlighted sections to see the mechanics of a perfect first message.</p>
        
        <div class="mb-text">
          "Hey Sarah, it's been a while since <span class="hl" onmouseover="showTt('Proves you remember them specifically.')" onmouseout="hideTt()">we worked on that messy Q3 logistics rollout</span>. I've been thinking about you lately and wanted to reconnect. I've recently moved into <span class="hl" onmouseover="showTt('States what you do without buzzwords or selling.')" onmouseout="hideTt()">coaching mid-career ops managers</span>, and I'd genuinely love to hear how things have been going on your end too. Would you have 15-20 minutes sometime in the next couple weeks for a quick call, <span class="hl" onmouseover="showTt('Removes the unspoken fear of a sales pitch.')" onmouseout="hideTt()">no agenda, just good to catch up</span>?"
        </div>
        
        <div class="hl-tooltip" id="hl-tt">HOVER OVER HIGHLIGHTED TEXT</div>
      </div>
    `,
    js: `
      function showTt(text) {
        document.getElementById('hl-tt').textContent = text;
      }
      function hideTt() {
        document.getElementById('hl-tt').textContent = 'HOVER OVER HIGHLIGHTED TEXT';
      }
    `
  }
};

// ==========================================
// MODULE 57 DATA
// ==========================================
const m57 = {
  id: 57,
  title: 'Why Tracking Matters, Even For Something This Personal',
  gTitle: 'Tracking Without <br/><span class="g">Being Creepy</span>',
  heroSub: 'The line isn\'t about whether you keep notes. It\'s about the intent behind them. Are you tracking to show up better, or tracking to extract?',
  qs: [
    'Do you currently have any system for tracking who\'s in your network? What does it look like right now?',
    'Sketch out what a simple tracking sheet (Name, Context, Last Contact, Discussed, Next Follow-Up) for your top ten contacts would look like.',
    'If someone saw your notes about them, would they feel cared for or managed? Be honest with yourself.',
    'What\'s a realistic check-in rhythm for you personally given your actual schedule and energy?',
    'Pick three people from your network right now and write down when you last actually spoke to each of them.',
    'Think of one specific, real detail about someone in your life that you\'d genuinely want to remember to ask about next time.'
  ],
  dec: 'I will track my relationships to ensure I show up consistently. I will only write notes I would be comfortable showing them.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_vV2iHbhXtkYhR/',
  body: {
    css: `
      .track-sim { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; margin: 40px 0; }
      .ts-row { display: flex; gap: 16px; margin-bottom: 24px; }
      .ts-input { flex: 1; padding: 16px; background: var(--void); border: 1px solid var(--gold-d); border-radius: 8px; color: var(--text); font-family: 'Cormorant Garamond'; font-size: 1.05rem; outline: none; }
      .ts-input:focus { border-color: var(--gold); }
      .ts-btn { padding: 16px 24px; background: var(--gold); border: none; border-radius: 8px; color: var(--void); font-family: 'Inter'; font-weight: bold; cursor: pointer; transition: 0.3s; }
      .ts-btn:hover { background: #fff; }
      .ts-res { margin-top: 24px; padding: 24px; border-radius: 8px; font-family: 'Cinzel'; display: none; }
      .ts-res.care { background: rgba(46,204,113,0.1); border: 1px solid var(--success); color: var(--success); display: block; }
      .ts-res.manage { background: rgba(232,72,85,0.1); border: 1px solid var(--danger); color: var(--danger); display: block; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Minimalist Tracking System</h2>
        <p class="body-text">You don't need CRM software. You need 5 columns: <strong>Name, Context, Last Contact, Discussed, Next Follow-up</strong>. The goal isn't complex tagging; it's simply not letting real relationships slip through the cracks.</p>
      </div>
      
      <div class="track-sim">
        <h2 class="sec-title" style="margin-bottom:12px; text-align:center">The Care vs. Management Test</h2>
        <p class="body-text" style="font-size:0.9rem; text-align:center; color:var(--muted); margin-bottom:24px">Test your intent. Paste a CRM note below to test if it passes the "Would they wince?" test.</p>
        
        <div class="ts-row">
          <input type="text" class="ts-input" id="ts-input" placeholder="e.g. 'Daughter just started university, check in next month.'" />
          <button class="ts-btn" onclick="runTest()">ANALYZE</button>
        </div>
        
        <div class="ts-res" id="ts-res"></div>
      </div>
    `,
    js: `
      function runTest() {
        const val = document.getElementById('ts-input').value.toLowerCase();
        const res = document.getElementById('ts-res');
        res.className = 'ts-res';
        
        if(!val) return;
        
        // Simple logic for simulator
        const redFlags = ['pitch', 'sell', 'convert', 'budget', 'leverage', 'extract', 'pain point'];
        let isManage = false;
        redFlags.forEach(f => { if(val.includes(f)) isManage = true; });
        
        if(isManage) {
          res.classList.add('manage');
          res.innerHTML = "FAILED: This note exists to help you extract something. If they saw this, they would feel managed, not cared for.";
        } else {
          res.classList.add('care');
          res.innerHTML = "PASSED: This note exists to help you show up better for them. Genuine care organized into a system.";
        }
      }
    `
  }
};

const modules = [m53, m54, m55, m56, m57];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
