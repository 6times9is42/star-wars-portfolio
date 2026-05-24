/* ========= HERO TYPING ========= */
const heroText = "Hello there, General";
const typed = document.getElementById("typed-text");
let charIndex = 0;

function typeHero() {
  if (charIndex < heroText.length) {
    typed.textContent += heroText[charIndex++];
    setTimeout(typeHero, 90);
  } else {
    document.getElementById('hero-sub')?.classList.add('visible');
    document.querySelector('.scroll-hint')?.classList.add('visible');
  }
}

/* ========= SW INTRO ========= */
const swIntro = document.getElementById('sw-intro');
const swLine1 = document.getElementById('sw-line1');
const swLine2 = document.getElementById('sw-line2');

function typeSwLine(el, text, startDelay, charDelay, cb) {
  setTimeout(() => {
    el.classList.add('sw-visible');
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, charDelay);
      } else if (cb) {
        cb();
      }
    }
    tick();
  }, startDelay);
}

let introComplete = false;

typeSwLine(swLine1, 'A long time ago in a galaxy far,', 300, 65, () => {
  typeSwLine(swLine2, 'far away....', 500, 35, () => {
    setTimeout(() => {
      swIntro.classList.add('fade-out');
      setTimeout(() => {
        swIntro.classList.add('hidden');
        screens[0].classList.add('active');
        document.getElementById('nav-console').classList.add('console-ready');
        document.querySelectorAll('.hero-coord').forEach(el => el.classList.add('coord-visible'));
        introComplete = true;
        typeHero();
      }, 1200);
    }, 1600);
  });
});

/* ========= SCREEN SYSTEM ========= */
const screens = Array.from(document.querySelectorAll(".screen"));
let currentScreen = 0;
let jumping = false;

/* ========= HYPERSPACE CANVAS ========= */
const canvas = document.getElementById("hyperspace");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];
let starColor = '#ffffff';

const STAR_COUNT = 600;
const BASE_SPEED = 2;
const MAX_JUMP_SPEED = 55;

let currentSpeed = BASE_SPEED;
let targetSpeed = BASE_SPEED;

let shakeIntensity = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: STAR_COUNT }, createStar);
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
window.addEventListener("resize", resize);

/* ========= ANIMATION LOOP ========= */
function animate() {
  ctx.fillStyle = "rgba(5,6,10,0.35)";
  ctx.fillRect(0, 0, w, h);

  currentSpeed += (targetSpeed - currentSpeed) * 0.06;

  const shakeX = (Math.random() - 0.5) * shakeIntensity;
  const shakeY = (Math.random() - 0.5) * shakeIntensity;

  ctx.save();
  ctx.translate(w / 2 + shakeX, h / 2 + shakeY);

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

    ctx.strokeStyle = starColor;
    ctx.lineWidth = jumping ? 1.4 : 1;

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
  { cls: 'blank' },
  { cls: 'prompt', text: '$ whoami' },
  { cls: 'out', text: 'Yashvardhan Pattanashetti' },
  { cls: 'dim', text: 'CS @ NTU Singapore · GPA 4.24 · Jane Street Estimathon Winner' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ cat background.txt' },
  { cls: 'out', text: 'AIR 215 · JEE Main  |  AIR 777 · JEE Advanced' },
  { cls: 'out', text: 'Prev: Research Intern @ Mahindra.AI' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ cat skills.txt' },
  { cls: 'out', text: '[ML/AI]     Python · XGBoost · CNNs · RAG · SHAP' },
  { cls: 'out', text: '[SYSTEMS]   C · C++ · Java · SQL · Git/GitHub' },
  { cls: 'out', text: '[WEB]       JavaScript · React Native · HTML · CSS' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ cat interests.txt' },
  { cls: 'out', text: 'Mathematics  · Quantitative Finance  · Quantum Computing ·  Football ' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ _' },
];

let terminalRan = false;

function runTerminal() {
  const output = document.getElementById('terminal-output');
  let i = 0;

  function next() {
    if (i >= termLines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      output.appendChild(cursor);
      return;
    }
    const line = termLines[i++];
    const el = document.createElement('div');
    el.className = 't-line';

    if (line.cls === 'blank') {
      el.innerHTML = '<span class="t-blank"></span>';
    } else if (line.cls === 'prompt') {
      el.innerHTML = `<span class="t-prompt">${line.text}</span>`;
    } else {
      el.innerHTML = `<span class="t-${line.cls}">${line.text}</span>`;
    }

    output.appendChild(el);

    const delay = line.cls === 'prompt' ? 550 : line.cls === 'blank' ? 80 : 180;
    setTimeout(next, delay);
  }

  next();
}

/* ========= HYPERSPACE JUMP ========= */
function jumpTo(index) {
  if (jumping || index === currentScreen) return;

  jumping = true;
  targetSpeed = MAX_JUMP_SPEED;
  shakeIntensity = 0;

  const direction = index > currentScreen ? 'right' : 'left';
  const departing = screens[currentScreen];
  departing.classList.remove('active');
  departing.classList.add(direction === 'right' ? 'departing-right' : 'departing-left');

  positionShip(index, true);
  document.getElementById('ct-speed').textContent = 'HYPERSPACE';
  document.getElementById('ct-status').textContent = 'JUMPING';

  setTimeout(() => {
    shakeIntensity = 0;
  }, 300);

  setTimeout(() => {
    departing.classList.remove('departing-right', 'departing-left');
    screens[index].classList.add('active');
    currentScreen = index;
    updateConsole(index);
    document.getElementById('ct-speed').textContent = 'SUB-LIGHT';
    document.getElementById('ct-status').textContent = 'NOMINAL';
    if (screens[index].id === 'about' && !terminalRan) {
      terminalRan = true;
      setTimeout(runTerminal, 300);
    }
  }, 2000);

  setTimeout(() => {
    targetSpeed = BASE_SPEED;
    shakeIntensity = 0;
  }, 1400);

  setTimeout(() => {
    jumping = false;
  }, 2200);
}

/* CLICK ANYWHERE on hero → go to about */
document.body.addEventListener("click", () => {
  if (!introComplete) return;
  if (currentScreen === 0) jumpTo(1);
});

/* ========= PROJECT INFINITE SCROLL ========= */
const scrollTrack = document.getElementById('scroll-track');
let scrollPos = 0;
let scrollVel = 1.0;
const MIN_VEL = 1.0;
let scrollPaused = false;

function animateScroll() {
  if (!scrollPaused) {
    scrollVel *= 0.97;
    if (Math.abs(scrollVel) < MIN_VEL) scrollVel = MIN_VEL;

    scrollPos += scrollVel;

    const half = scrollTrack.scrollWidth / 2;
    if (scrollPos >= half) scrollPos -= half;
    if (scrollPos < 0) scrollPos += half;

    scrollTrack.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
  }
  requestAnimationFrame(animateScroll);
}

animateScroll();

document.querySelector('.horizontal-scroll').addEventListener('wheel', e => {
  e.preventDefault();
  scrollVel += e.deltaY * 0.003;
}, { passive: false });

/* Badge and blog content clicks don't trigger navigation */
document.querySelector('.cert-grid').addEventListener('click', e => e.stopPropagation());
document.querySelector('.transmissions').addEventListener('click', e => e.stopPropagation());
document.querySelector('.terminal').addEventListener('click', e => e.stopPropagation());
document.querySelector('.nav-console').addEventListener('click', e => e.stopPropagation());
document.querySelector('.starmap-layout').addEventListener('click', e => e.stopPropagation());

/* ========= BRIDGE CONSOLE ========= */
const consoleShip = document.getElementById('console-ship');
const consoleTrack = document.getElementById('console-track');
const consoleWps = document.querySelectorAll('.console-wp');

const SCREEN_META = [
  { heading: '000°', sector: 'ALPHA-01' },
  { heading: '060°', sector: 'BETA-04' },
  { heading: '120°', sector: 'GAMMA-07' },
  { heading: '180°', sector: 'DELTA-12' },
  { heading: '240°', sector: 'EPSILON-15' },
  { heading: '300°', sector: 'OMEGA-99' },
];

function positionShip(index, animate) {
  const wps = consoleTrack.querySelectorAll('.console-wp');
  const targetWp = wps[index];
  if (!targetWp) return;
  const trackRect = consoleTrack.getBoundingClientRect();
  const wpRect = targetWp.getBoundingClientRect();
  const left = wpRect.left - trackRect.left + wpRect.width / 2;
  if (!animate) {
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
  consoleWps.forEach((wp, i) => wp.classList.toggle('active', i === index));
}

consoleWps.forEach(wp => {
  wp.addEventListener('click', e => {
    e.stopPropagation();
    const idx = parseInt(wp.dataset.idx, 10);
    if (!isNaN(idx)) jumpTo(idx);
  });
});

window.addEventListener('load', () => {
  positionShip(0, false);
  updateConsole(0);
});

/* ========= PROJECT DATA ========= */
const projectData = {
  fifa: {
    fileId: 'FILE-001',
    title: 'FIFA 2026 World Cup Predictor',
    domain: 'ML · Data Science',
    rgb: '59,220,255',
    accent: '#3bdcff',
    glyph: '⚽',
    status: 'COMPLETED',
    techstack: ['Python', 'XGBoost', 'SHAP', 'Vercel'],
    skills: ['Machine Learning', 'Feature Engineering', 'Monte Carlo Simulation', 'Web Deployment'],
    brief: 'Built an end-to-end ML system to predict the FIFA 2026 World Cup winner. Scraped real squad data for all 48 nations from Transfermarkt — market values, positions, club leagues — and engineered ~40 features per team including recency-weighted form, ELO ratings, squad depth, and top-league ratio. An XGBoost classifier trained on 8 years of international results predicts win/draw/loss probabilities, with expected goals (xG) models layered on top for scoreline simulation. A 100,000-run Monte Carlo engine simulates the full 48-team bracket including the new best-8 third-place rule. SHAP explanations reveal per-team probability drivers. Deployed as a live static Vercel app. France emerged most likely to win — but the model doesn\'t know it\'s Ronaldo\'s last World Cup.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/wc-predictor' },
      { label: 'Live Demo', href: 'https://wc-predictor-wine.vercel.app/' }
    ]
  },
  catscan: {
    fileId: 'FILE-002',
    title: 'CatScan',
    domain: 'ML · Mobile',
    rgb: '212,169,68',
    accent: '#d4a944',
    glyph: '◉',
    status: 'COMPLETED',
    techstack: ['PyTorch', 'SQL', 'Android', 'Kivy'],
    skills: ['Computer Vision', 'Mobile Development', 'Healthcare AI', 'Model Optimization'],
    brief: 'Offline Android app enabling early cataract screening in rural India. Implemented guided pupil-centric image capture and preprocessing, reducing model bias and achieving 93% validation accuracy. Built CataractCNN — a lightweight CNN delivering sub-1 second on-device predictions on mid-range Android devices. Collaborated with ophthalmologists from Lokeswarananda Eye Foundation to refine the clinical workflow and validate model predictions against professional diagnoses.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/CatScan' }
    ]
  },
  padic: {
    fileId: 'FILE-003',
    title: 'p-Adic Calculus Research',
    domain: 'Math · Research',
    rgb: '77,255,180',
    accent: '#4dffb4',
    glyph: '∂',
    status: 'COMPLETED',
    techstack: ['LaTeX', 'Formal Proofs'],
    skills: ['Calculus', 'Number Theory', 'Mathematical Writing', 'Research'],
    brief: 'Led development of a first-principles framework for differentiation on p-adic numbers, formally defining limits, continuity, and derivatives via p-adic ultrametric. Collaborated with team to prove p-adic analogues of 5 core calculus rules — product rule, chain rule, mean value theorem, L\'Hôpital\'s rule, and Taylor expansion — and analysed real-valued representations through the canonical map, exposing fundamental behavioural distinctions from classical real analysis.'
  },
  gigflow: {
    fileId: 'FILE-004',
    title: 'GigFlow',
    domain: 'Full-Stack · Dashboard',
    rgb: '190,100,255',
    accent: '#be64ff',
    glyph: '◈',
    status: 'LIVE',
    techstack: ['React 19', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    skills: ['Full-Stack Engineering', 'JWT Authentication', 'Role-Based Access Control', 'Server-Side Filtering', 'Responsive Dashboard UX'],
    brief: 'Built a production-grade MERN lead management dashboard with strict TypeScript across the client and API. GigFlow supports JWT authentication with admin and sales roles, per-lead ownership enforcement, lead CRUD, debounced search, server-side filtering by status/source, sorting, pagination, URL-synced filter state, and CSV export. The interface includes dark/light mode persistence, mobile layouts, loading and empty states, toast feedback, keyboard shortcuts, and Docker Compose for one-command local development.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/gigflow' },
      { label: 'Live Demo', href: 'https://gigflow-smoky.vercel.app' }
    ]
  },
  portfolio: {
    fileId: 'FILE-005',
    title: 'Star Wars Portfolio',
    domain: 'Web · Creative Coding',
    rgb: '255,210,0',
    accent: '#ffd200',
    glyph: '☆',
    status: 'LIVE',
    techstack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    skills: ['Frontend Engineering', 'CSS Animation', 'Creative Design', 'Responsive UI'],
    brief: 'Personal portfolio built around a Star Wars command-centre aesthetic — dark-themed, fully responsive, deployed on Vercel. Features a full-text glitch scramble on load, a Sith mode colour variant triggered via easter egg, a horizontally scrolling project carousel with holographic card effects, a certifications gallery, and a Transmission Logs blog styled as encrypted Imperial dispatches. Built from scratch with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/star-wars-portfolio' },
      { label: 'Live Demo', href: 'https://yashvardhan2109.vercel.app/' }
    ]
  },
  flint: {
    fileId: 'FILE-006',
    title: 'Flint',
    domain: 'Full-Stack · AI Tools',
    rgb: '245,166,35',
    accent: '#f5a623',
    glyph: '◆',
    status: 'LIVE',
    techstack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Supabase', 'Anthropic API', 'Resend', 'Vercel'],
    skills: ['Full-Stack Engineering', 'AI Integration', 'SaaS Product Design', 'Database Architecture', 'Transactional Email'],
    brief: 'Built Flint, a free web app for startup founders and engineering managers to audit their AI tool spending. Users input their tool stack — Cursor, GitHub Copilot, Claude, ChatGPT, Windsurf, and more — and get an instant finance-literate breakdown of where they\'re overspending, which plans to switch, and their total potential savings. A deterministic audit engine applies rule-based recommendations across 8 tools and 5 rule categories; Claude Sonnet generates a personalised ~100-word summary paragraph on top. Each audit gets a unique shareable URL with Open Graph previews for Twitter and Slack unfurls. Includes email lead capture via Resend, IP-based rate limiting, honeypot bot protection, and a Vitest suite covering the full audit engine.',
    links: [
      { label: 'GitHub', href: 'https://github.com/6times9is42/flint' },
      { label: 'Live Demo', href: 'https://flint-audit.vercel.app' }
    ]
  },
  systems: {
    fileId: 'FILE-006',
    title: 'Systems Project',
    domain: 'Systems · C++',
    rgb: '212,169,68',
    accent: '#d4a944',
    glyph: '⚙',
    status: 'IN DEVELOPMENT',
    techstack: ['C', 'C++', 'POSIX', 'Assembly', 'GDB'],
    skills: ['Systems Programming', 'Memory Management', 'Concurrency', 'Performance Optimization'],
    brief: 'Low-level systems programming project exploring OS internals and hardware-software interfaces. Focuses on memory allocator design, lock-free concurrent data structures, and cache-efficient algorithms. Classification: IN DEVELOPMENT — further details pending.'
  },
  algo: {
    fileId: 'FILE-007',
    title: 'Algorithm Theory',
    domain: 'Algorithms · Theory',
    rgb: '212,169,68',
    accent: '#d4a944',
    glyph: '∞',
    status: 'IN DEVELOPMENT',
    techstack: ['C++', 'Python', 'LaTeX', 'LEAN4'],
    skills: ['Algorithm Design', 'Complexity Theory', 'Dynamic Programming', 'Formal Verification'],
    brief: 'Theoretical CS project at the intersection of combinatorics and computational complexity. Investigates approximation algorithms for NP-hard problems, explores parameterized complexity, and develops formal proofs of correctness using proof assistants. Classification: IN DEVELOPMENT — further details pending.'
  }
};

/* ========= TRANSMISSION DATA ========= */
const transmissionData = {
  '001': {
    id: '[TRANSMISSION #001]',
    stardate: 'STARDATE 2026.05.07',
    title: 'I Built an ML System to Predict the FIFA 2026 World Cup Winner',
    status: 'LIVE',
    content: `
      <p>The 2026 FIFA World Cup is 54 days away and my finals just ended. So naturally, I spent the last week building an ML system to figure out who's going to claim the title of World Champion.</p>
      <p><strong>→ Real squad data</strong> for all 48 nations scraped from Transfermarkt — market values, positions, club leagues — rolled up into team strength profiles across attack, midfield, defense, and goalkeeping.</p>
      <p><strong>→ ~40 features per team</strong> including recency-weighted form, ELO ratings, squad depth, tournament experience, and top-league ratio.</p>
      <p><strong>→ An XGBoost classifier</strong> trained on 8 years of international results predicting win/draw/loss probabilities for any matchup, with chronological splits to avoid data leakage.</p>
      <p><strong>→ Expected goals (xG) models</strong> layered on top for scoreline simulation and tiebreakers.</p>
      <p><strong>→ A 100,000-run Monte Carlo engine</strong> simulating the full 2026 bracket, including the new 48-team format and the best-8 third-place rule.</p>
      <p><strong>→ SHAP explanations per team</strong> so you can see exactly what's driving each country's probability.</p>
      <p>A 100,000 simulations say France is most likely to win. England and Spain are strong competitors for the title. Portugal, however, isn't even in the top 5.</p>
      <p>Here's what the model doesn't know: it's Cristiano Ronaldo's last World Cup. The model is cold, mathematical, and ruthless. So I'm going to need Portugal to prove it wrong.</p>
    `
  }
};

/* ========= PROJECT MODAL ========= */
const projectModal = document.getElementById('project-modal');
const pmInner = projectModal.querySelector('.pm-inner');

function openProjectModal(key) {
  const p = projectData[key];
  if (!p) return;

  pmInner.style.setProperty('--pm-accent', p.accent);
  pmInner.style.setProperty('--pm-rgb', p.rgb);

  pmInner.querySelector('.pm-file-id').textContent = p.fileId;
  pmInner.querySelector('.pm-status-tag').textContent = p.status;
  pmInner.querySelector('.pm-glyph').textContent = p.glyph;
  pmInner.querySelector('.pm-domain-tag').textContent = p.domain;
  pmInner.querySelector('.pm-title').textContent = p.title;
  pmInner.querySelector('.pm-brief').textContent = p.brief;

  const chipsEl = pmInner.querySelector('.pm-chips');
  chipsEl.innerHTML = p.techstack.map(t => `<span class="pm-chip">${t}</span>`).join('');

  const skillsEl = pmInner.querySelector('.pm-skills');
  skillsEl.innerHTML = p.skills.map(s => `<div class="pm-skill">${s}</div>`).join('');

  const actionsEl = pmInner.querySelector('.pm-actions');
  const links = p.links || [];
  actionsEl.hidden = links.length === 0;
  actionsEl.innerHTML = links
    .map(link => `<a class="pm-action" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
    .join('');

  scrollPaused = true;
  projectModal.classList.add('open');
}

function closeProjectModal() {
  projectModal.classList.remove('open');
  scrollPaused = false;
}

projectModal.addEventListener('click', e => {
  if (e.target === projectModal) closeProjectModal();
});

projectModal.querySelector('.pm-close').addEventListener('click', closeProjectModal);

/* ========= TRANSMISSION MODAL ========= */
const txModal = document.getElementById('tx-modal');
const txmInner = txModal.querySelector('.txm-inner');

function openTxModal(id) {
  const tx = transmissionData[id];
  if (!tx) return;

  txmInner.querySelector('.txm-id-tag').textContent = tx.id;
  txmInner.querySelector('.txm-date-tag').textContent = tx.stardate;
  txmInner.querySelector('.txm-main-title').textContent = tx.title;
  txmInner.querySelector('.txm-content').innerHTML = tx.content;

  txModal.classList.add('open');
}

function closeTxModal() {
  txModal.classList.remove('open');
}

txModal.addEventListener('click', e => {
  if (e.target === txModal) closeTxModal();
});

txModal.querySelector('.txm-close').addEventListener('click', closeTxModal);

/* ========= CARD & READ LOG CLICKS ========= */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => {
    e.stopPropagation();
    const key = card.dataset.project;
    if (key) openProjectModal(key);
  });

  const p = projectData[card.dataset.project];
  if (p) {
    card.style.setProperty('--accent', p.accent);
    card.style.setProperty('--accent-rgb', p.rgb);
  }
});

document.querySelectorAll('.tx-read').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const id = btn.dataset.tx;
    if (id) openTxModal(id);
  });
});

/* ========= CHARTED SYSTEMS (EXPERIENCE) ========= */
const systemData = [
  {
    planet: 'MAHINDRA NEXUS',
    sector: 'CORE WORLDS · SEC ALPHA-01',
    tag: 'INTERN · RESEARCH',
    role: 'Research Intern',
    org: 'Mahindra.AI (Mahindra Group)',
    dates: 'STARDATE 2025.12 — 2026.01',
    status: 'COMPLETED',
    color: '#3bdcff',
    rgb: '59,220,255',
    logs: [
      'Compared 15+ AI architectures (LLMs, SLMs, SLM+RAG) across cost, latency & reliability',
      'Designed SLM-first strategy reducing projected inference latency by up to 70%',
      'Built 2-phase agentic AI deployment roadmap balancing efficiency & compliance',
    ],
    chips: ['LLMs', 'SLMs', 'RAG', 'AI Strategy', 'Research'],
  },
  {
    planet: 'CORUSCANT ACADEMY',
    sector: 'MID RIM · SEC GAMMA-07',
    tag: 'LEADERSHIP · ORIENTATION',
    role: 'Group Leader',
    org: 'NTU CCDS — Transitional Orientation Program',
    dates: 'STARDATE 2026.02 — PRESENT',
    status: 'ACTIVE',
    color: '#d4a944',
    rgb: '212,169,68',
    logs: [
      'Partnered with 10+ orientation leaders to manage logistics and schedules',
      'Coordinated group activities and icebreakers for incoming CCDS students',
      'Served as primary point of contact for the new CS cohort during transition',
    ],
    chips: ['Leadership', 'Coordination', 'NTU', 'CCDS'],
  },
  {
    planet: 'BESPIN HAVEN',
    sector: 'OUTER RIM · SEC DELTA-12',
    tag: 'LEADERSHIP · HALL',
    role: 'Group Leader',
    org: 'NTU Hall XIV — Freshmen Orientation Program',
    dates: 'STARDATE 2026.02 — PRESENT',
    status: 'ACTIVE',
    color: '#4dffb4',
    rgb: '77,255,180',
    logs: [
      'Partnered with 10+ orientation leaders and organisers across hall residence',
      'Managed logistics, schedules, and icebreaker activities for freshmen cohort',
      'Fostered community and camaraderie within Hall XIV during orientation week',
    ],
    chips: ['Leadership', 'Event Management', 'NTU Hall XIV'],
  },
];

const starmapDetail = document.getElementById('starmap-detail');

function renderSystemDetail(idx) {
  const sys = systemData[idx];
  if (!sys || !starmapDetail) return;
  starmapDetail.style.opacity = '0';
  setTimeout(() => {
    starmapDetail.style.setProperty('--detail-color', sys.color);
    starmapDetail.style.setProperty('--detail-rgb', sys.rgb);
    starmapDetail.innerHTML = `
      <div class="sd-header">
        <span class="sd-planet-name">${sys.planet}</span>
        <span class="sd-status${sys.status === 'ACTIVE' ? ' sd-status-active' : ''}">${sys.status}</span>
      </div>
      <div class="sd-sector">${sys.sector}</div>
      <div class="sd-divider"></div>
      <div class="sd-field">
        <div class="sd-label">DESIGNATION</div>
        <div class="sd-val">${sys.role}</div>
      </div>
      <div class="sd-field">
        <div class="sd-label">COMMAND</div>
        <div class="sd-val">${sys.org}</div>
      </div>
      <div class="sd-field">
        <div class="sd-label">DEPLOYMENT WINDOW</div>
        <div class="sd-val sd-val-mono">${sys.dates}</div>
      </div>
      <div class="sd-field">
        <div class="sd-label">MISSION LOGS</div>
        <div class="sd-logs">${sys.logs.map(l => `<div class="sd-log">${l}</div>`).join('')}</div>
      </div>
      <div class="sd-chips">${sys.chips.map(c => `<span class="sd-chip">${c}</span>`).join('')}</div>
    `;
    starmapDetail.style.opacity = '1';
  }, 150);
}

document.querySelectorAll('.planet-node').forEach(node => {
  node.addEventListener('click', e => {
    e.stopPropagation();
    const idx = parseInt(node.dataset.idx, 10);
    document.querySelectorAll('.planet-node').forEach(n => n.classList.remove('active'));
    node.classList.add('active');
    renderSystemDetail(idx);
  });
});

renderSystemDetail(0);

/* ========= CERT LIGHTBOX ========= */
const certModal = document.getElementById('cert-modal');
const certmImg = document.getElementById('certm-img');

function openCertModal(src, alt) {
  certmImg.src = src;
  certmImg.alt = alt || 'Certificate';
  certModal.classList.add('open');
}

function closeCertModal() {
  certModal.classList.remove('open');
}

certModal.addEventListener('click', e => {
  if (e.target === certModal) closeCertModal();
});

certModal.querySelector('.certm-close').addEventListener('click', closeCertModal);

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', e => {
    e.stopPropagation();
    const img = card.querySelector('.cert-face-back .cert-img');
    if (img && img.getAttribute('src')) openCertModal(img.src, img.alt);
  });
});


/* ========= JEDI / SITH THEME TOGGLE ========= */
const sysStatus = document.getElementById('sys-status');

/* Walk a DOM subtree and collect all leaf elements that contain short text */
function gatherLeafText(root) {
  const result = [];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'IMG', 'CANVAS', 'INPUT', 'BUTTON', 'VIDEO', 'IFRAME']);
  function walk(el) {
    if (SKIP.has(el.tagName)) return;
    if ([...el.children].length === 0) {
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
      if (' :·°—'.includes(ch)) return ch;
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

  const DURATION = 680;

  /* ── Scramble every piece of visible text ── */

  /* sys-status resolves to the NEW label; everything else resolves back to itself */
  scrambleEl(sysStatus, toSith ? 'SYS: OFFLINE' : 'SYS: ONLINE', DURATION);

  /* Always-visible chrome — nav console and coords */
  const chromeSelectors = [
    '.hero-coord.top-left-coord',
    '.console-sys-id',
    '#ct-heading', '#ct-speed', '#ct-sector', '#ct-status',
  ];
  chromeSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => scrambleEl(el, el.textContent, DURATION));
  });
  document.querySelectorAll('.ct-label').forEach(el => scrambleEl(el, el.textContent, DURATION));
  document.querySelectorAll('.wp-label').forEach(el => scrambleEl(el, el.textContent, DURATION));

  /* Active screen — collect all short leaf-text elements and scramble them */
  const screenLeaves = gatherLeafText(screens[currentScreen]).slice(0, 30);
  screenLeaves.forEach(el => scrambleEl(el, el.textContent, DURATION));

  /* ── Wave-blink flash on accent-colored elements ── */
  const WAVE1 = ['#sys-status', '#ct-speed'];
  const WAVE2 = ['#sys-status', '#ct-speed', '#ct-sector', '.console-ship'];

  function addFlash(sels) {
    sels.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.add('t-flash')));
  }
  function removeFlash(sels) {
    sels.forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.remove('t-flash')));
  }

  addFlash(WAVE1);
  setTimeout(() => removeFlash(WAVE1), 90);
  setTimeout(() => addFlash(WAVE2), 170);

  /* Theme switches while still in wave 2 flash */
  setTimeout(() => {
    document.body.classList.toggle('sith-mode', toSith);
    document.getElementById('favicon').href = toSith
      ? 'images/favicon-sith.svg'
      : 'images/favicon-jedi.svg';
  }, 470);

  /* Cleanup */
  setTimeout(() => {
    removeFlash(WAVE2);
    delete document.body.dataset.flash;
    delete document.body.dataset.switching;
  }, DURATION + 20);
}

if (sysStatus) {
  sysStatus.addEventListener('click', e => {
    e.stopPropagation();
    triggerThemeSwitch(!document.body.classList.contains('sith-mode'));
  });
}

/* ESC closes modals; arrows navigate between screens */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeTxModal();
    closeCertModal();
  } else if (!introComplete) {
    return;
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (currentScreen < screens.length - 1) jumpTo(currentScreen + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (currentScreen > 0) jumpTo(currentScreen - 1);
  }
});
