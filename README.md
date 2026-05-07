# Yashvardhan — Star Wars Portfolio

A fully interactive, Star Wars-themed personal portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — pure hyperspace.

**Live site:** [yashvardhan2109.vercel.app/](https://yashvardhan2109.vercel.app/)

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
| **Certifications** | Badge wall with category glow and full-cert modal viewer |
| **Blog** | Transmission logs — press-briefing aesthetic with flicker header and post modal |

### Bridge Console
Fixed bottom navigation computer with:
- Real-time heading, speed, sector, and status telemetry
- Waypoint track with ship indicator that follows the active section
- Autopilot engaged tag

---

*May the Force be with you.*
