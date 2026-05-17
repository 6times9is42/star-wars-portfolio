# Favicon — Design Spec
Date: 2026-05-17

## Overview

Add a lightsaber favicon to the Star Wars portfolio. The blade colour matches the active theme: cyan in Jedi mode, red in Sith mode.

## Assets

Two SVG files, same shape, different colour:

| File | Blade colour | Hilt accent | Used when |
|---|---|---|---|
| `images/favicon-jedi.svg` | `#3bdcff` (cyan) | `#3bdcff` at 35% opacity | Default / Jedi mode |
| `images/favicon-sith.svg` | `#e8001c` (red) | `#e8001c` at 35% opacity | Sith mode active |

### SVG shape (32×32 viewBox)

- **Blade**: 3px-wide rounded rectangle, top-centred, height 18px, with a 5px-wide soft glow halo at 18% opacity behind it
- **Guard**: 10px-wide slate rectangle (`#4a6070` / `#4a2020` in sith), 2.5px tall, sits immediately below blade
- **Hilt**: 6px-wide dark rectangle (`#2a3a44` / `#2a1010` in sith), 7.5px tall, with a faint accent detail line at 35% opacity

## HTML change

`index.html` `<head>` — add before closing `</head>`:

```html
<link rel="icon" id="favicon" href="images/favicon-jedi.svg" type="image/svg+xml">
```

## JS change

`script.js` — inside `triggerThemeSwitch(toSith)`, after the `sith-mode` class toggle:

```js
document.getElementById('favicon').href = toSith
  ? 'images/favicon-sith.svg'
  : 'images/favicon-jedi.svg';
```

## Out of scope

- PNG fallback for legacy browsers (SVG favicons are supported in all modern browsers)
- Animated favicon
- Apple touch icon
