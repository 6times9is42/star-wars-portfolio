# Yashvardhan — Star Wars Portfolio

A fully interactive, Star Wars-themed personal portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — pure hyperspace.

**Live site:** [yashvardhan.vercel.app](https://star-wars-portfolio-6times9is42.vercel.app)

---

## Features

### Holographic UI
- Full-screen section-based navigation with hyperspace jump transitions
- Animated star field canvas with speed-up / shake on section jump
- SW intro crawl on first load
- Persistent HUD: top-left coordinates, SYS: ONLINE status indicator, bottom bridge console

### Jedi ↔ Sith Theme Toggle
Click **SYS: ONLINE** (top-right) to flip the entire UI from Jedi blue to Sith red. Every color token, glow, border, and shadow switches via CSS custom properties. During the switch, all on-screen text simultaneously scrambles through glitch characters before resolving — no element moves or disappears.

### Sections
| Section | Aesthetic |
|---|---|
| **Home** | Holographic comm link — incoming transmission with holo-rings, sweep line, and progressive text reveal |
| **About** | Bio panel with scanline photo frame, stat grid, and skill chips |
| **Experience** | Interactive starmap — click planets (MAHINDRA NEXUS, CORUSCANT ACADEMY, BESPIN HAVEN) to reveal mission logs |
| **Projects** | Infinite-scroll card wall with category-keyed glow — ML/AI (cyan), Mobile (gold), Research (green) |
| **Certifications** | Circular badge wall with category glow rings and full-cert modal viewer |
| **Blog** | Transmission logs — press-briefing aesthetic with flicker header and post modal |

### Bridge Console
Fixed bottom navigation computer with:
- Real-time heading, speed, sector, and status telemetry
- Waypoint track with ship indicator that follows the active section
- Autopilot engaged tag

---

## Tech

- **HTML / CSS / JavaScript** — zero dependencies, zero build step
- **CSS custom properties** — full theme system; one class swap (`body.sith-mode`) flips 11 variables and the entire UI follows
- **Canvas API** — star field with parallax speed and shake
- **Google Fonts** — Orbitron (display), Rajdhani (body), Space Mono (mono)

---

## Project Structure

```
star-wars-portfolio/
├── index.html          # Single-page app — all sections and modals
├── style.css           # All styles, keyframes, and theme tokens
├── script.js           # Canvas, navigation, modals, theme toggle, scramble FX
├── images/
│   ├── profilepic.jpeg
│   ├── google-logo.webp
│   └── certs/          # Certificate JPEGs for the badge modal viewer
├── certificates/       # Original PDF certificates
└── vercel.json         # Vercel static site config
```

---

## Deploy on Vercel

This is a zero-config static site. Vercel detects `index.html` automatically.

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/6times9is42/star-wars-portfolio)

**Or via CLI:**

```bash
npm i -g vercel
vercel
```

---

## Local Development

No build step. Open directly in a browser:

```bash
# Any static server works
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

*May the Force be with you.*
