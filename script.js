/* ========= HERO TYPING ========= */
const heroText = "Hi, I'm Yashvardhan";
const typed = document.getElementById("typed-text");
let charIndex = 0;

function typeHero() {
  if (charIndex < heroText.length) {
    typed.textContent += heroText[charIndex++];
    setTimeout(typeHero, 90);
  } else {
    // typing done — reveal subtitle and CTAs
    document.getElementById('hero-sub').classList.add('visible');
    document.getElementById('hero-ctas').classList.add('visible');
    document.querySelector('.scroll-hint').classList.add('visible');
  }
}
typeHero();

/* ========= SCREEN SYSTEM ========= */
const screens = Array.from(document.querySelectorAll(".screen"));
let currentScreen = 0;
let jumping = false;

/* ========= HYPERSPACE CANVAS ========= */
const canvas = document.getElementById("hyperspace");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];

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
  // Motion blur fade
  ctx.fillStyle = "rgba(5,6,10,0.35)";
  ctx.fillRect(0, 0, w, h);

  // Smooth speed interpolation
  currentSpeed += (targetSpeed - currentSpeed) * 0.06;

  // Camera shake
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

    ctx.strokeStyle = "#ffffff";
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
  { cls: 'out',    text: 'Yashvardhan Pattanashetti' },
  { cls: 'dim',    text: 'Computer Science @ Nanyang Technological University' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ cat skills.txt' },
  { cls: 'out',    text: '[SYSTEMS]   C · C++ · Operating Systems · Networks' },
  { cls: 'out',    text: '[ALGO]      Graph Theory · Dynamic Programming · Math' },
  { cls: 'out',    text: '[QUANT]     Python · Backtesting · Financial Modeling' },
  { cls: 'blank' },
  { cls: 'prompt', text: '$ cat interests.txt' },
  { cls: 'out',    text: 'Competitive Programming' },
  { cls: 'out',    text: 'Quantitative Finance' },
  { cls: 'out',    text: 'Low-Level Systems Design' },
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
  shakeIntensity = 1;

  screens[currentScreen].classList.remove("active");

  // Fade shake smoothly
  setTimeout(() => {
    shakeIntensity = 0;
  }, 300);

  // Switch screen mid-jump
  setTimeout(() => {
    screens[index].classList.add("active");
    currentScreen = index;
    if (screens[index].id === 'about' && !terminalRan) {
      terminalRan = true;
      setTimeout(runTerminal, 300);
    }
  }, 2000);

  // Exit hyperspace
  setTimeout(() => {
    targetSpeed = BASE_SPEED;
    shakeIntensity = 0;
    jumping = false;
  }, 1400);
}

/* CLICK ANYWHERE → NEXT (guards against projects screen) */
document.body.addEventListener("click", () => {
  if (screens[currentScreen].id === "projects") return;
  if (currentScreen < screens.length - 1) {
    jumpTo(currentScreen + 1);
  }
});

/* NAVIGATION */
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.stopPropagation();
    const target = link.dataset.target;
    const index = screens.findIndex(s => s.id === target);
    if (index !== -1) jumpTo(index);
  });
});

document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const target = btn.dataset.target;
    const index = screens.findIndex(s => s.id === target);
    if (index !== -1) jumpTo(index);
  });
});

/* ========= PROJECT INFINITE SCROLL ========= */
const scrollTrack = document.getElementById('scroll-track');
let scrollPos = 0;
let scrollVel = 0.35;
const MIN_VEL = 0.35;

function animateScroll() {
  scrollVel *= 0.97;
  if (Math.abs(scrollVel) < MIN_VEL) scrollVel = MIN_VEL;

  scrollPos += scrollVel;

  const half = scrollTrack.scrollWidth / 2;
  if (scrollPos >= half) scrollPos -= half;
  if (scrollPos < 0) scrollPos += half;

  scrollTrack.style.transform = `translate3d(${-scrollPos}px, 0, 0)`;
  requestAnimationFrame(animateScroll);
}

animateScroll();

/* Mouse wheel adds momentum */
document.querySelector('.horizontal-scroll').addEventListener('wheel', e => {
  e.preventDefault();
  scrollVel += e.deltaY * 0.003;
}, { passive: false });

/* Card clicks don't trigger hyperspace */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', e => e.stopPropagation());
});
