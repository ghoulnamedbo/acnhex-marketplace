# ACNHEX Market — Complete App Context & Reference

> **Purpose of this file:** Paste into any Claude chat to provide full context about the ACNHEX Market app — its architecture, design system, features, file structure, and patterns. Use this to generate mockups, plan features, or discuss the project without needing the full codebase.

---

## 1. What Is ACNHEX Market?

A **single-page Progressive Web App (PWA)** that lets Animal Crossing: New Horizons players browse 25,000+ in-game items and generate copiable **Discord order bot commands** at checkout. It is NOT a real store — it generates text commands like `!order 000000480000206A, 0000000100003019` for Discord bots that handle item delivery in ACNH.

- **Name:** ACNHEX Market (the "HEX" refers to hexadecimal item IDs used by ACNH modding tools)
- **Stack:** Vanilla JS (ES modules), CSS, HTML — no frameworks, no build step
- **Data:** ~26,500 item variants across 26 categories, sourced from the ACNH community spreadsheet
- **Hosting:** Static files served via `http-server` on port 8080
- **PWA:** Has `manifest.json`, service worker (`sw.js`), installable on iOS/Android

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
```
CSS Variables:
--palm-leaf:      #364023   (darkest green — headings, code bg accents)
--pines:          #6a823e   (primary accent — buttons, active states, badges)
--willow:         #9c9f69   (secondary green — gradients, code keywords)
--parfait:        #c7a39b   (warm mauve)
--blossoms:       #e6b1c4   (pink — filled hearts, code values)
--dolce-pink:     #efd4dd   (light pink — card backgrounds)
--bg:             #f6eee9   (warm peachy page background)
--bg-warm:        #f0e4dc   (slightly darker warm bg)
--card:           #FFFFFF   (white cards)
--text-primary:   #2C2C2C
--text-secondary: #8A7E78
--text-light:     #B8ADA6
--border:         #EDE5DF
--danger:         #E87070   (red — delete, warnings)
--tag-bg:         #EDF2E4   (sage green pill bg)
--tag-text:       #6a823e
--code-bg:        #2A2F1E   (dark forest — code blocks)
--code-text:      #E8E8D8
--code-keyword:   #9c9f69   (willow — prefix in commands)
--code-value:     #e6b1c4   (blossoms — hex values in commands)
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
├── sw.js                   # Service worker
├── acnhex-market-design-spec.json  # Design system reference (JSON)
├── css/
│   └── styles.css          # ~4700 lines — ALL styles (no preprocessor)
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
│   │   └── helpers.js      # Common helper functions (isInLovedList, getCartTotal, etc.)
│   └── pages/
│       ├── catalog.js      # renderCatalog, renderItemCard, renderDailyPick, etc.
│       ├── detail.js       # renderDetail, orbit carousel, compare mode
│       ├── cart.js         # renderCart, renderPastOrders
│       ├── wishlist.js     # renderWishlist, renderWishlistDetail
│       ├── settings.js     # renderSettings
│       └── info.js         # renderInfo
├── data/
│   ├── catalog-index.json  # Master index: category list + flat item index (~26K items)
│   ├── villagers.json      # Villager data for reviews (name, photo, personality, catchphrase)
│   ├── review-templates.json # Review text templates per personality/subtype/star rating
│   └── categories/         # Per-category detail JSON files (variants, hex IDs, tags, etc.)
│       ├── furniture.json
│       ├── clothing.json
│       ├── headwear.json
│       ├── accessories.json
│       ├── bags.json
│       ├── shoes.json
│       ├── socks.json
│       ├── wallpaper.json
│       ├── flooring.json
│       ├── rugs.json
│       ├── wall-items.json
│       ├── art.json
│       ├── fossils.json
│       ├── fish.json
│       ├── insects.json
│       ├── sea-life.json
│       ├── music.json
│       ├── gyroids.json
│       ├── food.json
│       ├── fencing.json
│       ├── tools.json
│       ├── photos.json
│       ├── posters.json
│       ├── umbrellas.json
│       ├── wetsuits.json
│       └── other.json
├── icons/
│   └── icon.svg
└── tools/
    ├── preprocess.js       # Data preprocessing scripts
    └── preprocess.py
```

---

## 4. App Architecture

### Module System (ES Modules)
- `app.js` imports from `data.js`, `storage.js`, `reviews.js`, `ads.js`, `sounds.js`
- No bundler — browsers load modules natively via `<script type="module">`

### State Management
A single `state` object in `app.js` holds all app state:
```js
const state = {
  page: 'catalog',           // 'catalog' | 'detail' | 'cart' | 'wishlist' | 'settings' | 'info'
  cart: [],                   // Array of {id, name, variant, variantIdx, hex, img}
  wishlists: {lists: [...]},  // Multi-list wishlist system
  viewingListId: null,        // Currently open list detail
  wishlistToast: null,        // Active wishlist toast
  listPickerItem: null,       // Item for list picker modal
  setPickerItems: null,       // Items array for set picker modal
  setPickerName: null,        // Set name for set picker modal
  prefix: '!',               // Bot command prefix
  seenIntro: false,           // First-time modal dismissed
  loadMode: 'batch',          // 'batch' | 'scroll'
  activeCategory: 'All',      // Current category filter
  selectedItemId: null,        // Detail page item
  selectedVariantIdx: 0,       // Detail page variant
  itemDetail: null,            // Full item detail data
  searchOpen: false,           // Search overlay visibility
  searchQuery: '',             // Current search text
  searchResults: null,         // Search result set
  searchFilterTags: [],        // Active filter tags
  searchFilterOpen: false,     // Filter panel open
  loadedCount: 0,              // Items loaded so far
  isRandom: false,             // Random picks mode active
  randomItems: [],             // Random items array
  randomUsedIndices: Set,      // Track used random indices
  expandedItems: null,         // Expanded (one-per-variant) items
  expandedTotal: 0,            // Total expanded items count
  expandedLoading: false,      // Loading state for expanded items
  scrollY: 0,                  // Saved scroll position
  previousPage: null,          // For back navigation
  savedSearch: null,           // Saved search state for back-from-detail
  catScrollLeft: 0,            // Category carousel scroll position
  similarScrollLeft: 0,        // Similar items carousel scroll position
  detailHistory: [],           // Stack for navigating between detail pages (similar items)
  soundEnabled: false,         // Sound effects toggle
  soundVolume: 0.5,            // Volume level (0-1)
  adsEnabled: false,           // Master ad toggle (defaults OFF)
  adsBanners: false,           // Banner ads toggle
  adsInterstitials: false,     // Full-page interstitial ads toggle
  adsPopups: false,            // Popup overlay ads toggle
  adsFloatingNotifs: false,    // Floating notification ads toggle
  // Detail page V2
  detailsExpanded: false,      // Collapsible details section expanded
  variantDrawerOpen: false,    // Variant drawer open (unused)
  _savedDetailState: null,     // Saved detail state for tab switching
  // Import/Export modals
  showExportModal: false,      // Export modal visible
  showImportModal: false,      // Import modal visible
  seenExportInfo: false,       // Export info tooltip dismissed
  // Emoji picker
  emojiPickerFor: null,        // List ID for emoji picker modal
  // Compare variants mode
  compareMode: false,          // Compare tray visible
  compareVariants: [],         // Array of variant indices selected for comparison (max 5)
};
```

### Rendering Pattern
- **Full page re-render:** `render()` rebuilds `app.innerHTML` with the correct page + nav + overlays
- **Surgical updates:** Some operations avoid full re-render:
  - `updateDetailVariant()` — variant pill change on detail page
  - `toggleWishlist()` in search — updates heart SVGs in-place
  - `addToCart()` in search — updates badge count only
  - `runSearch()` — replaces only `#search-results` innerHTML
- **Event delegation:** `attachEvents()` is called after every render, binds via `querySelectorAll`

### Navigation
- **SPA routing** via `state.page` — no URL changes, no history API
- **Bottom nav bar:** 5 tabs — Browse, Wishlist, Cart, Settings, Info
- **Detail page back:** Supports history stack for similar-item drill-down, and restoring search state

---

## 5. Feature Inventory

### 5a. Browse / Catalog (Home Page)
- **Hero banner:** Dark green receipt-style banner with animated line items showing example hex IDs and bot commands. "NOOK INC. CERTIFIED" badge. Tagline: "Browse. Pick. Order instantly."
- **Search bar:** Fake search input in hero area + filter button — opens full-screen search overlay
- **Category carousel:** 26 categories in horizontal scroll with emoji icons (52×52 rounded squares). Left/right arrow buttons. Active category has green bg with shadow.
- **Categories:** All, Furniture, Clothing, Headwear, Accessories, Bags, Shoes, Socks, Wallpaper, Flooring, Rugs, Wall Items, Art, Fossils, Fish, Insects, Sea Life, Music, Gyroids, Food, Fencing, Tools, Photos, Posters, Umbrellas, Wetsuits, Other
- **Item grid:** 2-column responsive grid (`minmax(155px, 1fr)`). Each card shows:
  - Pastel thumbnail bg (rotating 4 colors), item image
  - Heart button (top-right, glass-morphism)
  - Item name, variant name, hex badge (green pill)
  - "Add" button (green, full-width)
- **Random Picks:** Default homepage shows shuffled items from all categories
- **Load modes:** "Item Batches" (load 50 at a time with button) or "Continuous Scroll" (infinite scroll via IntersectionObserver)
- **Pull-to-refresh:** Mobile touch gesture refreshes with new random items + plays melody sound
- **Inline ads:** Banner ads inserted every N items, interstitial ads inserted after item 17 (30% chance)

### 5b. Search Overlay
- Full-screen white overlay with search input + filter toggle + close button
- **Real-time search** with 300ms debounce against expanded variant index
- **Filter panel** with tag groups:
  - Color 1 (Primary): 14 colors
  - Color 2 (Secondary): 14 colors
  - Styles: active, cool, cute, elegant, gorgeous, simple
  - Catalog: for sale, not for sale, not in catalog
  - Other: various tags
- Active filter pills shown below search bar, removable individually
- Results show same item cards as catalog grid
- Infinite scroll within search results
- **Preserved state:** When navigating to detail from search, search state is saved and restored on back

### 5c. Item Detail Page
- **Hero with Orbit Carousel:** 500px min-height colored bg containing the orbit carousel
  - Larger hero area with integrated variant selection
  - Glass buttons: Back (chevron, top-left) and heart (top-right) — frosted glass style
- **Variant Orbit Carousel:** 3D-style circular carousel replacing the old horizontal pill buttons
  - **For < 15 variants:** Circular orbit with ALL variants rendered
    - Items positioned in 3D space with perspective
    - Active item centered and largest, others scaled down
    - Dot indicators below carousel
    - Swipe gesture support on mobile
  - **For 15+ variants:** Windowed approach with 5 visible items
    - Progress bar instead of dots (shows "X / Total")
    - Items rebuilt on navigation for performance
  - **Heart dots:** Small heart indicator on each wishlisted variant's orbit item
  - **Chevron buttons:** Left/right navigation on desktop
  - **Hint text:** "← swipe to rotate →" on mobile
- **Title + rating:** Item name (heading-lg) + star rating from generated reviews
- **Tag pills:** Up to 8 tags in green pill badges
- **Set Card:** If item belongs to an HHA Set, shows a card with:
  - Set name and "Part of a set" subtitle
  - **Add Set to Cart** button: Adds all items in the set with sequential fly animations (100ms stagger)
  - **Add Set to List** button: Opens set picker modal to choose a list
- **Details card:** White rounded card with collapsible field rows:
  - Primary fields always shown: Hex ID, Size, Catalog, HHA Set
  - Secondary fields collapsed: HHA Concepts, HHA Series, Styles, Colors, DIY
  - "Show all details" toggle button with hint showing field count
- **Villager Reviews:** Auto-generated using real villager data:
  - Summary with average rating, star distribution bar chart
  - Individual reviews with villager photo, name, stars, date, text
  - Templates vary by personality, subtype, and star rating
  - Grammar engine handles plural item names
- **Similar Items carousel:** Horizontal scroll of related items below reviews:
  - Matching logic: SET (same HHA Set/Series) > STYLE (shared style tag) > COLOR (shared colors)
  - Cards: 140px wide, pastel bg, match badge (SET/STYLE/COLOR), heart button, name, variant, hex
  - Desktop arrow buttons, scroll-snap
  - Cached per item to prevent reshuffle on re-render
- **Sticky CTA bar:** Fixed bottom gradient with:
  - "Add to List" secondary button (opens list picker modal)
  - Quantity control (−/0/+) + "Add to Cart" green gradient button
- **Compare Variants Mode:** For items with 3+ variants, a "Compare" button opens a comparison tray:
  - Fixed bottom tray showing 2-5 selected variants side by side
  - Each variant shows: thumbnail, name, color1/color2, hex code
  - Individual "Add to Cart" and "Add to List" buttons per variant
  - "Clear" button to reset comparison selection
  - Tap orbit variants to add/remove from comparison (max 5)
  - Compare button only visible for items with 3+ variants
- **Detail history stack:** Clicking similar items pushes current item to stack, back button pops

### 5d. Cart (Order Ledger)
- **Header:** Dark green gradient with "Order Ledger / Your Cart", count/40, clear button, progress bar
- **Empty state:** Animated leaves, cart emoji, random Nook Inc. quote, "Start Shopping" button
- **Ledger rows:** Numbered (01, 02...), thumbnail, name, variant · hex pill, duplicate (+) button, remove (✕) button
  - Remove has slide-out animation
  - Duplicate has pop animation
- **Tear line:** Dashed "✂ tear here" separator
- **Shipping label (Bot Command):** Receipt-style label with:
  - Tape strips (top/bottom)
  - Barcode visualization
  - "Ship to: Discord"
  - Item manifest (dots, names, hex codes)
  - Full bot command: `{prefix}order hex1, hex2, hex3...`
  - "QTY: N" + "📋 tap to copy" hint
  - Copy overlay: "📦 Copied!" stamp animation
- **Cart limit:** 40 items max (matching Discord bot limits)
- **Flying animation:** When adding to cart from browse/detail, item image flies to cart nav icon

### 5e. Wishlist (Multi-List System)
- **List overview:** Shows all lists with name, item count, thumbnail
  - Default list: "Loved Items" (💚 icon, undeletable)
  - Custom lists: deletable, capped at 40 items each
  - **Custom emoji:** Each list can have a custom emoji icon (edit button on list card)
- **Create new list:** Inline input field (replaced prompt() for mobile-friendliness)
- **List detail view:** Back button, list name, item count, action buttons
  - Items shown with thumbnail, name, variant · hex, add-to-cart (+) button, remove (🗑) button
  - **"Copy Order"** generates bot command from all list items
  - **"Add All to Cart"** adds all list items to cart (with fly animations)
  - **Export button:** Opens export modal with hex codes
  - **Import button:** Opens import modal to add items by hex codes
- **Export Modal:** Sheet-style modal showing:
  - List name and item count
  - All hex codes in a copyable text area
  - "Copy Hex Codes" button
  - Info tooltip on first use explaining the feature
- **Import Modal:** Sheet-style modal with:
  - Text area to paste hex codes (space, comma, or newline separated)
  - Shows count of valid/invalid hex codes parsed
  - Adds matched items to current list
- **Emoji Picker Modal:** Grid of 100+ emojis organized by category:
  - Objects, Home, Nature, Animals, Food, Activities, Weather, Symbols
  - Click to set as list icon
- **Set Picker Modal:** For adding entire HHA sets to a list:
  - Shows set name and item count
  - List all wishlists with checkmark buttons
  - "+ New List" inline form option
- **Heart toggle behavior:**
  - Tapping heart on any item → adds to "Loved Items" (or removes if already in any list)
  - "Add to List" button on detail page → opens list picker modal (excludes Loved Items option)
- **List picker modal:** Scrollable list of all wishlists (max-height: 50vh), "+ New List" button, "Done" button
- **Wishlist toast:** "Saved to [list name]" + "Change" button (appears after heart toggle)

### 5f. Settings
- **Bot Command Prefix:** Text input + 5 preset buttons (!, ., $, ?, /)
- **Preview:** Live code block showing `{prefix}order 0x0A3F 0x1B2C`
- **Item Loading:** Toggle between "Item Batches" and "Continuous Scroll"
- **Nook Inc. Sound Package:**
  - Toggle switch for sound effects
  - Volume slider (0-100%, 5% increments) — disabled when sound is off
- **🦝 Fake Promos:** Ad preference system with cascading toggles:
  - Master toggle: "Enable Fake Ads" (controls all sub-toggles)
  - 🖼️ Banner Ads toggle
  - 📺 Full-page Interstitials toggle
  - 💬 Popup Overlays toggle
  - 🔔 Floating Notifications toggle
  - All default to OFF — sub-toggles disabled when master is off
- **Danger Zone:** "Clear All Data" button (with confirmation)

### 5g. Info / Credits
- **ACNH Spreadsheet:** Primary credit card with green border and "View Spreadsheet" link
- **Version Info:** "2.0.8 update" of ACNH
- **Install instructions:** iOS (Safari → Share → Add to Home) and Android (Chrome → menu → Install)
- **App footer:** Leaf emoji, "ACNHEX Market", version 1.0.0

### 5h. Sound Effects (NookSounds)
Web Audio API synthesized sounds — no audio files. All sounds use sine oscillators with lowpass filters and gentle envelopes. Opt-in via Settings toggle. Respects `prefers-reduced-motion`.

| Sound | Trigger |
|-------|---------|
| `addToCart` | Item added to cart |
| `duplicate` | Cart item duplicated |
| `removeItem` | Cart item removed |
| `clearCart` | Cart cleared |
| `cartFull` | Cart at 40 limit |
| `heartAdd` | Item wishlisted |
| `heartRemove` | Item un-wishlisted |
| `newList` | New wishlist created |
| `deleteList` | Wishlist deleted |
| `pullRefresh` | Pull-to-refresh triggered |
| `categoryTap` | Category changed |
| `loadMore` | More items loaded |
| `variantSwitch` | Variant changed |
| `copyCommand` | Command copied |
| `prefixChange` | Prefix changed |
| `toggleSound` | Sound toggled on |
| `interstitial` | Interstitial ad appears (ascending scale 262-523 Hz) |
| `notification` | Floating notification appears |
| `dismissAd` | Ad dismissed (whoosh downward 800→400 Hz) |
| `adToast` | Ad toast shown (ascending chord 392→784 Hz) |

### 5i. Fake Ad System (In-Universe)
All ads are themed around Animal Crossing NPCs. **Nothing is real** — clicking any ad shows a "This is a fake ad" toast.

**Defaults & Preferences:**
- All fake ads are **OFF by default** — users opt-in via Settings
- Each ad type has its own toggle (banners, interstitials, popups, floating notifications)
- **Cookie consent modal is exempt** — always shows on first visit regardless of ad preferences or cooldowns

**Ad types:**
1. **Inline banner ads:** 22 unique designs inserted in the item grid every N items:
   - Redd's Art Emporium (scam popup style)
   - Sahara's Rug Warehouse (mystery box)
   - CJ's Fish Prints (app store listing)
   - Kicks' Shoe Boutique (product card)
   - Gracie Grace (luxury brand)
   - Brewster's Roost (minimalist menu)
   - Leif's Garden Shop (seasonal sale with progress bar)
   - Wisp's Spirit Shop (choice card)
   - Daisy Mae's Turnip Co. (stock ticker)
   - Blathers' Museum (exhibit card)
   - Pascal's Pearl Wisdom (fortune cookie)
   - Label's Fashion Check (scorecard)
   - Katrina's Fortune Shop (mystic)
   - Flick's Bug Commissions (artist portfolio)
   - Celeste's Star Exchange (event flyer)
   - Gullivarrr's Pirate Treasures (treasure map)
   - Harriet's Shampoodle Salon (salon booking)
   - K.K. Slider Concert (ticket)
   - Tortimer's Island Tours (retro postcard)
   - Able Sisters (coupon with tear line)
   - Resetti's Save Insurance (system alert)
   - Rover's Travel Bureau (booking)

2. **Interstitial ads:** Full-width cards inserted after item 17 (30% chance on initial load)

3. **Popup ads:** Modal overlays triggered by events:
   - Cookie consent popup (on init, after 2s delay)
   - "Nook Inc. Premium" upsell (on first cart add)
   - "1000th Visitor" prize (after 5+ page navigations)
   - Turnip Ticker (after 3+ items viewed)
   - HHP/Lottie design service (after 2 min browse time)

4. **Floating notifications:** iOS-style notification banners at top of screen:
   - NookLink updates, HHP promotions, Flash Sales, K.K. Concert alerts, Celeste Meteor Showers, Turnip Alerts
   - Auto-dismiss after 8s, swipeable on mobile
   - Scheduled at random 90-120s intervals after dismissal

5. **Ad toast:** Bottom banner "🦝 This is a fake Nook Inc. ad!" shown when clicking any ad element

### 5j. Loading Screen
Animated entry with:
- Floating leaf particles
- Glowing leaf emoji
- "ACNHEX Market" title + "Nook Inc. Official" subtitle
- Progress bar with rotating messages ("Checking Nook's inventory...", "Shaking trees for items...", etc.)
- Torn receipt edge bottom with "Nook Inc. Certified"
- Version number (v2.0.8)
- Fade-out transition when app is ready

### 5k. First-Time Modal
On first visit:
- Prefix configuration (input + preset buttons + live preview)
- Load mode selection (Item Batches vs Continuous Scroll)
- "Let's go! 🛒" confirmation button
- State saved to localStorage via `storage.js`

---

## 6. Data Model

### Catalog Index Item (catalog-index.json)
```js
{
  id: "item_001",         // Unique item ID
  n: "antique chair",     // Display name
  v1: "Brown",            // Default variant name
  hex: "000000000000F6E", // Default hex code
  img: "https://...",     // Image URL
  c: "Furniture",         // Category
  t: "brown|white|elegant|for sale"  // Pipe-separated tags
}
```

### Full Item Detail (categories/*.json)
```js
{
  id: "item_001",
  name: "antique chair",
  category: "Furniture",
  hexBase: "F6E",
  image: "https://...",
  size: "1x1",
  catalog: "For sale",
  diy: "No",
  hhaConcept1: "living room",
  hhaConcept2: "study",
  hhaSeries: "antique",
  hhaSet: "None",
  tags: ["brown", "white", "elegant", "for sale"],
  variants: [
    {
      name: "Brown",
      hex: "F6E",
      hexVariated: "000000000000F6E",
      image: "https://...",
      color1: "Brown",
      color2: "White"
    },
    // ... more variants
  ]
}
```

### Expanded Item (for search/browse — one entry per variant)
```js
{
  id: "item_001",
  variantIdx: 0,
  n: "antique chair",
  v1: "Brown",
  hex: "000000000000F6E",
  img: "https://...",
  c: "Furniture",
  t: "elegant|for sale|brown|white",  // Tags without parent color duplication
  c1: "brown",      // color1 lowercase
  c2: "white"       // color2 lowercase
}
```

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

### Hex Lookup
The `data.js` module provides hex-based item lookup for the import feature:
- `lookupByHex(hex)` — Returns `{id, variantIdx}` for a given hex code
- Builds a lazy-initialized Map from expanded items for O(1) lookup
- Supports uppercase/lowercase hex input

---

## 7. Key UI Patterns & Components

### Card Component (Item Card)
```
┌─────────────────────┐
│  [pastel bg area]   │  ← 140px height, rotating bg colors
│     [item image]    │
│            [♡]      │  ← heart button, glass-morphism, 32×32
├─────────────────────┤
│  item name          │  ← 12px bold
│  variant · [HEX]    │  ← 10px muted + green pill
│  [ + Add          ] │  ← full-width green button
└─────────────────────┘
  22px border-radius, white bg, subtle shadow
```

### Variant Orbit Carousel
CSS classes for the 3D orbit variant selector:
- `.variant-orbit-container` — Outer wrapper, relative positioning
- `.variant-orbit-container--instant` — Disables transitions for 15+ variants
- `.variant-orbit-track` — Container for orbit items (240px height)
- `.variant-orbit-track--circular` — Taller track (290px) for circular orbit mode
- `.variant-orbit-item` — Individual variant thumbnail (absolute positioned)
- `.variant-orbit-item--active` — Currently selected variant (centered, largest)
- `.variant-orbit-label` — Variant name label (only shown on active item)
- `.variant-orbit-heart-dot` — Heart indicator for wishlisted variants
- `.variant-orbit-chevron` — Navigation arrows (left/right)
- `.variant-orbit-dots` — Dot indicator container (< 15 variants)
- `.variant-orbit-dot--active` — Active dot (wider, green)
- `.variant-orbit-progress` — Progress bar container (15+ variants)
- `.variant-orbit-progress-fill` — Animated fill bar
- `.variant-orbit-hint` — "← swipe to rotate →" hint text

### Set Action Card
CSS for the HHA Set add-to-cart/list card:
- `.detail-set-card` — White card with set info and action buttons
- `.detail-set-icon` — Emoji icon (🪴)
- `.detail-set-info` — Set name and subtitle
- `.detail-set-actions` — Button container (flex row)
- `.detail-set-action-btn` — Individual action button (cart/list icons)
- `.detail-set-action-btn--loading` — Loading state (opacity)
- `.detail-set-action-btn--added` — Success state (green glow + scale)

### Detail Page Layout
```
┌─────────────────────────────────┐
│  [< back]                  [♡]  │  ← glass buttons on hero
│         ┌─────────────┐         │
│    ◄   │   [active]   │    ►   │  ← orbit carousel with chevrons
│      ○  │  [img 160px] │  ○     │     (500px hero with 36px bottom radius)
│     ○   └─────────────┘   ○    │
│           ● ○ ○ ○ ○ ○           │  ← dot indicators (< 15 variants)
│         ← swipe to rotate →     │     or progress bar (15+ variants)
├─────────────────────────────────┤
│  Item Name              ⭐ 4.2  │
│  [tag] [tag] [tag]              │  ← green pills (up to 8)
│  ┌─ SET CARD ───────────────┐   │  ← only if item has HHA Set
│  │ 🪴 ruined series         │   │
│  │    Part of a set  [🛒][♡]│   │  ← Add Set buttons
│  └──────────────────────────┘   │
│  ┌─ DETAILS ────────────────┐   │
│  │ Hex ID          36C2     │   │
│  │ Size             3x1     │   │
│  │ [▼ Show all details (3)] │   │  ← collapsible
│  └──────────────────────────┘   │
│  ┌─ VILLAGER REVIEWS ───────┐   │
│  │ 4.2 ★★★★☆  19 reviews   │   │
│  │ [bar chart]               │   │
│  │ [review cards...]         │   │
│  └──────────────────────────┘   │
│  🍃 SIMILAR ITEMS   [badge]     │
│  [card] [card] [card] ►         │  ← horizontal scroll
│                                  │
│  ┌─────────────────────────┐    │  ← sticky, fixed bottom
│  │ [📋 Add to List]        │    │
│  │ [−][0][+] [🛒 Add Cart] │    │
│  └─────────────────────────┘    │
├──── bottom nav ─────────────────┤
```

### Cart (Order Ledger) Layout
```
┌─ dark green header ─────────────┐
│ ORDER LEDGER        3/40 [Clear]│
│ Your Cart                       │
│ ▓▓▓░░░░░░░░░ 3 items  37 open  │
├─────────────────────────────────┤
│ 01 [thumb] item name    [+] [✕]│
│ 02 [thumb] item name    [+] [✕]│
│ 03 [thumb] item name    [+] [✕]│
│ - - - ✂ tear here - - - - - - -│
│ BOT COMMAND              3 items│
│ ┌──[tape]──────────────────┐    │
│ │ ||||||||||||| (barcode)  │    │
│ │ SHIP TO: Discord         │    │
│ │ • item1         36C2     │    │
│ │ • item2         3195     │    │
│ │ !order hex1, hex2, hex3  │    │
│ │ QTY: 3    📋 tap to copy │    │
│ └──[tape]──────────────────┘    │
│ ✦ NOOK INC. CERTIFIED ✦        │
└─────────────────────────────────┘
```

### Bottom Navigation
```
┌─────────────────────────────┐
│  🏠      ♡      🛒³     ⚙      ⓘ  │
│ Browse  Wish   Cart  Settings Info │
└─────────────────────────────────────┘
Active = sage green bg pill (#EDF2E4), green icon
Inactive = light gray (#B8ADA6)
Cart badge = green circle with white count
```

### Sheet Modals
iOS-style bottom sheet modals used for:
- **Export Modal:** Shows hex codes for a list with copy button
- **Import Modal:** Text area to paste hex codes, shows valid/invalid counts
- **Emoji Picker:** Grid of emojis for list customization
- **Set Picker:** List selector for adding entire sets

CSS classes:
- `.sheet-overlay` — Dark backdrop
- `.sheet-modal` — White rounded card sliding from bottom
- `.sheet-handle` — Drag indicator bar at top
- `.sheet-title` — Modal title text

---

## 8. Animations & Interactions

| Animation | Description |
|-----------|-------------|
| `fadeSlideIn` | Cards/rows slide up and fade in |
| `page-enter` | Whole page slides up on navigation |
| `grid-enter` | Item grid fades in |
| `receiptLineIn` | Receipt items animate in sequentially (0.6s, 1.2s, 1.8s delays) |
| `slideOutRight` | Cart item slides right on remove |
| `dupPop` | Cart duplicate button pops with green glow |
| `.pop` on badge | Cart badge bounces on add |
| `.pulse` on heart | Heart button pulses on toggle |
| `cart-pulse` | Cart nav icon pulses after flying animation |
| Flying item | Image flies from card to cart icon (0.7s cubic-bezier) |
| Sequential fly | Set-to-cart adds items with 100ms stagger between each fly animation |
| Orbit spiral in | Orbit items spiral/fade in on detail page entrance |
| Orbit rotation | 3D perspective rotation when changing variants (circular mode) |
| `similarFadeUp` | Similar items section fades up with 0.15s delay |
| Pull-to-refresh | Touch drag shows indicator, releases to refresh |
| `notifSlideIn/Out` | Floating notifications slide from top |
| `promoToastSlide` | Ad toast slides up then fades out |
| Hover lifts | Cards translateY(-2px) on hover |
| Active press | Cards scale(0.98) on active |
| Set button states | Loading (opacity), added (green glow + scale) animations |

---

## 9. Responsive Breakpoints

| Breakpoint | Max-width | Changes |
|-----------|-----------|---------|
| Default | 600px | Base mobile layout |
| 768px+ | 720px | Nav/CTA max-width expands, desktop arrows appear on carousels, banner ads span 2×2 grid |
| 1024px+ | 900px | Container expands further |
| 1280px+ | 1080px | Widest container |

---

## 10. localStorage Keys

| Key | Default | Purpose |
|-----|---------|---------|
| `acnhex_cart` | `[]` | Cart items array |
| `acnhex_wishlists` | `null` (migrated) | Multi-list wishlist structure |
| `acnhex_prefix` | `'!'` | Bot command prefix |
| `acnhex_seen_intro` | `false` | First-time modal dismissed |
| `acnhex_load_mode` | `'batch'` | Item loading mode |
| `acnhex_sound_enabled` | `'false'` | Sound effects toggle |
| `acnhex_sound_volume` | `0.5` | Sound volume level (0-1) |
| `acnhex_ads_enabled` | `'false'` | Master fake ads toggle |
| `acnhex_ads_banners` | `'false'` | Banner ads toggle |
| `acnhex_ads_interstitials` | `'false'` | Interstitial ads toggle |
| `acnhex_ads_popups` | `'false'` | Popup ads toggle |
| `acnhex_ads_floating` | `'false'` | Floating notification ads toggle |
| `acnhex_cookie_dismissed` | `false` | Cookie consent popup dismissed |
| `acnhex_seen_export_info` | `false` | Export info tooltip dismissed |
| `acnhex_wishlist` | (legacy) | Old flat wishlist (auto-migrated) |

---

## 11. Key Implementation Patterns

### HTML Generation
All HTML is generated via template literals in JS functions. No JSX, no templates. Pattern:
```js
function renderSomething() {
  return `<div class="something">
    ${items.map(item => `<div class="item">${esc(item.name)}</div>`).join('')}
  </div>`;
}
```

### XSS Safety
`esc()` function escapes HTML entities. Used everywhere user/data content is interpolated:
```js
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
```

### Event Binding
Events are rebound after every `render()` call via `attachEvents()`. Special care taken to:
- Skip search overlay elements (handled separately by `attachSearchResultEvents()`)
- Use `e.stopPropagation()` for nested clickables (heart inside card, etc.)
- Use `data-*` attributes for passing item IDs, variant indices, etc.

### Surgical DOM Updates
To avoid full re-renders that cause flicker/scroll-jump:
- `updateDetailVariant()` — Updates hero image, fields, CTA in-place
- `updateOrbitAndDetail()` — Repositions orbit items + updates detail fields + hero bg
- `positionOrbitItems(idx)` — Calculates 3D positions for orbit carousel items
- `refreshOrbitHeartDots()` — Updates heart indicators on orbit items after wishlist changes
- Search overlay hearts toggled via `querySelectorAll` + innerHTML swap
- Cart badge count updated directly when adding from search
- Search results replaced via `container.innerHTML` without touching search input

### Image Loading
- `loading="lazy"` on all images
- `onerror` fallback to 📦 emoji
- Background colors cycle through 4 pastel shades based on index

---

## 12. Development Notes

### Starting the App
```bash
# From the project root:
node C:/Users/Della/AppData/Roaming/npm/node_modules/http-server/bin/http-server . -p 8080 -c-1
```
Or use the `.claude/launch.json` config with `preview_start`.

### No Build Step
Everything runs as-is. ES modules in the browser. CSS loaded directly. JSON fetched at runtime.

### Data Pipeline
Raw data from the ACNH spreadsheet → preprocessed by `tools/preprocess.py` or `tools/preprocess.js` → produces `catalog-index.json` + per-category JSON files in `data/categories/`.

### Version
- App version: 2.0.8 (shown in info page)
- Data version: ACNH 2.0.8 update (all items through final update)
- Cache-busting: `?v=2.0.8` on CSS and JS imports

---

## 13. Critical Rules for Mockups & Extensions

1. **FONT:** Always use `'Space Mono', monospace`. Never proportional fonts.
2. **FONT SIZES:** Use smaller sizes than you'd expect. Max heading: 26px. Body: 11-13px.
3. **COLORS:** Warm peachy bg (#f6eee9), forest green accent (#6a823e), palm leaf headings (#364023).
4. **CARDS:** 22px radius, white bg, subtle shadows. Always.
5. **BUTTONS:** Green gradient for primary CTA, green outline for secondary. 18px radius.
6. **CATEGORY ICONS:** 52×52 rounded squares (16px radius), NOT circles or pills.
7. **CODE BLOCKS:** Dark forest bg (#2A2F1E), willow green keywords, pink values.
8. **HEX BADGES:** Small green pills (tag-bg/tag-text), 9-10px font size.
9. **NO SEARCH BAR** in the main catalog view — only accessible via hero banner or filter button.
10. **ITEM IMAGES** always on pastel backgrounds, cycling through 4 colors.
11. **MONOSPACE AESTHETIC:** Lean into the technical/hex-editor vibe. Hex codes should feel prominent.
12. **BOTTOM NAV:** 5 tabs, fixed, white bg with blur, rounded top corners.
13. **MAX WIDTH:** 600px default, expands at breakpoints. Always centered.
