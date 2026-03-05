# ACNHEX Market — Professional Polish Roadmap

## 📋 HOW THIS WORKS
- Features are ordered **least to most destructive** (CSS-only tweaks first, then additive JS, then refactors)
- Each feature has a **CHECKLIST** for implementation and a **TEST PLAN** for verification
- Claude must **read all context files** before starting any session: `CLAUDE.md`, `js/app.js`, `js/storage.js`, `js/utils.js`, `js/shared/helpers.js`, `js/shared/icons.js`, `css/styles.css`, `index.html`, and the relevant page module(s) for the task
- Claude must **not continue** to the next feature until the user says **"pass"**
- Claude must verify **all unrelated features still work** after each change

---

## PHASE 1: CSS-ONLY CHANGES (Zero JS Risk)
*These touch only `css/styles.css`. No logic changes. No DOM changes. Impossible to break functionality.*

---

### 1.1 — Cart Progress Bar Animation ✅
**Risk: 🟢 None** — Pure CSS transition addition

#### CHECKLIST
- [x] Open `css/styles.css`
- [x] Find the progress bar fill class used in the cart header (`.cart-progress-fill` or similar)
- [x] Add `transition: width 300ms ease-out;` to the fill element
- [x] Verify no existing `transition` property is being overridden
- [x] Test in both light and dark mode

#### TEST PLAN
1. Go to Browse, add 1 item to cart → navigate to Cart
2. Tap the (+) duplicate button on that item
3. **PASS IF**: The green progress bar smoothly animates wider over ~300ms (not an instant jump)
4. Remove an item with (✕) → bar should smoothly shrink
5. Verify the bar still turns red/danger-colored near 35+ items (add items to test if feasible)

---

### 1.2 — Button State Feedback (`:active` Press States) ✅
**Risk: 🟢 None** — CSS pseudo-class additions only

#### CHECKLIST
- [x] Open `css/styles.css`
- [x] Add a global active state rule for all interactive elements:
  ```css
  .item-add-btn:active,
  .heart-btn:active,
  .cat-btn:active,
  .nav-tab:active,
  .cta-btn-secondary:active,
  .detail-add-cart-btn:active,
  .detail-hero-action-btn:active,
  .preset-btn:active,
  .glass-btn:active,
  .import-btn:active,
  .select-all-btn:active {
    transform: scale(0.97);
    opacity: 0.85;
  }
  ```
- [x] Add a brief transition to make the press smooth: `transition: transform 100ms ease, opacity 100ms ease;` on the base classes of those elements
- [x] Ensure no existing `transform` on these elements is being overridden in default state (check for hover/animation transforms)
- [x] Check that `.variant-orbit-chevron` buttons and `.cart-dup-btn`, `.cart-remove-btn` are also covered
- [x] Test: confirm dark mode doesn't break (opacity might look different)

#### TEST PLAN
1. Tap any "Add" button on the browse grid → **PASS IF**: button briefly shrinks to 97% scale and dims, then bounces back
2. Tap a heart button → same press feedback
3. Tap category pills → same
4. Tap nav bar tabs → same
5. Long-press any button → should stay pressed state while held
6. Verify NO existing animations are broken (fly animation, orbit rotation, etc.)

---

### 1.3 — Theme Toggle Smooth Transition ✅
**Risk: 🟢 None** — CSS transition on root properties

#### CHECKLIST
- [x] Open `css/styles.css`
- [x] Add to `body` (or `:root`):
  ```css
  body {
    transition: background-color 300ms ease, color 300ms ease;
  }
  ```
- [x] Add to `.bottom-nav`, `.card`, and any other major surface elements:
  ```css
  .bottom-nav, [class*="card"], .item-card, .settings-card, main {
    transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
  }
  ```
- [x] Do NOT add transition to elements that rely on instant color changes (e.g., toggle switches, progress bar fills)
- [x] Verify the loading screen is excluded (it has its own fade-out)

#### TEST PLAN
1. Go to Settings → Appearance → tap "Dark"
2. **PASS IF**: Background and card colors fade smoothly over ~300ms (not an instant hard swap)
3. Tap "Light" → smooth fade back
4. Tap "System" → should match OS preference with smooth transition
5. Verify the loading screen still works normally on full reload
6. Verify no flickering or double-transition on rapid theme toggling

---

### 1.4 — Category Carousel Gradient Fade Masks ✅
**Risk: 🟢 None** — CSS pseudo-elements on carousel container

#### CHECKLIST
- [x] Open `css/styles.css`
- [x] Find the category carousel scroll container (likely `.cat-carousel` or `.categories-scroll`)
- [x] Add `position: relative;` to the parent container if not already set
- [x] Add `::before` and `::after` pseudo-elements with horizontal gradient fades:
  ```css
  .cat-carousel-wrapper::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 24px;
    background: linear-gradient(to right, var(--bg), transparent);
    z-index: 2;
    pointer-events: none;
  }
  .cat-carousel-wrapper::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 24px;
    background: linear-gradient(to left, var(--bg), transparent);
    z-index: 2;
    pointer-events: none;
  }
  ```
- [x] Verify the arrows (< >) still appear and are clickable above the gradient
- [x] Test dark mode (gradient should use dark `--bg` value automatically via CSS var)

#### TEST PLAN
1. Go to Browse → scroll categories
2. **PASS IF**: Soft gradient fades visible on left and right edges of the category carousel
3. Arrows still work and are visible
4. Switch to dark mode → gradients should match dark background
5. Scroll all the way left → left gradient should still show (it's okay, or you can add JS later to hide it at edges)

---

## PHASE 2: SAFE DATA DISPLAY FIXES (Read-Only JS Changes)
*These change how data is displayed but don't alter state, storage, or event handling.*

---

### 2.1 — Hex Badge Consistency (Grid Cards Always Show Short Hex) ✅
**Risk: 🟢 Very Low** — Changes a display-only render string

#### CHECKLIST
- [x] Read `js/shared/helpers.js` — note the `getShortHex()` function already exists
- [x] Read `js/app.js` — find `renderItemCard()` or the grid card rendering function
- [x] Find where the hex badge is rendered in grid cards (look for `item.hex` or `hexVariated`)
- [x] Replace the raw hex display with `getShortHex(item.hex)` if not already using it
- [x] Ensure the import for `getShortHex` exists in the file
- [x] Do NOT change the hex display on the detail page (it should still show full hex in the DETAILS card)
- [x] Do NOT change the hex in the cart ledger rows (those should keep short hex)

#### TEST PLAN
1. Go to Browse → look at all visible item cards
2. **PASS IF**: Every hex badge on grid cards shows exactly 4 uppercase characters (e.g., "1BEB", "3417")
3. No hex badge should show "0000000200001BEB" format on the grid
4. Click into any item detail → the DETAILS section should still show both short hex AND full variated hex
5. Check the cart → hex badges should also be short (4 chars)
6. Search for an item → results should also show short hex

---

### 2.2 — Review Date Range Cap (Max 2025) ✅
**Risk: 🟢 Very Low** — Changes a date generation range in reviews.js

#### CHECKLIST
- [x] Read `js/reviews.js` fully
- [x] Find where review dates are generated (look for `new Date()`, `Math.random()`, year ranges)
- [x] Change the maximum year from 2026 (or current year) to 2025
- [x] Keep the minimum year as 2020 (ACNH launch year)
- [x] Verify the date formatting function is unchanged

#### TEST PLAN
1. Navigate to any item detail page → scroll to VILLAGER REVIEWS
2. **PASS IF**: No review date shows a year later than 2025
3. Check 3-4 different items to verify dates are in the 2020-2025 range
4. Verify review content, star ratings, and villager names/photos are all still correct

---

### 2.3 — Similar Items — "Why Similar?" Label Enhancement ✅
**Risk: 🟢 Very Low** — Changes a heading string in detail render

#### CHECKLIST
- [x] Read `js/pages/detail.js`
- [x] Find the Similar Items section render code
- [x] Find where the matching criterion label is displayed (currently just shows e.g., "Black" or "antique")
- [x] Change the label format to include the match type:
  - If matching by SET → `📦 Same set: [set name]`
  - If matching by SERIES → `📚 Same series: [series name]`
  - If matching by STYLE → `✨ Similar style: [style name]`
  - If matching by COLOR → `🎨 Similar color: [color name]`
- [x] Preserve the existing matching logic — only change the display label
- [x] Use `esc()` on any user-facing strings

#### TEST PLAN
1. Navigate to an item with similar items → scroll to "SIMILAR ITEMS"
2. **PASS IF**: The label now reads something like "🎨 Similar color: Black" instead of just "Black"
3. Test with items from a known set (e.g., "antique chair") → should show "📦 Same set: Antique"
4. Verify clicking similar items still navigates correctly
5. Verify the similar items carousel still scrolls properly

---

### 2.4 — Cart "Estimated Order" Summary Line ✅
**Risk: 🟢 Low** — Adds one new HTML element to cart render

#### CHECKLIST
- [x] Read `js/pages/cart.js`
- [x] Find the tear line / separator between item rows and the shipping label
- [x] Above the tear line (or just below the last cart item), insert a summary line:
  ```
  [X unique items, Y total]
  ```
- [x] Calculate unique items by counting distinct `id + variantIdx` combos in `state.cart`
- [x] Style it as a subtle, centered, small-caps label matching the receipt aesthetic
- [x] Add CSS in `styles.css` for the new element (use existing receipt/label styles)

#### TEST PLAN
1. Add 3x of the same item + 1 different item to cart (4 total, 2 unique)
2. Navigate to Cart
3. **PASS IF**: Summary line reads "2 unique items, 4 total" above the tear line
4. Add another unique item → summary updates to "3 unique items, 5 total"
5. Remove all of one item type → count updates correctly
6. Empty cart completely → summary should not appear (empty state shows instead)

---

## PHASE 3: ADDITIVE UI FEATURES (New Elements, Existing Flows Untouched)
*These add new buttons, indicators, or sections. Existing functionality is not modified.*

---

### 3.1 — "In Cart" Indicator on Grid Cards ✅
**Risk: 🟡 Low** — Adds a visual indicator; uses existing `getCartQtyForItem` helper

#### CHECKLIST
- [x] Read `js/shared/helpers.js` — confirm `getCartQtyForItem(state, itemId, variantIdx)` exists
- [x] Read the item card render function in `js/app.js` (or `js/pages/catalog.js`)
- [x] After the heart button in each card, add a conditional "in cart" dot/badge:
  ```js
  const cartQty = getCartQtyForItem(state, item.id, item.variantIdx || 0);
  // If cartQty > 0, render a small green dot or mini cart icon on the thumbnail
  ```
- [x] Add CSS for the indicator: small green dot (8px circle), positioned absolute in the top-left of the thumbnail, with a subtle border
- [x] Ensure the indicator updates when items are added/removed (it will naturally re-render)
- [x] The indicator should NOT appear on the detail page (only grid cards)

#### TEST PLAN
1. Add any item to cart from the browse grid
2. **PASS IF**: A small green dot appears on that item's thumbnail in the grid
3. Remove it from cart → dot disappears
4. Add 3x of an item → dot should still show (just presence, not quantity)
5. Switch categories and come back → dot persists for items in cart
6. Verify hearts still work independently of the cart indicator

---

### 3.2 — Quantity Counter Visual Memory ✅
**Risk: 🟡 Low** — Changes the Add button render to check cart state

#### CHECKLIST
- [x] Read the item card render function (grid cards on browse page)
- [x] Find where the "Add" button renders and where the "− N +" counter renders
- [x] On render, check `getCartQtyForItem(state, item.id, item.variantIdx)`:
  - If qty > 0 → render the "− N +" counter immediately (not the Add button)
  - If qty === 0 → render the "Add" button as normal
- [x] The − button should remove one from cart, + should add one more
- [x] Ensure this works with the existing add/remove cart logic (don't duplicate handlers)
- [x] Test with multiple variants of the same item (each variant tracked separately)

#### TEST PLAN
1. Add 3x "Mom's plushie" to cart
2. Scroll away in the browse grid, then scroll back
3. **PASS IF**: Mom's plushie card shows "− 3 +" counter (not the "Add" button)
4. Switch to a different category and back → counter still shows
5. Use − to remove down to 0 → card switches back to "Add" button
6. Add from detail page → browse grid should reflect the updated count

---

### 3.3 — Cart Item — Tap to View Detail ✅
**Risk: 🟡 Low** — Adds click handler to existing cart row elements

#### CHECKLIST
- [x] Read `js/pages/cart.js`
- [x] Find the cart item row render (the thumbnail + name area)
- [x] Wrap the thumbnail and item name in a clickable element (or add a click handler to the existing row area, excluding the +/✕ buttons)
- [x] On click, navigate to the detail page: set `state.selectedItemId` and `state.selectedVariantIdx`, then navigate to `#/detail/{id}/{variantIdx}`
- [x] Add `cursor: pointer;` CSS to the clickable area
- [x] Ensure the (+) duplicate and (✕) remove buttons are NOT captured by this click (use `stopPropagation` or target-specific selectors)
- [x] Add a subtle hover/active state to indicate it's tappable

#### TEST PLAN
1. Add items to cart → navigate to Cart
2. Tap on an item's thumbnail or name
3. **PASS IF**: Navigates to that item's detail page with the correct variant selected
4. Use browser back → should return to cart
5. Tap the (+) button → should duplicate the item (NOT navigate away)
6. Tap the (✕) button → should remove the item (NOT navigate away)

---

### 3.4 — Variant Drawer "Add to Cart" Per Row ✅
**Risk: 🟡 Low** — Adds a button to each row in existing drawer

#### CHECKLIST
- [x] Read `js/pages/detail.js` — find the variant drawer render (the "ALL X" view)
- [x] Find where each `variant-drawer-row` is rendered
- [x] Add a small "+" button at the end of each row
- [x] On click, add that specific variant to cart using the existing cart-add logic
- [x] The button should show the cart quantity if > 0 (e.g., "2" instead of "+")
- [x] Add CSS: small circular button, green background, white text, positioned at the right of each row
- [x] Ensure adding from the drawer updates the detail page CTA bar quantity too
- [x] Add "CART" column header label
- [x] Track drawer open state to prevent full re-render on cart add
- [x] Add fly-to-cart animation support

#### TEST PLAN
1. Navigate to an item with multiple variants → tap "ALL X" to open the drawer
2. **PASS IF**: Each variant row now has a small "+" button on the right side
3. Tap "+" on any variant → item added to cart (cart badge increments)
4. The "+" button should change to show the quantity (e.g., "1")
5. Tap it again → quantity becomes "2"
6. Close the drawer → the main detail page CTA bar should reflect the correct variant/quantity
7. Verify the ♥ indicators and 📋 indicators still display correctly on rows

---

### 3.5 — Hex Badge Tap-to-Copy Enhanced Feedback ✅
**Risk: 🟡 Low** — Enhances existing click handler with animation

#### CHECKLIST
- [x] Find where the hex badge copy behavior is handled (likely in `js/pages/detail.js` or `js/app.js`)
- [x] After the existing `navigator.clipboard.writeText()` call, add:
  - A CSS class toggle (e.g., `hex-copy-flash`) that:
    - Scales the badge up to 1.15x
    - Changes background to `var(--pines)` (green)
    - Changes text color to white
    - Transitions back after 600ms
- [x] Add the CSS keyframe/transition in `styles.css`:
  ```css
  .hex-copy-badge.hex-copy-flash {
    transform: scale(1.15);
    background: var(--pines);
    color: white;
    transition: all 200ms ease-out;
  }
  ```
- [x] Remove the class after 600ms with `setTimeout`
- [x] Ensure the "✓ Copied!" text still appears

#### TEST PLAN
1. Navigate to any item detail → tap the hex badge
2. **PASS IF**: Badge briefly scales up, flashes green with white text, then smoothly returns to normal
3. The "✓ Copied!" text should still appear during the flash
4. Check clipboard → correct hex value was copied
5. Tap again rapidly → animation should restart cleanly each time
6. Test both the short hex badge and the full variated hex badge in the expanded details

---

### 3.6 — Empty List Personality (Warm Empty States) ✅
**Risk: 🟡 Low** — Adds conditional HTML in wishlist detail render

#### CHECKLIST
- [x] Read `js/pages/wishlist.js` — find the list detail view render
- [x] Find where the "0 items" state is handled (when viewing a list with no items)
- [x] Add an empty state message block similar to the cart empty state:
  ```html
  <div class="wl-empty-state">
    <div class="wl-empty-emoji">[list emoji enlarged]</div>
    <p class="wl-empty-title">This list is feeling lonely!</p>
    <p class="wl-empty-sub">Browse some items to fill it up 🍃</p>
    <button class="wl-empty-browse-btn">Start Browsing</button>
  </div>
  ```
- [x] The "Start Browsing" button should navigate to the catalog page
- [x] Style in `css/styles.css` matching the cart empty state aesthetic (centered, soft colors, leaf particles optional)
- [x] The "Loved Items" list should have a unique message: "Tap ♡ on any item to start your collection"

#### TEST PLAN
1. Create a new empty custom list from wishlist page
2. Tap into it
3. **PASS IF**: Warm empty state with the list's emoji, friendly message, and "Start Browsing" button
4. "Start Browsing" navigates to catalog
5. Check "Loved Items" when empty → should show its own unique message about tapping hearts
6. Add an item to the list → empty state disappears, item shows

---

### 3.7 — Jump to Top / Jump to Order Buttons ✅
**Risk: 🟡 Low** — New floating button, no existing UI modified

#### CHECKLIST
- [x] Add a "Jump to Top" floating action button (FAB) that appears when the user scrolls past 600px on:
  - Browse/catalog page → "↑" arrow button, scrolls to top
  - Search results → same behavior
- [x] Add a "Jump to Order" FAB on:
  - Cart page (when items exist) → scrolls to the BOT COMMAND / shipping label section
  - Wishlist list detail → scrolls to the bottom action area
- [x] Implementation:
  - Listen to `scroll` events (debounced)
  - Toggle a `.visible` class on the FAB when scroll threshold is met
  - Use `window.scrollTo({ top: 0, behavior: 'smooth' })` for top
  - Use `element.scrollIntoView({ behavior: 'smooth' })` for "jump to order"
- [x] Style: Small circular button (40px), `var(--pines)` background, white arrow icon, positioned bottom-right (above nav bar), `opacity: 0 → 1` transition
- [x] Must not overlap with the nav bar or CTA bar on detail page
- [x] The button should disappear when near the target (e.g., hide "jump to top" when near top)

#### TEST PLAN
1. Browse page → scroll down past ~3 screens of items
2. **PASS IF**: Small green circular "↑" button fades in at bottom-right, above the nav bar
3. Tap it → smooth scroll to top, button fades out as you approach the top
4. Go to Cart with items → scroll down slightly
5. **PASS IF**: "Jump to Order" button (📋 or ↓ icon) appears
6. Tap it → smooth scroll to the bot command/shipping label section
7. Verify the button doesn't appear on pages where it's not needed (Settings, Info)
8. Verify it doesn't overlap with the detail page CTA bar

---

## PHASE 4: ENHANCED INTERACTIONS (Modifying Existing Event Handlers)
*These change how existing features behave. More care needed.*

---

### 4.1 — Search Tag Auto-Complete Chips ✅
**Risk: 🟡 Medium** — Modifies search input handler and results display

#### CHECKLIST
- [x] Read the search logic in `js/app.js` and `js/data.js`
- [x] Read how `searchFilterTags` currently works in state
- [x] Collect all unique tags from the filter system (colors, styles, catalog, sizes)
- [x] In the search input handler (the debounced handler):
  - After the user types 3+ characters, check if the query matches any known tag (using startsWith)
  - If match found, show auto-complete suggestion chips between the search input and the results:
    ```html
    <div class="search-autocomplete">
      <span class="autocomplete-hint">Add as filter:</span>
      <button class="autocomplete-chip">pink</button>
      <button class="autocomplete-chip">pink (secondary)</button>
    </div>
    ```
  - Clicking a chip adds it to `searchFilterTags` and clears that word from the text input
- [x] Ensure existing manual filter panel (the ▽ toggle) still works independently
- [x] Auto-complete should only show when typing, not when the filter panel is open
- [x] Limit to max 3-4 suggestions to avoid clutter
- [x] Style: horizontal row of small pills with `+` prefix, subtle background

#### TEST PLAN
1. Open search → type "pink"
2. **PASS IF**: Auto-complete chips appear suggesting "pink" as a Color 1 and/or Color 2 filter
3. Tap the chip → "pink" is added as an active filter (badge shows "1"), search input clears the word "pink"
4. Type "elegant" → suggestion for "elegant" style filter appears
5. Open the filter panel manually → auto-complete should hide
6. Clear all filters → badge returns to 0
7. Existing text search (typing item names) still works exactly as before

---

### 4.2 — Active Filter Count Persistence & Reminder ✅
**Risk: 🟡 Medium** — Modifies search open/close behavior

#### CHECKLIST
- [x] Read how `searchFilterTags` is managed in state across search open/close
- [x] Verify if filters already persist when closing and reopening search (check `state.savedSearch`)
- [x] If filters are cleared on search close → change behavior to KEEP filters in state
- [x] When reopening search with active filters, show a brief toast/banner:
  ```
  "1 active filter: pink" (dismiss ✕)
  ```
- [x] Add a "Clear filters" quick action visible when filters are active
- [x] The filter badge on the filter icon should show immediately on search open if filters exist

#### TEST PLAN
1. Open search → add "pink" filter → see results
2. Close search (✕ button)
3. Reopen search
4. **PASS IF**: Filter is still active, badge shows "1", and a reminder banner shows "1 active filter: pink"
5. The reminder should have a dismiss/clear button
6. Tapping clear removes the filter and refreshes results
7. Verify closing search and navigating to another page, then back → filters should clear (session-only persistence)

---

### 4.3 — "Search Within Category" Toggle ✅
**Risk: 🟡 Medium** — Adds a toggle that modifies search scope

#### CHECKLIST
- [x] Read the search function in `js/data.js` (`searchItems`)
- [x] Add an optional `category` parameter to `searchItems()`:
  ```js
  export function searchItems(query, offset, limit, category = null) {
    // If category provided and not 'All', filter by category first
  }
  ```
- [x] In the search overlay UI (in `js/app.js`), add a toggle pill below the search input:
  ```html
  <button class="search-scope-toggle">
    🪑 Search within Furniture
  </button>
  ```
  - Only visible when `state.activeCategory` is not 'All'
  - Shows the current category emoji + name
  - Toggleable: active = scoped search, inactive = global search
- [x] Add state property: `state.searchWithinCategory = false`
- [x] When toggled ON, pass `state.activeCategory` to the search function
- [x] When toggled OFF or category is 'All', search globally as before
- [x] Style: pill button matching existing filter tag style, with active/inactive states

#### TEST PLAN
1. Select "Furniture" category in browse
2. Open search → **PASS IF**: "Search within Furniture" toggle is visible
3. Type "chair" with toggle OFF → shows chairs from ALL categories
4. Toggle ON → results narrow to only Furniture chairs
5. Toggle OFF → results expand back to all categories
6. Switch to "All" category → toggle should not appear
7. Verify the toggle state resets when closing search

---

### 4.4 — List Rename with Inline Input (Replace prompt()) ✅
**Risk: 🟡 Medium** — Replaces a prompt() call with inline DOM

#### CHECKLIST
- [x] Read `js/pages/wishlist.js` — find the rename handler
- [x] Find where `prompt()` is called for renaming
- [x] Replace with inline editing:
  - On rename button click, replace the list name `<p>` with an `<input>` pre-filled with current name
  - Show a confirm (✓) and cancel (✕) button
  - On confirm: save the new name via storage, re-render
  - On cancel: restore original name, re-render
  - On Enter key: confirm
  - On Escape key: cancel
- [x] Reuse the same pattern as the "Create New List" inline input (already exists)
- [x] Ensure special characters are handled (use `esc()`)
- [x] Max length: 30 characters (to prevent overflow)

#### TEST PLAN
1. Go to Wishlist → tap the ✏ rename button on a custom list
2. **PASS IF**: Name text becomes an editable input field with the current name pre-filled
3. Change the name → tap ✓ → name updates
4. Rename again → tap ✕ (cancel) → original name restored
5. Rename → press Enter → confirms
6. Rename → press Escape → cancels
7. Try empty name → should reject (keep old name)
8. Verify the list name updates everywhere it's referenced

---

### 4.5 — Cart Badge Animation ✅
**Risk: 🟡 Medium** — Modifies the nav bar badge render

#### CHECKLIST
- [x] Find where the cart badge number is rendered in the nav bar (in `js/app.js`, likely in the `renderNav()` or main render function)
- [x] When the cart count changes, add a brief animation class:
  - `.cart-badge-bump` → scale(1.3) then back to scale(1) over 300ms
  - Optionally: the old number slides up/fades out, new number slides in from below
- [x] Implementation approach:
  - Track `previousCartCount` in state or a module variable
  - On render, if count changed: add `.cart-badge-bump` class
  - Remove class after 300ms via setTimeout
- [x] Add CSS:
  ```css
  .cart-badge-bump {
    animation: badge-bump 300ms ease-out;
  }
  @keyframes badge-bump {
    0% { transform: scale(1); }
    50% { transform: scale(1.35); }
    100% { transform: scale(1); }
  }
  ```
- [x] Don't animate on initial page load (only on actual cart changes)

#### TEST PLAN
1. Browse items → tap "Add" on an item
2. **PASS IF**: Cart badge number bounces/pops briefly when incrementing
3. Go to cart → remove an item
4. **PASS IF**: Badge bounces when decrementing
5. Add items rapidly → animation should trigger each time
6. Navigate between pages → badge should NOT animate (only on count changes)
7. Verify the badge still hides when cart is empty (count = 0)

---

## PHASE 5: SYSTEM-WIDE ENHANCEMENTS (Broader Changes)
*These affect multiple files or introduce new subsystems.*

---

### 5.1 — Toast/Feedback System Overhaul ✅
**Risk: 🟠 Medium** — Introduces a unified toast system used across the app

#### CHECKLIST
- [x] Read all existing toast/feedback implementations:
  - Wishlist toast ("Saved to [list name]")
  - Hex badge "✓ Copied!"
  - Ad toast ("This is a fake Nook Inc. ad!")
  - Copy command "📦 Copied!" stamp
- [x] Create a unified toast function in `js/utils.js` or a new `js/toast.js`:
  ```js
  export function showToast(message, { type = 'info', duration = 2500, undoCallback = null } = {}) { ... }
  ```
  - Types: `'success'`, `'info'`, `'warning'`, `'undo'`
  - Undo type shows an "Undo" button that calls `undoCallback`
  - All toasts appear in the same fixed position (bottom center, above nav bar)
  - Slide up to enter, slide down to exit
  - Queue system: if multiple toasts, stack or wait
- [x] Add CSS for the toast container and toast types
- [x] Replace existing toast implementations one by one:
  - Cart remove → undo toast: "Removed [item name]" with Undo button
  - Wishlist heart toggle → success toast: "Saved to Loved Items"
  - Copy hex → success toast: "Hex copied!"
  - Copy command → success toast: "📦 Order copied!"
- [x] Keep the fake ad toast separate (it has unique styling)
- [x] Ensure toasts don't block interaction (pointer-events: none on container, auto on toast)

#### TEST PLAN
1. Add item to wishlist → **PASS IF**: Consistent toast at bottom center
2. Remove item from cart → toast with "Undo" button appears
3. Tap "Undo" → item is re-added to cart
4. Copy hex → toast confirmation
5. Copy bot command → toast confirmation
6. Trigger multiple actions quickly → toasts queue properly (don't overlap)
7. Verify fake ad toast still works with its own styling
8. All toasts auto-dismiss after ~2.5 seconds

---

### 5.2 — Loading & Skeleton States ✅
**Risk: 🟠 Medium** — Adds intermediate render states during data loading

#### CHECKLIST
- [x] Create skeleton card HTML templates in `js/app.js` or `js/pages/catalog.js`:
  ```html
  <div class="item-card skeleton">
    <div class="skeleton-thumb"></div>
    <div class="skeleton-text wide"></div>
    <div class="skeleton-text narrow"></div>
    <div class="skeleton-btn"></div>
  </div>
  ```
- [x] Add CSS with animated shimmer gradient:
  ```css
  .skeleton { pointer-events: none; }
  .skeleton-thumb, .skeleton-text, .skeleton-btn {
    background: linear-gradient(90deg, var(--border) 25%, var(--bg-warm) 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  ```
- [x] Show skeleton cards during:
  - Category switch (between clearing old items and rendering new ones)
  - "Load More" fetch (show 4-6 skeletons at the bottom while loading)
  - Search (while debounce timer is active)
  - Initial page load (before first render)
- [x] Show 4-6 skeleton cards matching the 2-column grid layout
- [x] Skeleton should match the exact dimensions of real cards
- [x] Test dark mode skeletons (colors should adapt via CSS vars)

#### TEST PLAN
1. Click a category (e.g., switch from "All" to "Furniture")
2. **PASS IF**: Skeleton cards briefly appear with shimmer animation before real items load
3. Click "Load More" → skeleton cards appear at the bottom of the grid while new items load
4. Open search and type → skeleton may appear during debounce period
5. Switch to dark mode → skeletons should use dark theme colors
6. Verify real cards replace skeletons cleanly (no flash, no leftover skeletons)

---

### 5.3 — State Transition Animations ✅
**Risk: 🟠 Medium-High** — Modifies the core render cycle

*Already implemented in previous work:*
- Page transitions (`.page-enter` with `pageFadeIn`)
- Card entry stagger (`.grid-enter` with staggered delays)
- Expand/collapse animation (`.detail-fields-collapsible` with `max-height`)
- Sheet modal slide-up (`sheetSlideUp`)
- `prefers-reduced-motion` support

#### CHECKLIST
- [x] **Page transitions (cross-fade)**:
  - In `js/app.js`, find the main `render()` function
  - Before clearing `app.innerHTML`, capture the old content and apply a fade-out class
  - After setting new `innerHTML`, apply a fade-in class
  - Implementation: use CSS `opacity` transition (200ms) with a wrapper approach
  - Alternative (simpler): add `.page-enter` class to the new content, animate opacity 0→1
  ```css
  .page-enter { animation: fadeIn 200ms ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  ```
- [x] **Card entry stagger**:
  - After rendering item cards, add staggered delays:
  ```js
  document.querySelectorAll('.item-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 30}ms`;
    card.classList.add('card-enter');
  });
  ```
  ```css
  .card-enter { animation: cardFadeIn 200ms ease-out both; }
  @keyframes cardFadeIn { from { opacity: 0; transform: translateY(12px); } }
  ```
- [x] **Expand/collapse animation** (Show all details):
  - Wrap the collapsible content in a container with `max-height` transition
  - Collapsed: `max-height: 0; overflow: hidden`
  - Expanded: `max-height: 500px` (large enough for content)
  - Transition: `max-height 300ms ease-out`
- [x] **Sheet modal entry**:
  - Add slide-up animation to `.sheet-modal`:
  ```css
  .sheet-modal { animation: slideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  ```
- [x] **Nav tab indicator slide** — if the active pill is a pseudo-element or real element, animate its `left` position with transition
- [x] Test that `prefers-reduced-motion` is respected (wrap animations in a media query)

#### TEST PLAN
1. Switch between nav tabs (Browse → Cart → Wishlist)
2. **PASS IF**: Pages fade in smoothly (not instant DOM swap)
3. Switch categories on browse page → item cards fade in with staggered timing
4. Click "Show all details" on a detail page → content slides open smoothly
5. Open "Save to List" modal → sheet slides up with a spring curve
6. Open emoji picker → same spring slide-up
7. Enable "Reduce Motion" in OS accessibility settings → animations should be instant/disabled
8. Verify NO existing functionality is broken (search, cart add, variant switching, etc.)
9. Performance check: scroll through 50+ items smoothly — no jank from animations

---

### 5.4 — Image Loading Strategy (Blur Placeholder + Fade In) ✅
**Risk: 🟠 Medium** — Modifies image rendering across all card types

#### CHECKLIST
- [x] Find all places where item images are rendered (`<img>` tags in card renders)
- [x] Wrap each image in a container with a solid background color (matching `getItemBg(index)`)
- [x] Add a CSS class for the loading state and loaded state:
  ```css
  .item-img-wrapper {
    background: var(--img-placeholder-bg);
    border-radius: 14px;
    overflow: hidden;
  }
  .item-img-wrapper img {
    opacity: 0;
    transition: opacity 200ms ease;
  }
  .item-img-wrapper img.loaded {
    opacity: 1;
  }
  ```
- [x] Add `onload` handler to each image: `onload="this.classList.add('loaded')"`
- [x] Replace the `onerror` fallback (📦 emoji) with a styled placeholder:
  ```html
  <div class="img-fallback">📦</div>
  ```
  Style it with centered emoji, matching background color, proper sizing
- [x] Ensure lazy loading (`loading="lazy"`) is preserved
- [x] Test: images should fade in as they load, placeholder color shows first

#### TEST PLAN
1. Clear browser cache → reload the app
2. Scroll through items on browse page
3. **PASS IF**: Each item thumbnail shows a solid pastel background first, then the image fades in over 200ms as it loads
4. Throttle network to 3G in dev tools → effect should be much more visible
5. Break an image URL intentionally → styled 📦 fallback should appear (not a broken image icon)
6. Verify dark mode thumbnail backgrounds look appropriate

---

### 5.5 — Pull-to-Refresh Visual Polish
**Risk: 🟠 Medium** — Modifies existing touch gesture handler

#### CHECKLIST
- [x] Find the pull-to-refresh implementation in `js/app.js`
- [x] Add a visual indicator element above the content:
  ```html
  <div class="ptr-indicator">
    <span class="ptr-icon">🍃</span>
    <span class="ptr-text">Pull to refresh</span>
  </div>
  ```
- [x] During the pull gesture:
  - The indicator should translate down proportionally to the pull distance
  - The 🍃 icon should rotate based on pull distance
  - At threshold: text changes to "Release to refresh"
  - After release: show spinner or "Refreshing..." text
  - On complete: snap back up and hide
- [x] Add CSS for the indicator (fixed/absolute positioned above the scroll area, starts hidden)
- [x] Respect `prefers-reduced-motion` — disable rotation animation

#### TEST PLAN
1. On the browse page, pull down from the top (mobile gesture or click-drag)
2. **PASS IF**: A leaf icon and "Pull to refresh" text appears, growing as you pull further
3. Pull past the threshold → text changes to "Release to refresh"
4. Release → items refresh with new random picks, indicator snaps back and hides
5. Don't pull far enough → indicator snaps back without refreshing
6. Verify this only works on the browse page (not cart, settings, etc.)

---

## PHASE 6: COMPLEX FEATURES (Multi-File, New Subsystems)

---

### 6.1 — Sound Preview Buttons in Settings
**Risk: 🟡 Low-Medium** — Adds buttons that trigger existing sound functions

#### CHECKLIST
- [x] Read `js/sounds.js` — understand the `NookSounds` class and available sound methods
- [x] Read `js/pages/settings.js` — find the Sound Package section render
- [x] Add 2-3 small "▶" buttons next to the sound toggle, each playing a different sample:
  - "🛒 Cart" → plays `addToCart` sound
  - "💚 Heart" → plays `heartAdd` sound
  - "📋 Copy" → plays `copyCommand` sound
- [x] The preview buttons should work regardless of the main sound toggle state (always play at the current volume)
- [x] Style: small inline pill buttons with play icon, subtle styling
- [x] Buttons should have a brief "playing" state (highlight for 500ms)

#### TEST PLAN
1. Go to Settings → Sound section (sound toggle OFF)
2. **PASS IF**: 2-3 preview buttons visible ("🛒 Cart", "💚 Heart", "📋 Copy")
3. Tap any preview button → hear the sound play at the current volume level
4. Adjust volume slider → preview sounds should play at new volume
5. Toggle sound ON → preview buttons still work
6. Toggle sound OFF → preview buttons still play (they're for preview only)

---

### 6.2 — Settings Section Jump Links
**Risk: 🟡 Low** — Adds a mini nav at the top of settings page

#### CHECKLIST
- [x] Read `js/pages/settings.js`
- [x] Add unique `id` attributes to each settings section card:
  - `id="settings-prefix"`, `id="settings-loading"`, `id="settings-sound"`, `id="settings-appearance"`, `id="settings-motion"`, `id="settings-shortcuts"`, `id="settings-promos"`, `id="settings-danger"`
- [x] At the top of the settings page, render a horizontal scrollable chip row:
  ```html
  <div class="settings-jump-links">
    <a href="#settings-prefix" class="jump-chip">Prefix</a>
    <a href="#settings-sound" class="jump-chip">Sound</a>
    <a href="#settings-appearance" class="jump-chip">Theme</a>
    <a href="#settings-promos" class="jump-chip">Promos</a>
    <a href="#settings-danger" class="jump-chip">Data</a>
  </div>
  ```
- [x] Use smooth scroll behavior: `scroll-behavior: smooth` on the page or use JS `scrollIntoView`
- [x] Style: small horizontal pills, scroll-snap, matching category carousel aesthetic
- [x] Ensure clicking a jump link doesn't interfere with hash routing (use `e.preventDefault()` + manual scrollIntoView)

#### TEST PLAN
1. Go to Settings
2. **PASS IF**: Horizontal row of jump chips at the top (Prefix, Sound, Theme, Promos, Data)
3. Tap "Sound" → smooth scroll to the Sound section
4. Tap "Data" → smooth scroll to the Danger Zone section
5. Tap "Prefix" → smooth scroll back to the top
6. Verify normal page scroll still works
7. Verify navigation to other pages still works (the jump links don't break hash routing)

---

### 6.3 — Empty Cart → "Re-order Last" Button
**Risk: 🟡 Medium** — Uses existing `orderHistory` localStorage

#### CHECKLIST
- [x] Read `js/storage.js` — confirm `getOrderHistory()` and `setOrderHistory()` exist
- [x] Read `js/pages/cart.js` — find the empty cart state render
- [x] First: ensure orders are SAVED to history when the user copies the bot command
  - In the copy handler, save current cart to order history:
    ```js
    const history = storage.getOrderHistory();
    history.unshift({ items: [...state.cart], timestamp: Date.now() });
    storage.setOrderHistory(history.slice(0, 10)); // Keep last 10
    ```
- [x] In the empty cart render, check for order history:
  - If history exists, show a "📦 Re-order last" button below "Start Shopping"
  - On click: restore `history[0].items` to `state.cart`, save, re-render
- [x] Show a brief description: "Re-order: [N items] from [relative time]"
- [x] Style: secondary button style (outline), below the primary "Start Shopping" button

#### TEST PLAN
1. Add items to cart → copy the bot command (this saves to history)
2. Clear the cart
3. **PASS IF**: Empty cart shows "Start Shopping" AND "📦 Re-order last" button
4. The re-order button shows item count and relative time ("4 items from 2 minutes ago")
5. Tap "Re-order last" → cart is restored with the previous items
6. Clear cart again when there's no history → only "Start Shopping" shows (no re-order button)

---

### 6.4 — Onboarding Modal Upgrade (Multi-Step)
**Risk: 🟠 Medium-High** — Replaces existing intro modal entirely

#### CHECKLIST
- [ ] Read the current intro modal code in `js/app.js` (search for `seenIntro`, `intro-modal`, first-time)
- [ ] Replace the single-screen modal with a 3-step slide-through:
  - **Step 1**: "Welcome to ACNHEX Market" — brief explanation with illustration (browse → cart → Discord)
  - **Step 2**: "Set your prefix" — the existing prefix picker + presets + live preview
  - **Step 3**: "Choose your style" — load mode toggle + theme selector (Light/Dark/System)
- [ ] Add slide indicators (3 dots) at the bottom
- [ ] "Next" button advances steps, "Back" button goes back, final step has "Let's go! 🛒"
- [ ] Add swipe gesture support (left/right) between steps
- [ ] Each step should have a smooth slide transition (translateX animation)
- [ ] Save all preferences at the end (not per-step) — so canceling mid-flow doesn't partially save
- [ ] Keep the `seenIntro` flag behavior — only shows once
- [ ] Style: match existing modal aesthetic but wider/taller to accommodate content

#### TEST PLAN
1. Clear all data (Settings → Clear All Data) → reload app
2. **PASS IF**: Multi-step onboarding modal appears (not the old single-screen)
3. Step 1 shows welcome message → tap "Next"
4. Step 2 shows prefix picker → set prefix to "$" → tap "Next"
5. Step 3 shows load mode + theme → select Dark mode → tap "Let's go!"
6. App loads with $ prefix and dark theme correctly applied
7. Reload → onboarding should NOT reappear (seenIntro flag set)
8. Verify swipe gesture works between steps
9. Verify dot indicators reflect current step

---

### 6.5 — Drag-to-Reorder Wishlist Lists
**Risk: 🔴 High** — Touch gesture handling + state reordering + persistence

#### CHECKLIST
- [ ] Read `js/pages/wishlist.js` — understand the list rendering order
- [ ] Read `js/storage.js` — the lists array order determines display order
- [ ] Implement drag-to-reorder on the wishlist overview page:
  - Add a drag handle (≡ icon) to each custom list card (NOT on Loved Items — it stays first)
  - On long-press of the handle: enter drag mode
  - Show a visual "lift" on the dragged card (shadow, scale up slightly)
  - Other cards shift position as the dragged card moves
  - On drop: reorder the `state.wishlists.lists` array and save to storage
- [ ] Implementation options:
  - **Option A**: Native HTML5 drag-and-drop (simpler but less mobile-friendly)
  - **Option B**: Custom touch event handling (touchstart/touchmove/touchend) — recommended for mobile
- [ ] Ensure Loved Items (index 0) is never draggable and always stays first
- [ ] After reordering, save immediately to `storage.setWishlists()`
- [ ] Add visual feedback: drop zone highlights, smooth repositioning animation
- [ ] Consider `prefers-reduced-motion` — skip animations if set

#### TEST PLAN
1. Create 3+ custom lists
2. Long-press the drag handle (≡) on one list
3. **PASS IF**: Card "lifts" with shadow, other cards shift to make room
4. Drag to a new position → release → card drops into new position
5. Reload page → order is preserved (saved to localStorage)
6. Verify Loved Items cannot be dragged
7. Verify list contents are not affected by reordering (items in each list stay correct)
8. Test on mobile viewport (touch events) and desktop (mouse events)
9. Verify other list actions (rename, delete, emoji change) still work after reordering

---

### 6.6 — Error & Edge Case States
**Risk: 🟠 Medium** — Multiple small changes across many files

#### CHECKLIST
- [ ] **Offline banner**:
  - Listen for `online`/`offline` events on `window`
  - When offline, show a fixed banner at the top: "📡 You're offline — browsing cached items"
  - When back online, auto-dismiss with "Back online!" toast
  - Style: subtle amber/yellow banner, 32px height, full width
- [ ] **Cart full (40/40) state**:
  - When cart has 40 items, disable all "Add" buttons across the app
  - Add visual state: grey out the button, show "Cart full" text
  - On the detail page CTA: "Cart full (40/40)" instead of "Add to Cart"
  - Play the `cartFull` sound (already exists)
- [ ] **Empty search results**:
  - Find the "no results" state in search
  - Add suggested searches: "Try 'chair', 'blue', or 'elegant'"
  - Show the search query back: "No results for 'xyzabc'"
- [ ] **Image fallback styling**:
  - Already addressed in Phase 5.4 (image loading strategy)

#### TEST PLAN
1. Turn off WiFi/network → browse the app
2. **PASS IF**: Amber "You're offline" banner appears at top
3. Turn WiFi back on → banner auto-dismisses
4. Fill cart to 40/40 → all Add buttons should be greyed out
5. Try to add another item → button shows "Cart full" and plays the full sound
6. Remove an item → Add buttons re-enable
7. Search for "xyzxyzxyz" → **PASS IF**: "No results for 'xyzxyzxyz'. Try 'chair', 'blue', or 'elegant'"

---

### 6.7 — Fake Promos Preview in Settings
**Risk: 🟡 Medium** — Adds inline ad previews, uses existing ad render code

#### CHECKLIST
- [ ] Read `js/ads.js` — understand the ad template/render functions
- [ ] Read `js/pages/settings.js` — find the Fake Promos section
- [ ] Add a "Preview" button next to each ad type toggle
- [ ] On click, render a small inline preview of that ad type directly below the toggle:
  - **Banner**: Show a mini version of one banner ad (scaled down)
  - **Interstitial**: Show a screenshot-like thumbnail
  - **Popup**: Show a mini overlay preview in a contained box
  - **Notification**: Show the notification banner inline
- [ ] Each preview should be self-contained (no full-screen overlays) and dismissible
- [ ] Reuse existing ad render HTML but wrap in a `.ad-preview-container` with `transform: scale(0.6)` and `pointer-events: none`
- [ ] Style: bordered preview box with "Preview" label

#### TEST PLAN
1. Go to Settings → Fake Promos section
2. **PASS IF**: Each ad type has a small "Preview" button
3. Tap "Preview" next to Banner Ads → mini banner ad appears inline below the toggle
4. Tap "Preview" next to Popup Overlays → mini popup preview appears inline
5. Tap again or tap elsewhere → preview dismisses
6. Verify toggling the ad on/off doesn't affect the preview
7. Verify navigating away and back → no stale previews

---

### 6.8 — URL-Aware Deep Linking & Page Titles
**Risk: 🟡 Low-Medium** — Adds document.title updates

#### CHECKLIST
- [ ] In `js/app.js`, find the `updateHash()` function or the render cycle
- [ ] After each navigation, update `document.title`:
  - Catalog: `"ACNHEX Market"`
  - Detail: `"[Item Name] - [Variant] | ACNHEX Market"`
  - Cart: `"Cart (N) | ACNHEX Market"`
  - Wishlist: `"Wishlist | ACNHEX Market"` or `"[List Name] | ACNHEX Market"`
  - Settings: `"Settings | ACNHEX Market"`
  - Info: `"About | ACNHEX Market"`
- [ ] Test the browser back button through these flows:
  - Browse → Detail → Similar Item → Detail → Back → Back → Browse
  - Browse → Cart → Back → Browse
  - Browse → Search → Item Detail → Back → Search results preserved
- [ ] Verify that the hash routing + `popstate`/`hashchange` listeners handle all cases

#### TEST PLAN
1. Navigate to an item detail page
2. **PASS IF**: Browser tab title shows "Bird Mobile - Blue | ACNHEX Market"
3. Navigate to Cart → title shows "Cart (4) | ACNHEX Market"
4. Navigate to Settings → title shows "Settings | ACNHEX Market"
5. Use browser Back button through: Browse → Detail → Similar → Detail → Back → Back
6. **PASS IF**: Each Back press returns to the correct previous page with correct state
7. Share a detail page URL → opening it directly should load the correct item

---

### 6.9 — Keyboard Navigation Polish
**Risk: 🟡 Low-Medium** — Enhances existing keyboard handler

#### CHECKLIST
- [ ] Read the keyboard shortcut handler in `js/app.js`
- [ ] **Focus rings**: Add visible focus indicators:
  ```css
  *:focus-visible {
    outline: 2px solid var(--pines);
    outline-offset: 2px;
    border-radius: 8px;
  }
  ```
  - Use `:focus-visible` (not `:focus`) to only show for keyboard navigation
- [ ] **Tab order**: Verify logical tab order on each page:
  - Browse: search bar → categories → first item card → second item card...
  - Detail: back button → heart → orbit controls → CTA buttons
  - Cart: first cart item → duplicate/remove → next item → copy command
- [ ] **Search auto-focus**: When pressing `/` or `Ctrl+K`, ensure `input.focus()` is called immediately
- [ ] Add `tabindex="0"` to interactive elements that aren't natively focusable (div buttons, etc.)
- [ ] Add `role="button"` to clickable divs that aren't `<button>` elements

#### TEST PLAN
1. Press Tab repeatedly on the browse page
2. **PASS IF**: Focus ring (green outline) moves logically through interactive elements
3. Press `/` → search opens AND input is focused (can type immediately)
4. Press Escape → search closes, focus returns to previous element
5. Press 1-5 → switches nav tabs
6. On detail page, use arrow keys → variants change
7. Verify focus rings don't appear on mouse click (only keyboard navigation)

---

### 6.10 — Dark Mode Parity Audit
**Risk: 🟡 Low-Medium** — CSS adjustments for dark theme

#### CHECKLIST
- [ ] Open `css/styles.css` — review all `[data-theme="dark"]` rules
- [ ] **Thumbnail backgrounds**: The pastel rotating colors (`BG_COLORS` in data.js) need dark variants:
  ```css
  [data-theme="dark"] .item-thumb { background: var(--card) !important; }
  ```
  Or define dark-mode BG_COLORS: `['#3D2A30', '#352F28', '#2E3528', '#3D2A35']`
- [ ] **Code blocks**: Already dark in light mode — in dark mode, ensure sufficient contrast:
  ```css
  [data-theme="dark"] .code-block { background: #1a1e16; }
  ```
- [ ] **Shadows**: In dark mode, shadows should be much more subtle or replaced with borders:
  ```css
  [data-theme="dark"] { --shadow-card: 0 1px 2px rgba(0,0,0,0.2); }
  ```
  (Already partially done — audit for completeness)
- [ ] **Hero banner**: Verify the dark green gradient looks intentional, not just "dark"
- [ ] **Skeleton loaders** (from 5.2): Ensure shimmer uses dark-appropriate colors
- [ ] Test every page in dark mode: Browse, Detail, Cart, Wishlist, Settings, Info

#### TEST PLAN
1. Switch to Dark mode
2. Browse through items → **PASS IF**: Thumbnail backgrounds are dark-appropriate (not pastel pink on dark)
3. Open an item detail → code block/hex badges have good contrast
4. Check cart → shipping label and receipt styling look intentional in dark mode
5. Check settings → all sections readable
6. Verify no elements have white/light backgrounds that clash
7. Compare light and dark side by side — both should feel "designed", not one like an afterthought

---

### 6.11 — Performance Perception (Prefetch + Instant Category Headers)
**Risk: 🟡 Medium** — Changes data loading strategy

#### CHECKLIST
- [ ] Read `js/data.js` — understand category data loading and caching
- [ ] **Instant category header**: When a category is clicked:
  1. Immediately update the heading text and show skeleton cards (from 5.2)
  2. THEN load the actual data
  3. Replace skeletons with real cards once data arrives
  - This means splitting the category click handler into two phases
- [ ] **Prefetch adjacent categories**: After loading a category, start fetching the next category in the list in the background:
  ```js
  // After loading "Furniture", prefetch "Clothing" in idle time
  requestIdleCallback(() => loadCategoryData(nextCategory));
  ```
- [ ] Use `requestIdleCallback` (with fallback `setTimeout(..., 100)`) for prefetching
- [ ] Don't prefetch more than 1-2 categories ahead (memory/bandwidth)
- [ ] Cache management: the `categoryCache` in data.js already handles this

#### TEST PLAN
1. Click a category (e.g., "Clothing") from the carousel
2. **PASS IF**: Category heading updates INSTANTLY ("CLOTHING · 881 found"), skeleton cards appear immediately
3. Real items fade in shortly after (100-300ms)
4. Click the next category → it should load faster (was prefetched)
5. Verify slow network (3G throttle) makes the skeleton phase much more visible
6. Verify no duplicate renders or flickering

---

## FEATURE INDEX (Quick Reference)

| # | Feature | Phase | Risk | Files |
|---|---------|-------|------|-------|
| 1.1 | Cart progress bar animation | 1 | 🟢 | CSS |
| 1.2 | Button press states | 1 | 🟢 | CSS |
| 1.3 | Theme transition | 1 | 🟢 | CSS |
| 1.4 | Category carousel gradient masks | 1 | 🟢 | CSS |
| 2.1 | Hex badge consistency | 2 | 🟢 | app.js, helpers.js |
| 2.2 | Review date cap | 2 | 🟢 | reviews.js |
| 2.3 | "Why similar?" labels | 2 | 🟢 | detail.js |
| 2.4 | Cart order summary | 2 | 🟢 | cart.js, CSS |
| 3.1 | "In cart" indicator | 3 | 🟡 | app.js, CSS |
| 3.2 | Quantity counter memory | 3 | 🟡 | app.js |
| 3.3 | Cart items tappable | 3 | 🟡 | cart.js |
| 3.4 | Variant drawer cart buttons | 3 | 🟡 | detail.js |
| 3.5 | Hex badge copy animation | 3 | 🟡 | detail.js, CSS |
| 3.6 | Empty list personality | 3 | 🟡 | wishlist.js, CSS |
| 3.7 | Jump to top/order buttons | 3 | 🟡 | app.js, CSS |
| 4.1 | Search auto-complete chips | 4 | 🟡 | app.js, data.js |
| 4.2 | Filter persistence | 4 | 🟡 | app.js |
| 4.3 | Search within category | 4 | 🟡 | app.js, data.js |
| 4.4 | Inline list rename | 4 | 🟡 | wishlist.js |
| 4.5 | Cart badge animation | 4 | 🟡 | app.js, CSS |
| 5.1 | Toast system overhaul | 5 | 🟠 | utils.js/toast.js, all pages |
| 5.2 | Skeleton loading states | 5 | 🟠 | app.js, CSS |
| 5.3 | State transition animations | 5 | 🟠 | app.js, CSS |
| 5.4 | Image loading strategy | 5 | 🟠 | all card renders, CSS |
| 5.5 | Pull-to-refresh polish | 5 | 🟠 | app.js, CSS |
| 6.1 | Sound preview buttons | 6 | 🟡 | settings.js, sounds.js |
| 6.2 | Settings jump links | 6 | 🟡 | settings.js, CSS |
| 6.3 | Re-order last button | 6 | 🟡 | cart.js, storage.js |
| 6.4 | Onboarding upgrade | 6 | 🟠 | app.js, CSS |
| 6.5 | Drag-to-reorder lists | 6 | 🔴 | wishlist.js, storage.js |
| 6.6 | Error & edge case states | 6 | 🟠 | app.js, multiple pages |
| 6.7 | Fake promos preview | 6 | 🟡 | settings.js, ads.js |
| 6.8 | Deep linking & page titles | 6 | 🟡 | app.js |
| 6.9 | Keyboard navigation polish | 6 | 🟡 | app.js, CSS |
| 6.10 | Dark mode parity | 6 | 🟡 | CSS, data.js |
| 6.11 | Performance perception | 6 | 🟡 | data.js, app.js |

---

## PROTOCOL REMINDERS

### Before Starting ANY Feature
1. ✅ Read `ROADMAP.md` (this file)
2. ✅ Read all files listed in the CHECKLIST for that feature
3. ✅ Read `js/storage.js` and `js/shared/helpers.js` (always)
4. ✅ Run the app and verify it works BEFORE making changes
5. ✅ Identify the exact lines of code to modify

### During Implementation
6. ✅ Make the MINIMUM changes needed — surgical precision
7. ✅ Do NOT refactor unrelated code
8. ✅ Do NOT change function signatures unless required
9. ✅ Preserve all existing comments
10. ✅ Test the feature matches the TEST PLAN

### After Implementation
11. ✅ Run through the TEST PLAN with the user
12. ✅ Verify 3 unrelated features still work (quick smoke test):
    - Search still returns results
    - Cart add/remove still works
    - Navigation between all 5 tabs works
13. ✅ Wait for user to say **"pass"** before proceeding

---

*Total features: 33 | Estimated phases: 6 | CSS-only: 4 | Low risk: 12 | Medium risk: 14 | High risk: 1*
