/* ========= ENV ========= */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const screens = Array.from(document.querySelectorAll('.screen'));
let currentScreen = 0;
let jumping = false;
let introComplete = false;

function safeSession(fn) {
  try { return fn(window.sessionStorage); } catch { return null; }
}

/* ========= HERO TYPING ========= */
const heroText = 'Hello there.';
const typed = document.getElementById('typed-text');
const hero = document.getElementById('hero');

function typeHero() {
  if (reducedMotion) {
    typed.textContent = heroText;
    hero.classList.add('revealed');
    return;
  }
  let i = 0;
  (function tick() {
    if (i < heroText.length) {
      typed.textContent += heroText[i++];
      setTimeout(tick, 85);
    } else {
      setTimeout(() => hero.classList.add('revealed'), 250);
    }
  })();
}

/* ========= OPENING CRAWL ========= */
const swIntro = document.getElementById('sw-intro');
const swLine1 = document.getElementById('sw-line1');
const swLine2 = document.getElementById('sw-line2');
const introTimers = [];

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  introTimers.push(id);
  return id;
}

function typeSwLine(el, text, startDelay, charDelay, cb) {
  later(() => {
    el.classList.add('sw-visible');
    let i = 0;
    (function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        later(tick, charDelay);
      } else if (cb) {
        cb();
      }
    })();
  }, startDelay);
}

function finishIntro(fast) {
  if (introComplete) return;
  introComplete = true;
  introTimers.forEach(clearTimeout);
  safeSession(s => s.setItem('introSeen', '1'));

  swIntro.classList.add('fade-out');
  later(() => swIntro.classList.add('hidden'), fast ? 400 : 1200);

  setScreenState(0);
  screens[0].classList.add('active');
  document.getElementById('nav-console').classList.add('console-ready');
  document.querySelectorAll('.hud-coord').forEach(el => el.classList.add('coord-visible'));
  updateConsole(0);
  requestAnimationFrame(() => positionShip(0, false));
  setTimeout(typeHero, fast ? 300 : 700);
}

function startIntro() {
  const introSeen = safeSession(s => s.getItem('introSeen'));
  if (reducedMotion || introSeen) {
    swIntro.classList.add('hidden');
    finishIntro(true);
    return;
  }
  typeSwLine(swLine1, 'A long time ago in a galaxy far,', 300, 60, () => {
    typeSwLine(swLine2, 'far away....', 450, 40, () => later(() => finishIntro(false), 1500));
  });
  swIntro.addEventListener('click', () => finishIntro(true));
  document.addEventListener('keydown', function skip() {
    document.removeEventListener('keydown', skip);
    finishIntro(true);
  }, { once: true });
}

/* ========= HYPERSPACE CANVAS ========= */
const canvas = document.getElementById('hyperspace');
const ctx = canvas.getContext('2d');

let w, h;
let stars = [];
let starColor = '#e8f4ff';

const STAR_COUNT = 520;
const BASE_SPEED = reducedMotion ? 0.4 : 2;
const MAX_JUMP_SPEED = reducedMotion ? 0.4 : 55;

let currentSpeed = BASE_SPEED;
let targetSpeed = BASE_SPEED;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: STAR_COUNT }, createStar);
  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, w, h);
}

function createStar() {
  return {
    x: (Math.random() - 0.5) * w,
    y: (Math.random() - 0.5) * h,
    z: Math.random() * w,
    px: 0,
    py: 0
  };
}

resize();
window.addEventListener('resize', () => {
  resize();
  positionShip(currentScreen, false);
});

function animate() {
  ctx.fillStyle = document.body.classList.contains('sith-mode')
    ? 'rgba(10,4,4,0.35)'
    : 'rgba(5,7,13,0.35)';
  ctx.fillRect(0, 0, w, h);

  currentSpeed += (targetSpeed - currentSpeed) * 0.06;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = starColor;

  stars.forEach(star => {
    star.px = (star.x / star.z) * w;
    star.py = (star.y / star.z) * h;
    star.z -= currentSpeed;

    if (star.z <= 0) {
      Object.assign(star, createStar(), { z: w });
      return;
    }

    const x = (star.x / star.z) * w;
    const y = (star.y / star.z) * h;
    const depth = 1 - star.z / w;

    ctx.globalAlpha = 0.25 + depth * 0.75;
    ctx.lineWidth = jumping ? 1.4 : 0.6 + depth * 1.2;
    ctx.beginPath();
    ctx.moveTo(star.px, star.py);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  ctx.restore();
  requestAnimationFrame(animate);
}

animate();

/* ========= TERMINAL (ABOUT) ========= */
const termLines = [
  { cls: 'prompt', text: 'whoami' },
  { cls: 'out', text: 'Yashvardhan Pattanashetti' },
  { cls: 'dim', text: 'BComp Computer Science (Hons) · NTU Singapore · 2025 → 2029' },
  { cls: 'blank' },
  { cls: 'prompt', text: 'cat now.txt' },
  { cls: 'hl', text: '▸ VP Academics · Google Developer Group on Campus NTU' },
  { cls: 'out', text: '  Quant Research Intern · C22 × NTU veNTUre   (2026)' },
  { cls: 'out', text: '  Research Intern · Mahindra.AI               (2025)' },
  { cls: 'blank' },
  { cls: 'prompt', text: 'cat honours.txt' },
  { cls: 'out', text: '1st Place · Jane Street Estimathon 2026' },
  { cls: 'out', text: 'SAT 1530 (perfect Math) · AIR 215 JEE Main · AIR 777 JEE Advanced' },
  { cls: 'dim', text: 'National Olympiad qualifier · Mathematics, Astronomy, Junior Science' },
  { cls: 'blank' },
  { cls: 'prompt', text: 'cat skills.txt' },
  { cls: 'key', text: '[LANG]   Python · C · C++ · Java · TypeScript · SQL' },
  { cls: 'key', text: '[ML]     PyTorch · XGBoost · scikit-learn · SHAP · pandas' },
  { cls: 'key', text: '[STACK]  Next.js · React Native · FastAPI · Express · Docker' },
  { cls: 'blank' },
  { cls: 'prompt', text: 'cat off-duty.txt' },
  { cls: 'out', text: 'Maths · Basketball (Clusters runners-up) · Football · Chess' },
];

let terminalRan = false;

function runTerminal() {
  const output = document.getElementById('terminal-output');
  let i = 0;

  function addLine(line) {
    const el = document.createElement('div');
    el.className = 't-line';
    const span = document.createElement('span');
    span.className = line.cls === 'blank' ? 't-blank' : `t-${line.cls}`;
    if (line.text) span.textContent = line.text;
    el.appendChild(span);
    output.appendChild(el);
  }

  function finish() {
    const el = document.createElement('div');
    el.className = 't-line';
    el.innerHTML = '<span class="t-prompt"></span><span class="terminal-cursor"></span>';
    output.appendChild(el);
  }

  if (reducedMotion) {
    termLines.forEach(addLine);
    finish();
    return;
  }

  (function next() {
    if (i >= termLines.length) return finish();
    const line = termLines[i++];
    addLine(line);
    const delay = line.cls === 'prompt' ? 420 : line.cls === 'blank' ? 60 : 120;
    setTimeout(next, delay);
  })();
}

/* ========= SCREEN STATE ========= */
function setScreenState(activeIdx) {
  screens.forEach((s, i) => {
    const on = i === activeIdx;
    s.inert = !on;
    s.setAttribute('aria-hidden', on ? 'false' : 'true');
  });
}

/* ========= HYPERSPACE JUMP ========= */
const JUMP_MS = reducedMotion ? 250 : 1500;

function jumpTo(index) {
  if (jumping || index === currentScreen || index < 0 || index >= screens.length) return;

  jumping = true;
  targetSpeed = MAX_JUMP_SPEED;

  const direction = index > currentScreen ? 'right' : 'left';
  const departing = screens[currentScreen];
  departing.classList.remove('active');
  departing.classList.add(direction === 'right' ? 'departing-right' : 'departing-left');

  positionShip(index, true);
  updateConsole(index);
  document.getElementById('ct-speed').textContent = 'HYPERSPACE';
  document.getElementById('ct-status').textContent = 'JUMPING';

  setTimeout(() => { targetSpeed = BASE_SPEED; }, JUMP_MS * 0.7);

  setTimeout(() => {
    departing.classList.remove('departing-right', 'departing-left');
    const arriving = screens[index];
    arriving.scrollTop = 0;
    arriving.classList.add('active');
    currentScreen = index;
    setScreenState(index);
    document.getElementById('ct-speed').textContent = 'SUB-LIGHT';
    document.getElementById('ct-status').textContent = 'NOMINAL';
    if (arriving.id === 'about' && !terminalRan) {
      terminalRan = true;
      setTimeout(runTerminal, 250);
    }
    if (location.hash !== '#' + arriving.id) {
      history.replaceState(null, '', index === 0 ? location.pathname : '#' + arriving.id);
    }
  }, JUMP_MS);

  setTimeout(() => { jumping = false; }, JUMP_MS + 150);
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => jumpTo(parseInt(btn.dataset.goto, 10)));
});

/* ========= BRIDGE CONSOLE ========= */
const consoleShip = document.getElementById('console-ship');
const consoleTrack = document.getElementById('console-track');
const consoleWps = document.querySelectorAll('.console-wp');

const SCREEN_META = [
  { heading: '000°', sector: 'ALPHA-01' },
  { heading: '051°', sector: 'BETA-04' },
  { heading: '103°', sector: 'GAMMA-07' },
  { heading: '154°', sector: 'DELTA-12' },
  { heading: '206°', sector: 'EPSILON-15' },
  { heading: '257°', sector: 'ZETA-21' },
  { heading: '309°', sector: 'OMEGA-99' },
];

function positionShip(index, animated) {
  const targetWp = consoleWps[index];
  if (!targetWp) return;
  const trackRect = consoleTrack.getBoundingClientRect();
  const wpRect = targetWp.getBoundingClientRect();
  const left = wpRect.left - trackRect.left + wpRect.width / 2;
  if (!animated) {
    consoleShip.style.transition = 'none';
    consoleShip.style.left = left + 'px';
    requestAnimationFrame(() => { consoleShip.style.transition = ''; });
  } else {
    consoleShip.style.left = left + 'px';
  }
}

function updateConsole(index) {
  const meta = SCREEN_META[index] || SCREEN_META[0];
  document.getElementById('ct-heading').textContent = meta.heading;
  document.getElementById('ct-sector').textContent = meta.sector;
  consoleWps.forEach((wp, i) => {
    wp.classList.toggle('active', i === index);
    if (i === index) wp.setAttribute('aria-current', 'page');
    else wp.removeAttribute('aria-current');
  });
}

consoleWps.forEach(wp => {
  wp.addEventListener('click', () => {
    const idx = parseInt(wp.dataset.idx, 10);
    if (!isNaN(idx)) jumpTo(idx);
  });
});

window.addEventListener('load', () => positionShip(currentScreen, false));

/* ========= PROJECT DATA ========= */
const projectOrder = ['fifa', 'flint', 'ntu-atlas', 'catscan', 'gigflow', 'padic', 'hdb', 'portfolio'];

const projectData = {
  fifa: {
    fileId: 'FILE-001',
    year: '2026',
    title: 'FIFA 2026 World Cup Predictor',
    domain: 'ML · Simulation',
    tint: 'oklch(0.84 0.13 214)',
    glyph: '⬡',
    status: 'LIVE',
    summary: 'XGBoost plus 100,000 Monte Carlo bracket runs across all 48 nations, with SHAP explanations for every team.',
    chips: ['Python', 'XGBoost', 'PyTorch', 'SHAP'],
    techstack: ['Python', 'XGBoost', 'PyTorch', 'FastAPI', 'SHAP', 'Vercel'],
    skills: ['Machine Learning', 'Feature Engineering', 'Monte Carlo Simulation', 'Model Explainability'],
    brief: 'An end-to-end system for forecasting the 2026 World Cup. I scraped squad data for all 48 nations from Transfermarkt and engineered 20+ team-level features: ELO, xG, rolling form, squad depth, and market value. An XGBoost multiclass classifier predicts match outcomes, with separate xG regressors for scorelines. A Monte Carlo engine plays the full 48-team bracket 100,000 times, including the official best-third-place rules, giving win probabilities at ±0.11% standard error. SHAP explanations are precomputed per team and every output is exported to JSON, so the whole thing deploys as a fast static site.',
    links: [
      { label: 'Live demo', href: 'https://wc-predictor-wine.vercel.app/', primary: true },
      { label: 'GitHub', href: 'https://github.com/6times9is42/wc-predictor' }
    ]
  },
  flint: {
    fileId: 'FILE-002',
    year: '2026',
    title: 'Flint',
    domain: 'Full-Stack · AI Tools',
    tint: 'oklch(0.72 0.18 300)',
    glyph: '◆',
    status: 'LIVE',
    summary: 'Audits a startup\'s AI subscriptions against live vendor pricing and writes a shareable, CFO-tone report in under three minutes.',
    chips: ['Next.js', 'TypeScript', 'Supabase', 'Claude API'],
    techstack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'Anthropic API', 'Resend', 'Vercel'],
    skills: ['Full-Stack Engineering', 'AI Integration', 'Product Design', 'Database Architecture'],
    brief: 'Founders and engineering managers list their AI tool stack (Cursor, Copilot, Claude, ChatGPT, Windsurf and more) and Flint returns a finance-literate breakdown of where they\'re overspending, which plans to switch to, and the total they could save. A deterministic audit engine applies rule-based recommendations across 8 tools and 5 rule categories; Claude writes a short personalised summary on top. Every audit gets a unique shareable URL with Open Graph previews for Slack and X unfurls. Includes lead capture via Resend, IP rate limiting, honeypot bot protection, and a Vitest suite covering the audit engine.',
    links: [
      { label: 'Live demo', href: 'https://flint-audit.vercel.app', primary: true },
      { label: 'GitHub', href: 'https://github.com/6times9is42/flint' }
    ]
  },
  'ntu-atlas': {
    fileId: 'FILE-003',
    year: '2026',
    title: 'NTU Atlas',
    domain: 'Web · Campus Tool',
    tint: 'oklch(0.86 0.15 165)',
    glyph: '◎',
    status: 'LIVE',
    summary: 'ntuatlas.com puts NTU\'s scattered portals, a filterable clubs index, and a freshmen checklist in one searchable place.',
    chips: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    techstack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    skills: ['Frontend Engineering', 'Information Architecture', 'UI Design', 'Responsive Layout'],
    brief: 'NTU\'s digital life is spread over dozens of portals that every student hunts for each semester. NTU Atlas consolidates them: a searchable directory spanning 10 portal categories (academics, career, finance, housing, facilities and more), a filterable index of clubs and societies, and a freshmen orientation checklist. Dark topographic UI with an animated grid and ambient glow, built with zero dependencies and deployed at ntuatlas.com.',
    links: [
      { label: 'Visit ntuatlas.com', href: 'https://ntuatlas.com', primary: true },
      { label: 'GitHub', href: 'https://github.com/6times9is42/ntu-atlas' }
    ]
  },
  catscan: {
    fileId: 'FILE-004',
    year: '2025',
    title: 'CatScan',
    domain: 'ML · Mobile Health',
    tint: 'oklch(0.93 0.03 240)',
    glyph: '◉',
    status: 'COMPLETED',
    summary: 'Offline cataract screening for rural India. 93% validation accuracy and sub-second inference on mid-range Android.',
    chips: ['TensorFlow', 'Keras', 'React Native', 'Android'],
    techstack: ['Python', 'TensorFlow / Keras', 'React Native', 'Android'],
    skills: ['Computer Vision', 'Mobile Development', 'Healthcare AI', 'Model Optimisation'],
    brief: 'Specialist eye care is scarce in rural India, so CatScan screens for cataracts on the phone, fully offline. Guided pupil-centred capture and preprocessing reduce bias in the input; CataractCNN, a lightweight network I built for the job, reaches 93% validation accuracy with sub-1-second inference on mid-range Android devices. Ophthalmologists from the Lokeswarananda Eye Foundation helped refine the clinical workflow and validated predictions against professional diagnoses.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/CatScan', primary: true }
    ]
  },
  gigflow: {
    fileId: 'FILE-005',
    year: '2026',
    title: 'GigFlow',
    domain: 'Full-Stack · Dashboard',
    tint: 'oklch(0.8 0.15 70)',
    glyph: '◈',
    status: 'LIVE',
    summary: 'Lead management dashboard with JWT auth, RBAC, debounced server-side search, URL-synced pagination and CSV export.',
    chips: ['TypeScript', 'React', 'Express', 'MongoDB'],
    techstack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Express', 'MongoDB', 'JWT', 'Docker'],
    skills: ['Full-Stack Engineering', 'Authentication', 'Role-Based Access Control', 'Dashboard UX'],
    brief: 'A production-grade lead management dashboard in strict TypeScript, client and API. JWT authentication with admin and sales roles, per-lead ownership enforcement, full CRUD, debounced search, server-side filtering by status and source, sorting, URL-synced pagination, and CSV export. Dark and light themes, mobile layouts, loading and empty states, toasts and keyboard shortcuts. Deployed on Vercel, Render and MongoDB Atlas, with Docker Compose for one-command local setup.',
    links: [
      { label: 'Live demo', href: 'https://gigflow-smoky.vercel.app', primary: true },
      { label: 'GitHub', href: 'https://github.com/6times9is42/gigflow' }
    ]
  },
  padic: {
    fileId: 'FILE-006',
    year: '2026',
    title: 'Calculus on the p-adic Numbers',
    domain: 'Maths · Research Paper',
    tint: 'oklch(0.8 0.12 84)',
    glyph: '∂',
    status: 'COMPLETED',
    summary: 'A first-principles derivative on the field of p-adic numbers, with proofs of five classic calculus rules.',
    chips: ['Analysis', 'Number Theory', 'LaTeX'],
    techstack: ['LaTeX', 'Formal Proofs'],
    skills: ['Real & p-adic Analysis', 'Number Theory', 'Mathematical Writing', 'Research'],
    brief: 'Calculus usually lives on the real numbers. This paper rebuilds it from first principles on the p-adic numbers, where distance is measured by divisibility and the ultrametric inequality makes every triangle isosceles. We formally define limits, continuity and derivatives via the p-adic ultrametric, prove p-adic analogues of five core rules (product rule, chain rule, mean value theorem, L\'Hôpital\'s rule and Taylor expansion), and study real-valued representations through the canonical map, which exposes where p-adic behaviour departs from classical analysis.'
  },
  hdb: {
    fileId: 'FILE-008',
    year: '2026',
    title: 'HDB Decision Support Platform',
    domain: 'Web · Civic Data · Team Project',
    tint: 'oklch(0.82 0.14 25)',
    glyph: '⌂',
    status: 'COMPLETED',
    summary: 'A Flask app for comparing Singapore HDB resale flats and BTO launches. I owned the server-rendered front end.',
    chips: ['Jinja2', 'JavaScript', 'Flask', 'SQLite'],
    techstack: ['Python', 'Flask', 'Jinja2', 'SQLite', 'Bootstrap', 'JavaScript', 'Leaflet', 'scikit-learn'],
    skills: ['Server-Rendered Frontend', 'Template Architecture', 'Debugging', 'Data Verification', 'Git Collaboration'],
    brief: 'A six-person SC2006 Software Engineering project at NTU: a Flask app for comparing Singapore HDB resale flats and BTO launches. A regression model trained on ~240,000 public resale transactions prices each flat, and a 0–5 locality score rates its location by distance to the nearest MRT, school, supermarket and park — weighted by the user\'s own ranking of what matters. I owned the server-rendered templates, holding the front end to the design spec while the backend shifted underneath it, and built the drag-to-rank preferences form on native drag and drop with no library. Two bugs worth the hunt: Jinja\'s round filter rendered 4.5 as four stars because Python rounds halves to even, and a clash between account-based data hiding and the redesigned amenity section was 500-ing every property page for logged-out users.',
    links: [
      { label: 'GitHub', href: 'https://github.com/SC2006-AY2026Sem1/snotsauce', primary: true }
    ]
  },
  portfolio: {
    fileId: 'FILE-007',
    year: '2026',
    title: 'This Portfolio',
    domain: 'Web · Creative Coding',
    tint: 'oklch(0.84 0.13 214)',
    glyph: '☆',
    status: 'LIVE',
    summary: 'You\'re inside it. Hyperspace jumps, a starmap résumé, and a Sith mode hiding in plain sight.',
    chips: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
    techstack: ['HTML', 'CSS', 'JavaScript', 'Canvas 2D', 'Vercel'],
    skills: ['Frontend Engineering', 'Motion Design', 'Creative Coding', 'Accessibility'],
    brief: 'A command-deck portfolio built from scratch with vanilla HTML, CSS and JavaScript: no frameworks, no build step. A canvas starfield accelerates into hyperspace between sections, experience is charted as a starmap, and a full-text glitch scramble flips the entire UI between Jedi and Sith palettes (try the SYS indicator, top right). Respects reduced-motion settings and works with keyboard, mouse, and touch.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/star-wars-portfolio', primary: true }
    ]
  }
};

/* ========= TRANSMISSION DATA ========= */
const transmissionData = {
  '001': {
    id: '[TRANSMISSION #001]',
    stardate: 'STARDATE 2026.05.25',
    title: 'The Ship of Theseus',
    status: 'LIVE',
    content: `
      <p>The Ship of Theseus is one of my favorite philosophical dilemmas. If all the parts of a ship are replaced, one by one, then when every part has been replaced, is it still the same ship? Convincing arguments can be made for both sides. Every time a part is replaced, it remains the same ship, and so when all the parts are replaced, it should still be the same ship. However, if a ship is but the sum of its parts, this must be an entirely new ship, as it shares no parts with the original. The latter argument raises an interesting question: suppose a new ship was built with all the old parts. Is that the Ship of Theseus? It really just depends on your notion of what a ship is; both arguments differ in their definitions and hence are correct in their own ways.</p>
      <p>I don't want to talk about ships, though. I think this problem is far more fascinating when applied to personal identity. What does one consider identity to be? You'd think it to be your flesh and bones, your physical form. After all, everyone's identifiable by their fingerprints, right? True, and yet it doesn't really make sense when you think about it. Your family, your closest friends, you know them in far deeper ways. The way their eyes shine when that one song comes on, or the way they laugh when you tell them another one of your dumb jokes.</p>
      <p>I think people are their memories. We are mosaics of everything we've experienced and all the people we've met in our lives. If you ever find me saying I hate Star Wars or Arcane, no fingerprint check required — that isn't me. Does that mean I become a different person every time I like a song I used to dislike? Not really; I'd call that growth rather than change. A new perspective doesn't mean I've forgotten all my old experiences. It just means there's now more that makes me who I am.</p>
      <p>People like to ask, "One day, if you forgot everything, who would you trust to remind you who you are?" and I cannot answer that question. There are far too many people without whom I wouldn't be who I am today, and many, I hope, whom I'll meet in the future. I think that's why I've never really had a best friend. Every good friend of mine has a unique, refreshing aspect to them, and they're all equally a part of me — parts that it simply wouldn't make sense to compare.</p>
      <p>Now, let's go back to the Ship of Theseus. While it may be a philosophical dilemma, in my opinion, the new ship is nothing like the old one, for I think the Ship of Theseus isn't just the planks it was built from. It's every treacherous sea it has traveled, every glorious battle it has won, every crew member it has sheltered. Once broken down, I don't think the Ship of Theseus can ever be rebuilt again. What do you think?</p>
    `
  }
};

/* ========= PROJECT REEL ========= */
const scrollTrack = document.getElementById('scroll-track');
const carousel = document.getElementById('carousel');

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cardHtml(key, clone) {
  const p = projectData[key];
  const live = p.status === 'LIVE';
  const linkHint = (p.links || []).length ? (p.links.some(l => /demo|visit/i.test(l.label)) ? 'DEMO · CODE' : 'CODE') : 'PAPER';
  return `
    <button class="project-card" type="button" data-project="${key}" style="--tint:${p.tint}"
      ${clone ? 'tabindex="-1" aria-hidden="true"' : ''}>
      <span class="pc-top">
        <span>${p.fileId} · ${p.year}</span>
        <span class="pc-status${live ? '' : ' done'}"><span class="pip"></span>${p.status}</span>
      </span>
      <span class="pc-glyph" aria-hidden="true">${p.glyph}</span>
      <span class="pc-domain">${escapeHtml(p.domain)}</span>
      <span class="pc-title">${escapeHtml(p.title)}</span>
      <span class="pc-summary">${escapeHtml(p.summary)}</span>
      <span class="pc-chips">${p.chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</span>
      <span class="pc-foot"><span>OPEN FILE <span class="pc-arrow" aria-hidden="true">→</span></span><span class="pc-links">${linkHint}</span></span>
    </button>`;
}

/* Two copies of the set make the loop seamless */
scrollTrack.innerHTML =
  projectOrder.map(k => cardHtml(k, false)).join('') +
  projectOrder.map(k => cardHtml(k, true)).join('');

let scrollPos = 0;
let scrollVel = 0;
const DRIFT = reducedMotion ? 0 : 0.6;
let hoverHold = false;
let modalHold = false;
let dragging = false;

function wrapPos() {
  const half = scrollTrack.scrollWidth / 2;
  if (!half) return;
  scrollPos = ((scrollPos % half) + half) % half;
}

function animateScroll() {
  if (!dragging && !modalHold) {
    scrollVel *= 0.94;
    const drift = hoverHold ? 0 : DRIFT;
    scrollPos += drift + scrollVel;
  }
  wrapPos();
  scrollTrack.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
  requestAnimationFrame(animateScroll);
}

animateScroll();

carousel.addEventListener('wheel', e => {
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  e.preventDefault();
  scrollVel += d * 0.04;
}, { passive: false });

carousel.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hoverHold = true; });
carousel.addEventListener('pointerleave', () => { hoverHold = false; });

/* Drag / flick */
let dragStartX = 0;
let dragStartPos = 0;
let lastX = 0;
let lastT = 0;
let dragMoved = false;

carousel.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  dragging = true;
  dragMoved = false;
  dragStartX = lastX = e.clientX;
  dragStartPos = scrollPos;
  lastT = performance.now();
  scrollVel = 0;
});

window.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  if (!dragMoved && Math.abs(dx) > 6) {
    dragMoved = true;
    carousel.classList.add('dragging');
    carousel.setPointerCapture?.(e.pointerId);
  }
  if (!dragMoved) return;
  scrollPos = dragStartPos - dx;
  const now = performance.now();
  const dt = Math.max(now - lastT, 1);
  scrollVel = -(e.clientX - lastX) / dt * 16;
  lastX = e.clientX;
  lastT = now;
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  setTimeout(() => carousel.classList.remove('dragging'), 0);
}

window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

/* Keep keyboard focus visible inside the transformed track */
carousel.addEventListener('focusin', e => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  hoverHold = true;
  carousel.scrollLeft = 0;
  const viewW = carousel.clientWidth;
  const left = card.offsetLeft - scrollPos;
  if (left < 24 || left + card.offsetWidth > viewW - 24) {
    scrollPos = card.offsetLeft - (viewW - card.offsetWidth) / 2;
  }
});
carousel.addEventListener('focusout', () => { hoverHold = false; });

scrollTrack.addEventListener('click', e => {
  const card = e.target.closest('.project-card');
  if (!card || dragMoved) return;
  openProjectModal(card.dataset.project, card);
});

/* ========= MODALS ========= */
let lastFocus = null;

function openModal(modal) {
  lastFocus = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  modal.querySelector('.modal-close').focus({ preventScroll: true });
}

function closeModal(modal) {
  if (modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reducedMotion ? 0 : 300);
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

function anyModalOpen() {
  return document.querySelector('.modal:not([hidden])') !== null;
}

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
  modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
  /* Trap Tab inside the open dialog */
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
});

/* Project modal */
const projectModal = document.getElementById('project-modal');
const pmInner = projectModal.querySelector('.pm-inner');

function openProjectModal(key) {
  const p = projectData[key];
  if (!p) return;

  pmInner.style.setProperty('--tint', p.tint);
  pmInner.querySelector('.pm-file-id').textContent = `${p.fileId} · ${p.year}`;
  pmInner.querySelector('.pm-status-tag').textContent = p.status;
  pmInner.querySelector('.pm-glyph').textContent = p.glyph;
  pmInner.querySelector('.pm-domain-tag').textContent = p.domain;
  pmInner.querySelector('.pm-title').textContent = p.title;
  pmInner.querySelector('.pm-brief').textContent = p.brief;
  pmInner.querySelector('.pm-chips').innerHTML = p.techstack.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('');
  pmInner.querySelector('.pm-skills').innerHTML = p.skills.map(s => `<span class="pm-skill">${escapeHtml(s)}</span>`).join('');

  const actionsEl = pmInner.querySelector('.pm-actions');
  const links = p.links || [];
  actionsEl.hidden = links.length === 0;
  actionsEl.innerHTML = links
    .map(l => `<a class="btn${l.primary ? ' btn-primary' : ''}" href="${l.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)} <span aria-hidden="true">↗</span></a>`)
    .join('');

  modalHold = true;
  openModal(projectModal);
}

function closeProjectModal() {
  modalHold = false;
  closeModal(projectModal);
}

projectModal.querySelector('.pm-close').addEventListener('click', () => { modalHold = false; });
projectModal.addEventListener('click', e => { if (e.target === projectModal) modalHold = false; });

/* Transmission modal */
const txModal = document.getElementById('tx-modal');
const txmInner = txModal.querySelector('.txm-inner');

function openTxModal(id) {
  const tx = transmissionData[id];
  if (!tx) return;
  txmInner.querySelector('.txm-id-tag').textContent = tx.id;
  txmInner.querySelector('.txm-date-tag').textContent = tx.stardate;
  txmInner.querySelector('.txm-main-title').textContent = tx.title;
  txmInner.querySelector('.txm-content').innerHTML = tx.content;
  txmInner.querySelector('.txm-scroll').scrollTop = 0;
  openModal(txModal);
}

document.querySelectorAll('.tx-read').forEach(btn => {
  btn.addEventListener('click', () => openTxModal(btn.dataset.tx));
});

/* Cert lightbox */
const certModal = document.getElementById('cert-modal');
const certmImg = document.getElementById('certm-img');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    certmImg.src = card.dataset.src;
    certmImg.alt = img ? img.alt : 'Certificate';
    openModal(certModal);
  });
});

/* ========= CHARTED SYSTEMS (EXPERIENCE) ========= */
const systemData = [
  {
    planet: 'MAHINDRA NEXUS',
    when: '2025.12',
    x: 12, y: 66,
    sector: 'CORE WORLDS · ALPHA-01',
    role: 'Research Intern',
    org: 'Mahindra.AI (Mahindra Group) · Mumbai',
    dates: '2025.12 → 2026.01',
    status: 'COMPLETED',
    tint: 'oklch(0.84 0.13 214)',
    logs: [
      'Benchmarked 15+ AI architectures (LLMs, SLMs, SLM + RAG) on cost, latency, reliability and deployment constraints',
      'Designed an SLM-first, modular agent strategy adopted as Mahindra\'s AI deployment blueprint',
      'Cut projected inference latency by up to 70% while preserving domain-specific accuracy',
      'Built the business case for 3–5× cost savings and a 2-phase roadmap presented to senior management',
    ],
    chips: ['LLMs', 'SLMs', 'RAG', 'Agentic AI', 'Strategy'],
  },
  {
    planet: 'CORUSCANT ACADEMY',
    when: '2026.02',
    x: 31, y: 28,
    sector: 'MID RIM · GAMMA-07',
    role: 'Group Leader',
    org: 'NTU CCDS · Transitional Orientation Programme',
    dates: '2026.02 → PRESENT',
    status: 'ACTIVE',
    tint: 'oklch(0.8 0.12 84)',
    logs: [
      'Partnered with 10+ orientation leaders on logistics and schedules for the incoming CCDS cohort',
      'Ran group activities and icebreakers for new computing students',
      'First point of contact for freshmen during their transition to NTU',
    ],
    chips: ['Leadership', 'Coordination', 'CCDS'],
  },
  {
    planet: 'BESPIN HAVEN',
    when: '2026.02',
    x: 49, y: 70,
    sector: 'OUTER RIM · DELTA-12',
    role: 'Group Leader',
    org: 'NTU Hall XIV · Freshmen Orientation Programme',
    dates: '2026.02 → PRESENT',
    status: 'ACTIVE',
    tint: 'oklch(0.86 0.15 165)',
    logs: [
      'Partnered with 10+ orientation leaders and organisers across the hall',
      'Managed logistics, schedules and icebreakers for the freshmen cohort',
      'Built community within Hall XIV during orientation week',
    ],
    chips: ['Leadership', 'Event Management', 'Hall XIV'],
  },
  {
    planet: 'KESSEL EXCHANGE',
    when: '2026.07',
    x: 69, y: 30,
    sector: 'OUTER RIM · KESSEL-12',
    role: 'Quantitative Research Intern',
    org: 'C22 × NTU veNTUre',
    dates: '2026.07 → 2026.10',
    status: 'COMPLETED',
    tint: 'oklch(0.72 0.18 300)',
    logs: [
      'Built a leakage-safe Python modelling pipeline over 46,520 trades, 502 unique accounts and 34 campaigns',
      'Caught close-time label leakage that had inflated 6 of 8 earlier findings',
      'Pre-specified a Holm-corrected, single-look holdout and reported its null result (−$5.84/lot, CI spanning zero), rejecting six further candidates',
      'Shipped a hash-verified, byte-reproducible prototype: Streamlit app, CLI and Python API with 182 tests',
    ],
    chips: ['Python', 'Statistics', 'Research Design', 'Streamlit', 'Reproducibility'],
  },
  {
    planet: 'TEMPLE ARCHIVES',
    when: '2026.09',
    x: 88, y: 64,
    sector: 'CORE WORLDS · ARCHIVE-01',
    role: 'Vice President of Academics',
    org: 'Google Developer Group on Campus NTU',
    dates: '2026.09 → PRESENT',
    status: 'ACTIVE',
    tint: 'oklch(0.82 0.14 150)',
    logs: [
      'Lead academic programming for GDG on Campus NTU',
      'Co-delivered "Data to Story" with Deep Learning Week NTU',
      'Taught cloud cost analysis and Gemini API integration to CS students',
    ],
    chips: ['Leadership', 'Teaching', 'Gemini API', 'Cloud'],
  },
];

const planetsEl = document.getElementById('planets');
const starmapDetail = document.getElementById('starmap-detail');
let activeSystem = 3;

planetsEl.innerHTML = systemData.map((s, i) => `
  <button class="planet-node${s.y > 55 ? ' label-above' : ''}${s.x < 20 ? ' edge-l' : s.x > 80 ? ' edge-r' : ''}" type="button" role="tab" id="planet-${i}"
    aria-controls="starmap-detail" data-idx="${i}" style="left:${s.x}%;top:${s.y}%;--tint:${s.tint}">
    <span class="planet-core" aria-hidden="true"></span>
    <span class="planet-label">
      <span class="planet-name">${s.planet}</span>
      <span class="planet-when">${s.when}</span>
    </span>
  </button>`).join('');

document.getElementById('route-line').setAttribute('points', systemData.map(s => `${s.x},${s.y}`).join(' '));

const planetNodes = [...planetsEl.querySelectorAll('.planet-node')];

function renderSystemDetail(idx, animated = true) {
  const sys = systemData[idx];
  if (!sys) return;
  activeSystem = idx;

  planetNodes.forEach((n, i) => {
    const on = i === idx;
    n.classList.toggle('active', on);
    n.setAttribute('aria-selected', on ? 'true' : 'false');
    n.tabIndex = on ? 0 : -1;
  });
  starmapDetail.setAttribute('aria-labelledby', `planet-${idx}`);

  const paint = () => {
    starmapDetail.style.setProperty('--tint', sys.tint);
    const active = sys.status === 'ACTIVE';
    starmapDetail.innerHTML = `
      <div class="sd-top">
        <span>${sys.sector}</span>
        <span class="sd-status${active ? ' is-active' : ''}">${active ? '<span class="pip"></span>' : ''}${sys.status}</span>
      </div>
      <div class="sd-planet">${sys.planet}</div>
      <h3 class="sd-role">${sys.role}</h3>
      <div class="sd-org">${sys.org}</div>
      <div class="sd-dates">${sys.dates}</div>
      <ul class="sd-logs">${sys.logs.map(l => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
      <div class="sd-chips">${sys.chips.map(c => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>
      <div class="sd-nav">
        <button type="button" data-step="-1" ${idx === 0 ? 'disabled style="visibility:hidden"' : ''}>← PREV SYSTEM</button>
        <button type="button" data-step="1" ${idx === systemData.length - 1 ? 'disabled style="visibility:hidden"' : ''}>NEXT SYSTEM →</button>
      </div>`;
    starmapDetail.classList.remove('swapping');
  };

  if (!animated || reducedMotion) return paint();
  starmapDetail.classList.add('swapping');
  setTimeout(paint, 160);
}

planetNodes.forEach((node, i) => {
  node.addEventListener('click', () => renderSystemDetail(i));
  node.addEventListener('keydown', e => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    e.stopPropagation();
    const next = (i + step + systemData.length) % systemData.length;
    renderSystemDetail(next);
    planetNodes[next].focus();
  });
});

starmapDetail.addEventListener('click', e => {
  const btn = e.target.closest('[data-step]');
  if (btn) renderSystemDetail(activeSystem + parseInt(btn.dataset.step, 10));
});

renderSystemDetail(activeSystem, false);

/* ========= JEDI / SITH THEME TOGGLE ========= */
const sysStatus = document.getElementById('sys-status');

/* Walk a DOM subtree and collect leaf elements that contain short text */
function gatherLeafText(root) {
  const result = [];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'svg', 'IMG', 'CANVAS', 'INPUT', 'VIDEO', 'IFRAME']);
  function walk(el) {
    if (SKIP.has(el.tagName)) return;
    if (el.children.length === 0) {
      const text = el.textContent.trim();
      if (text.length > 0 && text.length < 120) result.push(el);
    } else {
      [...el.children].forEach(walk);
    }
  }
  if (root) walk(root);
  return result;
}

/* Scramble an element's text through random characters, resolving to finalText */
function scrambleEl(el, finalText, duration) {
  if (!el) return;
  const chars = '#@!%$^&*~<>{}[]|/?■▓▒░▌▐';
  let elapsed = 0;
  const tick = 40;
  const id = setInterval(() => {
    elapsed += tick;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = finalText.split('').map(ch => {
      if (' :·°—→'.includes(ch)) return ch;
      return Math.random() < progress * 1.6
        ? ch
        : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (elapsed >= duration) {
      el.textContent = finalText;
      clearInterval(id);
    }
  }, tick);
}

function triggerThemeSwitch(toSith) {
  if (document.body.dataset.switching) return;
  document.body.dataset.switching = '1';
  document.body.dataset.flash = toSith ? 'sith' : 'jedi';

  const DURATION = reducedMotion ? 0 : 680;

  scrambleEl(sysStatus, toSith ? 'SYS: OFFLINE' : 'SYS: ONLINE', DURATION);

  if (!reducedMotion) {
    ['#hud-coord', '#ct-heading', '#ct-speed', '#ct-sector', '#ct-status', '.ct-label', '.wp-label']
      .forEach(sel => document.querySelectorAll(sel).forEach(el => scrambleEl(el, el.textContent, DURATION)));
    gatherLeafText(screens[currentScreen]).slice(0, 40)
      .forEach(el => scrambleEl(el, el.textContent, DURATION));
  }

  const WAVE1 = ['#sys-status', '#ct-speed'];
  const WAVE2 = ['#sys-status', '#ct-speed', '#ct-sector', '.console-ship'];
  const addFlash = sels => sels.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.add('t-flash')));
  const removeFlash = sels => sels.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.remove('t-flash')));

  addFlash(WAVE1);
  setTimeout(() => removeFlash(WAVE1), 90);
  setTimeout(() => addFlash(WAVE2), 170);

  setTimeout(() => {
    document.body.classList.toggle('sith-mode', toSith);
    sysStatus.setAttribute('aria-pressed', toSith ? 'true' : 'false');
    starColor = getComputedStyle(document.body).getPropertyValue('--star').trim() || '#e8f4ff';
    document.querySelector('meta[name="theme-color"]').content = toSith ? '#0a0404' : '#05070d';
    document.getElementById('favicon').href = toSith
      ? 'images/favicon-sith.svg'
      : 'images/favicon-jedi.svg';
  }, reducedMotion ? 0 : 470);

  setTimeout(() => {
    removeFlash(WAVE2);
    delete document.body.dataset.flash;
    delete document.body.dataset.switching;
  }, DURATION + 20);
}

sysStatus.addEventListener('click', () => {
  triggerThemeSwitch(!document.body.classList.contains('sith-mode'));
});

/* ========= KEYBOARD ========= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!projectModal.hidden) closeProjectModal();
    closeModal(txModal);
    closeModal(certModal);
    return;
  }
  if (!introComplete || anyModalOpen()) return;
  if (e.target.closest('input, textarea, [role="tab"]')) return;
  if (e.key === 'ArrowRight') {
    jumpTo(currentScreen + 1);
  } else if (e.key === 'ArrowLeft') {
    jumpTo(currentScreen - 1);
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    /* Up/Down only jump when the current screen has nothing left to scroll */
    const s = screens[currentScreen];
    const atBottom = s.scrollTop + s.clientHeight >= s.scrollHeight - 2;
    const atTop = s.scrollTop <= 0;
    if (e.key === 'ArrowDown' && atBottom) { e.preventDefault(); jumpTo(currentScreen + 1); }
    if (e.key === 'ArrowUp' && atTop) { e.preventDefault(); jumpTo(currentScreen - 1); }
  }
});

/* ========= TOUCH SWIPE ========= */
let touchX = 0;
let touchY = 0;
let touchIgnored = false;

document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  touchX = t.clientX;
  touchY = t.clientY;
  touchIgnored = !!e.target.closest('.carousel, .modal, .nav-console');
}, { passive: true });

document.addEventListener('touchend', e => {
  if (touchIgnored || !introComplete || anyModalOpen()) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchX;
  const dy = t.clientY - touchY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
    jumpTo(currentScreen + (dx < 0 ? 1 : -1));
  }
}, { passive: true });

/* ========= DEEP LINKS ========= */
const initialHash = location.hash.slice(1);
if (initialHash) {
  const idx = screens.findIndex(s => s.id === initialHash);
  if (idx > 0) {
    const waitIntro = setInterval(() => {
      if (!introComplete) return;
      clearInterval(waitIntro);
      setTimeout(() => jumpTo(idx), 400);
    }, 100);
  }
}

startIntro();
