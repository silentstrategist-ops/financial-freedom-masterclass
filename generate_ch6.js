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
// MODULE 22 DATA
// ==========================================
const m22 = {
  id: 22,
  title: 'Why "Stealth" Is the Right Word',
  gTitle: 'Why "Stealth" Is <br/><span class="g">the Right Word</span>',
  heroSub: 'Turning decades of accumulated experience into an actual second stream of income and control, without blowing up the stability you\'ve spent building. A quiet, deliberate repositioning of what you already know.',
  qs: [
    'List five things you know how to do well that you\'ve never once put on a resume or LinkedIn profile.',
    'Pick one achievement from your career and rewrite it as a result, not a duty. What actually changed because of what you did?',
    'Which two or three people from your past (weak ties) could plausibly become your first client, or introduce you to one?',
    'What\'s stopping you from reaching out to them this month? Be specific, not general.',
    'Of the low-risk entry points (retainer, contract, coaching, writing, reviewing), which fits your actual skill set and schedule?',
    'What is one small, genuinely useful thing you could offer someone in your network before ever mentioning payment?',
    'Have you ever undersold your own experience out loud, to someone else, in the last year? What did you say?',
    'If a former colleague called you tomorrow and asked what you\'re building now, what would you actually say back to them?',
    'Write the first sentence of the message you\'d send to reconnect with one specific person this week.',
    'What would it genuinely cost you, financially or otherwise, to try this and have it not work? Is that cost as large as it feels?'
  ],
  dec: 'I will build proof before I build noise. I will translate my internal experience into external value, starting with just one real client.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_wu8a9O5hDx5R1/',
  body: {
    css: `
      .audit-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin: 40px 0; }
      @media(max-width:800px) { .audit-grid { grid-template-columns: 1fr; } }
      .audit-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px; transition: 0.3s; }
      .audit-card:hover { border-color: var(--gold-b); background: var(--surface); }
      .audit-title { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
      .audit-desc { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
      .translate-box { background: rgba(201, 168, 76, 0.05); border: 1px dashed var(--gold-b); border-radius: 12px; padding: 24px; margin-top: 32px; cursor: pointer; transition: 0.3s; }
      .translate-box:hover { border-style: solid; background: rgba(201, 168, 76, 0.1); }
      .tr-label { font-family: 'Inter'; font-size: 0.65rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
      .tr-bad { color: var(--danger); text-decoration: line-through; margin-bottom: 12px; }
      .tr-good { color: var(--success); font-weight: 600; display: none; }
      .translate-box.active .tr-good { display: block; }
      .translate-box.active .tr-bad { display: none; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Self-Diagnosis: An Audit, Not a Resume</h2>
        <p class="body-text">Most working adults are sitting on more marketable value than they realize. A resume describes duties. It rarely describes the actual, transferable skill underneath those duties.</p>
      </div>
      
      <div class="audit-grid">
        <div class="audit-card">
          <div class="audit-title">1. Technical & Domain</div>
          <div class="audit-desc">Industry-level expertise, regulatory knowledge, financial modeling, supply chain logistics. What has your field quietly taught you that outsiders don't know?</div>
        </div>
        <div class="audit-card">
          <div class="audit-title">2. Soft Skills</div>
          <div class="audit-desc">Cross-functional leadership, negotiation under pressure, conflict resolution. The actual reason you were trusted with responsibility.</div>
        </div>
        <div class="audit-card">
          <div class="audit-title">3. Marketable Achievements</div>
          <div class="audit-desc">The moments in your career that, if you strip away the corporate framing, look exactly like a consulting engagement or case study.</div>
        </div>
      </div>
      
      <h2 class="sec-title" style="margin-top:60px">Translating Internal Language to External Value</h2>
      <p class="body-text">Internal language does not sell externally. Outcome is the only thing a prospective client is actually buying. <strong>Click to translate the duty into a result.</strong></p>
      
      <div class="translate-box" onclick="this.classList.toggle('active')">
        <div class="tr-label">CLICK TO TRANSLATE</div>
        <div class="tr-bad">"Responsible for managing the regional supply chain and overseeing a team of ten employees."</div>
        <div class="tr-good">"Directed a ten-person cross-functional team to streamline regional logistics, meaningfully reducing operational friction and cutting annual costs."</div>
      </div>
    `
  }
};

// ==========================================
// MODULE 23 DATA
// ==========================================
const m23 = {
  id: 23,
  title: 'A Word on Accuracy Before the Stories',
  gTitle: 'A Word on Accuracy <br/><span class="g">Before the Stories</span>',
  heroSub: 'The "young genius founder" narrative is a myth. Here is what the actual research says about the real age of high-growth business founders.',
  qs: [
    'Which of these stories surprised you most, and why do you think it surprised you specifically?',
    'Before reading this section, what age did you privately assume was "too late" to start something new? Where did that number come from?',
    'Sanders, Kroc, and Walton all built on decades of unglamorous work. What unglamorous experience are you sitting on that might be transferable?',
    'Vera Wang assumed it was too late for her at 40. What is the equivalent thought you catch yourself having, and at what age does it show up?',
    'Which of these figures had the least dramatic "leap," building on something close to what they already knew? What would your low-drama leap look like?',
    'Henry Ford failed twice before his third company succeeded. How would you personally respond to a comparable failure right now?',
    'If you had to describe your own career honestly as a case study for someone else, what would the one-paragraph version say right now?',
    'What is one piece of evidence from your own life, not from someone else\'s story, that directly contradicts the idea that your window has closed?'
  ],
  dec: 'I reject the myth that my window has closed. My accumulated experience is not a delay—it is my leverage.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_RFvXDP2ex2VLn/',
  body: {
    css: `
      .timeline-wrap { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; }
      .age-marker { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; position:relative; }
      .age-marker::before { content: ''; position: absolute; left: 40px; top: 0; bottom: -32px; width: 2px; background: var(--border); z-index: 1; }
      .age-marker:last-child::before { display: none; }
      .age-circle { width: 80px; height: 80px; border-radius: 50%; background: var(--void); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; flex-direction: column; z-index: 2; flex-shrink: 0; box-shadow: 0 0 20px rgba(201,168,76,0.1); }
      .ac-num { font-family: 'Cinzel'; font-size: 1.8rem; color: #fff; font-weight: 700; line-height: 1; }
      .ac-lbl { font-family: 'Inter'; font-size: 0.55rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
      .age-text { flex: 1; background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); }
      .age-text h4 { font-family: 'Cinzel'; font-size: 1.2rem; color: #fff; margin-bottom: 8px; }
      .age-text p { font-size: 0.95rem; color: var(--muted); line-height: 1.6; }
      .age-text strong { color: var(--gold); }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Data, First</h2>
        <p class="body-text">An analysis of 2.7 million business founders across the US found the average founder age was <strong>41.9 years</strong>. For the fastest-growing 0.1% of new technology companies, the average founder age was <strong>45.0 years old</strong>.</p>
        <p class="body-text">A 50-year-old founder is roughly <strong>1.8 times more likely</strong> to build a breakout company than a 30-year-old founder. The "young founder" story is a minority pattern mistakenly treated as the default.</p>
      </div>
      
      <h2 class="sec-title" style="margin-top:60px">The Actual Timeline of Success</h2>
      <div class="timeline-wrap">
        
        <div class="age-marker">
          <div class="age-circle"><div class="ac-num">44</div><div class="ac-lbl">Ford</div></div>
          <div class="age-text">
            <h4>Henry Ford</h4>
            <p>His first two attempts failed in his thirties. Ford Motor Company arrived when he was 40, and the breakthrough Model T didn't arrive until he was 44.</p>
          </div>
        </div>
        
        <div class="age-marker">
          <div class="age-circle"><div class="ac-num">49</div><div class="ac-lbl">Child</div></div>
          <div class="age-text">
            <h4>Julia Child</h4>
            <p>Didn't learn to cook until her mid-thirties. Published <em>Mastering the Art of French Cooking</em> at 49. Her TV fame began around age 51.</p>
          </div>
        </div>

        <div class="age-marker">
          <div class="age-circle"><div class="ac-num">54</div><div class="ac-lbl">Huffington</div></div>
          <div class="age-text">
            <h4>Arianna Huffington</h4>
            <p>Co-founded The Huffington Post at age 54. It was acquired by AOL six years later for $315 million.</p>
          </div>
        </div>
        
        <div class="age-marker">
          <div class="age-circle"><div class="ac-num">58</div><div class="ac-lbl">Kroc</div></div>
          <div class="age-text">
            <h4>Ray Kroc</h4>
            <p>A struggling milkshake machine salesman at 52. He didn't purchase McDonald's outright to begin building it into an empire until age 58.</p>
          </div>
        </div>
        
        <div class="age-marker">
          <div class="age-circle"><div class="ac-num">62</div><div class="ac-lbl">Sanders</div></div>
          <div class="age-text">
            <h4>Colonel Harland Sanders</h4>
            <p>Opened his first KFC franchise at age 62 after his original restaurant failed. Sold the company for $2 million at age 73.</p>
          </div>
        </div>
        
      </div>
    `
  }
};

// ==========================================
// MODULE 24 DATA
// ==========================================
const m24 = {
  id: 24,
  title: 'Why This Module Isn\'t Optional',
  gTitle: 'Why This Module <br/><span class="g">Isn\'t Optional</span>',
  heroSub: 'Money habits are rarely solitary. They\'re absorbed, negotiated, and hidden inside a household. The health of your finances is inseparable from the health of your relationships.',
  qs: [
    'How often does money actually get discussed openly in your household, and who tends to avoid the topic?',
    'Is there anything financial you\'ve never fully disclosed to your partner? What would it take to change that?',
    'What did you personally absorb about money from watching your own parents, and what are you passing on to your children?',
    'If you have children, what is one real, small financial decision you could let them make this year?',
    'Do you currently have a will? If not, what is the actual, honest reason you\'ve put it off?',
    'If something happened to you tomorrow, would the people closest to you actually know where to find your accounts and passwords?',
    'Are your beneficiary designations on retirement and insurance accounts current, or have they gone stale?',
    'Who would you want making decisions on your behalf if you couldn\'t, and have you ever told them directly?',
    'What\'s one specific money conversation you\'ve been avoiding having with someone in your life?',
    'Write down the exact date you\'ll have that conversation, or take that estate-planning step, by. A date, not "soon."'
  ],
  dec: 'I will not let avoidance endanger the people I love. Clarity beats good intentions, every time.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_aLeLFUdzxO2Mp/',
  body: {
    css: `
      .legacy-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin: 40px 0; }
      .legacy-card { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 32px 40px; display: flex; align-items: center; gap: 32px; }
      @media(max-width:768px) { .legacy-card { flex-direction: column; text-align: center; } }
      .lc-icon { width: 80px; height: 80px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 1px solid var(--border); flex-shrink: 0; }
      .lc-content { flex: 1; }
      .lc-title { font-family: 'Cinzel'; font-size: 1.4rem; color: #fff; margin-bottom: 8px; }
      .lc-desc { font-size: 1rem; color: var(--muted); line-height: 1.6; }
      .lc-stat { font-family: 'Inter'; font-size: 0.75rem; letter-spacing: 0.05em; color: var(--gold); background: var(--gold-g); padding: 8px 12px; border-radius: 6px; display: inline-block; margin-top: 16px; border: 1px solid var(--gold-d); }
    `,
    html: `
      <div class="legacy-grid">
        <div class="legacy-card">
          <div class="lc-icon">🗣️</div>
          <div class="lc-content">
            <div class="lc-title">Talking to a Partner</div>
            <div class="lc-desc">Financial secrecy is incredibly common. The fix isn't one dramatic conversation. It's a recurring, low-stakes check-in where both people can see the same numbers and name the same goals before resentments calcify.</div>
            <div class="lc-stat">~40% of adults in committed relationships admit to keeping a financial secret.</div>
          </div>
        </div>
        
        <div class="legacy-card">
          <div class="lc-icon">🌱</div>
          <div class="lc-content">
            <div class="lc-title">Teaching Children</div>
            <div class="lc-desc">Parents are consistently the single largest influence on children's financial attitudes, transmitted through observation. They notice if money is discussed calmly or anxiously long before they understand the math.</div>
            <div class="lc-stat">Basic cognitive "habits of mind" for money are largely formed by age 7.</div>
          </div>
        </div>

        <div class="legacy-card">
          <div class="lc-icon">📜</div>
          <div class="lc-content">
            <div class="lc-title">The Basics of a Will</div>
            <div class="lc-desc">A will doesn't need to be perfect. It just needs to name who receives what, who cares for dependents, and who executes it. Don't forget beneficiary designations on retirement accounts—they override the will.</div>
            <div class="lc-stat">Only 24% of American adults currently have a will.</div>
          </div>
        </div>
      </div>
    `
  }
};

// ==========================================
// MODULE 25 DATA
// ==========================================
const m25 = {
  id: 25,
  title: 'Returning to Where This Course Started',
  gTitle: 'Returning to Where <br/><span class="g">This Course Started</span>',
  heroSub: 'Freedom is not synonymous with retirement. It is the underlying structural condition in which continuing to work is something you are actively choosing, rather than something you are trapped into.',
  qs: [
    'Answer the opening question honestly: if your main income stopped today, how long could your current assets sustain your real lifestyle?',
    'Compare that answer to how you would have answered it before this course. What specifically changed?',
    'What percentage of your income still comes from a single source today, as an actual number?',
    'Name one concrete thing you\'ve built or changed through this course that measurably reduces that single-source dependency.',
    'If you fully achieved financial freedom, what would an ordinary Tuesday actually look like for you in specific detail?',
    'Would you keep doing your current work if you no longer needed the income from it at all? Why or why not?',
    'Based on self-determination theory (competence, relatedness, autonomy), which is most missing from your current working life?',
    'What is the next single point of failure in your financial life that most urgently needs addressing?',
    'Who in your life would notice first if you became genuinely financially free, and how would they know?',
    'What does "enough" actually mean for you personally? Write one sentence describing the specific life you\'re building toward.'
  ],
  dec: 'I am building autonomy, not just a bank balance. I will deliberately reduce my single points of failure until my time is entirely my own to choose.',
  link: 'https://whop.com/silent-strategist/exp_OQfyAgJkYyIvH9/app/courses/cors_fGZBpPUYQtguD/lessons/lesn_oDeu3nIs6GrJu/',
  body: {
    css: `
      .freedom-box { background: var(--deep); border: 1px solid var(--border); border-radius: var(--r); padding: 48px; margin: 40px 0; text-align: center; }
      .freedom-title { font-family: 'Cinzel'; font-size: 1.8rem; color: #fff; margin-bottom: 24px; }
      .freedom-scale { display: flex; align-items: center; justify-content: space-between; margin: 40px 0 20px; position: relative; }
      .fs-line { position: absolute; left: 10%; right: 10%; top: 50%; height: 2px; background: linear-gradient(90deg, var(--danger), var(--gold)); z-index: 1; }
      .fs-point { position: relative; z-index: 2; background: var(--void); border: 2px solid var(--border); padding: 12px 24px; border-radius: 30px; font-family: 'Inter'; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
      .fs-point.danger { border-color: var(--danger); color: var(--danger); }
      .fs-point.gold { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.1); }
      .fs-desc { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--muted); padding: 0 10%; }
      .fs-desc span { width: 180px; }
    `,
    html: `
      <div class="card">
        <h2 class="sec-title">The Dependency, Named Precisely</h2>
        <p class="body-text">A large salary from a single, sole source is not diversification—it is a large amount of exposure concentrated in one single point of failure. Earning more, managing better, building buffers, investing in assets... it has all been aimed at loosening that exact dependency.</p>
      </div>
      
      <div class="freedom-box">
        <div class="freedom-title">The Autonomy Shift</div>
        <p class="body-text" style="margin-bottom:0">Financial freedom is the shift from controlled motivation to autonomous motivation. It changes your relationship to work far more than it changes whether you do any.</p>
        
        <div class="freedom-scale">
          <div class="fs-line"></div>
          <div class="fs-point danger">Compulsion</div>
          <div class="fs-point">Buffer</div>
          <div class="fs-point">Assets</div>
          <div class="fs-point gold">Autonomy</div>
        </div>
        <div class="fs-desc">
          <span style="text-align:left">Trading time for survival. High dependency on one source.</span>
          <span style="text-align:right">Continuing to work becomes a choice, not a structural requirement.</span>
        </div>
      </div>
    `
  }
};

const modules = [m22, m23, m24, m25];

modules.forEach(m => {
  const html = generateModule(m.id, m.title, m.gTitle, m.heroSub, m.body, m.qs, m.dec, m.link);
  fs.writeFileSync('module-' + m.id + '.html', html);
  console.log('Generated module-' + m.id + '.html');
});
