/* ========= HERO TYPING ========= */
const heroText = "Hi, I’m Yashvardhan";
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
  }, 2000);

  // Exit hyperspace
  setTimeout(() => {
    targetSpeed = BASE_SPEED;
    shakeIntensity = 0;
    jumping = false;
  }, 1400);
}

/* CLICK ANYWHERE → NEXT */
document.body.addEventListener("click", () => {
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

document.querySelectorAll(".flip-card").forEach(card => {
  card.addEventListener("click", e => {
    e.stopPropagation(); // 🚫 prevent hyperspace jump
    card.classList.toggle("flipped");
  });
});

document.body.addEventListener("click", () => {
  if (currentScreen === screens.findIndex(s => s.id === "projects")) return;
  if (currentScreen < screens.length - 1) {
    jumpTo(currentScreen + 1);
  }
});

const scroll = document.querySelector(".projects-scroll");

scroll.addEventListener("scroll", () => {
  if (scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - 5) {
    scroll.scrollLeft = 0;
  }
});

/* ========= FLIP CARDS (PROJECTS ONLY) ========= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".flip-card").forEach(card => {
    card.addEventListener("click", e => {
      e.stopPropagation(); // prevent hyperspace jump
      card.classList.toggle("flipped");
    });
  });
});

/* ========= PREVENT PROJECT SCREEN AUTO-JUMP ========= */
document.body.addEventListener("click", () => {
  if (screens[currentScreen].id === "projects") return;
  if (currentScreen < screens.length - 1) {
    jumpTo(currentScreen + 1);
  }
});

/* ========= HORIZONTAL INFINITE SCROLL (FIXED) ========= */

const track = document.querySelector(".scroll-track");

let position = 0;
let velocity = 0.25; // BASE SPEED (NON-ZERO)
const FRICTION = 0.94;

function animateHorizontal() {
  position += velocity;

  const halfWidth = track.scrollWidth / 2;

  if (position >= halfWidth) {
    position -= halfWidth;
  }

  track.style.transform = `translate3d(${-position}px, 0, 0)`;

  requestAnimationFrame(animateHorizontal);
}

animateHorizontal();

/* Mouse wheel momentum */
track.parentElement.addEventListener(
  "wheel",
  e => {
    e.preventDefault();
    velocity += e.deltaY * 0.002;
  },
  { passive: false }
);

/* Stop hyperspace jump on card click */
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", e => e.stopPropagation());
});
