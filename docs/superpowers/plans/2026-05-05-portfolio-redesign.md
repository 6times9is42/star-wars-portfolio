# Portfolio Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Yashvardhan's personal portfolio into a polished dark military-sci-fi site with a terminal About, infinite-scroll Projects, badge-wall Certifications, and Transmission Logs Blog.

**Architecture:** Three files only — `index.html`, `style.css`, `script.js`. No build tool, no framework. Each task modifies one or more of these files in a focused way. CSS custom properties defined on `:root` are the single source of truth for colors and fonts.

**Tech Stack:** Vanilla HTML5 / CSS3 / JS (ES6). Fonts from Google Fonts: Orbitron, Rajdhani, Space Mono.

---

## Task 1: CSS Foundation — Variables & Fonts

**Files:**
- Modify: `index.html` (Google Fonts link)
- Modify: `style.css` (`:root` variables, body font, h2 update)

- [ ] **Step 1: Replace the Google Fonts `<link>` in `index.html`**

Replace the existing fonts link (line 8) with:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Rajdhani:wght@300;400;500;600&family=Space+Mono&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add CSS custom properties at the top of `style.css`**

Insert before the `/* RESET */` block:
```css
:root {
  --cyan: #3bdcff;
  --gold: #d4a944;
  --green: #4dffb4;
  --bg: #05060a;
  --surface: #0d0f1a;
  --surface-2: #111629;
  --border: #1e2340;
  --text: #c8ccdc;
  --muted: #6b7494;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```

- [ ] **Step 3: Update `body` and base text styles in `style.css`**

Replace the existing `body` rule:
```css
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}
```

Replace the existing `h2` rule:
```css
h2 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--cyan);
  margin-bottom: 1.5rem;
  letter-spacing: 0.2em;
  text-shadow: 0 0 12px rgba(59, 220, 255, 0.3);
}
```

Add a `.muted` utility class (it's referenced in HTML but not defined):
```css
.muted {
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
}
```

- [ ] **Step 4: Open `index.html` in a browser and verify**

Rajdhani should be the body font now — rounder, more architectural than Inter. Orbitron headings unchanged.

- [ ] **Step 5: Commit**
```bash
git add index.html style.css
git commit -m "feat: add CSS custom properties, swap body font to Rajdhani"
```

---

## Task 2: Nav Polish

**Files:**
- Modify: `index.html` (logo markup)
- Modify: `style.css` (logo, nav border, saber underline color)

- [ ] **Step 1: Update logo HTML in `index.html`**

Replace `<div class="logo">PORTFOLIO</div>` with:
```html
<div class="logo">
  <span class="logo-initials">YP</span>
  <span class="logo-bar"></span>
</div>
```

- [ ] **Step 2: Replace the `.logo` CSS rule and add new logo styles in `style.css`**

Replace the existing `.logo` rule with:
```css
.logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
}

.logo-initials {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: 3px;
}

.logo-bar {
  width: 28px;
  height: 3px;
  background: var(--gold);
  box-shadow: 0 0 10px var(--gold);
}
```

- [ ] **Step 3: Add nav bottom border and update saber underline color in `style.css`**

Replace the existing `nav` rule:
```css
nav {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1.2rem 2rem;
  z-index: 10;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(59, 220, 255, 0.1);
}
```

Replace the `.saber` rule:
```css
.saber {
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: var(--gold);
  box-shadow: 0 0 10px var(--gold);
  transition: width 0.3s ease;
}
```

Update `.nav-links a` font:
```css
.nav-links a {
  margin-left: 1.4rem;
  cursor: pointer;
  position: relative;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-family: var(--font-body);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.nav-links a:hover {
  color: var(--text);
}
```

- [ ] **Step 4: Verify in browser**

Logo should show "YP" with a short gold bar. Nav links get gold underline on hover.

- [ ] **Step 5: Commit**
```bash
git add index.html style.css
git commit -m "feat: polish nav — YP logo with gold bar, gold saber underline"
```

---

## Task 3: Hero Enhancements

**Files:**
- Modify: `index.html` (coordinate overlays, CTA buttons, scroll hint, subtitle update)
- Modify: `style.css` (hero layout, CTAs, scroll hint, coordinate styles)
- Modify: `script.js` (CTA button navigation, subtitle fade-in after typing)

- [ ] **Step 1: Update hero section HTML in `index.html`**

Replace the entire `<!-- HERO -->` section:
```html
<!-- HERO -->
<section id="hero" class="screen active hero">
  <div class="hero-coord top-left-coord">0°N · 0°E · ALT 0</div>
  <div class="hero-coord top-right-coord">SYS: ONLINE</div>
  <div class="hero-coord bottom-left-coord">SIGNAL: CLEAR</div>

  <h1><span id="typed-text"></span></h1>
  <p id="hero-sub" class="hero-sub">Computer Science @ NTU &nbsp;·&nbsp; Systems &nbsp;·&nbsp; Algorithms &nbsp;·&nbsp; Quant Finance</p>

  <div class="hero-ctas" id="hero-ctas">
    <button class="cta-btn" data-target="projects">[ VIEW PROJECTS ]</button>
    <button class="cta-btn cta-secondary" data-target="certifications">[ CERTIFICATIONS ]</button>
  </div>

  <div class="scroll-hint">&#9660;</div>
</section>
```

- [ ] **Step 2: Add hero CSS to `style.css`**

After the existing `#hero p` rule, add:
```css
.hero-coord {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--muted);
  letter-spacing: 0.15em;
  opacity: 0.45;
  pointer-events: none;
}
.top-left-coord  { top: 6.5rem; left: 2.5rem; }
.top-right-coord { top: 6.5rem; right: 2.5rem; }
.bottom-left-coord { bottom: 4rem; left: 2.5rem; }

.hero-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--muted);
  letter-spacing: 0.12em;
  margin-top: 0.5rem;
  opacity: 0;
  transition: opacity 1s ease;
}
.hero-sub.visible { opacity: 1; }

.hero-ctas {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
  opacity: 0;
  transition: opacity 1s ease 0.4s;
}
.hero-ctas.visible { opacity: 1; }

.cta-btn {
  background: transparent;
  border: 1px solid var(--cyan);
  color: var(--cyan);
  font-family: var(--font-display);
  font-size: 0.7rem;
  padding: 0.75rem 1.6rem;
  letter-spacing: 0.18em;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
}
.cta-btn:hover {
  background: rgba(59, 220, 255, 0.08);
  box-shadow: 0 0 20px rgba(59, 220, 255, 0.2);
}
.cta-secondary {
  border-color: var(--gold);
  color: var(--gold);
}
.cta-secondary:hover {
  background: rgba(212, 169, 68, 0.08);
  box-shadow: 0 0 20px rgba(212, 169, 68, 0.2);
}

.scroll-hint {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--muted);
  font-size: 0.9rem;
  opacity: 0.5;
  animation: bounce 2.5s ease-in-out infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}
```

Also replace the old `#hero h1` and `#hero p` rules:
```css
#hero h1 {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: var(--cyan);
  text-shadow: 0 0 30px rgba(59, 220, 255, 0.4);
}

#typed-text {
  border-right: 2px solid var(--cyan);
  padding-right: 6px;
  white-space: nowrap;
}
```

- [ ] **Step 3: Update `typeHero` in `script.js` to fade in sub + CTAs after typing finishes**

Replace the `typeHero` function:
```javascript
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
```

- [ ] **Step 4: Wire CTA buttons to navigate in `script.js`**

After the `document.querySelectorAll(".nav-links a").forEach(...)` block, add:
```javascript
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const target = btn.dataset.target;
    const index = screens.findIndex(s => s.id === target);
    if (index !== -1) jumpTo(index);
  });
});
```

- [ ] **Step 5: Verify in browser**

Hero should show: typed name → subtitle fades in → CTA buttons fade in. Coordinate labels visible in corners. Bouncing scroll hint at bottom.

- [ ] **Step 6: Commit**
```bash
git add index.html style.css script.js
git commit -m "feat: hero — coordinate overlays, CTA buttons, subtitle fade-in, scroll hint"
```

---

## Task 4: About Section — Terminal Bio

**Files:**
- Modify: `index.html` (replace about section content)
- Modify: `style.css` (terminal window styles)
- Modify: `script.js` (terminal typewriter + hook to screen transition)

- [ ] **Step 1: Replace the about section HTML in `index.html`**

Replace the entire `<!-- ABOUT -->` section:
```html
<!-- ABOUT -->
<section id="about" class="screen">
  <div class="terminal">
    <div class="terminal-header">
      <span class="terminal-dot tdot-red"></span>
      <span class="terminal-dot tdot-yellow"></span>
      <span class="terminal-dot tdot-green"></span>
      <span class="terminal-title">bash — yash@ntu: ~</span>
    </div>
    <div class="terminal-body">
      <div id="terminal-output"></div>
      <span class="terminal-cursor" id="term-cursor"></span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add terminal CSS to `style.css`**

Add after the `.muted` rule:
```css
/* ===== TERMINAL (ABOUT) ===== */
.terminal {
  width: 100%;
  max-width: 680px;
  background: #0b0d14;
  border: 1px solid var(--border);
  border-top: 2px solid var(--cyan);
  box-shadow:
    0 0 40px rgba(59, 220, 255, 0.06),
    0 24px 60px rgba(0, 0, 0, 0.6);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  background: #0f1120;
  border-bottom: 1px solid var(--border);
}

.terminal-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.tdot-red    { background: #ff5f57; }
.tdot-yellow { background: #febc2e; }
.tdot-green  { background: #28c840; }

.terminal-title {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted);
}

.terminal-body {
  padding: 1.4rem 1.6rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text);
  min-height: 280px;
  line-height: 1;
}

.t-line {
  margin-bottom: 0.55rem;
  white-space: pre;
}

.t-prompt { color: var(--cyan); }
.t-out    { color: var(--text); padding-left: 1.4rem; display: block; }
.t-dim    { color: var(--muted); padding-left: 1.4rem; display: block; }
.t-blank  { display: block; height: 0.6rem; }

.terminal-cursor {
  display: inline-block;
  width: 9px;
  height: 1em;
  background: var(--cyan);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
}
@keyframes blink {
  50% { opacity: 0; }
}
```

- [ ] **Step 3: Add terminal typewriter logic to `script.js`**

Add this block before the `jumpTo` function:
```javascript
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
  const cursor = document.getElementById('term-cursor');
  let i = 0;

  function next() {
    if (i >= termLines.length) return;
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
```

- [ ] **Step 4: Trigger terminal when About screen becomes active**

In the `jumpTo` function, find the line:
```javascript
    screens[index].classList.add("active");
    currentScreen = index;
```

Add a call after it:
```javascript
    screens[index].classList.add("active");
    currentScreen = index;
    if (screens[index].id === 'about' && !terminalRan) {
      terminalRan = true;
      setTimeout(runTerminal, 300);
    }
```

- [ ] **Step 5: Verify in browser**

Navigate to About. Terminal window appears, lines type out with staggered delays. Cursor blinks at end.

- [ ] **Step 6: Commit**
```bash
git add index.html style.css script.js
git commit -m "feat: about section — terminal bio with typewriter animation"
```

---

## Task 5: Projects — Card Redesign

**Files:**
- Modify: `index.html` (replace all project cards with 5 unique + 5 duplicate for loop)
- Modify: `style.css` (replace card styles with category-keyed glow system)

- [ ] **Step 1: Replace the entire projects section HTML in `index.html`**

Replace the `<section id="projects" ...>` block entirely:
```html
<section id="projects" class="screen">
  <h2 class="section-title">PROJECTS</h2>

  <div class="horizontal-scroll">
    <div class="scroll-track" id="scroll-track">

      <!-- === CARD SET A (originals) === -->
      <div class="project-card" data-category="math">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Math · Research</span>
          <h3>CatScan Project</h3>
          <p>Mathematical modeling and scan-based analysis applied to computational problems.</p>
          <div class="card-chips">
            <span class="chip">Python</span><span class="chip">NumPy</span><span class="chip">Research</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="algo">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Algorithms · CS</span>
          <h3>Traffic Network Analysis</h3>
          <p>Exploring Braess's paradox and congestion dynamics in urban graph networks.</p>
          <div class="card-chips">
            <span class="chip">Graph Theory</span><span class="chip">C++</span><span class="chip">Algorithms</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="quant">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Finance · Quant</span>
          <h3>Quant Trading Models</h3>
          <p>Backtesting systematic strategies with risk-adjusted return metrics and signal analysis.</p>
          <div class="card-chips">
            <span class="chip">Python</span><span class="chip">Pandas</span><span class="chip">Finance</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="systems">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Systems · C++</span>
          <h3>[Project Placeholder]</h3>
          <p>Placeholder description for a systems-level project. Details coming soon.</p>
          <div class="card-chips">
            <span class="chip">C</span><span class="chip">C++</span><span class="chip">Systems</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="algo">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Algorithms · Theory</span>
          <h3>[Project Placeholder]</h3>
          <p>Placeholder for an algorithms or CS theory project. Details coming soon.</p>
          <div class="card-chips">
            <span class="chip">Algorithms</span><span class="chip">Math</span><span class="chip">Theory</span>
          </div>
        </div>
      </div>

      <!-- === CARD SET B (duplicates for seamless loop) === -->
      <div class="project-card" data-category="math">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Math · Research</span>
          <h3>CatScan Project</h3>
          <p>Mathematical modeling and scan-based analysis applied to computational problems.</p>
          <div class="card-chips">
            <span class="chip">Python</span><span class="chip">NumPy</span><span class="chip">Research</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="algo">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Algorithms · CS</span>
          <h3>Traffic Network Analysis</h3>
          <p>Exploring Braess's paradox and congestion dynamics in urban graph networks.</p>
          <div class="card-chips">
            <span class="chip">Graph Theory</span><span class="chip">C++</span><span class="chip">Algorithms</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="quant">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Finance · Quant</span>
          <h3>Quant Trading Models</h3>
          <p>Backtesting systematic strategies with risk-adjusted return metrics and signal analysis.</p>
          <div class="card-chips">
            <span class="chip">Python</span><span class="chip">Pandas</span><span class="chip">Finance</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="systems">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Systems · C++</span>
          <h3>[Project Placeholder]</h3>
          <p>Placeholder description for a systems-level project. Details coming soon.</p>
          <div class="card-chips">
            <span class="chip">C</span><span class="chip">C++</span><span class="chip">Systems</span>
          </div>
        </div>
      </div>

      <div class="project-card" data-category="algo">
        <div class="card-corner top-left"></div><div class="card-corner top-right"></div>
        <div class="card-corner bottom-left"></div><div class="card-corner bottom-right"></div>
        <div class="card-content">
          <span class="card-category">Algorithms · Theory</span>
          <h3>[Project Placeholder]</h3>
          <p>Placeholder for an algorithms or CS theory project. Details coming soon.</p>
          <div class="card-chips">
            <span class="chip">Algorithms</span><span class="chip">Math</span><span class="chip">Theory</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace all project/card CSS in `style.css`**

Do two removals, then add the new block:

**2a.** Find and delete the `#projects.screen { ... }` block (the one under the `/* PROJECTS SCREEN OVERRIDE */` comment, around line 92–101). It looks like:
```css
#projects.screen {
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;
  padding-top: 6rem;
}
```

**2b.** Find the `.project-carousel {` rule (first occurrence, around line 143) and delete from that line all the way to the **end of the file**. This removes all old project/card/flip/scroll CSS.

Then, at the **end of `style.css`**, add:

```css
/* ===== PROJECTS SECTION ===== */
#projects.screen {
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;
  padding-top: 5.5rem;
  padding-left: 0;
  padding-right: 0;
}

.section-title {
  font-size: 1.6rem;
  letter-spacing: 0.2em;
  text-align: center;
  margin-bottom: 0;
  padding: 0 2rem;
}

.horizontal-scroll {
  width: 100vw;
  overflow: hidden;
  margin-top: 2.5rem;
  padding: 1rem 0 2rem;
}

.scroll-track {
  display: flex;
  gap: 2.5rem;
  padding: 0 4rem;
  width: max-content;
  will-change: transform;
}

/* ===== PROJECT CARD ===== */
.project-card {
  position: relative;
  flex: 0 0 17rem;
  height: 22rem;
  padding: 1.6rem;
  background: radial-gradient(circle at 30% 20%, var(--surface-2), var(--surface));
  border: 1px solid var(--border);
  color: var(--text);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
}

/* category-keyed accent colors */
.project-card[data-category="math"]    { --accent: var(--cyan);  --accent-rgb: 59,220,255; }
.project-card[data-category="algo"]    { --accent: var(--gold);  --accent-rgb: 212,169,68; }
.project-card[data-category="quant"]   { --accent: var(--green); --accent-rgb: 77,255,180; }
.project-card[data-category="systems"] { --accent: var(--gold);  --accent-rgb: 212,169,68; }

.project-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow:
    0 0 25px rgba(var(--accent-rgb), 0.2),
    0 20px 40px rgba(0, 0, 0, 0.7);
}
.project-card:hover::before {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.05), transparent 65%);
}

/* Corner brackets */
.card-corner {
  position: absolute;
  width: 1.8rem;
  height: 1.8rem;
  border: 1.5px solid var(--accent, var(--cyan));
  opacity: 0.5;
  transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
}
.top-left     { top: 0.6rem; left: 0.6rem; border-right: none; border-bottom: none; }
.top-right    { top: 0.6rem; right: 0.6rem; border-left: none; border-bottom: none; }
.bottom-left  { bottom: 0.6rem; left: 0.6rem; border-right: none; border-top: none; }
.bottom-right { bottom: 0.6rem; right: 0.6rem; border-left: none; border-top: none; }

.project-card:hover .card-corner {
  width: calc(100% - 1.2rem);
  height: calc(100% - 1.2rem);
  opacity: 0.9;
}

/* Card content */
.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.card-category {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent, var(--cyan));
}

.card-content h3 {
  font-family: var(--font-display);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: #e8ecff;
  line-height: 1.4;
}

.card-content p {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--muted);
  flex: 1;
}

.card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.chip {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--border);
  color: var(--muted);
  letter-spacing: 0.06em;
}
```

- [ ] **Step 3: Verify in browser**

Navigate to Projects. Cards should display with the correct category colors — cyan for math, gold for algo/systems, green for quant. Corner brackets expand on hover.

- [ ] **Step 4: Commit**
```bash
git add index.html style.css
git commit -m "feat: projects — redesigned cards with category-keyed glow, corner brackets"
```

---

## Task 6: Projects — Infinite Scroll JS Fix

**Files:**
- Modify: `script.js` (replace the broken scroll logic and remove duplicate click handlers)

- [ ] **Step 1: Remove the broken/duplicate scroll code from `script.js`**

Delete these sections entirely from `script.js`:
- The duplicate `document.body.addEventListener("click", ...)` blocks (lines ~129-133, ~152-157, ~178-183 — keep only ONE at the very top)
- The `const scroll = document.querySelector(".projects-scroll");` block and its event listener (`.projects-scroll` doesn't exist in HTML)
- The entire `/* ========= HORIZONTAL INFINITE SCROLL (FIXED) ========= */` block (the `animateHorizontal` function and wheel listener)

The full cleaned-up `script.js` body click section should look like exactly ONE instance:
```javascript
document.body.addEventListener("click", () => {
  if (screens[currentScreen].id === "projects") return;
  if (currentScreen < screens.length - 1) {
    jumpTo(currentScreen + 1);
  }
});
```

The flip-card click listener can also be removed since the new cards don't flip.

- [ ] **Step 2: Add the correct infinite scroll at the bottom of `script.js`**

```javascript
/* ========= PROJECT INFINITE SCROLL ========= */
const scrollTrack = document.getElementById('scroll-track');
let scrollPos = 0;
let scrollVel = 0.35;
const SCROLL_FRICTION = 0.97;
const MIN_VEL = 0.35;

function animateScroll() {
  scrollVel = Math.max(Math.abs(scrollVel), MIN_VEL) * Math.sign(scrollVel || 1);
  scrollVel *= SCROLL_FRICTION;
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
```

- [ ] **Step 3: Verify in browser**

Navigate to Projects. Cards scroll slowly left in a seamless loop. Mouse wheel speeds up / slows down the scroll. Cards don't trigger hyperspace jump when clicked.

- [ ] **Step 4: Commit**
```bash
git add script.js
git commit -m "fix: replace broken scroll JS, remove duplicate click handlers"
```

---

## Task 7: Certifications — Badge Wall

**Files:**
- Modify: `index.html` (replace certifications section)
- Modify: `style.css` (badge wall styles)

- [ ] **Step 1: Replace certifications section HTML in `index.html`**

Replace the `<!-- CERTIFICATIONS -->` section:
```html
<!-- CERTIFICATIONS -->
<section id="certifications" class="screen">
  <h2>CERTIFICATIONS</h2>
  <div class="badge-grid">

    <div class="badge" data-type="cs">
      <div class="badge-circle"><span class="badge-icon">AWS</span></div>
      <div class="badge-name">Cloud Practitioner</div>
      <div class="badge-issuer">Amazon Web Services</div>
    </div>

    <div class="badge" data-type="cs">
      <div class="badge-circle"><span class="badge-icon">PY</span></div>
      <div class="badge-name">Python Essentials</div>
      <div class="badge-issuer">Cisco NetAcad</div>
    </div>

    <div class="badge" data-type="quant">
      <div class="badge-circle"><span class="badge-icon">FIN</span></div>
      <div class="badge-name">[Placeholder Cert]</div>
      <div class="badge-issuer">Issuer Name</div>
    </div>

    <div class="badge" data-type="math">
      <div class="badge-circle"><span class="badge-icon">MTH</span></div>
      <div class="badge-name">[Placeholder Cert]</div>
      <div class="badge-issuer">Issuer Name</div>
    </div>

    <div class="badge" data-type="cs">
      <div class="badge-circle"><span class="badge-icon">SYS</span></div>
      <div class="badge-name">[Placeholder Cert]</div>
      <div class="badge-issuer">Issuer Name</div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add badge CSS to `style.css`**

```css
/* ===== CERTIFICATIONS ===== */
.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  max-width: 800px;
  margin-top: 2rem;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  cursor: default;
}

.badge[data-type="cs"]    { --badge-accent: var(--cyan);  --badge-rgb: 59,220,255; }
.badge[data-type="quant"] { --badge-accent: var(--gold);  --badge-rgb: 212,169,68; }
.badge[data-type="math"]  { --badge-accent: var(--green); --badge-rgb: 77,255,180; }

.badge-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 30%, var(--surface-2), var(--surface));
  border: 2px solid var(--badge-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.badge:hover .badge-circle {
  transform: scale(1.1);
  box-shadow: 0 0 28px rgba(var(--badge-rgb), 0.4);
}

.badge-icon {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--badge-accent);
  letter-spacing: 0.12em;
}

.badge-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text);
  text-align: center;
  max-width: 110px;
  line-height: 1.3;
}

.badge-issuer {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--muted);
  text-align: center;
}
```

- [ ] **Step 3: Verify in browser**

Navigate to Certifications. Badge wall shows 5 circular badges with correct color keying. Hover scales badge and adds glow.

- [ ] **Step 4: Commit**
```bash
git add index.html style.css
git commit -m "feat: certifications — circular badge wall with category glow"
```

---

## Task 8: Blog — Transmission Logs

**Files:**
- Modify: `index.html` (replace blog section)
- Modify: `style.css` (transmission card styles)

- [ ] **Step 1: Replace blog section HTML in `index.html`**

Replace the `<!-- BLOG -->` section:
```html
<!-- BLOG -->
<section id="blog" class="screen">
  <h2>TRANSMISSIONS</h2>
  <div class="transmissions">

    <div class="transmission-card">
      <div class="tx-header">
        <span class="tx-id">[TRANSMISSION #001]</span>
        <span class="tx-date">STARDATE 2026.05.05</span>
      </div>
      <h3 class="tx-title">Placeholder Post — Title Coming Soon</h3>
      <p class="tx-excerpt">
        This is a placeholder entry for an upcoming technical post. Topics will span systems programming, algorithm deep-dives, and quantitative models.
      </p>
      <div class="tx-footer">
        <span class="tx-status"><span class="tx-dot"></span>STATUS: PENDING</span>
        <span class="tx-read">READ LOG →</span>
      </div>
    </div>

    <div class="tx-incoming">
      <span>[ SIGNAL INCOMING — MORE TRANSMISSIONS PENDING ]</span>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add transmission CSS to `style.css`**

```css
/* ===== BLOG / TRANSMISSIONS ===== */
.transmissions {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-top: 2rem;
}

.transmission-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--gold);
  padding: 1.4rem 1.6rem;
  transition: border-left-color 0.3s, box-shadow 0.3s;
  text-align: left;
}
.transmission-card:hover {
  border-left-color: var(--cyan);
  box-shadow: 0 0 20px rgba(59, 220, 255, 0.07);
}

.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
}
.tx-id {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gold);
  letter-spacing: 0.1em;
}
.tx-date {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--muted);
}

.tx-title {
  font-family: var(--font-display);
  font-size: 1rem;
  color: #e8ecff;
  margin-bottom: 0.6rem;
  letter-spacing: 0.06em;
  line-height: 1.4;
}

.tx-excerpt {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 1rem;
}

.tx-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tx-status {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.tx-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}

.tx-read {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyan);
  cursor: pointer;
  opacity: 0.7;
}
.tx-read:hover { opacity: 1; }

.tx-incoming {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
  text-align: center;
  padding: 1rem;
  border: 1px dashed var(--border);
  animation: flicker 4s ease-in-out infinite;
}
@keyframes flicker {
  0%, 90%, 100% { opacity: 0.5; }
  91% { opacity: 0.15; }
  93% { opacity: 0.6; }
  95% { opacity: 0.2; }
}
```

- [ ] **Step 3: Verify in browser**

Navigate to Blog/Transmissions. One transmission card with gold left border. Hovering changes border to cyan. Pulsing dot in status. Flickering "incoming" placeholder below.

- [ ] **Step 4: Commit**
```bash
git add index.html style.css
git commit -m "feat: blog — transmission logs aesthetic with flicker placeholder"
```

---

## Task 9: Final Polish Pass

**Files:**
- Modify: `style.css` (section heading alignment for certifications/blog, projects section-title color)
- Modify: `script.js` (ensure logo click navigates to hero)

- [ ] **Step 1: Ensure certifications and blog screens center content correctly**

The default `.screen` centers content. Blog needs `text-align: left` override for the card text (already set on `.transmission-card`), but the `h2` and `.transmissions` wrapper should stay centered.

Add these overrides to `style.css`:
```css
#certifications.screen,
#blog.screen {
  padding-top: 5rem;
  justify-content: flex-start;
  overflow-y: auto;
}
```

- [ ] **Step 2: Add logo-click-to-home in `script.js`**

```javascript
document.querySelector('.logo').addEventListener('click', e => {
  e.stopPropagation();
  jumpTo(0);
});
```

- [ ] **Step 3: Verify full site flow in browser**

Walk through every section in order: Hero → About → Projects → Certifications → Blog.
Check:
- [ ] Hero: typed name, subtitle + CTAs fade in, coordinate labels visible, bouncing arrow
- [ ] About: terminal types out correctly, cursor blinks at end
- [ ] Projects: cards scroll left infinitely, hover glows match category color
- [ ] Certifications: badge grid centered, hover scales + glows
- [ ] Blog: transmission card + flickering placeholder
- [ ] Nav: all links navigate correctly, logo click goes home
- [ ] No JS errors in browser console

- [ ] **Step 4: Final commit**
```bash
git add index.html style.css script.js
git commit -m "feat: final polish — section overrides, logo home nav, full site verification"
```
