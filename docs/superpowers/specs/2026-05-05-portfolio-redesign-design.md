# Portfolio Website Redesign — Design Spec
**Date:** 2026-05-05  
**Owner:** Yashvardhan Pattanashetti  
**Stack:** Vanilla HTML / CSS / JS (single-page, no build tool)

---

## 1. Aesthetic Direction

**Theme:** Dark military sci-fi — Star Wars-inspired but modern. Not costume-party Star Wars; more like the aesthetic of terminals, starship dashboards, and mission briefings.

**Background:** Deep space black `#05060a` with subtle CSS noise grain texture overlay. Hyperspace canvas remains.

**Colors:**
- Primary accent: Electric cyan `#3bdcff`
- Secondary accent: Warm gold `#d4a944`
- Surface: `#0d0f1a` (cards, panels)
- Border: `#1e2340` (default), glows on hover
- Muted text: `#6b7494`
- Body text: `#c8ccdc`

**Typography:**
- Display / headings: `Orbitron` (already loaded)
- Body: `Rajdhani` (replacing Inter — more architectural, military-data-terminal feel)
- Mono / terminal: `Space Mono` (for terminal About section)

**Motion principles:**
- Entrance animations use `animation-delay` staggering (one per section, not scattered)
- Hover states: border glow + subtle lift, no jarring jumps
- Horizontal scroll: constant slow velocity, mouse-wheel adds/removes momentum

---

## 2. Navigation

No changes to structure. Visual polish:
- Logo `PORTFOLIO` → replaced with name initials `YP` in Orbitron + thin gold accent bar
- Nav links get a `::after` lightsaber underline in gold (currently cyan)
- Backdrop blur stays; add a `1px` bottom border with `rgba(59,220,255,0.15)` glow

---

## 3. Hero Section

Keeping the hyperspace canvas. Enhancements:
- Subtle corner coordinate overlays: `[0°N 0°E]` style text in `Space Mono`, 10px, muted — purely decorative
- Name `Hi, I'm Yashvardhan` types out as now — after complete, subtitle fades in
- Subtitle: `Computer Science @ NTU · Systems · Algorithms · Quant Finance`
- Below subtitle: two CTA ghost-buttons — `[ VIEW PROJECTS ]` and `[ CONTACT ]`
- Scroll hint: animated chevron-down at bottom center

---

## 4. About Section — Terminal Bio (Choice A)

Layout: Centered terminal window mock, max-width 700px.

```
╔══════════════════════════════════════════╗
║  TERMINAL  ●  ●  ●                       ║
╠══════════════════════════════════════════╣
║  $ whoami                                ║
║  > Yashvardhan Pattanashetti             ║
║  > CS @ Nanyang Technological University ║
║                                          ║
║  $ cat skills.txt                        ║
║  > [SYSTEMS]   C · C++ · OS · Networks   ║
║  > [ALGO]      Graph Theory · DP · Math  ║
║  > [QUANT]     Python · Backtesting      ║
║                                          ║
║  $ cat interests.txt                     ║
║  > Competitive programming               ║
║  > Quantitative finance                  ║
║  > [PLACEHOLDER — fill in more]          ║
║                                          ║
║  $ _                                     ║
╚══════════════════════════════════════════╝
```

Lines type out sequentially with `Space Mono`. Cursor blinks at end.  
Terminal frame: dark glass `#0b0d14`, border `1px solid #1e2340`, subtle cyan top-edge glow.

---

## 5. Projects Section — Infinite Horizontal Scroll

**Layout:** Full-width horizontal track. Cards scroll left automatically at ~0.4px/frame. Mouse wheel adds/removes velocity. No pagination.

**Card redesign (18rem × 22rem):**
- Background: `radial-gradient(circle at 30% 20%, #111629, #0b0d14)`
- Border: `1px solid #1e2340` default → glows on hover, color keyed to category:
  - Math/Research → cyan `#3bdcff`
  - Algorithms/CS → gold `#d4a944`
  - Finance/Quant → green `#4dffb4`
- Corner bracket decorators (existing mechanic) — expand on hover
- Card anatomy: category tag (top, color-coded) → title (Orbitron, 1.1rem) → description (Rajdhani, 0.9rem) → tech stack chips (bottom)
- Hover: `translateY(-8px)` + border color lights up + `::before` radial glow intensifies

**Projects (placeholder):**
1. CatScan Project — Math · Research
2. Traffic Network Analysis — Algorithms · CS  
3. Quant Trading Models — Finance · Quant
4. [Placeholder Project 4] — Systems · C++
5. [Placeholder Project 5] — Algorithms · CS

Cards repeated 2× for seamless infinite loop.

---

## 6. Certifications Section — Badge Wall (Choice A)

**Layout:** Centered grid of circular badges, 3–4 per row. Max width 800px.

**Badge anatomy:**
- Circle, 120px diameter
- Background: `radial-gradient(circle, #111629, #0b0d14)`
- Border: `2px solid` — color keyed to issuer category (cyan for CS, gold for finance, green for math)
- Icon or initials in center (large, Orbitron)
- Name below circle (Rajdhani, 0.85rem, centered)
- Issuer below name (muted, 0.75rem)

**Hover:** Badge scales up 1.1×, border glows with `box-shadow`, label fades in with year

**Placeholder badges:** AWS, Python, [3× placeholder] — user fills real ones later.

---

## 7. Blog Section — Transmission Logs

**Layout:** Vertical stack of "transmission" cards, max-width 700px, centered.

**Card anatomy:**
- Header line: `[TRANSMISSION #001]` in gold, `Space Mono`, small
- Star-date: `STARDATE 2026.05.05` in muted mono
- Title: blog post title in Orbitron, 1.2rem
- Excerpt: 2-line preview in Rajdhani
- Footer: `STATUS: INCOMING SIGNAL` with a pulsing dot

**Current state:** One placeholder transmission card + a `[SIGNAL INCOMING — MORE LOGS PENDING]` message in muted text.

---

## 8. Technical Notes

- All fonts loaded from Google Fonts: `Orbitron`, `Rajdhani`, `Space Mono`
- No framework, no build tool — pure HTML/CSS/JS
- Animations use `@keyframes` + `animation-delay` staggering, no JS animation libraries
- Horizontal scroll JS stays in `script.js`, section-specific logic stays near relevant HTML
- CSS uses custom properties (`--cyan`, `--gold`, `--surface`, etc.) defined on `:root`
- No `overflow: hidden` on body (current setup causes scroll issues on some sections); will fix

---

## 9. Out of Scope

- Mobile responsiveness (can be added later)
- Real content (user will fill in after site is complete)
- Backend / contact form functionality
- Dark/light mode toggle
