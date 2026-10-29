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
| **Home** | Holographic comm link: opening crawl (skippable, once per session), "Hello there." greeting, name, current role, and quick jumps |
| **Pilot Dossier** | Scan-lined photo frame, dossier rows, and a typed terminal readout of roles, honours, and skills |
| **Charted Systems** | Interactive starmap of every role (Mahindra.AI, CCDS TOP, Hall XIV FOP, C22 × NTU veNTUre, GDG on Campus NTU) with mission logs |
| **Mission Files** | Draggable, auto-drifting reel of project files with per-project tints and full briefs |
| **Clearances** | Certificate scans behind a hologram tint, with a full-size viewer |
| **Transmissions** | Blog posts as transmission logs with a reading modal |
| **Open a Channel** | Email, LinkedIn, and GitHub |

Navigation: arrow keys, the bridge console, swipe on touch, and `#section` deep links. Respects `prefers-reduced-motion`.

### Bridge Console
Fixed bottom navigation computer with:
- Real-time heading, speed, sector, and status telemetry
- Waypoint track with ship indicator that follows the active section
- Autopilot engaged tag

---

*May the Force be with you.*
