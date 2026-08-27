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
// MODULE 26 DATA
// ==========================================
const m26 = {
  id: 26,
  title: 'Why This Chapter Exists',
  gTitle: 'Why This Chapter <br/><span class="g">Exists</span>',
  heroSub: 'You cannot sell what you have not named. You cannot price what you have not audited. You cannot package what you still believe is "just what anyone would do."',
  qs: [
    'What do you actually have to sell, and to whom? Attempt to answer this directly right now.',
    'What specific task or problem feels so easy to you that you assume anyone could do it?',
    'Think back 10 years. What is something you do effortlessly today that would have seemed impossible to you back then?',
    'When was the last time you solved a massive problem for your employer, but brushed it off as "just doing your job"?',
    'What would happen if you were suddenly removed from your current organization tomorrow? What specifically would break?'
  ],
  dec: 'I will no longer confuse my familiarity with my skills for a lack of value. I will audit my expertise ruthlessly and honestly.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_QD1nCunL3WJFZ/',
  body: {
    css: `
      .vis-gap { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .vis-title { font-family: 'Cinzel'; font-size: 1.6rem; color: #fff; margin-bottom: 24px; }
      .vis-slider { display: flex; align-items: center; justify-content: space-between; margin: 40px 0; position: relative; max-width: 600px; margin-inline: auto; }
      .vs-line { position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: var(--border); z-index: 1; }
      .vs-fill { position: absolute; left: 0; width: 50%; top: 50%; height: 2px; background: var(--gold); z-index: 2; transition: width 0.3s; }
      .vs-point { position: relative; z-index: 3; background: var(--void); border: 2px solid var(--gold); border-radius: 50%; width: 24px; height: 24px; cursor: pointer; transition: 0.3s; }
      .vs-point:hover { transform: scale(1.2); background: var(--gold); }
      .vs-labels { display: flex; justify-content: space-between; font-family: 'Inter'; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
      .vs-msg { font-style: italic; color: var(--gold); margin-top: 32px; font-size: 1.1rem; height: 30px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Foundation of Your Value</h2>
        <p class="body-text">Twenty years of employment inside a single organizational structure slowly, invisibly commoditizes your own expertise in your own mind. You mistake the fact that something feels easy to you for evidence that it must be easy for everyone.</p>
        <p class="body-text">This chapter dismantles that illusion using cognitive science, behavioral economics, and a structured audit process.</p>
      </div>
      
      <div class="vis-gap">
        <div class="vis-title">The Visibility Gap</div>
        <p class="body-text" style="font-size:1rem">Slide the point to see how your perception of your work differs from the market's perception.</p>
        
        <div class="vis-slider">
          <div class="vs-line"></div>
          <div class="vs-fill" id="vs-fill"></div>
          <div class="vs-point" id="vs-point" style="left:0%" onmousedown="startDrag(event)"></div>
        </div>
        <div class="vs-labels">
          <span>Your View ("It's easy")</span>
          <span>Market View ("It's magic")</span>
        </div>
        <div class="vs-msg" id="vs-msg">"I'm just doing my job."</div>
      </div>
    `,
    js: `
      let isDragging = false;
      function startDrag(e) { isDragging = true; }
      window.addEventListener('mouseup', () => { isDragging = false; });
      window.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const slider = document.querySelector('.vis-slider');
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let pct = (x / rect.width) * 100;
        if(pct < 0) pct = 0; if(pct > 100) pct = 100;
        document.getElementById('vs-point').style.left = pct + '%';
        document.getElementById('vs-fill').style.width = pct + '%';
        
        const msg = document.getElementById('vs-msg');
        if(pct < 33) msg.textContent = '"I\\'m just doing my job. Anyone could do this."';
        else if(pct < 66) msg.textContent = '"I guess I have some specialized experience here."';
        else msg.textContent = '"My 15 years of pattern recognition just saved this company $200k."';
      });
    `
  }
};

// ==========================================
// MODULE 27 DATA
// ==========================================
const m27 = {
  id: 27,
  title: 'The Phenomenon',
  gTitle: 'The <br/><span class="g">Phenomenon</span>',
  heroSub: 'The sentence "I just did my job" is the single most expensive sentence in your financial life.',
  qs: [
    'Recall a time you solved a major problem in minutes. What was the problem, and why were you uniquely able to see the answer?',
    'How often do you assume that the people around you understand a concept just as deeply as you do?',
    'The Inverse Dunning-Kruger Effect: In what specific area do you consistently underestimate your own ability relative to your peers?',
    'Organizational Erasure: How much of your identity and perceived value is currently tied solely to your job title or W-2?',
    'What does it actually feel like when you write down a major professional achievement? Does it feel like bragging? Why?'
  ],
  dec: 'I will separate my humility from my data. Writing down the truth of my impact is not arrogance; it is accuracy.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_OWpnY5630F1jx/',
  body: {
    css: `
      .tapper-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .tap-btn { padding: 20px 40px; background: var(--gold); border: none; border-radius: var(--rp); font-family: 'Cinzel'; font-size: 1.2rem; color: var(--void); cursor: pointer; transition: 0.3s; font-weight: 700; margin: 24px 0; }
      .tap-btn:hover { background: #fff; transform: scale(1.05); }
      .tap-result { display: none; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border); }
      .tap-result.active { display: block; }
      .tr-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; text-align: left; margin-top: 24px; }
      @media(max-width:600px){ .tr-split { grid-template-columns: 1fr; } }
      .tr-side { background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
      .tr-title { font-family: 'Inter'; font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Curse of Knowledge</h2>
        <p class="body-text">Once you know something, it becomes extraordinarily difficult to accurately reconstruct what it was like not to know it. You assume what you're doing is obvious. But common sense is not common, and it is almost never free.</p>
      </div>
      
      <div class="tapper-box">
        <h2 class="sec-title" style="margin-bottom:12px">The Tappers & Listeners Simulator</h2>
        <p class="body-text" style="font-size:1rem">In 1990, Stanford researchers asked "Tappers" to tap out the rhythm of a famous song, and "Listeners" to guess it. Tappers predicted 50% would guess correctly.</p>
        
        <button class="tap-btn" onclick="document.getElementById('t-res').classList.add('active')">SIMULATE THE TAP</button>
        
        <div class="tap-result" id="t-res">
          <p class="body-text" style="color:var(--danger)">The actual success rate was only 2.5%.</p>
          <div class="tr-split">
            <div class="tr-side">
              <div class="tr-title">What You Experience</div>
              <p class="body-text" style="font-size:0.95rem">You hear the full, complex melody playing in your head. You have 15 years of context, history, and pattern recognition. To you, the solution is obvious.</p>
            </div>
            <div class="tr-side">
              <div class="tr-title">What The Client Experiences</div>
              <p class="body-text" style="font-size:0.95rem">They only hear random knocks on a table. Without your internal context, they are completely lost. They are paying you to translate the knocks into music.</p>
            </div>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 28 DATA
// ==========================================
const m28 = {
  id: 28,
  title: 'Tacit Knowledge vs. Explicit Knowledge',
  gTitle: 'Tacit vs. <br/><span class="g">Explicit Knowledge</span>',
  heroSub: 'The market pays a commodity price for explicit knowledge. It pays a premium price for tacit knowledge. What are you actually selling?',
  qs: [
    'Which of the four categories (Pattern Recognition, Relational Navigation, Judgment, Translation) is your deepest?',
    'What is a piece of explicit knowledge in your industry that is currently becoming commoditized (e.g., by software or AI)?',
    'Think of a time you used "Judgment Under Incomplete Information" to make a call that saved your company time or money. Describe it.',
    'Who in your organization relies on your "Relational and Political Navigation" to get things done without having formal authority?',
    'If you were removed from your team tomorrow, what specific translation or mediation would immediately break down?'
  ],
  dec: 'My twenty years of experience is my intellectual property. I will stop selling my explicit knowledge for a commodity price and start packaging my tacit knowledge for a premium.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_blems8BKoqAxA/',
  body: {
    css: `
      .tacit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 40px 0; }
      @media(max-width:768px) { .tacit-grid { grid-template-columns: 1fr; } }
      .tacit-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px; transition: 0.3s; cursor: pointer; }
      .tacit-card:hover { border-color: var(--gold); background: rgba(201,168,76,0.03); transform: translateY(-4px); }
      .tc-icon { font-size: 2rem; margin-bottom: 16px; }
      .tc-title { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 12px; }
      .tc-desc { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">We know more than we can tell</h2>
        <p class="body-text">Explicit knowledge can be written down, codified, and outsourced. Its price trends toward zero over time. Tacit knowledge is built through repetition, failure, and direct experience. It is scarce, and the market pays a premium for it.</p>
      </div>
      
      <h2 class="sec-title" style="margin-top:60px; text-align:center">The Four Categories of Tacit Knowledge</h2>
      <div class="tacit-grid">
        <div class="tacit-card">
          <div class="tc-icon">👁️</div>
          <div class="tc-title">1. Pattern Recognition Under Ambiguity</div>
          <div class="tc-desc">You can look at a messy situation and identify the relevant pattern faster than someone with less experience. You see the warning signs before the project derails.</div>
        </div>
        <div class="tacit-card">
          <div class="tc-icon">🤝</div>
          <div class="tc-title">2. Relational & Political Navigation</div>
          <div class="tc-desc">You know how to get things done inside complex human systems. You know how to build coalition support, frame bad news, and de-escalate crises.</div>
        </div>
        <div class="tacit-card">
          <div class="tc-icon">⚖️</div>
          <div class="tc-title">3. Judgment Under Incomplete Information</div>
          <div class="tc-desc">Explicit knowledge works when you have 100% of the data. Tacit knowledge tells you what to do when you have 60% of the data and a deadline in four hours.</div>
        </div>
        <div class="tacit-card">
          <div class="tc-icon">🔄</div>
          <div class="tc-title">4. Translation Between Domains</div>
          <div class="tc-desc">You act as a translator between people who speak different professional languages (e.g., engineering to sales, front line to C-suite).</div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 29 DATA
// ==========================================
const m29 = {
  id: 29,
  title: 'The Shadow Work Audit',
  gTitle: 'The Shadow <br/><span class="g">Work Audit</span>',
  heroSub: 'Extracting your proof-of-work record. Shadow work is the labor you perform that keeps the system running, but is invisible on your official performance review.',
  qs: [
    'The Interruption Log: Who comes to you for help outside of your formal duties? What do they ask?',
    'The "Only I" List: If you disappeared tomorrow, what specific task would immediately fail or slow down?',
    'The Translation Record: Describe a recent meeting where you had to translate between two conflicting departments.',
    'The Fire You Put Out: Describe a quiet crisis you prevented in the last year that never made it to management\'s radar.',
    'The Thing You Built: What template, process, or system did you create that others now rely on daily?'
  ],
  dec: 'I will make my invisible labor visible. I acknowledge that my shadow work is the highest-value, most sellable thing I do.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_718cA74xoLPpv/',
  body: {
    css: `
      .shadow-calc { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 40px; margin: 40px 0; }
      .sc-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border); }
      .sc-row:last-child { border-bottom: none; }
      .sc-label { font-family: 'Cinzel'; font-size: 1.1rem; color: var(--text); }
      .sc-input { background: var(--void); border: 1px solid var(--gold-d); color: var(--gold); padding: 8px 16px; border-radius: 8px; width: 80px; text-align: center; font-family: 'Inter'; outline: none; }
      .sc-input:focus { border-color: var(--gold); }
      .sc-total { margin-top: 32px; padding-top: 24px; border-top: 2px dashed var(--gold-d); text-align: center; }
      .sc-total-num { font-family: 'Cinzel'; font-size: 3rem; color: var(--gold); font-weight: 700; line-height: 1; margin: 12px 0; }
      .sc-total-desc { font-family: 'Inter'; font-size: 0.8rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">What Shadow Work Is</h2>
        <p class="body-text">It is the work that falls in the gaps between formal roles. De-escalating a panicked client. Mentoring junior staff. Maintaining institutional memory. Translating cross-functional meetings. This work is real, valuable, and almost entirely invisible to HR.</p>
      </div>
      
      <div class="shadow-calc">
        <h2 class="sec-title" style="text-align:center; margin-bottom:24px">The Shadow Value Calculator</h2>
        <p class="body-text" style="text-align:center; font-size:0.95rem; margin-bottom:32px">Estimate how many hours per week you spend on each of these invisible tasks.</p>
        
        <div class="sc-row">
          <div class="sc-label">1. Interruptions & Unofficial Mentoring</div>
          <input type="number" class="sc-input" min="0" value="0" oninput="calcShadow()" />
        </div>
        <div class="sc-row">
          <div class="sc-label">2. "Only I" Crisis Prevention</div>
          <input type="number" class="sc-input" min="0" value="0" oninput="calcShadow()" />
        </div>
        <div class="sc-row">
          <div class="sc-label">3. Cross-Department Translation</div>
          <input type="number" class="sc-input" min="0" value="0" oninput="calcShadow()" />
        </div>
        <div class="sc-row">
          <div class="sc-label">4. System & Process Maintenance</div>
          <input type="number" class="sc-input" min="0" value="0" oninput="calcShadow()" />
        </div>
        
        <div class="sc-total">
          <div class="sc-total-desc">PERCENTAGE OF YOUR WEEK SPENT ON SHADOW WORK</div>
          <div class="sc-total-num" id="s-total">0%</div>
          <p class="body-text" style="font-size:0.9rem; color:var(--muted); margin-top:12px">Most professionals discover this number sits between 30% and 50%. You are delivering the value of a high-end consultant while being paid the salary of a manager.</p>
        </div>
      </div>
    `,
    js: `
      function calcShadow() {
        const inputs = document.querySelectorAll('.sc-input');
        let totalHours = 0;
        inputs.forEach(input => { totalHours += (parseInt(input.value) || 0); });
        
        // Assuming a standard 40 hour week
        let pct = Math.min(Math.round((totalHours / 40) * 100), 100);
        document.getElementById('s-total').textContent = pct + '%';
        if(pct > 30) document.getElementById('s-total').style.color = 'var(--success)';
        else document.getElementById('s-total').style.color = 'var(--gold)';
      }
    `
  }
};

// ==========================================
// MODULE 30 DATA
// ==========================================
const m30 = {
  id: 30,
  title: 'The CCRI Framework',
  gTitle: 'The <br/><span class="g">CCRI Framework</span>',
  heroSub: 'Building your private proof-of-work database. Memory is unreliable. You need a structured extraction process to surface your most valuable achievements.',
  qs: [
    'Write your first CCRI Record: What was the Context (the baseline situation)?',
    'What was the Complication (why was this hard or resistant to obvious solutions)?',
    'What was the Resolution (your specific action or intervention)?',
    'What was the Impact (the measurable, quantifiable result or specific outcome)?',
    'Reviewing your first CCRI record, what type of problem appears to be your natural specialty?'
  ],
  dec: 'I will document my impact accurately. I will strip away corporate jargon and articulate exactly what I did and the measurable result it created.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_UVunxulooBbs3/',
  body: {
    css: `
      .ccri-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin: 40px 0; }
      .ccri-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px; display: flex; gap: 24px; align-items: flex-start; }
      @media(max-width:600px) { .ccri-card { flex-direction: column; } }
      .cc-letter { font-family: 'Cinzel'; font-size: 3rem; color: var(--gold); font-weight: 900; line-height: 1; text-shadow: 0 0 20px rgba(201,168,76,0.2); }
      .cc-content { flex: 1; }
      .cc-title { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 8px; }
      .cc-desc { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
      .cc-bad { color: var(--danger); text-decoration: line-through; margin-top: 12px; display: block; font-size: 0.85rem; }
      .cc-good { color: var(--success); display: block; font-size: 0.85rem; margin-top: 4px; font-weight: 500; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">Why You Need a Structured Record</h2>
        <p class="body-text">Your most valuable achievements are often the quiet ones. The crisis that never happened. The process you streamlined. You cannot rely on memory. You need a database formatted in the language the market uses to evaluate expertise.</p>
      </div>
      
      <div class="ccri-grid">
        <div class="ccri-card">
          <div class="cc-letter">C</div>
          <div class="cc-content">
            <div class="cc-title">Context</div>
            <div class="cc-desc">What was the baseline situation before you intervened?</div>
            <span class="cc-bad">Not: "Things were going badly."</span>
            <span class="cc-good">Instead: "The engineering team was missing sprint deadlines by 22% for 3 quarters."</span>
          </div>
        </div>
        
        <div class="ccri-card">
          <div class="cc-letter">C</div>
          <div class="cc-content">
            <div class="cc-title">Complication</div>
            <div class="cc-desc">Why was this hard? What were the political or technical constraints?</div>
            <span class="cc-bad">Not: "It was complicated."</span>
            <span class="cc-good">Instead: "Product added features mid-sprint without sign-off, and engineering lacked authority to push back."</span>
          </div>
        </div>
        
        <div class="ccri-card">
          <div class="cc-letter">R</div>
          <div class="cc-content">
            <div class="cc-title">Resolution</div>
            <div class="cc-desc">What did YOU actually do? What was the specific intervention?</div>
            <span class="cc-bad">Not: "I improved the process."</span>
            <span class="cc-good">Instead: "I designed a formal change-request protocol requiring dual sign-off."</span>
          </div>
        </div>
        
        <div class="ccri-card">
          <div class="cc-letter">I</div>
          <div class="cc-content">
            <div class="cc-title">Impact</div>
            <div class="cc-desc">What was the measurable, quantifiable outcome?</div>
            <span class="cc-bad">Not: "Things got better."</span>
            <span class="cc-good">Instead: "Sprint completion rates rose to 96%. Engineering overtime costs dropped by $43k."</span>
          </div>
        </div>
      </div>
    `
  }
};

const modules = [m26, m27, m28, m29, m30];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
