# ACNHEX Market — Project Context & Reference

> **Purpose:** Paste into any Claude chat to provide full context about the ACNHEX Market app — its architecture, design system, features, file structure, and patterns.

---

## 1. What Is ACNHEX Market?

A **single-page Progressive Web App (PWA)** that lets Animal Crossing: New Horizons players browse 25,000+ in-game items and generate copiable **Discord order bot commands** at checkout. It is NOT a real store — it generates text commands like `!order 000000480000206A, 0000000100003019` for Discord bots that handle item delivery in ACNH.

- **Name:** ACNHEX Market (the "HEX" refers to hexadecimal item IDs used by ACNH modding tools)
- **Stack:** Vanilla JS (ES modules), CSS, HTML — no frameworks, no build step
- **Data:** ~26,500 item variants across 26 categories, sourced from the ACNH community spreadsheet
- **PWA:** Has `manifest.json`, service worker (`sw.js`), installable on iOS/Android
- **Hosting:** GitHub Pages at https://ghoulnamedbo.github.io/acnhex-marketplace/

---

## 2. Design System

### Typography
- **Font:** `'Space Mono', monospace` — used EVERYWHERE. This is a monospaced design.
- **Weights:** Only 400 (body) and 700 (headings/labels/buttons). No 800/900.
- **Sizes are smaller than proportional fonts** because monospace runs wide:
  - `heading-xl`: 26px, 700, palm-leaf, -0.03em tracking
  - `heading-lg`: 22px, 700, palm-leaf
  - `heading-section`: 14px, 700, uppercase, 0.1em tracking
  - `label-upper`: 11px, 700, uppercase, 0.12em tracking, text-secondary
  - `text-body`: 12px, 400
  - `text-secondary`: 11px, 400, #8A7E78
  - `text-caption`: 10px, 700
  - `text-tiny`: 9px, 400

### Color Palette — "Forest & Blossom"
```css
--palm-leaf:      #364023   /* darkest green — headings, code bg accents */
--pines:          #6a823e   /* primary accent — buttons, active states, badges */
--willow:         #9c9f69   /* secondary green — gradients, code keywords */
--parfait:        #c7a39b   /* warm mauve */
--blossoms:       #e6b1c4   /* pink — filled hearts, code values */
--dolce-pink:     #efd4dd   /* light pink — card backgrounds */
--bg:             #f6eee9   /* warm peachy page background */
--bg-warm:        #f0e4dc   /* slightly darker warm bg */
--card:           #FFFFFF   /* white cards */
--text-primary:   #2C2C2C
--text-secondary: #8A7E78
--text-light:     #B8ADA6
--border:         #EDE5DF
--danger:         #E87070   /* red — delete, warnings */
--tag-bg:         #EDF2E4   /* sage green pill bg */
--tag-text:       #6a823e
--code-bg:        #2A2F1E   /* dark forest — code blocks */
--code-text:      #E8E8D8
--code-keyword:   #9c9f69   /* willow — prefix in commands */
--code-value:     #e6b1c4   /* blossoms — hex values in commands */
```

### Item Thumbnail Background Colors (rotating)
```js
['#efd4dd', '#E8DFCF', '#D6DFC8', '#F2D9E0']  // pink, cream, sage, rose
```

### Border Radii
- Cards: `22px`
- Hero image bottom: `36px`
- Primary buttons: `18px`
- Category icons: `16px` (52×52 rounded squares)
- Pill buttons: `50px`
- Thumbnails: `14-16px`
- Inputs: `14px`
- Code blocks: `14-18px`
- Nav bar top corners: `24px`

### Shadows
```css
--shadow-card:        0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
--shadow-card-hover:  0 2px 4px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.09);
--shadow-subtle:      0 1px 3px rgba(0,0,0,0.03), 0 2px 10px rgba(0,0,0,0.04);
--shadow-elevated:    0 2px 6px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08);
--shadow-btn:         0 2px 4px rgba(106,130,62,0.15), 0 4px 12px rgba(106,130,62,0.25);
--shadow-cta:         0 4px 8px rgba(106,130,62,0.2), 0 8px 24px rgba(106,130,62,0.35);
--shadow-nav:         0 -2px 8px rgba(0,0,0,0.03), 0 -6px 24px rgba(0,0,0,0.06);
```

---

## 3. File Structure

```
ACNHEX MARKETPLACE claude app/
├── index.html              # Single HTML entry point, loading screen, SW registration
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (bump CACHE_NAME version after changes)
├── css/
│   └── styles.css          # ALL styles (~8000+ lines, no preprocessor)
├── js/
│   ├── app.js              # Main app: state, routing, render orchestrator, attachEvents
│   ├── data.js             # Data loading, search, expansion, filtering, hex lookup
│   ├── storage.js          # localStorage wrapper (cart, wishlists, prefix, etc.)
│   ├── reviews.js          # Villager review generation with templates
│   ├── sounds.js           # Web Audio API sound effects (no audio files)
│   ├── ads.js              # In-universe fake ad system
│   ├── utils.js            # Shared utilities (esc function)
│   ├── shared/
│   │   ├── icons.js        # SVG icon definitions (ICONS constant)
│   │   └── helpers.js      # Common helper functions
│   └── pages/
│       ├── catalog.js      # renderCatalog, renderItemCard, renderDailyPick
│       ├── detail.js       # renderDetail, orbit carousel, compare mode
│       ├── cart.js         # renderCart, renderPastOrders
│       ├── wishlist.js     # renderWishlist, renderWishlistDetail
│       ├── settings.js     # renderSettings
│       └── info.js         # renderInfo
├── data/
│   ├── catalog-index.json  # Master index: category list + flat item index
│   ├── villagers.json      # Villager data for reviews
│   ├── review-templates.json
│   └── categories/         # Per-category detail JSON files (26 categories)
└── icons/
    └── icon.svg
```

---

## 4. App Architecture

### State Management
A single `state` object in `app.js` holds all app state:
```js
const state = {
  page: 'catalog',           // 'catalog' | 'detail' | 'cart' | 'wishlist' | 'settings' | 'info'
  cart: [],                  // Array of {id, name, variant, variantIdx, hex, img}
  wishlists: {lists: [...]}, // Multi-list wishlist system
  prefix: '!',               // Bot command prefix
  theme: 'light',            // 'light' | 'dark' | 'system'
  activeCategory: 'All',     // Current category filter
  // ... many more state properties
};
```

### Rendering Pattern
- **Full page re-render:** `render()` rebuilds `app.innerHTML` with the correct page + nav + overlays
- **Surgical updates:** Some operations avoid full re-render (variant switching, heart toggles, search results)
- **Event delegation:** `attachEvents()` is called after every render

### Navigation
- **SPA routing** via `state.page` — no URL changes, no history API
- **Bottom nav bar:** 5 tabs — Browse, Wishlist, Cart, Settings, Info

---

## 5. Feature Summary

### Browse / Catalog
- Hero banner with search bar and filter button
- Category carousel (26 categories, horizontal scroll)
- 2-column item grid with pastel backgrounds
- Random picks mode, load more batches or infinite scroll
- Pull-to-refresh on mobile
- Inline banner ads + interstitial ads (opt-in)

### Search Overlay
- Full-screen search with real-time filtering
- Tag-based filters (colors, styles, catalog status)
- Preserves state when navigating to detail

### Item Detail
- Orbit carousel for variants (3D-style circular navigation)
- Collapsible details card
- Villager reviews (auto-generated with real villager data)
- Similar items carousel
- Set card with "Add Set to Cart/List" buttons
- Compare variants mode (for 3+ variant items)
- Sticky CTA bar with quantity control

### Cart (Order Ledger)
- 40-item max limit
- Receipt-style layout with numbered rows
- Bot command output with syntax highlighting
- Tap-to-copy with feedback animation
- Flying item animation when adding

### Wishlist (Multi-List)
- Default "Loved Items" list + custom lists
- Custom emoji icons per list
- Export/import via hex codes
- Drag-to-reorder lists

### Settings
- Bot command prefix configuration
- Load mode toggle (batches vs continuous scroll)
- Theme toggle (light/dark/system)
- Sound effects toggle + volume slider
- Fake ads preferences (all off by default)
- Clear all data

### Sound Effects
Web Audio API synthesized sounds — no audio files. Opt-in via Settings.

### Fake Ad System
In-universe Animal Crossing themed ads (Redd, Sahara, CJ, etc.). All off by default.

---

## 6. Data Model

### Cart Item
```js
{ id, name, variant, variantIdx, hex, img }
```

### Wishlist Structure
```js
{
  lists: [
    { id: '__loved__', name: 'Loved Items', emoji: '💚', cap: null, items: [{id, variantIdx}] },
    { id: 'abc123', name: 'My Room', emoji: '🏠', cap: 40, items: [{id, variantIdx}] },
  ]
}
```

### Expanded Item (for search/browse)
```js
{
  id: "item_001",
  variantIdx: 0,
  n: "antique chair",
  v1: "Brown",
  hex: "000000000000F6E",
  img: "https://...",
  c: "Furniture",
  t: "elegant|for sale|brown|white",
  c1: "brown",
  c2: "white"
}
```

---

## 7. localStorage Keys

| Key | Default | Purpose |
|-----|---------|---------|
| `acnhex_cart` | `[]` | Cart items array |
| `acnhex_wishlists` | `null` | Multi-list wishlist structure |
| `acnhex_prefix` | `'!'` | Bot command prefix |
| `acnhex_seen_intro` | `false` | First-time modal dismissed |
| `acnhex_load_mode` | `'batch'` | Item loading mode |
| `acnhex_theme` | `'light'` | Theme preference |
| `acnhex_sound_enabled` | `'false'` | Sound effects toggle |
| `acnhex_sound_volume` | `0.5` | Sound volume level |
| `acnhex_ads_*` | `'false'` | Various ad toggles |

---

## 8. Critical Rules

1. **FONT:** Always use `'Space Mono', monospace`. Never proportional fonts.
2. **FONT WEIGHTS:** Only 400 and 700. Never 800/900.
3. **COLORS:** Warm peachy bg (#f6eee9), forest green accent (#6a823e), palm leaf headings (#364023).
4. **CARDS:** 22px radius, white bg, subtle shadows. Always.
5. **BUTTONS:** Green gradient for primary CTA, green outline for secondary. 18px radius.
6. **CODE BLOCKS:** Dark forest bg (#2A2F1E), willow green keywords, pink values.
7. **HEX BADGES:** Small green pills (tag-bg/tag-text), 9-10px font size.
8. **MAX WIDTH:** 600px default, expands at breakpoints. Always centered.
9. **CART CAP:** 40 items maximum (matching Discord bot limits).
10. **VARIATED HEX:** Always use the variant-specific hex ID in cart/commands, not the base hex.
11. **SERVICE WORKER:** Bump `CACHE_NAME` version in `sw.js` after any changes.
12. **NO EXTERNAL DATA:** Everything is localStorage. No backend, no accounts.

---

## 9. Development

### No Build Step
Everything runs as-is. ES modules in the browser. CSS loaded directly. JSON fetched at runtime.

### Service Worker Cache
After making changes, always bump the version in `sw.js`:
```js
const CACHE_NAME = 'acnhex-v3.9.10';  // Increment this
```

### Version
- App version: 2.0.8 (shown in info page)
- Data version: ACNH 2.0.8 update (all items through final update)
