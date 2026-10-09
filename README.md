# Maple's Dog Grooming — Site Template

Static, multi-page site (plain HTML/CSS/vanilla JS, no framework), built and bundled with Vite.

## Stack

- HTML/CSS/JS — no React, no build-time templating
- [Vite](https://vite.dev) for dev server, bundling, and multi-page build
- ESLint for linting

## Getting Started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/, one entry per page
npm run preview   # preview the production build
npm run lint       # run ESLint
```

`vite.config.js` declares each page (`index.html`, `services.html`, `gallery.html`, `about.html`, `contact.html`) as a rollup input, so `npm run build` emits all five pages.

## Client Setup Checklist

Before handing this off or deploying for a client, replace every placeholder below.

### Business info (repeated in the footer on every page, and in `index.html`'s JSON-LD)

- [ ] Business name — currently "Maple's Dog Grooming"
- [ ] Address — `123 Maple Street, Your Town, ST 00000` (footer on all pages + `contact.html` + JSON-LD in `index.html`)
- [ ] Phone number — `tel:+15555555555` / `(555) 555-5555` (footer on all pages + `contact.html`)
- [ ] Hours — `Tue–Sat 9am–5pm` (footer on all pages)
- [ ] Site URL — `https://www.example.com/` (JSON-LD in `index.html`)
- [ ] Social profile links — currently `#` placeholders (footer on all pages, see `follow-us.js`)

### Content

- [ ] About page bio/story copy — marked `PLACEHOLDER` in `about.html`
- [ ] Gallery photos — swap in real client photos (`gallery.html`, `assets/`)
- [ ] Open Graph / social share image — `og:image` in `index.html` points to `/assets/og-image.jpg`, which doesn't exist yet
- [ ] Testimonials — sample quotes in `index.html`

### Booking

- [ ] `booking.js` / `cart.js` currently store selections in `localStorage`; wire up the actual booking/calendar backend before launch

### Before launch

- [ ] Run `npm run build` and check all 5 pages render correctly from `dist/`
- [ ] Update `<title>` / meta descriptions per page if the business name or services change
- [ ] Re-run image optimization on any newly added photos (large JPEGs should be resized/converted to WebP or AVIF)

## Colour palette & contrast

All colours live as custom properties in `:root` at the top of `style.css`.
When rebranding for a client, change them there — nothing else hardcodes a
colour.

### The two-accent rule

The brand accent is a light peach, and **light accents cannot be used as
text**. `#f2a765` on white measures 2.0:1, far below the 4.5:1 WCAG AA needs
for body text. So the palette carries two accent values:

| Token           | Use for                                          |
| --------------- | ------------------------------------------------ |
| `--accent`      | **Fills only** — button backgrounds, badges, selected states |
| `--accent-text` | Labels sitting **on** an `--accent` fill (8.4:1)  |
| `--accent-ink`  | The accent used **as** text, links, or focus rings on a light background (5.7:1 on white, 4.7:1 on cream) |

If you only remember one thing: `--accent` is a background, `--accent-ink`
is a foreground. Never `color: var(--accent)`.

`--field-border` exists for the same reason — `--border` is 1.1:1 against the
input fill, which fails WCAG 1.4.11 for identifying a form control.

### Checking a new client palette

After swapping colours, verify these pairs. Any contrast checker works
(WebAIM's is fine); the thresholds are:

| Pair                                    | Minimum |
| --------------------------------------- | ------- |
| `--text` on `--bg` and on `--page-cream` | 4.5     |
| `--text-h` on both surfaces             | 3.0     |
| `--accent-text` on `--accent`           | 4.5     |
| `--accent-ink` on `--bg` and cream      | 4.5     |
| Focus ring (`--accent-ink`) vs surface  | 3.0     |
| `--field-border` vs the field fill      | 3.0     |

To derive a new `--accent-ink`: keep the accent's hue and saturation and
lower the lightness until it clears 4.5:1 on **both** the white and the cream
surface. It stays recognisably the brand colour while being readable.

## Before you deploy

`npm run build` now runs `check-build.mjs` automatically and **fails the build**
if the compiled site is broken. It catches the two mistakes that don't show up
in `npm run dev`:

1. **A page points at a file that isn't in `dist/`** — a dead stylesheet link, or
   a `<script>` Vite didn't bundle.
2. **A `.js` file writes an asset path as a plain string**, e.g.
   `src: "/assets/dog.jpg"`. Vite renames asset files during a build and
   rewrites the references it can see — but it can't see inside a string, so
   that path breaks in production only. Import the image instead:

   ```js
   import dog from "./assets/dog.jpg";
   // then use `dog` as the src
   ```

### Why this matters

`npm run dev` serves your files straight from the project folder, so every path
works. `npm run build` renames and relocates things. **Something can work
perfectly in dev and be broken in the build** — so never deploy from a dev-server
test alone.

The habit:

```
npm run verify    # build + check + open the built site locally
```

Click through every page with the browser console open (F12). If the console is
clean and the check passed, it's safe to `firebase deploy`.
