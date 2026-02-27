# ACNHEX Market — Claude Implementation Roadmap

> **THIS FILE IS LAW.** Claude must read this file at the start of every session and follow it exactly. Work through items **in order, one at a time.** Do NOT skip ahead. Do NOT mark an item complete — only the user can approve and pass an item after hands-on testing.

---

## Golden Rules

These rules override everything else. Violating any of them is a session-ending failure.

### 1. Context Compliance

- **Before writing ANY code**, re-read `ACNHEX-MARKET-BIBLE.md` and `acnh-market-context.md` in full.
- Every change must be consistent with the design system, color palette, typography, component patterns, and data model described in those files.
- If a task conflicts with the bible or context doc, **stop and ask the user** — do not silently override.
- After completing a task, re-read the section of the bible/context doc that relates to what you changed and verify nothing was violated.

### 2. Code Preservation

- **NEVER delete, rename, or gut an existing function** unless the task explicitly requires it.
- **NEVER remove a feature** to implement a new one. All existing functionality must survive every change.
- **NEVER replace a working file wholesale** — use surgical edits. Read the file first, then use the Edit tool with precise `old_string` / `new_string` replacements.
- Before editing any file, **read it first** so you know the current state. Do not assume you remember it from earlier in the session.
- If a function needs to change, preserve its signature and external behavior unless the task explicitly says otherwise.

### 3. Testing & Approval Protocol

- After implementing a task, **tell the user exactly what changed** (files modified, lines touched, behavior added).
- Tell the user **how to test it** — specific steps they can follow in the browser.
- **STOP and wait.** Do not start the next task.
- The user will test and respond with one of:
  - **"Pass"** — Move to the next item. You may mark it `[x]` in this file.
  - **"Fail"** or a bug report — Fix the bug. Do NOT move on. Re-present for testing.
- An item is only done when the user explicitly passes it. No exceptions.

### 4. Hosting Awareness

- This app is hosted on **GitHub Pages** (static files only, no server).
- All paths must be **relative** (e.g., `./data/catalog-index.json`, not `/data/catalog-index.json`).
- There is no server-side rendering, no redirects, no `.htaccess`. Routing must be client-side only (hash-based).
- Test that any path or fetch URL works when served from a subdirectory (GitHub Pages serves from `https://username.github.io/repo-name/`).
- The service worker scope and `start_url` in `manifest.json` must account for the GitHub Pages base path.

### 5. Commit Discipline

- Do NOT commit unless the user asks you to.
- When asked, commit only the files relevant to the current task with a clear message.

### 6. One Thing at a Time

- Implement exactly ONE checklist item per cycle.
- Do not bundle multiple items together "for efficiency."
- Do not refactor unrelated code while working on a task.
- If you discover a bug unrelated to the current task, note it to the user but do not fix it until it's your turn on the list.

---

## Roadmap

Items are ordered by priority: critical fixes first, then high-impact features, then polish.

---

### Phase 1 — Critical Fixes

These are bugs or broken behavior in the current production app. Fix them before adding anything new.

---

#### 1.1 Fix Service Worker Self-Sabotage

- [x] **Status: COMPLETE**

**Problem:** The `<script>` block in `index.html` unregisters ALL service workers and deletes ALL caches on every single page load, then re-registers. This means offline support never actually works — the cache is nuked before it can be used.

**What to do:**
- Remove the "nuke everything" registration pattern in `index.html`.
- Replace it with a standard SW registration that only registers (or updates) the worker — not unregister/delete on every load.
- The service worker (`sw.js`) itself is fine — its install/activate/fetch logic is correct. Only the registration code in `index.html` is broken.
- Make sure the SW registration path works on GitHub Pages (relative path: `'./sw.js'`).
- Verify `sw.js` caches `ASSETS` with paths that resolve correctly on GitHub Pages (all should start with `./`).
- Update `CACHE_NAME` in `sw.js` to match the current app version.

**Files to touch:** `index.html`, possibly `sw.js` (cache name + asset paths only).

**How user tests:**
1. Open the app in Chrome.
2. Open DevTools → Application → Service Workers. Confirm the SW is registered and active (not perpetually reinstalling).
3. Open Application → Cache Storage. Confirm caches exist and contain assets.
4. Go offline (DevTools → Network → Offline checkbox). Reload. The app should still load from cache.
5. Go back online. The app should work normally.

---

#### 1.2 Sync All Version Numbers

- [x] **Status: COMPLETE**

**Problem:** Version numbers are scattered and inconsistent:
- `index.html` loading screen: `v2.0.8`
- Info page in `app.js` (`renderInfo`): `Version 1.0.0`
- CSS cache-bust: `?v=34`
- JS cache-bust: `?v=31`
- SW registration: `?v=30`
- `CACHE_NAME` in `sw.js`: `acnhex-v29`

**What to do:**
- Define ONE canonical app version. Since the data covers ACNH update 2.0.8 and the loading screen already says `v2.0.8`, use **`2.0.8`** as the app version.
- Update the Info page `renderInfo()` to show `Version 2.0.8` instead of `Version 1.0.0`.
- Synchronize ALL cache-bust query strings to the same value (e.g., `?v=2.0.8` or a single incrementing number like `?v=35`).
- Update `CACHE_NAME` in `sw.js` to match (e.g., `acnhex-v2.0.8`).
- The loading screen already says `v2.0.8` — leave it as-is.

**Files to touch:** `index.html` (cache-bust params), `sw.js` (CACHE_NAME), `js/app.js` (renderInfo version string).

**How user tests:**
1. Check the loading screen — should say `v2.0.8`.
2. Navigate to Info page — should say `Version 2.0.8`.
3. View page source — CSS and JS imports should have the same `?v=` value.
4. Open DevTools → Application → Cache Storage — cache name should reflect the new version.

---

#### 1.3 Deduplicate the `esc()` Function

- [x] **Status: COMPLETE**

**Problem:** `esc()` is defined independently in both `app.js` (line ~222, DOM-based) and `reviews.js` (line ~126, regex-based). Two different implementations of the same utility is a maintenance hazard and subtle bug vector.

**What to do:**
- Add an `esc()` export to `storage.js` (or create a tiny `utils.js` module) — use the DOM-based version (it's more robust).
- Update `app.js` to import `esc` instead of defining it locally.
- Update `reviews.js` to import `esc` instead of defining it locally.
- If creating `utils.js`, add it to the `ASSETS` array in `sw.js` so it's cached.
- **Do not change any call sites** — only the definition location moves.

**Files to touch:** New `js/utils.js` (or `storage.js`), `js/app.js`, `js/reviews.js`, `sw.js` (if new file).

**How user tests:**
1. Browse the catalog — item names should render correctly (no HTML entities showing as raw text).
2. Open any item detail — villager reviews should render correctly with escaped text.
3. Search for an item with special characters (e.g., items with apostrophes like "mom's plushie") — should display properly everywhere.

---

### Phase 2 — High-Impact Features

These add significant value and fill the biggest gaps in the current app.

---

#### 2.1 Hash-Based URL Routing

- [x] **Status: COMPLETE**

**Problem:** The app has zero URL support. Everything is in-memory `state.page`. Users can't share links, use browser back/forward, or bookmark pages. Refreshing the page always goes back to the catalog.

**What to do:**
- Implement hash-based routing (e.g., `#/catalog`, `#/detail/ITEM_ID`, `#/cart`, `#/wishlist`, `#/wishlist/LIST_ID`, `#/settings`, `#/info`).
- On app load, read `window.location.hash` and navigate to the correct page.
- When `state.page` changes, update `window.location.hash` (without triggering a re-render loop).
- Listen to `hashchange` event for browser back/forward.
- The detail page route should include the item ID and optionally the variant index: `#/detail/ITEM_ID` or `#/detail/ITEM_ID/VARIANT_IDX`.
- Wishlist detail should route to `#/wishlist/LIST_ID`.
- **Preserve all existing navigation behavior** — back buttons, detail history stack, saved search state. The hash is an addition, not a replacement.
- Make sure relative paths for data fetches (`./data/...`) still work regardless of hash.
- Default hash (empty or `#/`) should go to catalog.

**Files to touch:** `js/app.js` (navigation logic, render function, init).

**How user tests:**
1. Open the app — URL should show `#/catalog` (or `#/`).
2. Tap an item — URL should update to `#/detail/ITEM_ID`.
3. Copy the URL, open in new tab — should land directly on that item's detail page.
4. Use browser back button — should go back to catalog (not leave the app).
5. Navigate to Cart, Wishlist, Settings, Info — URL should update for each.
6. Refresh on any page — should stay on that page.
7. Open a wishlist detail — URL should show `#/wishlist/LIST_ID`.
8. All existing nav behavior (back buttons, detail history, search state restore) still works.

---

#### 2.2 Dark Mode

- [x] **Status: COMPLETE**

**Problem:** No dark mode. The app only has the warm light theme.

**What to do:**
- Add a dark mode color palette as CSS custom property overrides inside a `[data-theme="dark"]` selector (or `@media (prefers-color-scheme: dark)` + manual toggle).
- Implement a manual toggle in Settings (between "Light", "Dark", and "System" / auto).
- Persist the user's theme choice in localStorage (`acnhex_theme`).
- Add the key to `storage.js` KEYS object.
- Dark palette should stay on-brand — use deep forest greens and warm dark tones, NOT pure black:
  - Page bg: `#1a1d14` (dark forest)
  - Card bg: `#252820` (dark sage)
  - Text primary: `#E8E8D8` (warm light)
  - Text secondary: `#9A9484`
  - Border: `#3A3D32`
  - Code bg: `#12140E` (deeper forest)
  - Tag bg: `#2A3320`
  - Keep accent colors (pines, blossoms, willow) mostly the same — they work on dark.
- The hero banner, bottom nav, modals, toasts, and all overlays must also adapt.
- Images with pastel backgrounds should retain their light bg (they're item thumbnails, not page chrome).
- Loading screen should also respect theme.
- Apply theme by setting `data-theme` attribute on `<html>` element.

**Files to touch:** `css/styles.css` (dark theme variables + any component overrides), `js/app.js` (settings toggle, init logic), `js/storage.js` (new key).

**How user tests:**
1. Go to Settings — see a theme toggle (Light / Dark / System).
2. Switch to Dark — entire app should switch to dark palette without flash.
3. Navigate every page (catalog, detail, cart, wishlist, settings, info) — all should look correct.
4. Item thumbnail backgrounds should still be pastel (not dark).
5. Code blocks should still be legible.
6. Refresh the page — theme should persist.
7. Set to "System", change OS dark mode setting — app should follow.
8. Loading screen should match the active theme.

---

#### 2.3 Recently Viewed Items

- [x] **Status: COMPLETE**

**Problem:** No way to get back to items you recently looked at without searching again.

**What to do:**
- Track the last 20 viewed items in localStorage (`acnhex_recent`).
- When user opens an item detail page, push `{ id, variantIdx, timestamp }` to the front of the recent list (deduplicating by id+variantIdx).
- Add a "Recently Viewed" horizontal scroll section on the catalog home page, below the hero banner and above the category carousel.
- Style it like the "Similar Items" carousel on the detail page — reuse the same card component.
- Add the key to `storage.js` KEYS object.
- If the recent list is empty (first visit), don't render the section at all.
- Limit stored entries to 20 to keep localStorage lean.

**Files to touch:** `js/storage.js` (new key + getter/setter), `js/app.js` (renderCatalog, loadItemDetail, new render function for recent section).

**How user tests:**
1. Fresh visit — no "Recently Viewed" section visible on home page.
2. Open 3 different item detail pages, then go back to catalog.
3. "Recently Viewed" section appears with those 3 items in reverse chronological order.
4. Tap a recently viewed item — goes to its detail page.
5. Refresh the page — recently viewed items persist.
6. View 25 items — only the most recent 20 should show.
7. View the same item twice — it should appear only once (most recent position).

---

#### 2.4 Multi-Order Splitting (40+ Items)

- [x] **Status: COMPLETE**

**Problem:** The cart hard-caps at 40 items. Users who want more need to manually manage multiple sessions. The 40-item limit is correct (Discord bot constraint), but the app should help users manage it.

**What to do:**
- Do NOT remove the 40-item cart limit. The cart still maxes at 40.
- Instead, add this to **wishlists**: when a wishlist has more than 40 items and the user taps "Copy Order" or "Add All to Cart", auto-split into multiple commands.
- In the wishlist detail view bot command section, if `entries.length > 40`:
  - Generate multiple `{prefix}order` commands, chunked at 40 items each.
  - Label them clearly: "Order 1 of N", "Order 2 of N", etc.
  - Each chunk has its own copy button.
  - Show a note: "Split into N orders (40-item bot limit per order)."
- The "Add All to Cart" button should add only the first 40 and show a toast: "Added 40/X items. Add remaining from the list after ordering."

**Files to touch:** `js/app.js` (renderWishlistDetail, cart-adding logic).

**How user tests:**
1. Create a wishlist with 50+ items (or import hex codes for 50+).
2. View the list detail — bot command section should show 2 commands: "Order 1 of 2" (40 items) and "Order 2 of 2" (remaining).
3. Copy each command individually — clipboard should have the correct hex codes for that chunk.
4. "Add All to Cart" should add 40, show a toast about the remaining items.
5. Lists with <=40 items should behave exactly as before (single command, no split label).

---

#### 2.5 Cart History / Past Orders

- [x] **Status: COMPLETE**

**Problem:** Once the cart is cleared, it's gone forever. Frequent users lose track of past orders.

**What to do:**
- When the user clears the cart (via the "Clear" button), save a snapshot to localStorage before clearing: `{ items: [...cart], timestamp: Date.now(), command: "..." }`.
- Store in `acnhex_order_history` as an array. Keep the last 10 orders max.
- Add a "Past Orders" section to the Cart page — shown below the bot command area (or below the empty state).
- Each past order shows: date/time, item count, truncated command preview, "Copy" button, and "Reload" button.
- "Reload" repopulates the current cart with those items (replacing current cart, with confirmation if cart is non-empty).
- Add the key to `storage.js` KEYS object and to `clearAll()`.

**Files to touch:** `js/storage.js` (new key), `js/app.js` (renderCart, clear cart handler).

**How user tests:**
1. Add some items to cart. Clear the cart.
2. "Past Orders" section should appear showing the order you just cleared.
3. Copy the past order's command — should match what was in the cart.
4. Click "Reload" on a past order — cart should repopulate with those items.
5. Clear and create multiple different orders — should see up to 10 in history.
6. Refresh the page — past orders persist.

---

### Phase 3 — Quality of Life

These improve usability but aren't critical.

---

#### 3.1 Keyboard Shortcuts

- [x] **Status: COMPLETE**

**What to do:**
- Add a global `keydown` listener for keyboard shortcuts:
  - `/` or `Ctrl+K` → Open search (focus the search input).
  - `Escape` → Close whatever is open (search, modals, drawers, variant drawer, sheet modals) in order of priority.
  - `1`–`5` → Switch to nav tabs (1=Browse, 2=Wishlist, 3=Cart, 4=Settings, 5=Info) — only when no input is focused.
  - `←` / `→` → Previous/next variant on detail page.
- Do NOT trigger shortcuts when user is typing in an input/textarea.
- Add a small "Keyboard Shortcuts" info card to the Settings page listing the bindings.

**Files to touch:** `js/app.js` (global keydown handler, settings render).

**How user tests:**
1. Press `/` on catalog page — search should open and focus.
2. Press `Escape` — search should close.
3. Press `3` — should navigate to Cart.
4. Open a detail page for an item with multiple variants. Press `→` — should go to next variant. `←` — previous.
5. Click into the prefix input field. Press `1` — should type "1" in the input, NOT navigate to Browse.
6. Settings page should show the shortcut list.

---

#### 3.2 Offline Indicator

- [x] **Status: COMPLETE**

**What to do:**
- Listen to `online` and `offline` window events.
- When offline, show a subtle fixed banner at the top of the page: "📡 You're offline — browsing cached data" in a warm amber/yellow tone.
- When back online, show "✅ Back online" briefly (2 seconds), then dismiss.
- The banner should not overlap with the loading screen or modals.
- Style it consistently with the app's design system.

**Files to touch:** `js/app.js` (event listeners, banner render), `css/styles.css` (banner styles).

**How user tests:**
1. Go offline (browser DevTools → Network → Offline).
2. A banner should appear at top: "You're offline."
3. Navigate around the app — banner stays visible.
4. Go back online — banner changes to "Back online" then disappears after 2 seconds.
5. The banner should not push content down in a jarring way (use fixed/absolute positioning).

---

#### 3.3 Collection Tracker

- [x] **Status: COMPLETE**

**What to do:**
- On the Wishlist overview page, add a "Collection Progress" summary card at the top.
- Show overall progress: "X / TOTAL items wishlisted across all lists" with a progress bar.
- Below that, show per-category mini bars: "Furniture: 12/189 (6%)", etc.
- Pull total counts from `data.getCategories()` (each category object has a count) and cross-reference with all wishlisted item IDs.
- Make the progress card collapsible (default collapsed) so it doesn't dominate the page.
- Style with the app's green progress bar gradient.

**Files to touch:** `js/app.js` (renderWishlist), `css/styles.css` (progress card styles).

**How user tests:**
1. Open the Wishlist page — see a "Collection Progress" card (collapsed by default).
2. Expand it — see overall progress and per-category bars.
3. Add a few items to wishlists from different categories, return to Wishlist page — numbers should update.
4. The bars should visually fill proportionally.
5. Categories with 0 wishlisted items should show 0% / empty bar (not be hidden).

---

### Phase 4 — Polish & Delight

Lower priority, but adds charm and completeness.

---

#### 4.1 Daily Featured Item ("Nook's Pick")

- [x] **Status: COMPLETE**

**What to do:**
- On the catalog home page, add a "Nook's Daily Pick" card above the category carousel.
- Use the current date as a deterministic seed (e.g., hash the date string, mod by total item count) so all users see the same item on the same day, and it changes daily.
- Show the item's image, name, variant, and a fun tagline (rotate through a list of ~10 quips like "Tom Nook's pick of the day!" or "Isabelle recommends this one!").
- Tapping the card opens the item detail page.
- Style it as a compact featured card — not as big as the hero banner. Use a subtle highlight border or background to distinguish it.

**Files to touch:** `js/app.js` (renderCatalog, seed logic), `css/styles.css` (featured card styles).

**How user tests:**
1. Open the app — see a "Nook's Daily Pick" card on the home page.
2. Tap it — goes to the item's detail page.
3. Refresh the page — same item appears (deterministic for today).
4. Change the system date to tomorrow (or wait a day) — a different item should appear.

---

#### 4.2 Export Wishlist as Shareable Image

- [ ] **Status: NOT STARTED**

**What to do:**
- In the wishlist detail view, add a "📸 Share as Image" button alongside the existing Export button.
- When tapped, use the Canvas API to generate a receipt-style PNG showing:
  - List name and emoji at the top
  - Item names and hex codes in a receipt format
  - "ACNHEX Market" branding at the bottom
  - The app's signature receipt/torn-edge aesthetic
- Trigger a download of the generated PNG (or use `navigator.share()` if available for mobile share sheets).
- Do NOT use any external libraries — Canvas API only.

**Files to touch:** `js/app.js` (wishlist detail render, image generation function), `css/styles.css` (button styles).

**How user tests:**
1. Open a wishlist with items.
2. Tap "Share as Image" — a PNG should download (or share sheet opens on mobile).
3. The image should show the list name, all items with hex codes, and app branding.
4. The image should be legible and styled like the app's receipt aesthetic.
5. An empty list should either disable the button or show a toast saying "Add items first."

---

#### 4.3 Compare Variants Mode

- [ ] **Status: NOT STARTED**

**What to do:**
- On the item detail page, for items with 3+ variants, add a "Compare" button near the variant drawer trigger.
- Tapping it opens a comparison overlay/modal showing 2-5 variant thumbnails side by side with their key attributes (name, color1, color2, hex) in a table.
- User can tap to add/remove variants from comparison (up to 5).
- Each compared variant has its own "Add to Cart" and "Add to Wishlist" button.
- This is especially useful for items with 30+ variants where the orbit carousel is hard to compare visually.

**Files to touch:** `js/app.js` (detail page render, comparison modal logic), `css/styles.css` (comparison modal styles).

**How user tests:**
1. Open an item with 5+ variants.
2. Tap "Compare" — comparison modal opens.
3. Select 2-3 variants — they appear side by side with details.
4. Add one to cart from the comparison view — cart updates correctly.
5. Close the modal — detail page is unchanged.
6. Items with 1-2 variants should not show the Compare button.

---

### Phase 5 — Code Health (Non-User-Facing)

These don't add visible features but prevent future bugs and make the codebase maintainable.

---

#### 5.1 Extract Render Functions from app.js

- [ ] **Status: NOT STARTED**

**Problem:** `app.js` is 4,300+ lines. It's hard to navigate and easy to introduce bugs.

**What to do:**
- Create new modules for the largest render functions:
  - `js/pages/catalog.js` — `renderCatalog`, `renderCatalogWithSearch`, `renderItemCard`, search helpers.
  - `js/pages/detail.js` — `renderDetail`, `renderSimilarItems`, `updateDetailVariant`, orbit logic.
  - `js/pages/cart.js` — `renderCart`, cart helpers.
  - `js/pages/wishlist.js` — `renderWishlist`, `renderWishlistDetail`, list helpers.
  - `js/pages/settings.js` — `renderSettings`.
  - `js/pages/info.js` — `renderInfo`.
- Each module exports its render function(s) and imports what it needs (`data`, `storage`, `ICONS`, `esc`, `state`).
- `app.js` imports from these modules and remains the orchestrator (state, routing, `render()`, `attachEvents()`).
- **This is a move-only refactor.** NO behavior changes. Every function must work identically.
- Add all new files to the `ASSETS` array in `sw.js`.

**Files to touch:** Create `js/pages/*.js`, modify `js/app.js`, modify `sw.js`.

**How user tests:**
1. Every single page and feature must work identically to before.
2. Open DevTools console — no import errors.
3. Go offline — all new module files should be cached and loadable.
4. This is a pure refactor — the user test is "nothing changed visually or behaviorally."

---

#### 5.2 Reduce Inline Styles

- [ ] **Status: NOT STARTED**

**Problem:** Many render functions use massive `style="..."` attributes (100+ characters) instead of CSS classes. This makes the UI hard to maintain and theme (especially now with dark mode).

**What to do:**
- Audit all render functions for inline styles.
- Create semantic CSS classes for repeated patterns (e.g., `.flex-row`, `.flex-col`, `.gap-sm`, `.wishlist-header-layout`, `.detail-title-section`, etc.).
- Replace inline styles with the new classes.
- **Do NOT change any visual output.** The app must look pixel-identical before and after.
- Focus on the worst offenders first: `renderWishlist`, `renderWishlistDetail`, `renderInfo`, `renderSettings`.

**Files to touch:** `css/styles.css` (new utility/component classes), `js/app.js` and page modules (replace inline styles with class names).

**How user tests:**
1. Every page must look identical to before.
2. Dark mode (if implemented) should now correctly theme elements that were previously using inline color values.
3. No visual regressions on any page.

---

## Session Startup Checklist

At the start of every session, Claude must:

1. [ ] Read `CLAUDE-ROADMAP.md` (this file) to find the current task.
2. [ ] Read `ACNHEX-MARKET-BIBLE.md` for design system rules.
3. [ ] Read `acnh-market-context.md` for architecture context.
4. [ ] Identify the first unchecked `[ ]` item in the roadmap — that is the current task.
5. [ ] Read the relevant source files before making any edits.
6. [ ] Implement the task following all Golden Rules.
7. [ ] Present the changes and testing instructions to the user.
8. [ ] Wait for "Pass" before proceeding.

---

## Quick Reference

| What | Where |
|------|-------|
| Design system | `ACNHEX-MARKET-BIBLE.md` |
| Architecture & features | `acnh-market-context.md` |
| App entry point | `index.html` |
| Main app logic | `js/app.js` |
| Data loading | `js/data.js` |
| Persistence | `js/storage.js` |
| Sound effects | `js/sounds.js` |
| Villager reviews | `js/reviews.js` |
| Fake ads | `js/ads.js` |
| Service worker | `sw.js` |
| PWA manifest | `manifest.json` |
| All styles | `css/styles.css` |
| Item data | `data/catalog-index.json` + `data/categories/*.json` |
| Hosting | GitHub Pages (static, no server) |
