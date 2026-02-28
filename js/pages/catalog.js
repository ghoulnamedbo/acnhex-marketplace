// ─── Catalog Page ───
// Browse items with category filtering, search, and random picks

import { esc } from '../utils.js';
import { ICONS } from '../shared/icons.js';
import { isInLovedList, isInWishlist, getCartTotal, getCartQtyForItem } from '../shared/helpers.js';
import * as data from '../data.js';
import * as ads from '../ads.js';

// ─── Daily Pick Constants ───
const DAILY_PICK_QUIPS = [
  "Tom Nook's pick of the day!",
  "Isabelle recommends this one!",
  "Trending on the island today!",
  "A villager favorite!",
  "Today's hidden gem!",
  "Blathers would approve!",
  "Perfect for your island!",
  "K.K. Slider's choice!",
  "Hot item alert!",
  "Nook's Cranny spotlight!"
];

function getDailyPickSeed() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ─── Render Functions ───
export function renderItemCard(state, item, idx) {
  const bg = data.getItemBg(idx);
  const vi = item.variantIdx ?? 0;
  const inLoved = isInLovedList(state, item.id, vi);
  const cartFull = getCartTotal(state) >= 40;
  const qtyInCart = getCartQtyForItem(state, item.id, vi);
  const showCounter = qtyInCart > 0;
  return `<div class="item-card" data-item="${esc(item.id)}" data-vi="${vi}">
    <div class="item-thumb" style="background:${bg}">
      ${item.img ? `<img src="${esc(item.img)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="heart-btn" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heart(inLoved)}</button>
    </div>
    <div class="item-info">
      <p class="item-name">${esc(item.n)}</p>
      <div class="item-meta">
        <span class="item-variant">${esc(item.v1)}</span>
        <span class="hex-badge">${esc(item.hex)}</span>
      </div>
      <div class="cart-btn-wrap" data-cart-item-id="${esc(item.id)}" data-cart-vi="${vi}">
        <button class="add-cart-btn${showCounter ? ' hidden' : ''}" data-add-cart="${esc(item.id)}" ${cartFull ? 'disabled' : ''}>
          ${ICONS.plus} Add
        </button>
        <div class="qty-counter${showCounter ? ' visible' : ''}">
          <button class="qty-counter-btn" data-qty-minus="${esc(item.id)}" data-qty-vi="${vi}">−</button>
          <span class="qty-counter-val">${qtyInCart}</span>
          <button class="qty-counter-btn" data-qty-plus="${esc(item.id)}" data-qty-vi="${vi}" ${cartFull ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>
  </div>`;
}

export async function renderRecentlyViewed(state) {
  if (!state.recentlyViewed || state.recentlyViewed.length === 0) return '';

  // Load item details for each recently viewed item
  const cards = [];
  for (const entry of state.recentlyViewed.slice(0, 20)) {
    try {
      const item = await data.getItemDetail(entry.id);
      if (!item) continue;
      const vi = entry.variantIdx || 0;
      const variant = item.variants[vi] || item.variants[0];
      if (!variant) continue;

      const inWL = isInWishlist(state, entry.id, vi);
      const hex = variant.hexVariated || variant.hex || item.hexBase;
      const idx = cards.length;
      const bg = data.getItemBg(idx);

      // Use same structure as item cards
      cards.push(`<div class="item-card recent-item-card" data-item="${esc(entry.id)}" data-vi="${vi}">
        <div class="item-thumb" style="background:${bg}">
          ${variant.image ? `<img src="${esc(variant.image)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
          <button class="heart-btn" data-heart="${esc(entry.id)}" data-heart-vi="${vi}">${ICONS.heart(inWL)}</button>
        </div>
        <div class="item-info">
          <p class="item-name">${esc(item.name)}</p>
          <div class="item-meta">
            <span class="item-variant">${esc(variant.name)}</span>
            <span class="hex-badge">${esc(hex)}</span>
          </div>
        </div>
      </div>`);
    } catch (e) {
      // Skip items that fail to load
    }
  }

  if (cards.length === 0) return '';

  return `<div class="recent-section px-24 pt-16">
    <div class="recent-header">
      <h4 class="label-upper similar-header-label"><span class="similar-header-emoji">🕐</span> RECENTLY VIEWED</h4>
    </div>
    <div class="recent-scroll-wrapper">
      <button class="recent-arrow left" id="recent-arrow-left">‹</button>
      <div class="recent-scroll hide-scrollbar" id="recent-scroll">
        ${cards.join('')}
      </div>
      <button class="recent-arrow right" id="recent-arrow-right">›</button>
    </div>
  </div>`;
}

export async function renderDailyPick(state) {
  const seed = getDailyPickSeed();
  const quipIndex = seed % DAILY_PICK_QUIPS.length;
  const quip = DAILY_PICK_QUIPS[quipIndex];

  // Use getCategories with a deterministic item ID from the index
  const indexItems = data.getCategories();
  if (!indexItems || indexItems.length === 0) return '';

  // Pick a category and get an item from it
  const catIdx = seed % indexItems.length;
  const cat = indexItems[catIdx];

  // Get items from this category
  const catItems = data.getItemsByCategory(cat.name, 0, 50);
  if (!catItems.items || catItems.items.length === 0) return '';

  const itemIdx = seed % catItems.items.length;
  const indexItem = catItems.items[itemIdx];

  // Get full item details
  const item = await data.getItemDetail(indexItem.id);
  if (!item || !item.variants || item.variants.length === 0) return '';

  const variantIdx = seed % item.variants.length;
  const variant = item.variants[variantIdx];

  return `
    <div class="daily-pick-section content-wrapper mt-16">
      <div class="daily-pick-card" data-daily-pick="${esc(item.id)}" data-daily-vi="${variantIdx}">
        <div class="daily-pick-badge">🌟 Nook's Daily Pick</div>
        <div class="daily-pick-content">
          <div class="daily-pick-thumb" style="background:${data.getItemBg(seed % 6)}">
            ${variant.image ? `<img src="${esc(variant.image)}" alt="" onerror="this.outerHTML='📦'">` : '📦'}
          </div>
          <div class="daily-pick-info">
            <div class="daily-pick-name">${esc(item.name)}</div>
            <div class="daily-pick-variant">${esc(variant.name)}</div>
            <div class="daily-pick-quip">"${esc(quip)}"</div>
          </div>
          <div class="daily-pick-arrow">›</div>
        </div>
      </div>
    </div>`;
}

export function renderCatalogWithSearch(state) {
  const results = state.searchResults || { items: [], total: 0 };
  const hasFilters = state.searchFilterTags.length > 0;
  const hasQuery = state.searchQuery || hasFilters;
  const tagGroups = data.getAvailableTags();

  return `<div class="page" id="search-page">
    <div class="search-section">
      <div class="search-header-row">
        <div class="search-input-wrap">
          <div class="search-input-icon">${ICONS.search}</div>
          <input type="text" class="search-input" id="search-input" placeholder="Search items or tags..." value="${esc(state.searchQuery)}" autofocus>
        </div>
        <button class="filter-toggle-btn ${hasFilters ? 'active' : ''}" id="filter-toggle">${ICONS.filter}${hasFilters ? `<span class="filter-badge">${state.searchFilterTags.length}</span>` : ''}</button>
        <button class="search-close-btn" id="search-close">✕</button>
      </div>
      ${state.searchFilterOpen ? `
      <div class="filter-panel" id="filter-panel">
        ${Object.entries(tagGroups).map(([group, tags]) => {
          const prefix = group === 'Color 1 (Primary)' ? 'c1:' : group === 'Color 2 (Secondary)' ? 'c2:' : '';
          return `<div class="filter-group">
            <h4 class="filter-group-label">${esc(group)}</h4>
            <div class="filter-tags">
              ${tags.map(t => {
                const tagVal = prefix + t;
                return `<button class="filter-tag ${state.searchFilterTags.includes(tagVal) ? 'active' : ''}" data-filter-tag="${esc(tagVal)}">${esc(t)}</button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
        ${hasFilters ? `<button class="filter-clear-btn" id="filter-clear">Clear all filters</button>` : ''}
      </div>` : ''}
      ${hasFilters ? `
        <div class="active-filters hide-scrollbar">
          ${state.searchFilterTags.map(t => {
            const label = t.startsWith('c1:') ? `${t.slice(3)} (1)` : t.startsWith('c2:') ? `${t.slice(3)} (2)` : t;
            return `<button class="active-filter-pill" data-remove-filter="${esc(t)}">${esc(label)} ✕</button>`;
          }).join('')}
        </div>` : ''}
    </div>
    <div id="search-results">
      ${hasQuery ? `
        <div class="search-results-header">
          <p class="text-secondary">${results.total} result${results.total !== 1 ? 's' : ''}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ''}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? 's' : ''})` : ''}</p>
        </div>
        <div class="item-grid">
          ${results.items.map((item, idx) => renderItemCard(state, item, idx)).join('')}
        </div>
        ${results.items.length < results.total ? '<div id="search-scroll-sentinel" style="height:1px"></div>' : ''}
      ` : `
        <div class="empty-state">
          <p class="empty-emoji">🔍</p>
          <p class="empty-title">Search by name or tags</p>
          <p class="empty-text">Try "chair", "blue", "elegant", or "DIY"</p>
        </div>
      `}
    </div>
  </div>`;
}

export async function renderCatalog(state) {
  const categories = data.getCategories();
  const isRandom = state.isRandom;
  let items, total;

  if (isRandom) {
    items = state.randomItems;
    total = data.getExpandedTotal();
  } else if (state.expandedItems) {
    items = state.expandedItems;
    total = state.expandedTotal;
  } else {
    // Fallback while loading
    const result = data.getItemsByCategory(
      state.activeCategory === 'All' ? null : state.activeCategory,
      0, state.loadedCount + 50
    );
    items = result.items;
    total = result.total;
    state.loadedCount = items.length;
  }

  // Render search section if search is active
  if (state.searchOpen) {
    return renderCatalogWithSearch(state);
  }

  // Create a bound renderItemCard for ads module
  const boundRenderItemCard = (item, idx) => renderItemCard(state, item, idx);

  return `<div class="page">
    <div class="app-header">
      <div>
        <p class="label-upper mb-4">Welcome to</p>
        <h1 class="heading-xl">ACNHEX Market</h1>
      </div>
    </div>

    <div class="hero-receipt-banner">
      <div class="hero-search-row">
        <div class="hero-search-fake" id="search-open-label">
          <span class="hero-search-icon">${ICONS.search}</span>
          <span class="hero-search-placeholder">Search items or tags...</span>
        </div>
        <button class="header-btn hero-filter-btn" id="search-open">${ICONS.filter}</button>
      </div>

      <div class="hero-inner">
        <div class="receipt">
          <div class="receipt-header">
            <div class="receipt-stars">✦ ACNHEX Market ✦</div>
            <div class="receipt-date">Nook Inc. Official Item Registry</div>
          </div>
          <div class="receipt-lines">
            <div class="receipt-line r-visible">
              <span class="receipt-swatch" style="background:#e87070"></span>
              <span class="receipt-item-name">bunk bed</span>
              <span class="receipt-item-hex">206A</span>
            </div>
            <div class="receipt-line r-visible">
              <span class="receipt-swatch" style="background:#6a823e"></span>
              <span class="receipt-item-name">public telephone</span>
              <span class="receipt-item-hex">3019</span>
            </div>
            <div class="receipt-line r-visible">
              <span class="receipt-swatch" style="background:#e6b1c4"></span>
              <span class="receipt-item-name">Pave's photo</span>
              <span class="receipt-item-hex">018B</span>
            </div>
          </div>
          <hr class="receipt-divider">
          <div class="receipt-cmd-label">BOT COMMAND</div>
          <div class="receipt-cmd r-visible">
            <span class="code-keyword">$order</span> <span class="code-value">000000480000206A</span><br><span class="code-value">0000000100003019</span><br><span class="code-value">000000000000018B</span>
          </div>
        </div>
      </div>

      <div class="hero-bottom">
        <div class="hero-nook-badge"><span>✦</span> NOOK INC. CERTIFIED</div>
        <div class="hero-tagline">Browse. Pick.</div>
        <div class="hero-tagline-green">Order instantly.</div>
        <div class="hero-subtitle">25,000+ ACNH items → Discord bot commands in seconds.</div>
      </div>
    </div>

    ${await renderRecentlyViewed(state)}

    ${await renderDailyPick(state)}

    <div class="catalog-section-padding">
      <div class="section-header-row">
        <h3 class="heading-section">Categories</h3>
      </div>
      <div class="categories-wrapper at-start" id="cat-wrapper">
        <button class="cat-arrow left hidden" id="cat-arrow-left">${ICONS.chevronLeft}</button>
        <button class="cat-arrow right" id="cat-arrow-right"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        <div class="categories-scroll hide-scrollbar" id="cat-scroll">
          <button class="cat-btn ${state.activeCategory === 'All' ? 'active' : ''}" data-cat="All">
            <div class="cat-icon"><span>🍃</span></div>
            <span class="cat-label">All</span>
          </button>
          ${categories.map(c => `
            <button class="cat-btn ${state.activeCategory === c.name ? 'active' : ''}" data-cat="${esc(c.name)}">
              <div class="cat-icon"><span>${c.emoji}</span></div>
              <span class="cat-label">${esc(c.name)}</span>
            </button>`).join('')}
        </div>
      </div>
    </div>

    <div class="catalog-results-header">
      <h3 class="heading-section">${isRandom ? 'Random Picks' : state.activeCategory === 'All' ? 'All Items' : esc(state.activeCategory)}</h3>
      <span class="text-secondary">${total} found</span>
    </div>

    <div class="item-grid">
      ${ads.renderItemGridWithAds(items, boundRenderItemCard)}
    </div>

    ${items.length < total && !isRandom && state.loadMode === 'batch' ? `<button class="load-more-btn" id="load-more">Load More</button>` : ''}
    ${items.length < total && !isRandom && state.loadMode === 'scroll' ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
    ${isRandom && items.length < total ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
  </div>`;
}
