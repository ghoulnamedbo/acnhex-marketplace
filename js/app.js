import * as storage from './storage.js';
import * as data from './data.js';
import * as reviews from './reviews.js';
import * as ads from './ads.js';
import NookSounds from './sounds.js';

// ─── SVG Icons ───
const ICONS = {
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  heart: (filled) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="${filled ? 'var(--blossoms)' : 'none'}" stroke="${filled ? 'var(--blossoms)' : 'currentColor'}" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartLg: (filled) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="${filled ? 'var(--blossoms)' : 'none'}" stroke="${filled ? 'var(--blossoms)' : 'currentColor'}" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  wishlistNav: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  cart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevronLeft: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  arrowRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  filter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
};

// ─── App State ───
const state = {
  page: 'catalog',
  cart: storage.getCart(),
  wishlists: null,
  viewingListId: null,
  wishlistToast: null,
  listPickerItem: null,
  setPickerItems: null,
  setPickerName: null,
  prefix: storage.getPrefix(),
  seenIntro: storage.getSeenIntro(),
  loadMode: storage.getLoadMode(),
  activeCategory: 'All',
  selectedItemId: null,
  selectedVariantIdx: 0,
  itemDetail: null,
  searchOpen: false,
  searchQuery: '',
  searchResults: null,
  searchFilterTags: [],
  searchFilterOpen: false,
  loadedCount: 0,
  isRandom: false,
  randomItems: [],
  randomUsedIndices: new Set(),
  expandedItems: null,
  expandedTotal: 0,
  expandedLoading: false,
  scrollY: 0,
  previousPage: null,
  savedSearch: null,
  catScrollLeft: 0,
  similarScrollLeft: 0,
  adToastVisible: false,
  activePopup: null,
  adPageViews: 0,
  itemsViewed: 0,
  sessionStart: Date.now(),
  firstCartAddDone: false,
  floatingNotif: null,
  floatingNotifTimer: null,
  floatingNotifAutoTimer: null,
  hhpTimerStarted: false,
  detailHistory: [],
  soundEnabled: false,
  soundVolume: 0.5,
  // Fake ad preferences (default OFF)
  adsEnabled: false,
  adsBanners: false,
  adsInterstitials: false,
  adsPopups: false,
  adsFloatingNotifs: false,
  // Detail page V2
  detailsExpanded: false,
  variantDrawerOpen: false,
  // Saved detail state for tab switching
  _savedDetailState: null,
};

const app = document.getElementById('app');

// ─── Wishlists Init & Helpers ───
function initWishlists() {
  let wl = storage.getWishlists();
  if (!wl) {
    // Migrate from old flat wishlist
    let oldList = storage.getWishlist();
    // Handle old plain string format
    if (oldList.length > 0 && typeof oldList[0] === 'string') {
      oldList = oldList.map(id => ({ id, variantIdx: 0 }));
    }
    wl = { lists: [{ id: '__loved__', name: 'Loved Items', cap: null, items: oldList }] };
    storage.setWishlists(wl);
  }
  state.wishlists = wl;
}
initWishlists();

// Load sound preferences from localStorage
state.soundEnabled = localStorage.getItem('acnhex_sound_enabled') === 'true';
state.soundVolume = parseFloat(localStorage.getItem('acnhex_sound_volume')) || 0.5;
NookSounds.setEnabled(state.soundEnabled);
NookSounds.setVolume(state.soundVolume);

// Load ad preferences from localStorage (default OFF)
state.adsEnabled = localStorage.getItem('acnhex_ads_enabled') === 'true';
state.adsBanners = localStorage.getItem('acnhex_ads_banners') === 'true';
state.adsInterstitials = localStorage.getItem('acnhex_ads_interstitials') === 'true';
state.adsPopups = localStorage.getItem('acnhex_ads_popups') === 'true';
state.adsFloatingNotifs = localStorage.getItem('acnhex_ads_floating') === 'true';

// Expose ad preferences for ads.js module
window.getAdPrefs = () => ({
  enabled: state.adsEnabled,
  banners: state.adsBanners,
  interstitials: state.adsInterstitials,
  popups: state.adsPopups,
  floatingNotifs: state.adsFloatingNotifs,
});

function isInWishlist(id, variantIdx = 0) {
  return state.wishlists.lists.some(list =>
    list.items.some(w => w.id === id && w.variantIdx === variantIdx)
  );
}

function findItemList(id, variantIdx = 0) {
  return state.wishlists.lists.find(list =>
    list.items.some(w => w.id === id && w.variantIdx === variantIdx)
  );
}

let toastTimer = null;
function showWishlistToast(itemId, variantIdx, listName, isRemoval = false) {
  clearTimeout(toastTimer);
  state.wishlistToast = { itemId, variantIdx, listName, isRemoval };
  toastTimer = setTimeout(() => {
    state.wishlistToast = null;
    const el = document.getElementById('wl-toast');
    if (el) el.remove();
  }, 3000);
}

function getTotalWishlistItems() {
  return state.wishlists.lists.reduce((sum, l) => sum + l.items.length, 0);
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ─── Navigation ───
function renderNav() {
  const tabs = [
    { id: 'catalog', label: 'Browse', icon: ICONS.home },
    { id: 'wishlist', label: 'Wishlist', icon: ICONS.wishlistNav },
    { id: 'cart', label: 'Cart', icon: ICONS.cart, badge: state.cart.length },
    { id: 'settings', label: 'Settings', icon: ICONS.settings },
    { id: 'info', label: 'Info', icon: ICONS.info },
  ];
  const activePage = state.page === 'detail' ? 'catalog' : state.page;
  return `<nav class="bottom-nav">${tabs.map(t => `
    <button class="nav-tab ${activePage === t.id ? 'active' : ''}" data-nav="${t.id}">
      <div style="position:relative">${t.icon}${t.badge ? `<span class="nav-badge">${t.badge}</span>` : ''}</div>
      <span>${t.label}</span>
    </button>`).join('')}</nav>`;
}

// ─── Image Helper ───
function itemImg(src, bg, size = 'full') {
  const bgColor = bg || data.getItemBg(0);
  if (!src) return `<div class="emoji-fallback" style="background:${bgColor}">📦</div>`;
  return `<img src="${esc(src)}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=emoji-fallback>📦</span>'" alt="" style="background:${bgColor}">`;
}

// ─── Catalog Page ───
async function renderCatalog() {
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
    return renderCatalogWithSearch();
  }

  return `<div class="page">
    <div class="app-header">
      <div>
        <p class="label-upper" style="margin-bottom:4px">Welcome to</p>
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

    <div style="padding:0 24px;margin-top:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
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

    <div style="padding:20px 24px 14px;display:flex;justify-content:space-between;align-items:center">
      <h3 class="heading-section">${isRandom ? 'Random Picks' : state.activeCategory === 'All' ? 'All Items' : esc(state.activeCategory)}</h3>
      <span class="text-secondary">${total} found</span>
    </div>

    <div class="item-grid">
      ${ads.renderItemGridWithAds(items, renderItemCard)}
    </div>

    ${items.length < total && !isRandom && state.loadMode === 'batch' ? `<button class="load-more-btn" id="load-more">Load More</button>` : ''}
    ${items.length < total && !isRandom && state.loadMode === 'scroll' ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
    ${isRandom && items.length < total ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
  </div>`;
}

// ─── Catalog with Integrated Search ───
function renderCatalogWithSearch() {
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
        <div style="padding:16px 24px 8px;display:flex;justify-content:space-between;align-items:center">
          <p class="text-secondary">${results.total} result${results.total !== 1 ? 's' : ''}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ''}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? 's' : ''})` : ''}</p>
        </div>
        <div class="item-grid">
          ${results.items.map((item, idx) => renderItemCard(item, idx)).join('')}
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

function renderItemCard(item, idx) {
  const bg = data.getItemBg(idx);
  const vi = item.variantIdx ?? 0;
  const inWishlist = isInWishlist(item.id, vi);
  const cartFull = getCartTotal() >= 40;
  const qtyInCart = getCartQtyForItem(item.id, vi);
  const showCounter = qtyInCart > 0;
  return `<div class="item-card" data-item="${esc(item.id)}" data-vi="${vi}">
    <div class="item-thumb" style="background:${bg}">
      ${item.img ? `<img src="${esc(item.img)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="heart-btn" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heart(inWishlist)}</button>
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

// ─── Item Detail ───
let _reviewCache = { itemId: null, data: null };

// Thumbnail background colors for orbit items
const thumbBgs = [
  'linear-gradient(135deg, #FDF6F0, #FAE5DC)',
  'linear-gradient(135deg, #F0F6E8, #E2EDCE)',
  'linear-gradient(135deg, #E8F4FA, #D0E8F5)',
  'linear-gradient(135deg, #FFF8E7, #FAECC0)',
  'linear-gradient(135deg, #F5F0F8, #E8DCF0)',
  'linear-gradient(135deg, #F0FAF5, #D5F0E0)',
  'linear-gradient(135deg, #FFF5F5, #FFE0E0)',
  'linear-gradient(135deg, #F5FAFF, #E0EFFF)',
];

async function renderDetail() {
  if (!state.itemDetail) {
    return `<div class="page"><div class="loading"><div class="spinner"></div><p class="text-secondary">Loading...</p></div></div>`;
  }

  const item = state.itemDetail;
  const vi = state.selectedVariantIdx;
  const variant = item.variants[vi] || item.variants[0];
  const bg = data.getItemBg(0);
  const inWishlist = isInWishlist(item.id, vi);
  const cartFull = getCartTotal() >= 40;
  const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;
  let reviewData;
  if (_reviewCache.itemId === item.id && _reviewCache.data) {
    reviewData = _reviewCache.data;
  } else {
    reviewData = await reviews.generateReviewSection(item);
    _reviewCache = { itemId: item.id, data: reviewData };
  }
  const similarHtml = await renderSimilarItems(item);

  // All detail fields for collapsible section
  const allFields = [
    ['Hex ID', item.hexBase, 'hex'],
    ['Size', item.size, 'text'],
    ['Hex ID (Variated)', variant.hexVariated || variant.hex || item.hexBase, 'hex'],
    ['Catalog', item.catalog, 'text'],
    ['HHA Concepts', [item.hhaConcept1, item.hhaConcept2].filter(Boolean).join(', '), 'text'],
    ['HHA Series', item.hhaSeries, 'text'],
    ['HHA Set', item.hhaSet, 'text'],
    ['Styles', (item.tags || []).filter(t => ['active','cool','cute','elegant','gorgeous','simple'].includes(t)).join(', '), 'text'],
    ['Colors', [variant.color1, variant.color2].filter(Boolean).join(', '), 'text'],
    ['DIY', item.diy, 'text'],
  ].filter(([, v]) => v && v !== 'NA' && v !== 'None');

  // Primary fields (always visible): Hex ID and Size
  const primaryFields = allFields.filter(([label]) => label === 'Hex ID' || label === 'Size');
  // Secondary fields (collapsible)
  const secondaryFields = allFields.filter(([label]) => label !== 'Hex ID' && label !== 'Size');

  // Render a field row with hex badge or plain text
  const renderFieldRow = ([label, val, type]) => {
    if (type === 'hex') {
      return `<div class="detail-field-row">
        <span class="detail-field-label">${esc(label)}</span>
        <button class="hex-copy-badge" data-hex="${esc(val)}">${esc(val)}</button>
      </div>`;
    }
    return `<div class="detail-field-row">
      <span class="detail-field-label">${esc(label)}</span>
      <span class="detail-field-value">${esc(String(val))}</span>
    </div>`;
  };

  // Determine if we use smooth animations (< 15 variants) or instant mode (15+)
  const useAnimations = item.variants.length < 15;

  return `<div class="page">
    <div class="detail-hero-orbit" id="detail-hero" style="background:${bg}">
      <button class="glass-btn left" id="detail-back">${ICONS.chevronLeft}</button>
      <button class="glass-btn right" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heartLg(inWishlist)}</button>

      ${item.variants.length > 1 ? (() => {
        const total = item.variants.length;

        // For < 15 variants: render ALL items with circular positioning
        // For 15+ variants: use windowed approach with 5 visible items
        if (useAnimations) {
          // Render ALL variants for smooth circular orbit animation
          return `
      <div class="variant-orbit-container">
        <button class="variant-orbit-chevron variant-orbit-chevron-left" aria-label="Previous variant">‹</button>

        <div class="variant-orbit-track variant-orbit-track--circular" data-count="${total}" data-selected="${vi}">
          ${item.variants.map((v, idx) => {
            const isCenter = idx === vi;
            const isWishlisted = state.wishlists.lists.some(list =>
              list.items.some(wi => wi.id === item.id && wi.variantIdx === idx)
            );
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${isWishlisted ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
                onerror="this.style.display='none';this.parentNode.querySelector('.variant-orbit-fallback').style.display='flex';">
              <div class="variant-orbit-fallback" style="display:none;">📦</div>
              ${isCenter ? `<span class="variant-orbit-label">${esc(v.name)}</span>` : ''}
            </div>`;
          }).join('')}
        </div>

        <button class="variant-orbit-chevron variant-orbit-chevron-right" aria-label="Next variant">›</button>

        <div class="variant-orbit-dots">
          ${item.variants.map((_, idx) =>
            `<div class="variant-orbit-dot${idx === vi ? ' variant-orbit-dot--active' : ''}"></div>`
          ).join('')}
        </div>

        <div class="variant-orbit-hint">← swipe to rotate →</div>
      </div>`;
        } else {
          // Windowed approach for 15+ variants
          const windowSize = Math.min(5, total);
          const halfWindow = Math.floor(windowSize / 2);
          const visibleIndices = [];
          for (let i = -halfWindow; i <= halfWindow; i++) {
            const idx = ((vi + i) % total + total) % total;
            visibleIndices.push(idx);
          }
          const uniqueVisible = [...new Set(visibleIndices)];

          return `
      <div class="variant-orbit-container variant-orbit-container--instant">
        <button class="variant-orbit-chevron variant-orbit-chevron-left" aria-label="Previous variant">‹</button>

        <div class="variant-orbit-track" data-count="${total}" data-selected="${vi}">
          ${uniqueVisible.map((idx, pos) => {
            const v = item.variants[idx];
            const isCenter = idx === vi;
            const isWishlisted = state.wishlists.lists.some(list =>
              list.items.some(wi => wi.id === item.id && wi.variantIdx === idx)
            );
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-orbit-pos="${pos}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${isWishlisted ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
                onerror="this.style.display='none';this.parentNode.querySelector('.variant-orbit-fallback').style.display='flex';">
              <div class="variant-orbit-fallback" style="display:none;">📦</div>
              ${isCenter ? `<span class="variant-orbit-label">${esc(v.name)}</span>` : ''}
            </div>`;
          }).join('')}
        </div>

        <button class="variant-orbit-chevron variant-orbit-chevron-right" aria-label="Next variant">›</button>

        <div class="variant-orbit-progress">
          <div class="variant-orbit-progress-fill" style="width:${((vi + 1) / total) * 100}%"></div>
          <span class="variant-orbit-progress-text">${vi + 1} / ${total}</span>
        </div>

        <div class="variant-orbit-hint">← swipe to rotate →</div>
      </div>`;
        }
      })() : `
      <div class="detail-single-variant">
        ${variant.image ? `<img src="${esc(variant.image)}" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      </div>`}
    </div>

    <div class="detail-content">
      <div class="detail-title-row">
        <div class="detail-title-left">
          <h2 class="heading-lg">${esc(item.name)}</h2>
          <span class="text-secondary detail-variant-name">${esc(variant.name)}</span>
        </div>
        <div class="detail-title-right">
          <div class="detail-rating">
            <span>⭐</span>
            <span class="detail-rating-value">${reviewData.avgRating}</span>
          </div>
          ${item.variants.length > 1 ? `
          <button class="variant-drawer-trigger" data-action="open-variant-drawer">
            <span>☰</span> All ${item.variants.length}
          </button>` : ''}
        </div>
      </div>

      <div class="tag-pills">
        ${(item.tags || []).slice(0, 8).map(t => `<span class="tag-pill">${esc(t)}</span>`).join('')}
      </div>

      ${item.hhaSet && item.hhaSet !== 'None' ? `
      <div class="detail-set-card">
        <div class="detail-set-icon">🪴</div>
        <div class="detail-set-info">
          <div class="detail-set-name">${esc(item.hhaSet)} series</div>
          <div class="detail-set-count">Part of a set</div>
        </div>
        <div class="detail-set-actions">
          <button class="detail-set-action-btn" data-set-cart="${esc(item.hhaSet)}" title="Add set to cart">
            <span class="detail-set-action-plus">+</span>${ICONS.cart.replace(/width="24" height="24"/, 'width="16" height="16"')}
          </button>
          <button class="detail-set-action-btn" data-set-list="${esc(item.hhaSet)}" title="Save set to list">
            <span class="detail-set-action-plus">+</span>${ICONS.wishlistNav.replace(/width="24" height="24"/, 'width="16" height="16"')}
          </button>
        </div>
      </div>
      ` : ''}

      <div class="details-card" id="detail-fields">
        <div class="detail-section-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <span class="label-upper">Details</span>
          ${secondaryFields.length > 0 && !state.detailsExpanded ? `<span class="detail-more-hint">${secondaryFields.length} more fields</span>` : ''}
        </div>

        ${primaryFields.map(renderFieldRow).join('')}

        ${secondaryFields.length > 0 ? `
        <div class="detail-fields-collapsible${state.detailsExpanded ? ' detail-fields-collapsible--open' : ''}">
          ${secondaryFields.map(renderFieldRow).join('')}
        </div>

        <button class="detail-expand-toggle" data-action="toggle-details">
          <span class="detail-expand-arrow${state.detailsExpanded ? ' detail-expand-arrow--flipped' : ''}">▾</span>
          ${state.detailsExpanded ? 'Show less' : 'Show all details'}
        </button>
        ` : ''}
      </div>

      ${reviewData.html}

      ${similarHtml}
    </div>

    <div class="sticky-cta" id="detail-cta">
      <button class="cta-btn-secondary" id="detail-add-to-list" data-list-item="${esc(item.id)}" data-list-vi="${vi}">
        📋 Add to List
      </button>
      <div class="detail-cart-btn-wrap" data-cart-item-id="${esc(item.id)}" data-cart-vi="${vi}">
        <button class="detail-add-cart-btn${qtyInCart > 0 ? ' hidden' : ''}" id="detail-add-cart" ${cartFull ? 'disabled' : ''}>
          ${ICONS.plus} Add to Cart
        </button>
        <div class="detail-qty-counter${qtyInCart > 0 ? ' visible' : ''}">
          <button class="detail-qty-counter-btn" data-detail-qty-minus>−</button>
          <span class="detail-qty-counter-val" id="detail-qty-cart">${qtyInCart}</span>
          <button class="detail-qty-counter-btn" data-detail-qty-plus ${cartFull ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>

    <div class="variant-drawer-backdrop${state.variantDrawerOpen ? ' variant-drawer-backdrop--open' : ''}" data-action="close-variant-drawer"></div>
    <div class="variant-drawer${state.variantDrawerOpen ? ' variant-drawer--open' : ''}">
      <div class="variant-drawer-handle"></div>
      <div class="variant-drawer-header">
        <span class="label-upper">All Variants</span>
        <span class="text-secondary">${item.variants.length} variants</span>
      </div>
      <div class="variant-drawer-table-header">
        <span></span><span>NAME</span><span>CLR 1</span><span>CLR 2</span><span>HEX</span>
      </div>
      <div class="variant-drawer-scroll">
        ${item.variants.map((v, idx) => {
          const isSel = idx === vi;
          const isWish = state.wishlists.lists.some(list =>
            list.items.some(wi => wi.id === item.id && wi.variantIdx === idx)
          );
          return `<button class="variant-drawer-row${isSel ? ' variant-drawer-row--selected' : ''}" data-drawer-variant="${idx}">
            <div class="variant-drawer-thumb" style="background:${thumbBgs[idx % thumbBgs.length]}">
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <span style="display:none;font-size:16px;">📦</span>
              ${isWish ? '<div class="variant-drawer-heart-dot">♥</div>' : ''}
            </div>
            <span class="variant-drawer-name">${esc(v.name)}</span>
            <span class="variant-drawer-color">${esc(v.color1 || '-')}</span>
            <span class="variant-drawer-color">${esc(v.color2 || '-')}</span>
            <span class="hex-copy-badge" data-hex="${esc(v.hexVariated || v.hex || item.hexBase)}">${esc((v.hexVariated || v.hex || item.hexBase).slice(-4).toUpperCase())}</span>
          </button>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

// ─── Similar Items Section ───
const STYLE_TAGS = new Set(['active','cool','cute','elegant','gorgeous','simple']);
let _similarCache = { itemId: null, matches: null, badgeText: null };

async function renderSimilarItems(item) {
  try {
    let allMatches, badgeText;

    // Reuse cached matches for the same item (prevents reshuffle on heart toggle re-render)
    if (_similarCache.itemId === item.id && _similarCache.matches) {
      allMatches = _similarCache.matches;
      badgeText = _similarCache.badgeText;
    } else {
      const categoryItems = await data.getCategoryItems(item.category);
      if (!categoryItems || categoryItems.length < 2) return '';

      const vi = state.selectedVariantIdx;
      const variant = item.variants[vi] || item.variants[0];
      const curSet = (item.hhaSet || '').trim();
      const curSeries = (item.hhaSeries || '').trim();
      const curStyles = (item.tags || []).filter(t => STYLE_TAGS.has(t.toLowerCase()));
      const curColor1 = (variant.color1 || '').toLowerCase();
      const curColor2 = (variant.color2 || '').toLowerCase();

      const setMatches = [];
      const styleMatches = [];
      const colorMatches = [];
      const seen = new Set();

      for (const other of categoryItems) {
        if (other.id === item.id) continue;
        if (seen.has(other.id)) continue;

        const ov = other.variants[0];
        if (!ov) continue;

        const otherSet = (other.hhaSet || '').trim();
        const otherSeries = (other.hhaSeries || '').trim();
        if ((curSet && curSet !== 'None' && otherSet === curSet) ||
            (curSeries && curSeries !== 'None' && otherSeries === curSeries)) {
          seen.add(other.id);
          setMatches.push({ item: other, variant: ov, matchType: 'set' });
          continue;
        }

        const otherStyles = (other.tags || []).filter(t => STYLE_TAGS.has(t.toLowerCase()));
        if (curStyles.length && otherStyles.some(s => curStyles.includes(s))) {
          seen.add(other.id);
          styleMatches.push({ item: other, variant: ov, matchType: 'style' });
          continue;
        }

        const oc1 = (ov.color1 || '').toLowerCase();
        const oc2 = (ov.color2 || '').toLowerCase();
        if ((curColor1 && (oc1 === curColor1 || oc2 === curColor1)) ||
            (curColor2 && (oc1 === curColor2 || oc2 === curColor2))) {
          seen.add(other.id);
          colorMatches.push({ item: other, variant: ov, matchType: 'color' });
          continue;
        }
      }

      const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
      allMatches = [...shuffle(setMatches), ...shuffle(styleMatches), ...shuffle(colorMatches)].slice(0, 12);

      const badgeParts = [];
      if (curSet && curSet !== 'None') badgeParts.push(curSet);
      else if (curSeries && curSeries !== 'None') badgeParts.push(curSeries);
      if (curStyles.length) badgeParts.push(curStyles[0]);
      if (curColor1) badgeParts.push(variant.color1);
      badgeText = badgeParts.slice(0, 2).join(' \u00b7 ') || 'Similar';

      // Cache for this item so re-renders (heart toggles) don't reshuffle
      _similarCache = { itemId: item.id, matches: allMatches, badgeText };
    }

    if (allMatches.length === 0) return '';

    const cardsHtml = allMatches.map((m, idx) => {
      const o = m.item;
      const v = m.variant;
      const inWL = isInWishlist(o.id, 0);
      const hex = v.hexVariated || v.hex || o.hexBase;
      const shortHex = hex.length > 6 ? hex.slice(-4).toUpperCase() : hex.toUpperCase();
      const matchClass = m.matchType === 'set' ? 'match-set' : m.matchType === 'style' ? 'match-style' : 'match-color';
      const matchLabel = m.matchType === 'set' ? 'SET' : m.matchType === 'style' ? 'STYLE' : 'COLOR';
      return `<div class="similar-card" data-item="${esc(o.id)}" data-vi="0">
        <div class="similar-card-image" style="background:${data.getItemBg(idx)}">
          <span class="similar-match-tag ${matchClass}">${matchLabel}</span>
          <button class="similar-card-heart" data-heart="${esc(o.id)}" data-heart-vi="0">${ICONS.heart(inWL)}</button>
          ${v.image ? `<img src="${esc(v.image)}" loading="lazy" onerror="this.outerHTML='<span style=font-size:52px>📦</span>'" alt="">` : '<span style="font-size:52px">📦</span>'}
        </div>
        <div class="similar-card-info">
          <div class="similar-card-name">${esc(o.name)}</div>
          <div class="similar-card-variant">${esc(v.name)}</div>
          <span class="similar-card-hex">${esc(shortHex)}</span>
        </div>
      </div>`;
    }).join('');

    return `<div class="similar-section" style="padding-left:24px;padding-right:24px">
      <div class="similar-header">
        <h4 class="label-upper" style="margin:0;display:flex;align-items:center;gap:6px"><span style="font-size:14px">🍃</span> SIMILAR ITEMS</h4>
        <span class="similar-badge">${esc(badgeText)}</span>
      </div>
      <div class="similar-scroll-wrapper">
        <button class="similar-arrow left" id="similar-arrow-left">‹</button>
        <div class="similar-scroll hide-scrollbar" id="similar-scroll">
          ${cardsHtml}
        </div>
        <button class="similar-arrow right" id="similar-arrow-right">›</button>
      </div>
    </div>`;
  } catch (e) {
    console.warn('Similar items error:', e);
    return '';
  }
}

// ─── Cart Page ───
const CART_EMPTY_QUOTES = [
  "Your pockets are empty! Time to go shopping, hm?",
  "No items? Nook Inc. believes in you! Browse away!",
  "Even a journey of 40 items begins with a single add!",
  "Tom Nook is tapping his foot… go find something nice!",
];
function getShortHex(hex) {
  if (!hex) return '';
  return hex.length > 6 ? hex.slice(-4).toUpperCase() : hex.toUpperCase();
}

function renderCart() {
  const cart = state.cart;
  const prefix = state.prefix;
  const total = getCartTotal();
  const hexes = cart.map(c => c.hex);

  return `<div class="page cart-page">
    <!-- Ledger Header -->
    <div class="ledger-header">
      <div class="ledger-header-top">
        <div>
          <div class="ledger-sub">Order Ledger</div>
          <div class="ledger-title">Your Cart</div>
        </div>
        <div class="ledger-right">
          <div class="ledger-count">${total}<span class="ledger-count-max">/40</span></div>
          ${cart.length > 0 ? `<button class="ledger-clear-btn" id="clear-cart">Clear</button>` : ''}
        </div>
      </div>
      <div class="ledger-progress">
        <div class="ledger-progress-track">
          <div class="ledger-progress-fill ${total > 35 ? 'danger' : ''}" style="width:${(total / 40) * 100}%"></div>
        </div>
        <div class="ledger-progress-labels">
          <span>${total} items</span>
          <span>${40 - total} slots open</span>
        </div>
      </div>
    </div>

    ${cart.length === 0 ? `
      <!-- Empty State -->
      <div class="cart-empty-card">
        <div class="cart-empty-inner">
          <div class="cart-empty-leaves">
            <div class="cart-leaf" style="left:15%;animation-delay:0s">🍃</div>
            <div class="cart-leaf" style="left:37%;animation-delay:1.6s">🌱</div>
            <div class="cart-leaf" style="left:59%;animation-delay:3.2s">🍃</div>
            <div class="cart-leaf" style="left:81%;animation-delay:4.8s">🌱</div>
          </div>
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-title">Your cart is empty!</div>
          <div class="cart-empty-quote">
            "${esc(CART_EMPTY_QUOTES[Math.floor(Math.random() * CART_EMPTY_QUOTES.length)])}"
            <div class="cart-empty-attr">— Nook Inc.</div>
          </div>
          <button class="cart-empty-cta" data-nav="catalog">🏠 Start Shopping</button>
        </div>
      </div>` : `
      <!-- Ledger Items -->
      <div class="ledger-items">
        ${cart.map((item, idx) => `
          <div class="ledger-row" style="animation-delay:${idx * 0.07}s" data-cart-row="${idx}">
            <div class="ledger-num">${String(idx + 1).padStart(2, '0')}</div>
            <div class="ledger-thumb" style="background:${data.getItemBg(idx)}">
              ${item.img ? `<img src="${esc(item.img)}" onerror="this.outerHTML='📦'" alt="">` : '📦'}
            </div>
            <div class="ledger-info">
              <div class="ledger-item-name">${esc(item.name)}</div>
              <div class="ledger-item-meta">
                ${esc(item.variant)}
                <span class="ledger-dot">·</span>
                <code class="ledger-hex-pill">${esc(getShortHex(item.hex))}</code>
              </div>
            </div>
            <button class="ledger-dupe-btn" data-dupe-idx="${idx}" ${getCartTotal() >= 40 ? 'disabled' : ''}>+</button>
            <button class="ledger-remove-btn" data-remove-idx="${idx}">✕</button>
          </div>`).join('')}
      </div>

      <!-- Tear Line -->
      <div class="tear-line">
        <span class="tear-label">✂ tear here</span>
      </div>

      <!-- Shipping Label -->
      <div class="shipping-section">
        <div class="shipping-header">
          <span class="shipping-header-label">Bot Command</span>
          <span class="shipping-header-count">${total} items</span>
        </div>

        <div class="tape-strip tape-top"></div>

        <div class="shipping-label" id="copy-cmd">
          <!-- Barcode -->
          <div class="barcode">
            ${Array.from({ length: 28 }).map((_, i) =>
              `<div class="barcode-bar" style="width:${i % 3 === 0 ? 3 : 1.5}px;height:${i % 5 === 0 ? 24 : 18}px;opacity:${(0.6 + (i % 7) * 0.06).toFixed(2)}"></div>`
            ).join('')}
          </div>

          <div class="ship-to">Ship to: Discord</div>

          <!-- Item Manifest -->
          <div class="manifest">
            ${cart.map((item, i) => `
              <div class="manifest-row${i < cart.length - 1 ? '' : ' last'}">
                <span class="manifest-name">
                  <span class="manifest-dot" style="background:${data.getItemBg(i)}"></span>
                  ${esc(item.name)}
                </span>
                <code class="manifest-hex">${esc(getShortHex(item.hex))}</code>
              </div>`).join('')}
          </div>

          <!-- Full Command -->
          <div class="label-command">
            <span class="label-cmd-prefix">${esc(prefix)}order</span> ${hexes.map((hex, i) =>
              `<span class="label-cmd-hex">${esc(hex)}</span>${i < hexes.length - 1 ? '<span class="label-cmd-comma">, </span>' : ''}`
            ).join('')}
          </div>

          <!-- Footer -->
          <div class="label-footer">
            <span>QTY: ${total}</span>
            <span class="label-copy-hint">📋 tap to copy</span>
          </div>

          <!-- Copy Overlay (hidden by default, shown via JS) -->
          <div class="stamp-overlay" id="stamp-overlay">
            <div class="stamp-badge">📦 Copied!</div>
          </div>
        </div>

        <div class="tape-strip tape-bottom"></div>
      </div>

      <!-- Nook Footer -->
      <div class="nook-footer">✦ NOOK INC. CERTIFIED ✦</div>
    `}
  </div>`;
}

// ─── Wishlist Page ───
let lastRenderedListHexes = [];

async function renderWishlist() {
  if (state.viewingListId) return renderWishlistDetail();

  const lists = state.wishlists.lists;
  const totalItems = getTotalWishlistItems();

  return `<div class="page">
    <div class="page-header" style="padding-bottom:20px">
      <h1 class="heading-xl" style="margin-bottom:4px">Wishlist</h1>
      <p class="text-secondary">${lists.length} list${lists.length !== 1 ? 's' : ''} · ${totalItems} item${totalItems !== 1 ? 's' : ''}</p>
    </div>

    ${lists.length === 0 ? `
      <div class="empty-state">
        <p class="empty-emoji">💚</p>
        <p class="empty-title">No lists yet</p>
        <p class="empty-text">Tap the heart on items you love</p>
      </div>` : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${lists.map(list => `
          <div class="wishlist-item" data-view-list="${esc(list.id)}" style="cursor:pointer">
            <div class="wishlist-thumb" style="background:${data.getItemBg(0)}">
              <span class="emoji-fallback">${list.id === '__loved__' ? '💚' : '📋'}</span>
            </div>
            <div style="flex:1;min-width:0">
              <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">${esc(list.name)}</p>
              <p style="font-size:10px;color:var(--text-secondary)">${list.items.length}${list.cap ? ' / ' + list.cap : ''} items</p>
            </div>
            ${list.id !== '__loved__' ? `<button class="remove-btn" data-delete-list="${esc(list.id)}">${ICONS.trash}</button>` : ''}
          </div>`).join('')}
      </div>`}

    <div style="padding:20px 24px">
      <button class="cta-btn-secondary" id="create-new-list" style="width:100%">+ Create New List</button>
    </div>
  </div>`;
}

async function renderWishlistDetail() {
  const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
  if (!list) { state.viewingListId = null; return renderWishlist(); }

  const entries = [];
  for (const w of list.items) {
    const detail = await data.getItemDetail(w.id);
    if (!detail) continue;
    const vi = w.variantIdx || 0;
    const variant = detail.variants[vi] || detail.variants[0];
    entries.push({
      id: detail.id,
      n: detail.name,
      v1: variant.name,
      hex: variant.hexVariated || variant.hex || detail.hexBase,
      img: variant.image || detail.image,
      _vi: vi,
    });
  }
  lastRenderedListHexes = entries.map(e => e.hex);

  return `<div class="page">
    <div class="page-header" style="display:flex;align-items:center;gap:12px;padding-bottom:20px">
      <button class="glass-btn" id="list-back" style="flex-shrink:0">${ICONS.chevronLeft}</button>
      <div style="flex:1;min-width:0">
        <h1 class="heading-xl" style="margin-bottom:4px">${esc(list.name)}</h1>
        <p class="text-secondary">${entries.length}${list.cap ? ' / ' + list.cap : ''} items</p>
      </div>
      ${entries.length > 0 ? `<button class="copy-btn" id="copy-list-order" style="flex-shrink:0">${ICONS.copy} Copy Order</button>` : ''}
    </div>

    ${entries.length === 0 ? `
      <div class="empty-state">
        <p class="empty-emoji">📋</p>
        <p class="empty-title">List is empty</p>
        <p class="empty-text">Tap the heart on items to add them</p>
      </div>` : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${entries.map((item, idx) => {
          const vi = item._vi || 0;
          return `<div class="wishlist-item" data-item="${esc(item.id)}" data-vi="${vi}">
            <div class="wishlist-thumb" style="background:${data.getItemBg(idx)}">
              ${item.img ? `<img src="${esc(item.img)}" onerror="this.outerHTML='📦'" alt="">` : '📦'}
            </div>
            <div style="flex:1;min-width:0">
              <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">${esc(item.n)}</p>
              <p style="font-size:10px;color:var(--text-secondary)">${esc(item.v1)} · ${esc(item.hex)}</p>
            </div>
            <div class="wishlist-actions">
              <button class="wishlist-add-btn" data-wl-add data-wl-id="${esc(item.id)}" data-wl-vi="${vi}" data-wl-name="${esc(item.n)}" data-wl-variant="${esc(item.v1)}" data-wl-hex="${esc(item.hex)}" data-wl-img="${esc(item.img || '')}">
                ${ICONS.plus}
              </button>
              <button class="remove-btn" data-remove-list-idx="${idx}">${ICONS.trash}</button>
            </div>
          </div>`;
        }).join('')}
      </div>`}
  </div>`;
}

// ─── Settings Page ───
function renderSettings() {
  const presets = ['!', '.', '$', '?', '/'];
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Settings</h1>
      <p class="text-secondary" style="margin-bottom:28px">Configure your bot prefix</p>
    </div>

    <div style="padding:0 24px">
      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Bot Command Prefix</h4>
        <input type="text" class="prefix-input" id="prefix-input" value="${esc(state.prefix)}" maxlength="5">
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:16px">Quick Presets</h4>
        <div class="presets-grid">
          ${presets.map(p => `
            <button class="preset-btn ${state.prefix === p ? 'active' : ''}" data-preset="${esc(p)}">${esc(p)}</button>
          `).join('')}
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Preview</h4>
        <div class="code-block" style="border-radius:14px;padding:14px 16px;font-size:12px">
          <span class="code-keyword">${esc(state.prefix)}order</span>
          <span class="code-value">0x0A3F</span>
          <span class="code-value">0x1B2C</span>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Item Loading</h4>
        <div class="load-mode-options">
          <button class="load-mode-btn ${state.loadMode === 'batch' ? 'active' : ''}" data-settings-load="batch">
            <span class="load-mode-icon">📦</span>
            <span class="load-mode-label">Item Batches</span>
          </button>
          <button class="load-mode-btn ${state.loadMode === 'scroll' ? 'active' : ''}" data-settings-load="scroll">
            <span class="load-mode-icon">🔄</span>
            <span class="load-mode-label">Continuous Scroll</span>
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Nook Inc. Sound Package</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Adds soft pocket sounds to browsing. Tom Nook approved.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">🔊 Sound Effects</span>
          <label class="toggle-container">
            <input type="checkbox" id="soundToggle" ${state.soundEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="sound-volume-row ${state.soundEnabled ? '' : 'disabled'}">
          <span style="font-size:11px;color:var(--text-secondary)">🔈</span>
          <input type="range" id="soundVolume" class="sound-slider" min="0" max="1" step="0.05" value="${state.soundVolume}" ${state.soundEnabled ? '' : 'disabled'}>
          <span style="font-size:11px;color:var(--text-secondary)">🔊</span>
          <span id="volumeLabel" class="volume-label">${Math.round(state.soundVolume * 100)}%</span>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">🦝 Fake Promos</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Toggle the in-universe Animal Crossing fake ads and promos.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">Enable Fake Ads</span>
          <label class="toggle-container">
            <input type="checkbox" id="adsToggle" ${state.adsEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="ad-options-group ${state.adsEnabled ? '' : 'disabled'}" id="adOptionsGroup">
          <div class="ad-toggle-row">
            <span>🖼️ Banner Ads</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsBannersToggle" ${state.adsBanners ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>📺 Full-page Interstitials</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsInterstitialsToggle" ${state.adsInterstitials ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>💬 Popup Overlays</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsPopupsToggle" ${state.adsPopups ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>🔔 Floating Notifications</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsFloatingToggle" ${state.adsFloatingNotifs ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card" style="border:1px solid var(--dolce-pink)">
        <h4 class="label-upper" style="margin-bottom:14px;color:var(--danger)">Danger Zone</h4>
        <button class="clear-btn" id="clear-data">Clear All Data</button>
      </div>
    </div>
  </div>`;
}

// ─── Info Page ───
function renderInfo() {
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Info</h1>
      <p class="text-secondary" style="margin-bottom:28px">About ACNHEX Market</p>
    </div>

    <div style="padding:0 24px;display:flex;flex-direction:column;gap:14px">
      <div class="credit-card primary">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="credit-icon" style="background:var(--tag-bg)">📊</div>
          <div style="flex:1;min-width:0">
            <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">ACNH Spreadsheet</p>
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5">Primary source for item images, hex IDs, variant data, and catalog information.</p>
          </div>
        </div>
        <a href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit?gid=310491205#gid=310491205" target="_blank" rel="noopener noreferrer" class="credit-link">${ICONS.external} View Spreadsheet</a>
      </div>

      <div class="credit-card">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="credit-icon" style="background:var(--dolce-pink)">📱</div>
          <div>
            <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">Version Info</p>
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5">ACNHEX Market contains all items through the <strong>2.0.8 update</strong> of Animal Crossing: New Horizons.</p>
          </div>
        </div>
      </div>

      <div class="install-card">
        <h4>📱 Install on iOS</h4>
        <p>Open in Safari → Tap Share → Add to Home Screen</p>
      </div>

      <div class="install-card">
        <h4>📱 Install on Android</h4>
        <p>Open in Chrome → Tap ⋮ menu → Install App or Add to Home Screen</p>
      </div>
    </div>

    <div class="app-footer">
      <div class="app-footer-icon">🍃</div>
      <p style="font-size:16px;font-weight:700;margin-bottom:2px;color:var(--palm-leaf)">ACNHEX Market</p>
      <p style="font-size:10px;color:var(--text-light);margin-bottom:4px">Version 1.0.0</p>
      <p style="font-size:10px;color:var(--text-light)">A community tool for ACNH players</p>
    </div>
  </div>`;
}

// ─── First-Time Modal ───
function renderModal() {
  if (state.seenIntro) return '';
  return `<div class="modal-overlay" id="intro-modal">
    <div class="modal-card">
      <p style="font-size:32px;margin-bottom:16px;text-align:center">🍃</p>
      <h2 style="font-size:20px;font-weight:700;color:var(--palm-leaf);text-align:center;margin-bottom:8px">Welcome to ACNHEX Market!</h2>
      <p style="font-size:12px;color:var(--text-secondary);text-align:center;margin-bottom:24px;line-height:1.5">Before you start, set your Discord order bot's command prefix.</p>

      <h4 class="label-upper" style="margin-bottom:10px">Prefix</h4>
      <input type="text" class="prefix-input" id="modal-prefix" value="${esc(state.prefix)}" maxlength="5" style="margin-bottom:16px">

      <div class="presets-grid" style="margin-bottom:20px">
        ${['!', '.', '$', '?', '/'].map(p => `
          <button class="preset-btn ${state.prefix === p ? 'active' : ''}" data-modal-preset="${p}">${p}</button>
        `).join('')}
      </div>

      <h4 class="label-upper" style="margin-bottom:10px">Preview</h4>
      <div class="code-block" id="modal-preview" style="border-radius:14px;padding:14px 16px;font-size:12px;margin-bottom:8px">
        <span class="code-keyword">${esc(state.prefix)}order</span>
        <span class="code-value">0x0A3F</span>
        <span class="code-value">0x1B2C</span>
      </div>

      <h4 class="label-upper" style="margin-bottom:10px;margin-top:20px">How should items load?</h4>
      <div class="load-mode-options">
        <button class="load-mode-btn ${state.loadMode === 'batch' ? 'active' : ''}" data-modal-load="batch">
          <span class="load-mode-icon">📦</span>
          <span class="load-mode-label">Item Batches</span>
          <span class="load-mode-desc">Load 50 items at a time</span>
        </button>
        <button class="load-mode-btn ${state.loadMode === 'scroll' ? 'active' : ''}" data-modal-load="scroll">
          <span class="load-mode-icon">🔄</span>
          <span class="load-mode-label">Continuous Scroll</span>
          <span class="load-mode-desc">Items load as you scroll</span>
        </button>
      </div>

      <button class="modal-confirm-btn" id="modal-confirm">Let's go! 🛒</button>
    </div>
  </div>`;
}

// ─── Search Overlay (now integrated into catalog page) ───
function renderSearch() {
  // Search is now rendered inline in the catalog page via renderCatalogWithSearch()
  return '';
}

// ─── Search Results HTML ───
function renderSearchResultsHTML() {
  const results = state.searchResults || { items: [], total: 0 };
  const hasFilters = state.searchFilterTags.length > 0;
  const hasQuery = state.searchQuery || hasFilters;
  if (hasQuery) {
    return `<div style="padding:16px 24px 8px">
        <p class="text-secondary">${results.total} result${results.total !== 1 ? 's' : ''}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ''}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? 's' : ''})` : ''}</p>
      </div>
      <div class="item-grid" style="padding:0 24px">
        ${results.items.map((item, idx) => renderItemCard(item, idx)).join('')}
      </div>
      ${results.items.length < results.total ? '<div id="search-scroll-sentinel" style="height:1px"></div>' : ''}`;
  }
  return `<div class="empty-state">
      <p class="empty-emoji">🔍</p>
      <p class="empty-title">Search by name or tags</p>
      <p class="empty-text">Try "chair", "blue", "elegant", or "DIY"</p>
    </div>`;
}

// ─── Search Helper ───
let searchScrollLoading = false;

async function runSearch() {
  if (state.searchQuery || state.searchFilterTags.length > 0) {
    state.searchResults = await data.searchExpandedWithTags(state.searchQuery, state.searchFilterTags, 0, 50);
  } else {
    state.searchResults = null;
  }
  const container = document.getElementById('search-results');
  if (container) {
    container.innerHTML = renderSearchResultsHTML();
    attachSearchResultEvents();
    attachSearchScrollObserver();
    // Re-render active filter pills
    updateFilterPills();
  } else {
    render();
  }
}

function updateFilterPills() {
  const hasFilters = state.searchFilterTags.length > 0;
  // Update filter pills
  let pillsContainer = document.querySelector('.active-filters');
  if (hasFilters) {
    const pillsHTML = `<div class="active-filters hide-scrollbar">
      ${state.searchFilterTags.map(t => {
        const label = t.startsWith('c1:') ? `${t.slice(3)} (1)` : t.startsWith('c2:') ? `${t.slice(3)} (2)` : t;
        return `<button class="active-filter-pill" data-remove-filter="${esc(t)}">${esc(label)} ✕</button>`;
      }).join('')}
    </div>`;
    if (pillsContainer) {
      pillsContainer.outerHTML = pillsHTML;
    } else {
      const searchResults = document.getElementById('search-results');
      if (searchResults) searchResults.insertAdjacentHTML('beforebegin', pillsHTML);
    }
  } else if (pillsContainer) {
    pillsContainer.remove();
  }
  // Re-attach pill event handlers
  document.querySelectorAll('[data-remove-filter]').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.searchFilterTags = state.searchFilterTags.filter(t => t !== btn.dataset.removeFilter);
      await runSearch();
    });
  });
  // Update filter toggle button badge
  const filterToggle = document.getElementById('filter-toggle');
  if (filterToggle) {
    filterToggle.innerHTML = `${ICONS.filter}${hasFilters ? `<span class="filter-badge">${state.searchFilterTags.length}</span>` : ''}`;
    filterToggle.classList.toggle('active', hasFilters);
  }
  // Update filter panel tag active states
  document.querySelectorAll('[data-filter-tag]').forEach(btn => {
    btn.classList.toggle('active', state.searchFilterTags.includes(btn.dataset.filterTag));
  });
}

async function loadMoreSearchResults() {
  if (searchScrollLoading || !state.searchResults) return;
  if (state.searchResults.items.length >= state.searchResults.total) return;
  searchScrollLoading = true;
  const more = await data.searchExpandedWithTags(
    state.searchQuery, state.searchFilterTags,
    state.searchResults.items.length, 50
  );
  state.searchResults.items = [...state.searchResults.items, ...more.items];
  state.searchResults.total = more.total;
  searchScrollLoading = false;
  const container = document.getElementById('search-results');
  if (container) {
    container.innerHTML = renderSearchResultsHTML();
    attachSearchResultEvents();
    attachSearchScrollObserver();
  }
}

function attachSearchScrollObserver() {
  const sentinel = document.getElementById('search-scroll-sentinel');
  if (!sentinel) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      loadMoreSearchResults();
    }
  }, { root: null, rootMargin: '200px' });
  observer.observe(sentinel);
}

// ─── Load Expanded Catalog ───
async function loadExpandedCatalog() {
  if (state.expandedLoading) return;
  state.expandedLoading = true;
  let result;
  if (state.activeCategory === 'All') {
    result = await data.getExpandedAll(0, state.loadedCount + 50);
  } else {
    result = await data.getExpandedByCategory(state.activeCategory, 0, state.loadedCount + 50);
  }
  state.expandedItems = result.items;
  state.expandedTotal = result.total;
  state.loadedCount = result.items.length;
  state.expandedLoading = false;
  render();
}

async function loadMoreRandom() {
  if (state.expandedLoading) return;
  state.expandedLoading = true;
  const more = await data.getRandomExpandedItems(50, state.randomUsedIndices);
  state.randomItems = [...state.randomItems, ...more];
  state.expandedLoading = false;
  render();
}

// ─── Attach search result events (item cards inside search) ───
function attachSearchResultEvents() {
  const container = document.getElementById('search-results');
  if (!container) return;
  container.querySelectorAll('[data-item]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-heart]') || e.target.closest('[data-add-cart]')) return;
      state.selectedItemId = card.dataset.item;
      state.selectedVariantIdx = parseInt(card.dataset.vi) || 0;
      // Save search state before leaving so back button can restore it
      state.savedSearch = {
        query: state.searchQuery,
        results: state.searchResults,
        filterTags: [...state.searchFilterTags],
        filterOpen: state.searchFilterOpen,
        scrollY: window.scrollY || 0
      };
      state.previousPage = 'search';
      state.page = 'detail';
      state._pageEnter = true;
      loadItemDetail(card.dataset.item);
    });
  });
  container.querySelectorAll('[data-heart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vi = parseInt(btn.dataset.heartVi) || 0;
      toggleWishlist(btn.dataset.heart, vi);
    });
  });
  container.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-item]');
      const vi = card ? parseInt(card.dataset.vi) || 0 : 0;
      // Try img first, fall back to .item-thumb, then button for animation origin
      const img = card && card.querySelector('.item-thumb img');
      const thumb = card && card.querySelector('.item-thumb');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      else if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      else _flyAnimRect = btn.getBoundingClientRect();
      addToCartFromIndex(btn.dataset.addCart, vi);
      updateAllCartBtnStates();
    });
  });
  container.querySelectorAll('[data-qty-plus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.qtyPlus;
      const vi = parseInt(btn.dataset.qtyVi) || 0;
      const card = btn.closest('[data-item]');
      const img = card && card.querySelector('.item-thumb img');
      const thumb = card && card.querySelector('.item-thumb');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      else if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      else _flyAnimRect = btn.getBoundingClientRect();
      addToCartFromIndex(itemId, vi);
      updateAllCartBtnStates();
    });
  });
  container.querySelectorAll('[data-qty-minus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.qtyMinus;
      const vi = parseInt(btn.dataset.qtyVi) || 0;
      removeOneFromCart(itemId, vi);
      updateAllCartBtnStates();
    });
  });
}

// ─── Surgical Detail Variant Update ───
function updateDetailVariant() {
  const item = state.itemDetail;
  if (!item) return;
  const vi = state.selectedVariantIdx;
  const variant = item.variants[vi] || item.variants[0];
  const inWishlist = isInWishlist(item.id, vi);
  const cartFull = getCartTotal() >= 40;
  const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;

  // Update hero image
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg && variant.image) heroImg.src = variant.image;

  // Update variant pill active states (for backwards compat)
  app.querySelectorAll('[data-variant]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.variant) === vi);
  });

  // Update detail fields with new collapsible structure
  const allFields = [
    ['Hex ID', item.hexBase, 'hex'],
    ['Size', item.size, 'text'],
    ['Hex ID (Variated)', variant.hexVariated || variant.hex || item.hexBase, 'hex'],
    ['Catalog', item.catalog, 'text'],
    ['HHA Concepts', [item.hhaConcept1, item.hhaConcept2].filter(Boolean).join(', '), 'text'],
    ['HHA Series', item.hhaSeries, 'text'],
    ['HHA Set', item.hhaSet, 'text'],
    ['Styles', (item.tags || []).filter(t => ['active','cool','cute','elegant','gorgeous','simple'].includes(t)).join(', '), 'text'],
    ['Colors', [variant.color1, variant.color2].filter(Boolean).join(', '), 'text'],
    ['DIY', item.diy, 'text'],
  ].filter(([, v]) => v && v !== 'NA' && v !== 'None');

  const primaryFields = allFields.filter(([label]) => label === 'Hex ID' || label === 'Size');
  const secondaryFields = allFields.filter(([label]) => label !== 'Hex ID' && label !== 'Size');

  const renderFieldRow = ([label, val, type]) => {
    if (type === 'hex') {
      return `<div class="detail-field-row">
        <span class="detail-field-label">${esc(label)}</span>
        <button class="hex-copy-badge" data-hex="${esc(val)}">${esc(val)}</button>
      </div>`;
    }
    return `<div class="detail-field-row">
      <span class="detail-field-label">${esc(label)}</span>
      <span class="detail-field-value">${esc(String(val))}</span>
    </div>`;
  };

  const fieldsEl = document.getElementById('detail-fields');
  if (fieldsEl) {
    fieldsEl.innerHTML = `
      <div class="detail-section-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="label-upper">Details</span>
        ${secondaryFields.length > 0 && !state.detailsExpanded ? `<span class="detail-more-hint">${secondaryFields.length} more fields</span>` : ''}
      </div>

      ${primaryFields.map(renderFieldRow).join('')}

      ${secondaryFields.length > 0 ? `
      <div class="detail-fields-collapsible${state.detailsExpanded ? ' detail-fields-collapsible--open' : ''}">
        ${secondaryFields.map(renderFieldRow).join('')}
      </div>

      <button class="detail-expand-toggle" data-action="toggle-details">
        <span class="detail-expand-arrow${state.detailsExpanded ? ' detail-expand-arrow--flipped' : ''}">▾</span>
        ${state.detailsExpanded ? 'Show less' : 'Show all details'}
      </button>
      ` : ''}`;

    // Re-attach toggle details and hex copy events
    attachDetailFieldEvents();
  }

  // Update CTA buttons
  const ctaEl = document.getElementById('detail-cta');
  if (ctaEl) {
    ctaEl.innerHTML = `
      <button class="cta-btn-secondary" id="detail-add-to-list" data-list-item="${esc(item.id)}" data-list-vi="${vi}">
        📋 Add to List
      </button>
      <div class="detail-cart-btn-wrap" data-cart-item-id="${esc(item.id)}" data-cart-vi="${vi}">
        <button class="detail-add-cart-btn${qtyInCart > 0 ? ' hidden' : ''}" id="detail-add-cart" ${cartFull ? 'disabled' : ''}>
          ${ICONS.plus} Add to Cart
        </button>
        <div class="detail-qty-counter${qtyInCart > 0 ? ' visible' : ''}">
          <button class="detail-qty-counter-btn" data-detail-qty-minus>−</button>
          <span class="detail-qty-counter-val" id="detail-qty-cart">${qtyInCart}</span>
          <button class="detail-qty-counter-btn" data-detail-qty-plus ${cartFull ? 'disabled' : ''}>+</button>
        </div>
      </div>`;
    // Re-attach CTA events
    attachDetailQtyEvents();
    const detailAddCart = document.getElementById('detail-add-cart');
    if (detailAddCart) detailAddCart.addEventListener('click', () => {
      // Find fly animation source: active orbit item, single variant image, or hero container
      const orbitImg = document.querySelector('.variant-orbit-item--active img');
      const singleImg = document.querySelector('.detail-single-variant img');
      const flySource = orbitImg || singleImg || document.getElementById('detail-hero');
      if (flySource) _flyAnimRect = flySource.getBoundingClientRect();
      addToCart({
        id: item.id,
        name: item.name,
        variant: variant.name,
        variantIdx: vi,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image || item.image,
      });
      updateDetailCartBtnState();
    });
    const detailListBtn = document.getElementById('detail-add-to-list');
    if (detailListBtn) detailListBtn.addEventListener('click', () => {
      state.listPickerItem = { id: item.id, variantIdx: vi, excludeLoved: true };
      render();
    });
  }

  // Update heart button in hero
  const heartBtn = app.querySelector('.detail-hero-orbit [data-heart]');
  if (heartBtn) {
    heartBtn.dataset.heartVi = vi;
    heartBtn.innerHTML = ICONS.heartLg(inWishlist);
  }
}

// Helper to attach events for detail field toggles and hex copy badges
function attachDetailFieldEvents() {
  // Toggle details expand/collapse
  document.querySelectorAll('[data-action="toggle-details"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.detailsExpanded = !state.detailsExpanded;
      const container = document.querySelector('.detail-fields-collapsible');
      if (container) container.classList.toggle('detail-fields-collapsible--open', state.detailsExpanded);
      const arrow = btn.querySelector('.detail-expand-arrow');
      if (arrow) arrow.classList.toggle('detail-expand-arrow--flipped', state.detailsExpanded);
      const textNode = btn.childNodes[btn.childNodes.length - 1];
      if (textNode && textNode.nodeType === 3) {
        textNode.textContent = state.detailsExpanded ? 'Show less' : 'Show all details';
      }
      const hint = document.querySelector('.detail-more-hint');
      if (hint) hint.style.display = state.detailsExpanded ? 'none' : '';
    });
  });

  // Hex copy badges
  attachHexCopyEvents();
}

function attachHexCopyEvents() {
  document.querySelectorAll('.hex-copy-badge').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const hex = badge.dataset.hex;
      navigator.clipboard.writeText(hex).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = hex; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
      });
      badge.classList.add('hex-copy-badge--copied');
      const originalText = badge.textContent;
      badge.textContent = '✓ Copied!';
      hapticTick();
      NookSounds.play('hexCopy');
      setTimeout(() => {
        badge.classList.remove('hex-copy-badge--copied');
        badge.textContent = originalText;
      }, 1400);
    });
  });
}

// ─── Detail Qty Events Helper ───
function attachDetailQtyEvents() {
  // Detail qty plus - adds item to cart
  document.querySelectorAll('[data-detail-qty-plus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.itemDetail) return;
      const vi = state.selectedVariantIdx;
      const variant = state.itemDetail.variants[vi] || state.itemDetail.variants[0];
      const cartFull = getCartTotal() >= 40;
      if (cartFull) return;

      // Find fly animation source
      const orbitImg = document.querySelector('.variant-orbit-item--active img');
      const singleImg = document.querySelector('.detail-single-variant img');
      const flySource = orbitImg || singleImg || document.getElementById('detail-hero');
      if (flySource) _flyAnimRect = flySource.getBoundingClientRect();

      addToCart({
        id: state.itemDetail.id,
        name: state.itemDetail.name,
        variant: variant.name,
        variantIdx: vi,
        hex: variant.hexVariated || variant.hex || state.itemDetail.hexBase,
        img: variant.image || state.itemDetail.image,
      });
      updateDetailCartBtnState();
    });
  });

  // Detail qty minus - removes item from cart
  document.querySelectorAll('[data-detail-qty-minus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.itemDetail) return;
      const vi = state.selectedVariantIdx;
      // Find and remove one item from cart
      const idx = state.cart.findIndex(c => c.id === state.itemDetail.id && c.variantIdx === vi);
      if (idx !== -1) {
        state.cart.splice(idx, 1);
        storage.setCart(state.cart);
        NookSounds.play('removeItem');
      }
      updateDetailCartBtnState();
    });
  });
}

// ─── Update Detail Cart Button State ───
function updateDetailCartBtnState() {
  if (!state.itemDetail) return;
  const vi = state.selectedVariantIdx;
  const qtyInCart = state.cart.filter(c => c.id === state.itemDetail.id && c.variantIdx === vi).length;
  const cartFull = getCartTotal() >= 40;

  const addBtn = document.getElementById('detail-add-cart');
  const counter = document.querySelector('.detail-qty-counter');
  const valSpan = document.getElementById('detail-qty-cart');
  const plusBtn = document.querySelector('[data-detail-qty-plus]');

  if (addBtn) {
    addBtn.classList.toggle('hidden', qtyInCart > 0);
    addBtn.disabled = cartFull;
  }
  if (counter) counter.classList.toggle('visible', qtyInCart > 0);
  if (valSpan) valSpan.textContent = qtyInCart;
  if (plusBtn) plusBtn.disabled = cartFull;

  // Update cart badge
  updateAllCartBtnStates();
}

// ─── Variant Orbit: position items ───
function positionOrbitItems(selectedIdx) {
  const track = document.querySelector('.variant-orbit-track');
  if (!track) return;
  const items = track.querySelectorAll('.variant-orbit-item');
  const count = items.length;
  if (count === 0) return;

  const isCircular = track.classList.contains('variant-orbit-track--circular');

  if (isCircular) {
    // True circular positioning for < 15 variants (like mockup)
    const angleStep = 360 / count;
    const radiusX = 200; // horizontal spread
    const radiusZ = 110; // depth

    items.forEach((el) => {
      const idx = parseInt(el.dataset.variantOrbit, 10);
      const relativeIdx = ((idx - selectedIdx) % count + count) % count;
      const angle = relativeIdx * angleStep;
      const radian = (angle * Math.PI) / 180;

      const x = Math.sin(radian) * radiusX;
      const z = Math.cos(radian) * radiusZ;
      const normalizedZ = (z + radiusZ) / (2 * radiusZ); // 0 (back) to 1 (front)

      const scale = 0.45 + normalizedZ * 0.55;
      const opacity = 0.3 + normalizedZ * 0.7;
      const blur = Math.max(0, (1 - normalizedZ) * 12);
      const brightness = 0.6 + normalizedZ * 0.4;
      const isFront = relativeIdx === 0;

      el.style.transform = `translateX(${x}px) scale(${scale})`;
      el.style.zIndex = Math.round(normalizedZ * 100);
      el.style.opacity = isFront ? 1 : opacity;
      el.style.filter = isFront ? 'none' : `blur(${blur}px) brightness(${brightness})`;
      el.style.width = isFront ? '230px' : '160px';
      el.style.height = isFront ? '230px' : '160px';
      el.style.boxShadow = isFront
        ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
        : '0 2px 8px rgba(0,0,0,0.06)';
      el.style.border = isFront
        ? '2.5px solid rgba(106,130,62,0.4)'
        : '1.5px solid rgba(255,255,255,0.5)';
      el.style.background = el.dataset.bg;

      // Update active class and label visibility
      el.classList.toggle('variant-orbit-item--active', isFront);
      const label = el.querySelector('.variant-orbit-label');
      if (label) label.style.display = isFront ? '' : 'none';
    });
  } else {
    // Fixed 5-position mode for 15+ variants (windowed)
    const positions = [
      { x: -230, scale: 0.55, z: 10, opacity: 0.5, blur: 6 },   // far-left
      { x: -120, scale: 0.75, z: 30, opacity: 0.75, blur: 2 },  // left
      { x: 0, scale: 1.0, z: 100, opacity: 1, blur: 0 },        // center
      { x: 120, scale: 0.75, z: 30, opacity: 0.75, blur: 2 },   // right
      { x: 230, scale: 0.55, z: 10, opacity: 0.5, blur: 6 },    // far-right
    ];

    items.forEach((el) => {
      const pos = parseInt(el.dataset.orbitPos, 10);
      const isCenter = el.classList.contains('variant-orbit-item--active');

      let posIdx;
      if (count === 5) {
        posIdx = pos;
      } else if (count === 3) {
        posIdx = pos + 1;
      } else if (count === 2) {
        posIdx = pos === 0 ? 1 : 3;
      } else {
        posIdx = 2;
      }

      const p = positions[posIdx] || positions[2];

      el.style.transform = `translateX(${p.x}px) scale(${p.scale})`;
      el.style.zIndex = p.z;
      el.style.opacity = p.opacity;
      el.style.filter = isCenter ? 'none' : `blur(${p.blur}px) brightness(0.95)`;
      el.style.width = isCenter ? '230px' : '150px';
      el.style.height = isCenter ? '230px' : '150px';
      el.style.boxShadow = isCenter
        ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
        : '0 2px 8px rgba(0,0,0,0.06)';
      el.style.border = isCenter
        ? '2.5px solid rgba(106,130,62,0.4)'
        : '1.5px solid rgba(255,255,255,0.5)';
      el.style.background = el.dataset.bg;
    });
  }
}

function initOrbitSwipe() {
  const track = document.querySelector('.variant-orbit-track');
  const hero = document.querySelector('.detail-hero-orbit');
  if (!track) return;

  // Use hero container for larger swipe area, fallback to track
  const swipeTarget = hero || track;
  let startX = null;
  let delta = 0;

  swipeTarget.addEventListener('pointerdown', (e) => {
    // Ignore swipes starting on buttons
    if (e.target.closest('.glass-btn') || e.target.closest('.variant-orbit-chevron')) return;
    startX = e.clientX;
    track.style.cursor = 'grabbing';
  });
  swipeTarget.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    delta = e.clientX - startX;
  });
  const endSwipe = () => {
    if (startX === null) return;
    const count = state.itemDetail.variants.length;
    if (delta > 40) {
      state.selectedVariantIdx = (state.selectedVariantIdx - 1 + count) % count;
      hapticTick();
      updateOrbitAndDetail();
    } else if (delta < -40) {
      state.selectedVariantIdx = (state.selectedVariantIdx + 1) % count;
      hapticTick();
      updateOrbitAndDetail();
    }
    startX = null; delta = 0; track.style.cursor = 'grab';
  };
  swipeTarget.addEventListener('pointerup', endSwipe);
  swipeTarget.addEventListener('pointerleave', endSwipe);
}

function hapticTick() {
  if (navigator.vibrate) navigator.vibrate(8);
}

// Surgical update: reposition orbit items + update detail fields + hero bg
function updateOrbitAndDetail() {
  const item = state.itemDetail;
  const vi = state.selectedVariantIdx;
  const total = item.variants.length;
  const useCircular = total < 15;

  const track = document.querySelector('.variant-orbit-track');
  if (track) {
    if (useCircular) {
      // Circular mode: all items already rendered, just update selected state
      track.dataset.selected = vi;
      track.querySelectorAll('[data-variant-orbit]').forEach(el => {
        const idx = parseInt(el.dataset.variantOrbit, 10);
        const isCenter = idx === vi;
        el.classList.toggle('variant-orbit-item--active', isCenter);
        // Add/update label
        let label = el.querySelector('.variant-orbit-label');
        if (isCenter) {
          if (!label) {
            label = document.createElement('span');
            label.className = 'variant-orbit-label';
            el.appendChild(label);
          }
          label.textContent = item.variants[idx].name;
          label.style.display = '';
        } else if (label) {
          label.style.display = 'none';
        }
      });
    } else {
      // Windowed mode for 15+ variants: rebuild visible window
      const windowSize = Math.min(5, total);
      const halfWindow = Math.floor(windowSize / 2);
      const visibleIndices = [];
      for (let i = -halfWindow; i <= halfWindow; i++) {
        const idx = ((vi + i) % total + total) % total;
        visibleIndices.push(idx);
      }
      const uniqueVisible = [...new Set(visibleIndices)];

      track.innerHTML = uniqueVisible.map((idx, pos) => {
        const v = item.variants[idx];
        const isCenter = idx === vi;
        const isWishlisted = state.wishlists.lists.some(list =>
          list.items.some(wi => wi.id === item.id && wi.variantIdx === idx)
        );
        return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
          data-variant-orbit="${idx}"
          data-orbit-pos="${pos}"
          data-bg="${thumbBgs[idx % thumbBgs.length]}">
          ${isWishlisted ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
          <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
            onerror="this.style.display='none';this.parentNode.querySelector('.variant-orbit-fallback').style.display='flex';">
          <div class="variant-orbit-fallback" style="display:none;">📦</div>
          ${isCenter ? `<span class="variant-orbit-label">${esc(v.name)}</span>` : ''}
        </div>`;
      }).join('');
      track.dataset.selected = vi;

      // Re-attach click handlers to new orbit items
      track.querySelectorAll('[data-variant-orbit]').forEach(el => {
        el.addEventListener('click', () => {
          const newIdx = parseInt(el.dataset.variantOrbit, 10);
          if (newIdx !== state.selectedVariantIdx) {
            state.selectedVariantIdx = newIdx;
            hapticTick();
            updateOrbitAndDetail();
          }
        });
      });
    }
  }

  positionOrbitItems(vi);
  updateDetailVariant(); // updates hero image, fields, CTA, heart state

  // Update dots (for < 15 variants)
  document.querySelectorAll('.variant-orbit-dot').forEach((dot, i) => {
    dot.classList.toggle('variant-orbit-dot--active', i === vi);
  });

  // Update progress bar (for 15+ variants)
  const progressFill = document.querySelector('.variant-orbit-progress-fill');
  const progressText = document.querySelector('.variant-orbit-progress-text');
  if (progressFill) progressFill.style.width = `${((vi + 1) / total) * 100}%`;
  if (progressText) progressText.textContent = `${vi + 1} / ${total}`;

  // Update variant name in title area
  const variantNameEl = document.querySelector('.detail-variant-name');
  if (variantNameEl) {
    variantNameEl.textContent = item.variants[vi].name;
  }

  // Update drawer row selection
  document.querySelectorAll('.variant-drawer-row').forEach((row, i) => {
    row.classList.toggle('variant-drawer-row--selected', i === vi);
  });

  // Transition hero background color
  const hero = document.getElementById('detail-hero');
  if (hero) {
    hero.style.background = data.getItemBg(vi);
  }

  NookSounds.play('variantSwitch');
}

function playDetailEntrance() {
  // Stagger orbit items spiraling in
  const orbitItems = document.querySelectorAll('.variant-orbit-item');
  orbitItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0) translateX(0)';
    setTimeout(() => {
      el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      positionOrbitItems(state.selectedVariantIdx);
    }, 80 + i * 60);
  });

  // Stagger content sections
  const sections = document.querySelectorAll('.detail-content > *');
  sections.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 350 + i * 100);
  });
}

function initDetailParallax() {
  const isDesktop = window.innerWidth >= 768;

  if (isDesktop) {
    const hero = document.querySelector('.detail-hero');
    if (!hero) return;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 12;
      const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 8;
      const active = document.querySelector('.variant-orbit-item--active');
      if (active) {
        const img = active.querySelector('img');
        if (img) img.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  } else {
    window.addEventListener('deviceorientation', (e) => {
      const x = Math.max(-12, Math.min(12, (e.gamma || 0) * 0.4));
      const y = Math.max(-8, Math.min(8, (e.beta || 0) * 0.25 - 10));
      const active = document.querySelector('.variant-orbit-item--active');
      if (active) {
        const img = active.querySelector('img');
        if (img) img.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }
}

// Update orbit heart dots after wishlist changes
function refreshOrbitHeartDots() {
  if (!state.itemDetail) return;
  document.querySelectorAll('.variant-orbit-item').forEach((el) => {
    const variantIdx = parseInt(el.dataset.variantOrbit, 10);
    const isWish = state.wishlists.lists.some(list =>
      list.items.some(wi => wi.id === state.itemDetail.id && wi.variantIdx === variantIdx)
    );
    const existing = el.querySelector('.variant-orbit-heart-dot');
    if (isWish && !existing) {
      el.insertAdjacentHTML('afterbegin', '<div class="variant-orbit-heart-dot">♥</div>');
    } else if (!isWish && existing) {
      existing.remove();
    }
  });
  // Also update drawer heart dots
  document.querySelectorAll('.variant-drawer-row').forEach((row, idx) => {
    const thumb = row.querySelector('.variant-drawer-thumb');
    if (!thumb) return;
    const isWish = state.wishlists.lists.some(list =>
      list.items.some(wi => wi.id === state.itemDetail.id && wi.variantIdx === idx)
    );
    const existing = thumb.querySelector('.variant-drawer-heart-dot');
    if (isWish && !existing) {
      thumb.insertAdjacentHTML('beforeend', '<div class="variant-drawer-heart-dot">♥</div>');
    } else if (!isWish && existing) {
      existing.remove();
    }
  });
}

// ─── Wishlist Toast ───
function renderWishlistToast() {
  if (!state.wishlistToast) return '';
  const t = state.wishlistToast;
  if (t.isRemoval) {
    return `<div class="wishlist-toast" id="wl-toast">
      <span>Removed from <strong>${esc(t.listName)}</strong></span>
    </div>`;
  }
  return `<div class="wishlist-toast" id="wl-toast">
    <span>Saved to <strong>${esc(t.listName)}</strong></span>
    <button class="toast-change-btn" id="toast-change">Change</button>
  </div>`;
}

// ─── List Picker Modal ───
function renderListPicker() {
  if (!state.listPickerItem) return '';
  const item = state.listPickerItem;
  return `<div class="modal-overlay" id="list-picker-overlay">
    <div class="modal-card">
      <h2 style="font-size:16px;font-weight:700;margin-bottom:16px;color:var(--palm-leaf)">Save to List</h2>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;-webkit-overflow-scrolling:touch">
        ${state.wishlists.lists.map(list => {
          const inThis = list.items.some(w => w.id === item.id && w.variantIdx === item.variantIdx);
          const full = list.cap !== null && list.items.length >= list.cap;
          const lovedDisabled = item.excludeLoved && list.id === '__loved__';
          const isLoved = list.id === '__loved__';
          return `<button class="list-pick-btn ${isLoved && inThis ? 'active' : ''} ${lovedDisabled ? 'greyed' : ''}" data-pick-list="${esc(list.id)}" ${full || lovedDisabled ? 'disabled' : ''}>
            <span>${esc(list.name)}</span>
            <span style="font-size:10px;color:var(--text-light)">${list.items.length}${list.cap ? '/' + list.cap : ''}${!isLoved && inThis ? ' · has item' : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="cta-btn-secondary" id="create-list-from-picker" style="margin-bottom:12px;width:100%">+ New List</button>
      <button class="search-close-btn" id="close-list-picker" style="width:100%">Done</button>
    </div>
  </div>`;
}

// ─── Set Picker Modal (add entire set to a list) ───
function renderSetPicker() {
  if (!state.setPickerItems || state.setPickerItems.length === 0) return '';
  const setName = state.setPickerName || 'Set';
  return `<div class="modal-overlay" id="set-picker-overlay">
    <div class="modal-card">
      <h2 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--palm-leaf)">Save ${esc(setName)} Series</h2>
      <p style="font-size:12px;color:var(--text-light);margin-bottom:16px">${state.setPickerItems.length} items will be added</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;-webkit-overflow-scrolling:touch">
        ${state.wishlists.lists.filter(l => l.id !== '__loved__').map(list => {
          const full = list.cap !== null && list.items.length >= list.cap;
          const remaining = list.cap ? list.cap - list.items.length : Infinity;
          const canAdd = Math.min(state.setPickerItems.length, remaining);
          return `<button class="list-pick-btn" data-set-pick-list="${esc(list.id)}" ${full ? 'disabled' : ''}>
            <span>${esc(list.name)}</span>
            <span style="font-size:10px;color:var(--text-light)">${list.items.length}${list.cap ? '/' + list.cap : ''}${canAdd < state.setPickerItems.length ? ' · can add ' + canAdd : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="cta-btn-secondary" id="create-list-from-set-picker" style="margin-bottom:12px;width:100%">+ New List</button>
      <button class="search-close-btn" id="close-set-picker" style="width:100%">Cancel</button>
    </div>
  </div>`;
}

// ─── Render ───
async function render() {
  // Save similar items scroll position before DOM is replaced
  // Only save when itemDetail is loaded (skip during loading transition to preserve reset)
  if (state.page === 'detail' && state.itemDetail) {
    const simScroll = document.getElementById('similar-scroll');
    if (simScroll) state.similarScrollLeft = simScroll.scrollLeft;
    state._detailScrollY = window.scrollY;
  }
  let content = '';
  switch (state.page) {
    case 'catalog': content = await renderCatalog(); break;
    case 'detail': content = await renderDetail(); break;
    case 'cart': content = renderCart(); break;
    case 'wishlist': content = await renderWishlist(); break;
    case 'settings': content = renderSettings(); break;
    case 'info': content = renderInfo(); break;
  }
  app.innerHTML = `<div id="ptr-indicator" class="ptr-indicator"></div>` + content + renderNav() + renderModal() + renderSearch() + renderWishlistToast() + renderListPicker() + renderSetPicker() + ads.renderActivePopup(state.activePopup) + ads.renderAdToast(state.adToastVisible) + ads.renderFloatingNotif(state.floatingNotif);
  attachEvents();

  // Apply entrance animations only on page/category navigation
  if (state._pageEnter) {
    state._pageEnter = false;
    const page = app.querySelector('.page');
    if (page) {
      page.classList.add('page-enter');
      page.addEventListener('animationend', () => page.classList.remove('page-enter'), { once: true });
    }
    const grid = app.querySelector('.item-grid');
    if (grid) {
      grid.classList.add('grid-enter');
      grid.addEventListener('animationend', () => grid.classList.remove('grid-enter'), { once: true });
    }
  }

  // Trigger cart badge pop animation after add-to-cart
  if (state._cartBounce) {
    state._cartBounce = false;
    const badge = app.querySelector('.nav-badge');
    if (badge) {
      badge.classList.add('pop');
      badge.addEventListener('animationend', () => badge.classList.remove('pop'), { once: true });
    }
  }

  // Trigger heart pulse animation after wishlist toggle
  if (state._heartPulse) {
    const { id, vi } = state._heartPulse;
    state._heartPulse = null;
    const heartBtn = app.querySelector(`[data-heart="${id}"][data-heart-vi="${vi}"]`);
    if (heartBtn) {
      heartBtn.classList.add('pulse');
      heartBtn.addEventListener('animationend', () => heartBtn.classList.remove('pulse'), { once: true });
    }
  }
}

// ─── Event Handling ───
let searchDebounce = null;

function attachEvents() {
  // Nav tabs
  app.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const target = btn.dataset.nav;
      state.adPageViews++;
      if (target === 'catalog') {
        // If we have saved detail state, restore to detail page
        if (state._savedDetailState) {
          state.page = 'detail';
          state.selectedItemId = state._savedDetailState.itemId;
          state.selectedVariantIdx = state._savedDetailState.variantIdx;
          state.itemDetail = state._savedDetailState.itemDetail;
          state._savedDetailState = null;
          state._pageEnter = true;
          render();
        } else {
          // Normal catalog restore
          state.page = 'catalog';
          state._pageEnter = true;
          render();
          window.scrollTo(0, state.scrollY || 0);
        }
      } else {
        // Save detail state when leaving detail page for another tab
        if (state.page === 'detail' && state.itemDetail) {
          state._savedDetailState = {
            itemId: state.selectedItemId,
            variantIdx: state.selectedVariantIdx,
            itemDetail: state.itemDetail,
          };
        } else if (state.page === 'catalog') {
          // Save scroll position when leaving catalog
          state.scrollY = window.scrollY;
        }
        state.page = target;
        if (target === 'wishlist') state.viewingListId = null;
        state._pageEnter = true;
        render();
      }
      // Check if a popup ad should be shown after navigation
      if (!state.activePopup) {
        const popupType = ads.checkPopupTrigger({
          type: 'nav',
          adPageViews: state.adPageViews,
          itemsViewed: state.itemsViewed,
          sessionStart: state.sessionStart,
        });
        if (popupType) {
          ads.markPopupShown();
          setTimeout(() => {
            state.activePopup = popupType;
            render();
          }, 1000);
        }
      }
    });
  });

  // Category buttons
  app.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      NookSounds.play('categoryTap');
      state.activeCategory = btn.dataset.cat;
      state.loadedCount = 0;
      state.isRandom = false;
      state.expandedItems = null;
      state.expandedTotal = 0;
      ads.resetGridInterstitial();
      const catScrollEl = document.getElementById('cat-scroll');
      if (catScrollEl) state.catScrollLeft = catScrollEl.scrollLeft;
      state._pageEnter = true;
      render();
      loadExpandedCatalog();
    });
  });

  // Category carousel arrows
  const catScroll = document.getElementById('cat-scroll');
  const catWrapper = document.getElementById('cat-wrapper');
  const catArrowL = document.getElementById('cat-arrow-left');
  const catArrowR = document.getElementById('cat-arrow-right');
  if (catScroll && catWrapper) {
    // Restore saved carousel scroll position
    if (state.catScrollLeft) catScroll.scrollLeft = state.catScrollLeft;
    const updateCatArrows = () => {
      const atStart = catScroll.scrollLeft <= 5;
      const atEnd = catScroll.scrollLeft >= catScroll.scrollWidth - catScroll.clientWidth - 5;
      catArrowL?.classList.toggle('hidden', atStart);
      catArrowR?.classList.toggle('hidden', atEnd);
      catWrapper.classList.toggle('at-start', atStart);
      catWrapper.classList.toggle('at-end', atEnd);
    };
    catScroll.addEventListener('scroll', updateCatArrows);
    updateCatArrows();
    if (catArrowL) catArrowL.addEventListener('click', () => catScroll.scrollBy({ left: -200, behavior: 'smooth' }));
    if (catArrowR) catArrowR.addEventListener('click', () => catScroll.scrollBy({ left: 200, behavior: 'smooth' }));
  }

  // Item cards (catalog/wishlist — NOT inside search overlay)
  app.querySelectorAll('[data-item]').forEach(card => {
    if (card.closest('#search-page')) return; // handled by attachSearchResultEvents
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-heart]') || e.target.closest('[data-add-cart]') ||
          e.target.closest('.remove-btn') || e.target.closest('.wishlist-add-btn') ||
          e.target.closest('[data-remove-list-idx]')) return;
      // If clicking a similar item from a detail page, push current item to history stack
      if (state.page === 'detail' && state.itemDetail && card.closest('.similar-section')) {
        state.detailHistory.push({
          itemId: state.itemDetail.id,
          variantIdx: state.selectedVariantIdx,
        });
      } else {
        // Coming from catalog/wishlist — reset history and save scroll position
        state.detailHistory = [];
        state.scrollY = window.scrollY;
        state.previousPage = 'catalog';
      }
      state.selectedItemId = card.dataset.item;
      state.selectedVariantIdx = parseInt(card.dataset.vi) || 0;
      state.searchOpen = false;
      state.searchQuery = '';
      state.searchResults = null;
      state.page = 'detail';
      state._pageEnter = true;
      loadItemDetail(card.dataset.item);
    });
  });

  // Heart buttons (skip search page — handled by attachSearchResultEvents)
  app.querySelectorAll('[data-heart]').forEach(btn => {
    if (btn.closest('#search-page')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vi = parseInt(btn.dataset.heartVi) || 0;
      toggleWishlist(btn.dataset.heart, vi);
    });
  });

  // Add to cart buttons (skip search page)
  app.querySelectorAll('[data-add-cart]').forEach(btn => {
    if (btn.closest('#search-page')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-item]');
      const vi = card ? parseInt(card.dataset.vi) || 0 : 0;
      // Try img first, fall back to .item-thumb, then button for animation origin
      const img = card && card.querySelector('.item-thumb img');
      const thumb = card && card.querySelector('.item-thumb');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      else if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      else _flyAnimRect = btn.getBoundingClientRect();
      addToCartFromIndex(btn.dataset.addCart, vi);
      updateAllCartBtnStates();
    });
  });

  // Quantity counter plus buttons (skip search page)
  app.querySelectorAll('[data-qty-plus]').forEach(btn => {
    if (btn.closest('#search-page')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.qtyPlus;
      const vi = parseInt(btn.dataset.qtyVi) || 0;
      const card = btn.closest('[data-item]');
      const img = card && card.querySelector('.item-thumb img');
      const thumb = card && card.querySelector('.item-thumb');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      else if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      else _flyAnimRect = btn.getBoundingClientRect();
      addToCartFromIndex(itemId, vi);
      updateAllCartBtnStates();
    });
  });

  // Quantity counter minus buttons (skip search page)
  app.querySelectorAll('[data-qty-minus]').forEach(btn => {
    if (btn.closest('#search-page')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.qtyMinus;
      const vi = parseInt(btn.dataset.qtyVi) || 0;
      removeOneFromCart(itemId, vi);
      updateAllCartBtnStates();
    });
  });

  // Load more (batch mode)
  const loadMore = document.getElementById('load-more');
  if (loadMore) loadMore.addEventListener('click', () => {
    NookSounds.play('loadMore');
    state.isRandom ? loadMoreRandom() : loadExpandedCatalog();
  });

  // Infinite scroll (scroll mode + always for random)
  const scrollSentinel = document.getElementById('scroll-sentinel');
  if (scrollSentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !state.expandedLoading) {
        NookSounds.play('loadMore');
        state.isRandom ? loadMoreRandom() : loadExpandedCatalog();
      }
    }, { rootMargin: '200px' });
    observer.observe(scrollSentinel);
  }

  // Random items
  const randomBtn = document.getElementById('random-btn');
  if (randomBtn) randomBtn.addEventListener('click', async () => {
    state.isRandom = true;
    state.randomUsedIndices = new Set();
    state.randomItems = await data.getRandomExpandedItems(50, state.randomUsedIndices);
    render();
  });

  // Search
  const searchOpen = document.getElementById('search-open');
  if (searchOpen) searchOpen.addEventListener('click', () => {
    state.searchOpen = true;
    render();
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  });
  const searchOpenLabel = document.getElementById('search-open-label');
  if (searchOpenLabel) searchOpenLabel.addEventListener('click', () => {
    state.searchOpen = true;
    render();
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  });
  const searchClose = document.getElementById('search-close');
  if (searchClose) searchClose.addEventListener('click', () => {
    state.searchOpen = false;
    state.searchQuery = '';
    state.searchResults = null;
    state.searchFilterTags = [];
    state.searchFilterOpen = false;
    render();
  });
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(async () => {
        state.searchQuery = e.target.value;
        await runSearch();
      }, 300);
    });
  }

  // Filter toggle
  const filterToggle = document.getElementById('filter-toggle');
  if (filterToggle) filterToggle.addEventListener('click', () => {
    state.searchFilterOpen = !state.searchFilterOpen;
    // Re-render search page without full page render to keep keyboard open
    const searchPage = document.getElementById('search-page');
    if (searchPage) {
      const savedQuery = document.getElementById('search-input')?.value || '';
      state.searchQuery = savedQuery;
      render();
      setTimeout(() => {
        const inp = document.getElementById('search-input');
        if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
      }, 10);
    } else {
      render();
    }
  });

  // Filter tag buttons
  app.querySelectorAll('[data-filter-tag]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const tag = btn.dataset.filterTag;
      if (state.searchFilterTags.includes(tag)) {
        state.searchFilterTags = state.searchFilterTags.filter(t => t !== tag);
      } else {
        state.searchFilterTags.push(tag);
      }
      await runSearch();
    });
  });

  // Remove individual filter pill
  app.querySelectorAll('[data-remove-filter]').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.searchFilterTags = state.searchFilterTags.filter(t => t !== btn.dataset.removeFilter);
      await runSearch();
    });
  });

  // Clear all filters
  const filterClear = document.getElementById('filter-clear');
  if (filterClear) filterClear.addEventListener('click', async () => {
    state.searchFilterTags = [];
    await runSearch();
  });

  // Detail page
  const detailBack = document.getElementById('detail-back');
  if (detailBack) detailBack.addEventListener('click', async () => {
    if (state.detailHistory && state.detailHistory.length > 0) {
      // Pop the history stack — go back to the previous detail item
      const prev = state.detailHistory.pop();
      state.selectedVariantIdx = prev.variantIdx;
      state._pageEnter = true;
      loadItemDetail(prev.itemId);
    } else if (state.previousPage === 'search' && state.savedSearch) {
      // Restore search state (only when history stack is empty)
      state.page = 'catalog';
      state.itemDetail = null;
      state.detailHistory = [];
      state._savedDetailState = null; // Clear saved detail state on explicit exit
      state.searchOpen = true;
      state.searchQuery = state.savedSearch.query;
      state.searchResults = state.savedSearch.results;
      state.searchFilterTags = state.savedSearch.filterTags;
      state.searchFilterOpen = state.savedSearch.filterOpen;
      const savedScrollY = state.savedSearch.scrollY || 0;
      state.savedSearch = null;
      state.previousPage = null;
      state._pageEnter = true;
      await render();
      window.scrollTo(0, savedScrollY);
    } else {
      state.page = 'catalog';
      state.itemDetail = null;
      state.previousPage = null;
      state._savedDetailState = null; // Clear saved detail state on explicit exit
      state._pageEnter = true;
      await render();
      window.scrollTo(0, state.scrollY);
    }
  });

  // Variant pills — surgical update instead of full render
  app.querySelectorAll('[data-variant]').forEach(btn => {
    btn.addEventListener('click', () => {
      NookSounds.play('variantSwitch');
      state.selectedVariantIdx = parseInt(btn.dataset.variant);
      updateDetailVariant();
    });
  });

  // Variant carousel arrows
  const variantScroll = document.getElementById('variant-scroll');
  const variantArrowL = document.getElementById('variant-arrow-left');
  const variantArrowR = document.getElementById('variant-arrow-right');
  if (variantScroll) {
    if (variantArrowL) variantArrowL.addEventListener('click', () => variantScroll.scrollBy({ left: -120, behavior: 'smooth' }));
    if (variantArrowR) variantArrowR.addEventListener('click', () => variantScroll.scrollBy({ left: 120, behavior: 'smooth' }));
  }

  // Detail qty +/- buttons
  attachDetailQtyEvents();

  // Detail add to cart (single add like home page)
  const detailAddCart = document.getElementById('detail-add-cart');
  if (detailAddCart) detailAddCart.addEventListener('click', () => {
    if (state.itemDetail) {
      const vi = state.selectedVariantIdx;
      const variant = state.itemDetail.variants[vi] || state.itemDetail.variants[0];
      // Find fly animation source: active orbit item, single variant image, or hero container
      const orbitImg = document.querySelector('.variant-orbit-item--active img');
      const singleImg = document.querySelector('.detail-single-variant img');
      const flySource = orbitImg || singleImg || document.getElementById('detail-hero');
      if (flySource) _flyAnimRect = flySource.getBoundingClientRect();
      addToCart({
        id: state.itemDetail.id,
        name: state.itemDetail.name,
        variant: variant.name,
        variantIdx: vi,
        hex: variant.hexVariated || variant.hex || state.itemDetail.hexBase,
        img: variant.image || state.itemDetail.image,
      });
      updateDetailCartBtnState();
    }
  });

  // Detail "Add to List" button — always opens list picker (excludes Loved Items)
  const detailListBtn = document.getElementById('detail-add-to-list');
  if (detailListBtn) detailListBtn.addEventListener('click', () => {
    const itemId = detailListBtn.dataset.listItem;
    const vi = parseInt(detailListBtn.dataset.listVi) || 0;
    state.listPickerItem = { id: itemId, variantIdx: vi, excludeLoved: true };
    render();
  });

  // Similar items carousel — arrow buttons & scroll
  // (card taps and heart toggles are handled by the existing generic
  //  [data-item] and [data-heart] handlers above — no duplicate needed)
  const simScroll = document.getElementById('similar-scroll');
  const simArrowL = document.getElementById('similar-arrow-left');
  const simArrowR = document.getElementById('similar-arrow-right');
  if (simScroll) {
    const updateSimArrows = () => {
      if (simArrowL) simArrowL.classList.toggle('hidden', simScroll.scrollLeft <= 4);
      if (simArrowR) simArrowR.classList.toggle('hidden', simScroll.scrollLeft >= simScroll.scrollWidth - simScroll.clientWidth - 4);
    };
    simScroll.addEventListener('scroll', updateSimArrows, { passive: true });
    // Restore saved similar items scroll position
    if (state.similarScrollLeft) {
      simScroll.scrollLeft = state.similarScrollLeft;
    }
    updateSimArrows();
    if (simArrowL) simArrowL.addEventListener('click', () => simScroll.scrollBy({ left: -300, behavior: 'smooth' }));
    if (simArrowR) simArrowR.addEventListener('click', () => simScroll.scrollBy({ left: 300, behavior: 'smooth' }));
  }
  // Restore detail page scroll position (prevents page jump on interactions)
  if (state.page === 'detail' && state._detailScrollY !== undefined) {
    window.scrollTo(0, state._detailScrollY);
    state._detailScrollY = undefined;
  }

  // ─── Variant Orbit Carousel Events ───
  // Orbit chevrons
  document.querySelectorAll('.variant-orbit-chevron-left').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = state.itemDetail.variants.length;
      state.selectedVariantIdx = (state.selectedVariantIdx - 1 + count) % count;
      hapticTick();
      updateOrbitAndDetail();
    });
  });
  document.querySelectorAll('.variant-orbit-chevron-right').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = state.itemDetail.variants.length;
      state.selectedVariantIdx = (state.selectedVariantIdx + 1) % count;
      hapticTick();
      updateOrbitAndDetail();
    });
  });

  // Orbit item direct click
  document.querySelectorAll('.variant-orbit-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.variantOrbit);
      if (idx !== state.selectedVariantIdx) {
        state.selectedVariantIdx = idx;
        hapticTick();
        updateOrbitAndDetail();
      }
    });
  });

  // Variant drawer open/close
  document.querySelectorAll('[data-action="open-variant-drawer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.variant-drawer')?.classList.add('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.add('variant-drawer-backdrop--open');
    });
  });
  document.querySelectorAll('[data-action="close-variant-drawer"]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('.variant-drawer')?.classList.remove('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.remove('variant-drawer-backdrop--open');
    });
  });

  // Variant drawer row clicks
  document.querySelectorAll('.variant-drawer-row').forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't close drawer if clicking hex copy badge
      if (e.target.closest('.hex-copy-badge')) return;
      const idx = parseInt(row.dataset.drawerVariant);
      state.selectedVariantIdx = idx;
      hapticTick();
      updateOrbitAndDetail();
      document.querySelector('.variant-drawer')?.classList.remove('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.remove('variant-drawer-backdrop--open');
    });
  });

  // Toggle details expand/collapse
  document.querySelectorAll('[data-action="toggle-details"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.detailsExpanded = !state.detailsExpanded;
      const container = document.querySelector('.detail-fields-collapsible');
      if (container) container.classList.toggle('detail-fields-collapsible--open', state.detailsExpanded);
      const arrow = btn.querySelector('.detail-expand-arrow');
      if (arrow) arrow.classList.toggle('detail-expand-arrow--flipped', state.detailsExpanded);
      const textNode = btn.childNodes[btn.childNodes.length - 1];
      if (textNode && textNode.nodeType === 3) {
        textNode.textContent = state.detailsExpanded ? 'Show less' : 'Show all details';
      }
      const hint = document.querySelector('.detail-more-hint');
      if (hint) hint.style.display = state.detailsExpanded ? 'none' : '';
    });
  });

  // Add Set to Cart button
  document.querySelectorAll('[data-set-cart]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const setName = btn.dataset.setCart;
      btn.classList.add('detail-set-action-btn--loading');

      const setItems = await data.getItemsBySet(setName);
      let addedCount = 0;

      for (const item of setItems) {
        if (getCartTotal() >= 40) break;
        // Add first variant of each item
        const v = item.variants[0];
        addToCart({
          id: item.id,
          name: item.name,
          variant: v.name,
          variantIdx: 0,
          hex: v.hexVariated || v.hex || item.hexBase,
          img: v.image || item.image,
        });
        addedCount++;
      }

      btn.classList.remove('detail-set-action-btn--loading');
      if (addedCount > 0) {
        btn.classList.add('detail-set-action-btn--added');
        hapticTick();
        NookSounds.play('addToCart');
        setTimeout(() => btn.classList.remove('detail-set-action-btn--added'), 1500);
      }
    });
  });

  // Add Set to List button
  document.querySelectorAll('[data-set-list]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const setName = btn.dataset.setList;
      btn.classList.add('detail-set-action-btn--loading');

      const setItems = await data.getItemsBySet(setName);
      btn.classList.remove('detail-set-action-btn--loading');

      if (setItems.length > 0) {
        // Store set items for the list picker
        state.setPickerItems = setItems.map(item => ({
          id: item.id,
          name: item.name,
          variant: item.variants[0].name,
          variantIdx: 0,
          img: item.variants[0].image || item.image,
        }));
        state.setPickerName = setName;
        render();
      }
    });
  });

  // Hex copy badges
  attachHexCopyEvents();

  // Initialize orbit positions + swipe after detail page render
  if (state.page === 'detail' && state.itemDetail && state.itemDetail.variants.length > 1) {
    positionOrbitItems(state.selectedVariantIdx);
    initOrbitSwipe();
  }

  // Play entrance animation for detail page on fresh page load
  if (state.page === 'detail' && state.itemDetail && state._pageEnter) {
    playDetailEntrance();
    initDetailParallax();
    state._pageEnter = false;
  }

  // Cart duplicate by index (with pop animation)
  app.querySelectorAll('[data-dupe-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (getCartTotal() >= 40) return;
      const idx = parseInt(btn.dataset.dupeIdx);
      const item = state.cart[idx];
      if (item) {
        btn.style.animation = 'dupPop 0.35s cubic-bezier(0.34,1.56,0.64,1)';
        btn.style.boxShadow = '0 0 0 3px rgba(106,130,62,0.25)';
        setTimeout(() => { btn.style.animation = ''; btn.style.boxShadow = ''; }, 700);
        NookSounds.play('duplicate');
        addToCart({ ...item });
      }
    });
  });

  // Cart remove by index (with slide-out animation)
  app.querySelectorAll('[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.removeIdx);
      NookSounds.play('removeItem');
      const row = btn.closest('[data-cart-row]');
      if (row) {
        row.style.animation = 'slideOutRight 0.4s ease-in forwards';
        row.addEventListener('animationend', () => {
          state.cart.splice(idx, 1);
          storage.setCart(state.cart);
          render();
        }, { once: true });
      } else {
        state.cart.splice(idx, 1);
        storage.setCart(state.cart);
        render();
      }
    });
  });

  // Clear entire cart
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', () => {
    if (confirm('Clear all items from your cart?')) {
      NookSounds.play('clearCart');
      state.cart = [];
      storage.setCart(state.cart);
      render();
    }
  });

  // Wishlist add-to-cart (uses embedded data attributes for correct variant)
  app.querySelectorAll('[data-wl-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-item]');
      // Try img first, fall back to .item-thumb, then button for animation origin
      const img = card && card.querySelector('.item-thumb img');
      const thumb = card && card.querySelector('.item-thumb');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      else if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      else _flyAnimRect = btn.getBoundingClientRect();
      const entry = {
        id: btn.dataset.wlId,
        name: btn.dataset.wlName,
        variant: btn.dataset.wlVariant,
        variantIdx: parseInt(btn.dataset.wlVi) || 0,
        hex: btn.dataset.wlHex,
        img: btn.dataset.wlImg,
      };
      addToCart(entry);
    });
  });

  // Remove from specific list by index (in list detail view)
  app.querySelectorAll('[data-remove-list-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.removeListIdx);
      const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
      if (list && idx >= 0 && idx < list.items.length) {
        list.items.splice(idx, 1);
        storage.setWishlists(state.wishlists);
        render();
      }
    });
  });

  // View list detail
  app.querySelectorAll('[data-view-list]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-list]')) return;
      state.viewingListId = btn.dataset.viewList;
      render();
    });
  });

  // List back button
  const listBack = document.getElementById('list-back');
  if (listBack) listBack.addEventListener('click', () => {
    state.viewingListId = null;
    render();
  });

  // Create new list
  const createList = document.getElementById('create-new-list');
  if (createList) createList.addEventListener('click', () => {
    createList.outerHTML = `<div style="display:flex;gap:8px" id="new-list-form">
      <input type="text" id="new-list-input" class="prefix-input" placeholder="List name..." autofocus style="flex:1;width:auto;margin:0">
      <button class="preset-btn active" id="new-list-confirm" style="width:auto;padding:0 18px;font-size:18px">✓</button>
    </div>`;
    const inp = document.getElementById('new-list-input');
    const doCreate = () => {
      const name = (inp.value || '').trim();
      if (name) {
        state.wishlists.lists.push({ id: Date.now().toString(36), name, cap: 40, items: [] });
        storage.setWishlists(state.wishlists);
        NookSounds.play('newList');
      }
      render();
    };
    document.getElementById('new-list-confirm').addEventListener('click', doCreate);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreate(); });
    inp.focus();
  });

  // Delete list
  app.querySelectorAll('[data-delete-list]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const listId = btn.dataset.deleteList;
      const list = state.wishlists.lists.find(l => l.id === listId);
      if (list && confirm(`Delete "${list.name}"? Items will be removed from this list only.`)) {
        state.wishlists.lists = state.wishlists.lists.filter(l => l.id !== listId);
        storage.setWishlists(state.wishlists);
        NookSounds.play('deleteList');
        render();
      }
    });
  });

  // Copy list order
  const copyListBtn = document.getElementById('copy-list-order');
  if (copyListBtn) copyListBtn.addEventListener('click', () => {
    NookSounds.play('copyCommand');
    const command = `${state.prefix}order ${lastRenderedListHexes.join(' ')}`;

    const showCopied = () => {
      copyListBtn.innerHTML = `${ICONS.check} Copied!`;
      setTimeout(() => { copyListBtn.innerHTML = `${ICONS.copy} Copy Order`; }, 2000);
    };
    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(command).then(showCopied).catch(() => {
        fallbackCopy(command);
        showCopied();
      });
    } else {
      fallbackCopy(command);
      showCopied();
    }
  });

  // Toast "Change" button
  const toastChange = document.getElementById('toast-change');
  if (toastChange) toastChange.addEventListener('click', () => {
    const t = state.wishlistToast;
    if (t) {
      state.listPickerItem = { id: t.itemId, variantIdx: t.variantIdx };
      clearTimeout(toastTimer);
      state.wishlistToast = null;
      render();
    }
  });

  // List picker — pick a list
  app.querySelectorAll('[data-pick-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      const listId = btn.dataset.pickList;
      const item = state.listPickerItem;
      if (!item) return;
      const list = state.wishlists.lists.find(l => l.id === listId);
      if (!list) return;
      if (list.id === '__loved__') {
        // Loved Items: toggle (single instance only)
        const idx = list.items.findIndex(w => w.id === item.id && w.variantIdx === item.variantIdx);
        if (idx >= 0) {
          list.items.splice(idx, 1);
        } else if (!list.items.some(w => w.id === item.id && w.variantIdx === item.variantIdx)) {
          list.items.push({ id: item.id, variantIdx: item.variantIdx });
        }
      } else {
        // Other lists: always add (allow duplicates)
        if (list.cap !== null && list.items.length >= list.cap) return;
        list.items.push({ id: item.id, variantIdx: item.variantIdx });
      }
      storage.setWishlists(state.wishlists);
      render();
    });
  });

  // List picker — create list
  const createFromPicker = document.getElementById('create-list-from-picker');
  if (createFromPicker) createFromPicker.addEventListener('click', () => {
    createFromPicker.outerHTML = `<div style="display:flex;gap:8px;margin-bottom:12px" id="picker-list-form">
      <input type="text" id="picker-list-input" class="prefix-input" placeholder="List name..." autofocus style="flex:1;width:auto;margin:0">
      <button class="preset-btn active" id="picker-list-confirm" style="width:auto;padding:0 18px;font-size:18px">✓</button>
    </div>`;
    const inp = document.getElementById('picker-list-input');
    const doCreate = () => {
      const name = (inp.value || '').trim();
      if (name) {
        state.wishlists.lists.push({ id: Date.now().toString(36), name, cap: 40, items: [] });
        storage.setWishlists(state.wishlists);
      }
      render();
    };
    document.getElementById('picker-list-confirm').addEventListener('click', doCreate);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreate(); });
    inp.focus();
  });

  // Close list picker
  const closeListPicker = document.getElementById('close-list-picker');
  if (closeListPicker) closeListPicker.addEventListener('click', () => {
    state.listPickerItem = null;
    render();
  });
  // Also close on overlay click
  const pickerOverlay = document.getElementById('list-picker-overlay');
  if (pickerOverlay) pickerOverlay.addEventListener('click', (e) => {
    if (e.target === pickerOverlay) {
      state.listPickerItem = null;
      render();
    }
  });

  // Set picker — pick a list for entire set
  app.querySelectorAll('[data-set-pick-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      const listId = btn.dataset.setPickList;
      const items = state.setPickerItems;
      if (!items || items.length === 0) return;

      const list = state.wishlists.lists.find(l => l.id === listId);
      if (!list) return;

      let addedCount = 0;
      for (const item of items) {
        // Check list capacity
        if (list.cap !== null && list.items.length >= list.cap) break;
        // Skip if already in list
        if (list.items.some(w => w.id === item.id && w.variantIdx === item.variantIdx)) continue;

        list.items.push({
          id: item.id,
          variantIdx: item.variantIdx,
          addedAt: Date.now(),
        });
        addedCount++;
      }

      if (addedCount > 0) {
        storage.saveWishlists(state.wishlists);
        hapticTick();
        NookSounds.play('addToList');
        state.wishlistToast = { listId, listName: list.name, action: 'add' };
      }

      state.setPickerItems = null;
      state.setPickerName = null;
      render();
    });
  });

  // Create new list from set picker
  const createFromSetPicker = document.getElementById('create-list-from-set-picker');
  if (createFromSetPicker) createFromSetPicker.addEventListener('click', () => {
    const modal = createFromSetPicker.closest('.modal-card');
    createFromSetPicker.style.display = 'none';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'New list name';
    inp.className = 'modal-input';
    inp.style.marginBottom = '12px';
    modal.insertBefore(inp, createFromSetPicker);

    const doCreate = () => {
      const name = inp.value.trim();
      if (!name) return;
      const newId = 'list_' + Date.now();
      const newList = { id: newId, name, items: [], cap: null };

      // Add set items to the new list
      const items = state.setPickerItems || [];
      for (const item of items) {
        newList.items.push({
          id: item.id,
          variantIdx: item.variantIdx,
          addedAt: Date.now(),
        });
      }

      state.wishlists.lists.push(newList);
      storage.saveWishlists(state.wishlists);
      hapticTick();
      NookSounds.play('addToList');
      state.wishlistToast = { listId: newId, listName: name, action: 'add' };
      state.setPickerItems = null;
      state.setPickerName = null;
      render();
    };

    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreate(); });
    inp.focus();
  });

  // Close set picker
  const closeSetPicker = document.getElementById('close-set-picker');
  if (closeSetPicker) closeSetPicker.addEventListener('click', () => {
    state.setPickerItems = null;
    state.setPickerName = null;
    render();
  });

  // Also close set picker on overlay click
  const setPickerOverlay = document.getElementById('set-picker-overlay');
  if (setPickerOverlay) setPickerOverlay.addEventListener('click', (e) => {
    if (e.target === setPickerOverlay) {
      state.setPickerItems = null;
      state.setPickerName = null;
      render();
    }
  });

  // Copy command (shipping label click)
  const copyLabel = document.getElementById('copy-cmd');
  if (copyLabel) copyLabel.addEventListener('click', () => {
    NookSounds.play('copyCommand');
    const command = `${state.prefix}order ${state.cart.map(c => c.hex).join(' ')}`;

    // Show stamp overlay feedback
    const showStamp = () => {
      const overlay = document.getElementById('stamp-overlay');
      if (overlay) {
        overlay.classList.add('visible');
        const hint = copyLabel.querySelector('.label-copy-hint');
        if (hint) hint.style.opacity = '0';
        setTimeout(() => {
          overlay.classList.remove('visible');
          if (hint) hint.style.opacity = '1';
        }, 2500);
      }
    };

    // Fallback copy using execCommand for non-secure contexts
    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(command).then(showStamp).catch(() => {
        fallbackCopy(command);
        showStamp();
      });
    } else {
      fallbackCopy(command);
      showStamp();
    }
  });

  // Settings prefix
  const prefixInput = document.getElementById('prefix-input');
  if (prefixInput) prefixInput.addEventListener('input', (e) => {
    state.prefix = e.target.value;
    storage.setPrefix(state.prefix);
    NookSounds.play('prefixChange');
    render();
    setTimeout(() => {
      const inp = document.getElementById('prefix-input');
      if (inp) { inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
    }, 10);
  });

  // Preset buttons
  app.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.prefix = btn.dataset.preset;
      storage.setPrefix(state.prefix);
      NookSounds.play('prefixChange');
      render();
    });
  });

  // Settings load mode
  app.querySelectorAll('[data-settings-load]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.loadMode = btn.dataset.settingsLoad;
      storage.setLoadMode(state.loadMode);
      app.querySelectorAll('[data-settings-load]').forEach(b => {
        b.classList.toggle('active', b.dataset.settingsLoad === state.loadMode);
      });
    });
  });

  // Sound toggle
  const soundToggle = document.getElementById('soundToggle');
  const soundVolumeSlider = document.getElementById('soundVolume');
  const volumeLabel = document.getElementById('volumeLabel');
  const volumeRow = document.querySelector('.sound-volume-row');

  if (soundToggle) soundToggle.addEventListener('change', (e) => {
    state.soundEnabled = e.target.checked;
    NookSounds.setEnabled(state.soundEnabled);
    localStorage.setItem('acnhex_sound_enabled', state.soundEnabled);
    // Enable/disable volume slider based on sound toggle
    if (soundVolumeSlider) soundVolumeSlider.disabled = !state.soundEnabled;
    if (volumeRow) volumeRow.classList.toggle('disabled', !state.soundEnabled);
    if (state.soundEnabled) NookSounds.play('toggleSound');
  });

  // Volume slider
  if (soundVolumeSlider) soundVolumeSlider.addEventListener('input', (e) => {
    state.soundVolume = parseFloat(e.target.value);
    NookSounds.setVolume(state.soundVolume);
    localStorage.setItem('acnhex_sound_volume', state.soundVolume);
    if (volumeLabel) volumeLabel.textContent = Math.round(state.soundVolume * 100) + '%';
  });

  // Ad toggles
  const adsToggle = document.getElementById('adsToggle');
  const adOptionsGroup = document.getElementById('adOptionsGroup');
  const adsBannersToggle = document.getElementById('adsBannersToggle');
  const adsInterstitialsToggle = document.getElementById('adsInterstitialsToggle');
  const adsPopupsToggle = document.getElementById('adsPopupsToggle');
  const adsFloatingToggle = document.getElementById('adsFloatingToggle');

  if (adsToggle) adsToggle.addEventListener('change', (e) => {
    state.adsEnabled = e.target.checked;
    localStorage.setItem('acnhex_ads_enabled', state.adsEnabled);
    // Enable/disable sub-toggles
    if (adOptionsGroup) adOptionsGroup.classList.toggle('disabled', !state.adsEnabled);
    [adsBannersToggle, adsInterstitialsToggle, adsPopupsToggle, adsFloatingToggle].forEach(t => {
      if (t) t.disabled = !state.adsEnabled;
    });
  });

  if (adsBannersToggle) adsBannersToggle.addEventListener('change', (e) => {
    state.adsBanners = e.target.checked;
    localStorage.setItem('acnhex_ads_banners', state.adsBanners);
  });

  if (adsInterstitialsToggle) adsInterstitialsToggle.addEventListener('change', (e) => {
    state.adsInterstitials = e.target.checked;
    localStorage.setItem('acnhex_ads_interstitials', state.adsInterstitials);
  });

  if (adsPopupsToggle) adsPopupsToggle.addEventListener('change', (e) => {
    state.adsPopups = e.target.checked;
    localStorage.setItem('acnhex_ads_popups', state.adsPopups);
  });

  if (adsFloatingToggle) adsFloatingToggle.addEventListener('change', (e) => {
    state.adsFloatingNotifs = e.target.checked;
    localStorage.setItem('acnhex_ads_floating', state.adsFloatingNotifs);
  });

  // Clear data
  const clearBtn = document.getElementById('clear-data');
  if (clearBtn) clearBtn.addEventListener('click', async () => {
    if (confirm('This will clear ALL data including cart, wishlists, settings, and cache. Are you sure?')) {
      // Clear all localStorage
      storage.clearAll();
      // Clear all caches (service worker, etc.)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      // Hard refresh (bypass cache)
      location.reload(true);
    }
  });

  // Modal
  const modalConfirm = document.getElementById('modal-confirm');
  if (modalConfirm) modalConfirm.addEventListener('click', () => {
    state.seenIntro = true;
    storage.setSeenIntro(true);
    storage.setPrefix(state.prefix);
    storage.setLoadMode(state.loadMode);
    render();
  });

  app.querySelectorAll('[data-modal-load]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.loadMode = btn.dataset.modalLoad;
      app.querySelectorAll('[data-modal-load]').forEach(b => {
        b.classList.toggle('active', b.dataset.modalLoad === state.loadMode);
      });
    });
  });

  const modalPrefix = document.getElementById('modal-prefix');
  if (modalPrefix) modalPrefix.addEventListener('input', (e) => {
    state.prefix = e.target.value;
    const preview = document.getElementById('modal-preview');
    if (preview) {
      preview.innerHTML = `<span class="code-keyword">${esc(state.prefix)}order</span> <span class="code-value">0x0A3F</span> <span class="code-value">0x1B2C</span>`;
    }
    // Update preset active states
    app.querySelectorAll('[data-modal-preset]').forEach(b => {
      b.classList.toggle('active', b.dataset.modalPreset === state.prefix);
    });
  });

  app.querySelectorAll('[data-modal-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.prefix = btn.dataset.modalPreset;
      const inp = document.getElementById('modal-prefix');
      if (inp) inp.value = state.prefix;
      const preview = document.getElementById('modal-preview');
      if (preview) {
        preview.innerHTML = `<span class="code-keyword">${esc(state.prefix)}order</span> <span class="code-value">0x0A3F</span> <span class="code-value">0x1B2C</span>`;
      }
      app.querySelectorAll('[data-modal-preset]').forEach(b => {
        b.classList.toggle('active', b.dataset.modalPreset === state.prefix);
      });
    });
  });

  // ─── Fake Ad Events ───
  // Clicking any inline banner or interstitial ad shows toast
  app.querySelectorAll('[data-nook-promo]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't trigger toast if clicking dismiss button on floating notif
      if (e.target.closest('#notif-dismiss')) return;
      e.stopPropagation();
      showAdToast();
    });
  });

  // Popup dismiss buttons
  app.querySelectorAll('[data-popup-dismiss]').forEach(el => {
    el.addEventListener('click', async () => {
      if (state.activePopup) {
        NookSounds.play('dismissAd');
        ads.dismissPopup(state.activePopup);
        state.activePopup = null;
        await render();
        showAdToast();
      }
    });
  });

  // Floating notification dismiss button
  const notifDismiss = document.getElementById('notif-dismiss');
  if (notifDismiss) {
    notifDismiss.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissFloatingNotif();
    });
  }

  // Floating notification swipe to dismiss (mobile)
  const floatingNotif = document.getElementById('floating-notif');
  if (floatingNotif) {
    let startX = 0;
    let startY = 0;
    let swiping = false;
    floatingNotif.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });
    floatingNotif.addEventListener('touchmove', (e) => {
      if (!swiping) return;
      const diffY = startY - e.touches[0].clientY;
      if (diffY > 30) { // swiped up
        swiping = false;
        dismissFloatingNotif();
      }
    }, { passive: true });
    floatingNotif.addEventListener('touchend', () => { swiping = false; }, { passive: true });
  }

  // Re-attach search result events when search overlay is active
  if (state.searchOpen && state.searchResults) {
    attachSearchResultEvents();
    attachSearchScrollObserver();
  }
}

// ─── Ad Toast Helper ───
let adToastTimer = null;
function showAdToast() {
  clearTimeout(adToastTimer);
  state.adToastVisible = true;
  NookSounds.play('adToast');
  render();
  adToastTimer = setTimeout(() => {
    state.adToastVisible = false;
    const el = document.getElementById('promo-toast');
    if (el) el.remove();
  }, 3200);
}

// ─── Floating Notification Helpers ───
function dismissFloatingNotif() {
  NookSounds.play('dismissAd');
  const el = document.getElementById('floating-notif');
  if (el) {
    el.classList.add('dismissing');
    el.addEventListener('animationend', () => {
      state.floatingNotif = null;
      const container = document.getElementById('floating-notif-container');
      if (container) container.remove();
      // Schedule next notification after a delay
      scheduleFloatingNotif();
    }, { once: true });
  } else {
    state.floatingNotif = null;
    scheduleFloatingNotif();
  }
  clearTimeout(state.floatingNotifAutoTimer);
}

function showFloatingNotif() {
  if (state.floatingNotif || state.activePopup) return; // don't overlap with popups
  const notif = ads.getNextFloatingNotif();
  if (!notif) return;
  state.floatingNotif = notif;
  NookSounds.play('notification');
  render();

  // Auto-dismiss after 8 seconds
  clearTimeout(state.floatingNotifAutoTimer);
  state.floatingNotifAutoTimer = setTimeout(() => {
    dismissFloatingNotif();
  }, 8000);
}

function scheduleFloatingNotif() {
  clearTimeout(state.floatingNotifTimer);
  if (!ads.canShowFloatingNotif()) return;
  // Random delay between 90-120 seconds for subsequent notifications
  const delay = 90000 + Math.random() * 30000;
  state.floatingNotifTimer = setTimeout(() => {
    // Don't show if user is actively scrolling
    if (state._userScrolling) {
      scheduleFloatingNotif(); // retry later
      return;
    }
    showFloatingNotif();
  }, delay);
}

// ─── HHP Browse Time Popup ───
function startHhpTimer() {
  if (state.hhpTimerStarted) return;
  state.hhpTimerStarted = true;
  setTimeout(() => {
    if (!state.activePopup && !state.searchOpen) {
      const popupType = ads.checkPopupTrigger({
        type: 'timer',
        sessionStart: state.sessionStart,
      });
      if (popupType) {
        ads.markPopupShown();
        state.activePopup = popupType;
        render();
      }
    }
  }, 125000); // Check at ~2 min mark
}

// ─── Flying Add-to-Cart Animation ───
let _flyAnimRect = null;

// ─── Actions ───
async function toggleWishlist(itemId, variantIdx = 0) {
  const wasIn = isInWishlist(itemId, variantIdx);
  if (wasIn) {
    // Remove from ALL lists
    state.wishlists.lists.forEach(list => {
      list.items = list.items.filter(w => !(w.id === itemId && w.variantIdx === variantIdx));
    });
    storage.setWishlists(state.wishlists);
    NookSounds.play('heartRemove');
    showWishlistToast(itemId, variantIdx, 'Loved Items', true);
  } else {
    // Add to Loved Items by default (single instance only)
    const loved = state.wishlists.lists.find(l => l.id === '__loved__');
    if (!loved.items.some(w => w.id === itemId && w.variantIdx === variantIdx)) {
      loved.items.push({ id: itemId, variantIdx });
    }
    storage.setWishlists(state.wishlists);
    NookSounds.play('heartAdd');
    showWishlistToast(itemId, variantIdx, 'Loved Items');
  }

  if (state.searchOpen) {
    // Surgical update: toggle heart icons without full re-render to prevent flash
    const filled = !wasIn;
    app.querySelectorAll(`[data-heart="${itemId}"][data-heart-vi="${variantIdx}"]`).forEach(btn => {
      btn.innerHTML = ICONS.heart(filled);
      btn.classList.add('pulse');
      btn.addEventListener('animationend', () => btn.classList.remove('pulse'), { once: true });
    });
    // Inject wishlist toast
    const existingToast = document.getElementById('wl-toast');
    if (existingToast) existingToast.remove();
    if (state.wishlistToast) {
      app.insertAdjacentHTML('beforeend', renderWishlistToast());
      const toastChange = document.getElementById('toast-change');
      if (toastChange) toastChange.addEventListener('click', () => {
        const t = state.wishlistToast;
        if (t) {
          state.listPickerItem = { id: t.itemId, variantIdx: t.variantIdx };
          clearTimeout(toastTimer);
          state.wishlistToast = null;
          render();
        }
      });
    }
    return;
  }

  // Surgical update for detail page to avoid full re-render (fixes double-tap issue)
  if (state.page === 'detail' && state.itemDetail) {
    const filled = !wasIn;
    // Update hero heart button
    const heroHeart = app.querySelector('.detail-hero-orbit [data-heart]');
    if (heroHeart) {
      heroHeart.innerHTML = ICONS.heartLg(filled);
      heroHeart.classList.add('pulse');
      heroHeart.addEventListener('animationend', () => heroHeart.classList.remove('pulse'), { once: true });
    }
    // Update similar items hearts
    app.querySelectorAll(`.similar-card-heart[data-heart="${itemId}"]`).forEach(btn => {
      const vi = parseInt(btn.dataset.heartVi) || 0;
      if (vi === variantIdx) {
        btn.innerHTML = ICONS.heart(filled);
        btn.classList.add('pulse');
        btn.addEventListener('animationend', () => btn.classList.remove('pulse'), { once: true });
      }
    });
    // Update orbit heart dots
    refreshOrbitHeartDots();
    // Show toast
    const existingToast = document.getElementById('wl-toast');
    if (existingToast) existingToast.remove();
    if (state.wishlistToast) {
      app.insertAdjacentHTML('beforeend', renderWishlistToast());
      const toastChange = document.getElementById('toast-change');
      if (toastChange) toastChange.addEventListener('click', () => {
        const t = state.wishlistToast;
        if (t) {
          state.listPickerItem = { id: t.itemId, variantIdx: t.variantIdx };
          clearTimeout(toastTimer);
          state.wishlistToast = null;
          render();
        }
      });
    }
    return;
  }

  state._heartPulse = { id: itemId, vi: variantIdx };
  await render();
}

function getCartTotal() {
  return state.cart.length;
}

function getCartQtyForItem(itemId, variantIdx) {
  return state.cart.filter(c => c.id === itemId && c.variantIdx === variantIdx).length;
}

function removeOneFromCart(itemId, variantIdx) {
  const idx = state.cart.findIndex(c => c.id === itemId && c.variantIdx === variantIdx);
  if (idx !== -1) {
    state.cart.splice(idx, 1);
    storage.setCart(state.cart);
    NookSounds.play('removeItem');
  }
}

function updateAllCartBtnStates() {
  // Update all visible cart button wrappers to reflect current cart state
  document.querySelectorAll('.cart-btn-wrap').forEach(wrap => {
    const itemId = wrap.dataset.cartItemId;
    const vi = parseInt(wrap.dataset.cartVi) || 0;
    const qty = getCartQtyForItem(itemId, vi);
    const addBtn = wrap.querySelector('.add-cart-btn');
    const counter = wrap.querySelector('.qty-counter');
    const valSpan = wrap.querySelector('.qty-counter-val');
    const plusBtn = wrap.querySelector('[data-qty-plus]');
    const cartFull = getCartTotal() >= 40;

    if (qty > 0) {
      addBtn.classList.add('hidden');
      counter.classList.add('visible');
      valSpan.textContent = qty;
    } else {
      addBtn.classList.remove('hidden');
      counter.classList.remove('visible');
    }

    // Disable add/plus buttons when cart is full
    addBtn.disabled = cartFull;
    if (plusBtn) plusBtn.disabled = cartFull;
  });

  // Update cart badge
  const badge = document.querySelector('.nav-badge');
  if (badge) {
    const total = getCartTotal();
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function addToCartFromIndex(itemId, variantIdx = 0) {
  if (getCartTotal() >= 40) return;
  // Try to find expanded item info from currently displayed items
  const displayed = [
    ...(state.expandedItems || []),
    ...(state.randomItems || []),
    ...((state.searchResults && state.searchResults.items) || []),
  ];
  const expandedItem = displayed.find(i => i.id === itemId && (i.variantIdx ?? 0) === variantIdx);
  if (expandedItem) {
    addToCart({
      id: expandedItem.id,
      name: expandedItem.n,
      variant: expandedItem.v1,
      variantIdx: variantIdx,
      hex: expandedItem.hex,
      img: expandedItem.img,
    });
    return;
  }
  // Fallback to index item
  const item = data.getIndexItem(itemId);
  if (!item) return;
  addToCart({
    id: item.id,
    name: item.n,
    variant: item.v1,
    variantIdx: 0,
    hex: item.hex,
    img: item.img,
  });
}

function addToCart(entry) {
  if (state.cart.length >= 40) { NookSounds.play('cartFull'); return; }

  // Fire flying animation using snapshot captured by click handler
  if (_flyAnimRect) {
    const cartTab = app.querySelector('[data-nav="cart"]');
    if (cartTab) {
      const endRect = cartTab.getBoundingClientRect();
      const sr = _flyAnimRect;
      let clone;
      if (entry.img) {
        clone = document.createElement('img');
        clone.src = entry.img;
      } else {
        // Fallback: create a styled div for items without images
        clone = document.createElement('div');
        clone.textContent = '📦';
        clone.style.display = 'flex';
        clone.style.alignItems = 'center';
        clone.style.justifyContent = 'center';
        clone.style.fontSize = '24px';
        clone.style.background = 'var(--tag-bg, #f0f0f0)';
      }
      clone.className = 'flying-item';
      clone.style.left = sr.left + sr.width / 2 - 22 + 'px';
      clone.style.top = sr.top + sr.height / 2 - 22 + 'px';
      clone.style.transform = 'scale(1) translate(0, 0)';
      clone.style.opacity = '1';
      document.body.appendChild(clone);
      const dx = endRect.left + endRect.width / 2 - (sr.left + sr.width / 2);
      const dy = endRect.top + endRect.height / 2 - (sr.top + sr.height / 2);
      // Double rAF ensures element is painted before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clone.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in';
          clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.25)`;
          clone.style.opacity = '0';
        });
      });
      clone.addEventListener('transitionend', function handler(e) {
        if (e.propertyName !== 'transform') return;
        clone.removeEventListener('transitionend', handler);
        clone.remove();
        cartTab.classList.add('cart-pulse');
        cartTab.addEventListener('animationend', () => cartTab.classList.remove('cart-pulse'), { once: true });
      });
    }
  }
  _flyAnimRect = null;

  state.cart.push(entry);
  storage.setCart(state.cart);
  NookSounds.play('addToCart');
  state._cartBounce = true;

  if (state.searchOpen) {
    // Surgical update: just refresh the cart badge without a full re-render
    const cartTab = app.querySelector('[data-nav="cart"]');
    if (cartTab) {
      const wrapper = cartTab.querySelector('div');
      const existing = cartTab.querySelector('.nav-badge');
      if (existing) existing.textContent = state.cart.length;
      else if (wrapper) wrapper.insertAdjacentHTML('beforeend', `<span class="nav-badge">${state.cart.length}</span>`);
      const badge = cartTab.querySelector('.nav-badge');
      if (badge) {
        badge.classList.add('pop');
        badge.addEventListener('animationend', () => badge.classList.remove('pop'), { once: true });
      }
    }
    return;
  }

  render();

  // Trigger premium popup on first cart add in session
  if (!state.firstCartAddDone) {
    state.firstCartAddDone = true;
    if (!state.activePopup) {
      const popupType = ads.checkPopupTrigger({ type: 'cartAdd' });
      if (popupType) {
        ads.markPopupShown();
        setTimeout(() => {
          state.activePopup = popupType;
          render();
        }, 800);
      }
    }
  }
}

async function loadItemDetail(itemId) {
  state.itemDetail = null;
  _similarCache = { itemId: null, matches: null, badgeText: null }; // clear similar items cache for new item
  _reviewCache = { itemId: null, data: null }; // clear reviews cache for new item
  state.similarScrollLeft = 0; // reset similar carousel scroll for new item
  state._detailScrollY = undefined; // prevent restoring old scroll position
  state.detailsExpanded = false; // reset collapsible details
  state.variantDrawerOpen = false; // reset variant drawer
  state.itemsViewed++;
  render(); // Show loading
  window.scrollTo(0, 0);
  state.itemDetail = await data.getItemDetail(itemId);
  state._pageEnter = true;
  render();
  window.scrollTo(0, 0);
}

// ─── Pull-to-Refresh ───
function initPullToRefresh() {
  let startY = 0;
  let pulling = false;
  const threshold = 60;

  document.addEventListener('touchstart', (e) => {
    if (window.scrollY <= 2 && state.page === 'catalog' && !state.searchOpen) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const pullDistance = e.touches[0].clientY - startY;
    if (pullDistance > 0 && window.scrollY <= 2) {
      const indicator = document.getElementById('ptr-indicator');
      if (indicator) {
        indicator.classList.add('pulling');
        indicator.style.setProperty('--pull-y', Math.min(pullDistance * 0.4, 80) + 'px');
      }
    } else {
      pulling = false;
      const indicator = document.getElementById('ptr-indicator');
      if (indicator) {
        indicator.classList.remove('pulling');
        indicator.style.setProperty('--pull-y', '0px');
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', async () => {
    if (!pulling) return;
    pulling = false;
    const indicator = document.getElementById('ptr-indicator');
    if (!indicator) return;
    const pullY = parseFloat(indicator.style.getPropertyValue('--pull-y')) || 0;
    if (pullY >= threshold * 0.4) {
      indicator.classList.remove('pulling');
      indicator.classList.add('refreshing');
      // Refresh with new random items
      NookSounds.play('pullRefresh');
      ads.resetGridInterstitial();
      state.isRandom = true;
      state.randomUsedIndices = new Set();
      state.randomItems = await data.getRandomExpandedItems(50, state.randomUsedIndices);
      indicator.classList.remove('refreshing');
      indicator.style.setProperty('--pull-y', '0px');
      render();
    } else {
      indicator.classList.remove('pulling');
      indicator.style.setProperty('--pull-y', '0px');
    }
  });
}

// ─── Scroll Activity Tracking (for notification gating) ───
let scrollIdleTimer = null;
function initScrollTracking() {
  window.addEventListener('scroll', () => {
    state._userScrolling = true;
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
      state._userScrolling = false;
    }, 2000); // Consider user idle after 2s of no scroll
  }, { passive: true });
}

// ─── Init ───
async function init() {
  app.innerHTML = `<div class="loading" style="padding-top:40vh"><div class="spinner"></div><p class="text-secondary">Loading catalog...</p></div>`;
  await data.loadCatalog();
  // Start with random picks as the default homepage view
  state.isRandom = true;
  state.randomUsedIndices = new Set();
  state.randomItems = await data.getRandomExpandedItems(50, state.randomUsedIndices);
  state._pageEnter = true;
  render();
  initPullToRefresh();
  initScrollTracking();
  // Dismiss loading screen
  const ls = document.getElementById('loading-screen');
  if (ls) {
    ls.classList.add('ls-fade-out');
    ls.addEventListener('transitionend', () => ls.remove(), { once: true });
    setTimeout(() => { if (ls.parentNode) ls.remove(); }, 800);
  }
  // Show cookie popup on first visit (after a short delay for UX)
  setTimeout(() => {
    const popupType = ads.checkPopupTrigger({ type: 'init' });
    if (popupType) {
      ads.markPopupShown();
      state.activePopup = popupType;
      render();
    }
  }, 2000);

  // Schedule first floating notification (45-60 seconds after load)
  state.floatingNotifTimer = setTimeout(() => {
    // Don't show if user is actively scrolling
    if (state._userScrolling) {
      scheduleFloatingNotif(); // retry later
      return;
    }
    showFloatingNotif();
  }, 45000 + Math.random() * 15000);

  // Start the 2-minute browse timer for HHP popup
  startHhpTimer();
}

init();
