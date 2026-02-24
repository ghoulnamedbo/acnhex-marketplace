import * as storage from './storage.js';
import * as data from './data.js';
import * as reviews from './reviews.js';
import * as ads from './ads.js';

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
function showWishlistToast(itemId, variantIdx, listName) {
  clearTimeout(toastTimer);
  state.wishlistToast = { itemId, variantIdx, listName };
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

function renderItemCard(item, idx) {
  const bg = data.getItemBg(idx);
  const vi = item.variantIdx ?? 0;
  const inWishlist = isInWishlist(item.id, vi);
  const cartFull = getCartTotal() >= 40;
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
      <button class="add-cart-btn" data-add-cart="${esc(item.id)}" ${cartFull ? 'disabled' : ''}>
        ${ICONS.plus} Add
      </button>
    </div>
  </div>`;
}

// ─── Item Detail ───
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
  const reviewData = await reviews.generateReviewSection(item);

  const detailFields = [
    ['Hex ID', item.hexBase],
    ['Hex ID (Variated)', variant.hexVariated || variant.hex || item.hexBase],
    ['Size', item.size],
    ['Catalog', item.catalog],
    ['HHA Concepts', [item.hhaConcept1, item.hhaConcept2].filter(Boolean).join(', ')],
    ['HHA Series', item.hhaSeries],
    ['HHA Set', item.hhaSet],
    ['Styles', (item.tags || []).filter(t => ['active','cool','cute','elegant','gorgeous','simple'].includes(t)).join(', ')],
    ['Colors', [variant.color1, variant.color2].filter(Boolean).join(', ')],
    ['DIY', item.diy],
  ].filter(([, v]) => v && v !== 'NA');

  return `<div class="page">
    <div class="detail-hero" style="background:${bg}">
      ${variant.image ? `<img id="detail-hero-img" src="${esc(variant.image)}" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="glass-btn left" id="detail-back">${ICONS.chevronLeft}</button>
      <button class="glass-btn right" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heartLg(inWishlist)}</button>
    </div>

    <div class="detail-title" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">
      <h2 class="heading-lg" style="line-height:1.25">${esc(item.name)}</h2>
      <div class="detail-rating">
        <span style="font-size:14px">⭐</span>
        <span style="font-size:13px;font-weight:700">${reviewData.avgRating}</span>
      </div>
    </div>

    ${item.variants.length > 1 ? `
    <div class="variant-carousel-wrapper" id="variant-wrapper">
      <button class="variant-arrow left" id="variant-arrow-left"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
      <div class="variant-carousel hide-scrollbar" id="variant-scroll">
        ${item.variants.map((v, i) => `
          <button class="variant-pill ${i === vi ? 'active' : ''}" data-variant="${i}">${esc(v.name)}</button>
        `).join('')}
      </div>
      <button class="variant-arrow right" id="variant-arrow-right"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
    </div>` : ''}

    <div class="tag-pills">
      ${(item.tags || []).slice(0, 8).map(t => `<span class="tag-pill">${esc(t)}</span>`).join('')}
    </div>

    <div class="details-card" id="detail-fields">
      <h4 class="label-upper" style="margin-bottom:16px">Details</h4>
      ${detailFields.map(([label, val], i) => `
        <div class="detail-row">
          <span class="detail-label">${esc(label)}</span>
          <span class="detail-value">${esc(String(val))}</span>
        </div>`).join('')}
    </div>

    ${reviewData.html}

    <div class="sticky-cta" id="detail-cta">
      <button class="cta-btn-secondary" id="detail-add-to-list" data-list-item="${esc(item.id)}" data-list-vi="${vi}">
        📋 Add to List
      </button>
      <div class="detail-qty-row">
        <div class="qty-control">
          <button class="qty-btn" data-detail-qty-minus="cart">−</button>
          <span class="qty-value" id="detail-qty-cart">0</span>
          <button class="qty-btn" data-detail-qty-plus="cart">+</button>
        </div>
        <button class="cta-btn" id="detail-add-cart" ${cartFull ? 'disabled' : ''}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  </div>`;
}

// ─── Cart Page ───
function renderCart() {
  const cart = state.cart;
  const prefix = state.prefix;
  const total = getCartTotal();
  const hexes = cart.map(c => c.hex);

  return `<div class="page">
    <div class="page-header">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <h1 class="heading-xl" style="margin-bottom:4px">Your Cart</h1>
        ${cart.length > 0 ? `<button class="clear-cart-btn" id="clear-cart">Clear Cart</button>` : ''}
      </div>
      <p class="text-secondary" style="margin-bottom:16px">${total} / 40 items · ${40 - total} slots remaining</p>
      <div class="progress-bar">
        <div class="progress-fill ${total > 35 ? 'danger' : ''}" style="width:${(total / 40) * 100}%"></div>
      </div>
    </div>

    ${cart.length === 0 ? `
      <div class="empty-state">
        <p class="empty-emoji">🛒</p>
        <p class="empty-title">Cart is empty</p>
        <p class="empty-text">Browse the catalog to add items</p>
      </div>` : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${cart.map((item, idx) => `
          <div class="cart-item">
            <div class="cart-thumb" style="background:${data.getItemBg(0)}">
              ${item.img ? `<img src="${esc(item.img)}" onerror="this.outerHTML='📦'" alt="">` : '📦'}
            </div>
            <div class="cart-item-info">
              <p class="cart-item-name">${esc(item.name)}</p>
              <p class="cart-item-meta">${esc(item.variant)} · <span style="color:var(--pines)">${esc(item.hex)}</span></p>
            </div>
            <button class="dupe-btn" data-dupe-idx="${idx}" ${getCartTotal() >= 40 ? 'disabled' : ''}>${ICONS.plus}</button>
            <button class="remove-btn" data-remove-idx="${idx}">${ICONS.trash}</button>
          </div>`).join('')}
      </div>

      <div style="padding:28px 24px 0">
        <h4 class="label-upper" style="margin-bottom:12px">Bot Command</h4>
        <div class="code-block">
          <span class="code-keyword">${esc(prefix)}order</span> ${hexes.map((hex, i) =>
            `<span class="code-value">${esc(hex)}</span>${i < hexes.length - 1 ? ' ' : ''}`
          ).join('')}
          <button class="copy-btn" id="copy-cmd">${ICONS.copy} Copy</button>
        </div>
      </div>`}
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

// ─── Search Overlay ───
function renderSearch() {
  if (!state.searchOpen) return '';
  const results = state.searchResults || { items: [], total: 0 };
  const hasFilters = state.searchFilterTags.length > 0;
  const hasQuery = state.searchQuery || hasFilters;
  const tagGroups = data.getAvailableTags();

  return `<div class="search-overlay" id="search-overlay">
    <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
      <div style="position:relative;flex:1">
        <div style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-light)">${ICONS.search}</div>
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
    <div id="search-results">${renderSearchResultsHTML()}</div>
  </div>`;
}

// ─── Search Results HTML ───
function renderSearchResultsHTML() {
  const results = state.searchResults || { items: [], total: 0 };
  const hasFilters = state.searchFilterTags.length > 0;
  const hasQuery = state.searchQuery || hasFilters;
  if (hasQuery) {
    return `<p class="text-secondary" style="margin-bottom:16px">${results.total} result${results.total !== 1 ? 's' : ''}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ''}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? 's' : ''})` : ''}</p>
      <div class="item-grid">
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
  const scrollRoot = sentinel.closest('.search-overlay');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      loadMoreSearchResults();
    }
  }, { root: scrollRoot, rootMargin: '200px' });
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
        overlayScrollY: document.getElementById('search-overlay')?.scrollTop || 0
      };
      state.previousPage = 'search';
      state.searchOpen = false;
      state.searchQuery = '';
      state.searchResults = null;
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
      const img = card && card.querySelector('.item-thumb img');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      addToCartFromIndex(btn.dataset.addCart, vi);
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

  // Update hero image
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg && variant.image) heroImg.src = variant.image;

  // Update variant pill active states
  app.querySelectorAll('[data-variant]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.variant) === vi);
  });

  // Update detail fields
  const detailFields = [
    ['Hex ID', item.hexBase],
    ['Hex ID (Variated)', variant.hexVariated || variant.hex || item.hexBase],
    ['Size', item.size],
    ['Catalog', item.catalog],
    ['HHA Concepts', [item.hhaConcept1, item.hhaConcept2].filter(Boolean).join(', ')],
    ['HHA Series', item.hhaSeries],
    ['HHA Set', item.hhaSet],
    ['Styles', (item.tags || []).filter(t => ['active','cool','cute','elegant','gorgeous','simple'].includes(t)).join(', ')],
    ['Colors', [variant.color1, variant.color2].filter(Boolean).join(', ')],
    ['DIY', item.diy],
  ].filter(([, v]) => v && v !== 'NA');

  const fieldsEl = document.getElementById('detail-fields');
  if (fieldsEl) {
    fieldsEl.innerHTML = `<h4 class="label-upper" style="margin-bottom:16px">Details</h4>
      ${detailFields.map(([label, val]) => `
        <div class="detail-row">
          <span class="detail-label">${esc(label)}</span>
          <span class="detail-value">${esc(String(val))}</span>
        </div>`).join('')}`;
  }

  // Update CTA buttons
  const ctaEl = document.getElementById('detail-cta');
  if (ctaEl) {
    ctaEl.innerHTML = `
      <button class="cta-btn-secondary" id="detail-add-to-list" data-list-item="${esc(item.id)}" data-list-vi="${vi}">
        📋 Add to List
      </button>
      <div class="detail-qty-row">
        <div class="qty-control">
          <button class="qty-btn" data-detail-qty-minus="cart">−</button>
          <span class="qty-value" id="detail-qty-cart">0</span>
          <button class="qty-btn" data-detail-qty-plus="cart">+</button>
        </div>
        <button class="cta-btn" id="detail-add-cart" ${cartFull ? 'disabled' : ''}>
          🛒 Add to Cart
        </button>
      </div>`;
    // Re-attach CTA events
    attachDetailQtyEvents();
    const detailAddCart = document.getElementById('detail-add-cart');
    if (detailAddCart) detailAddCart.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('detail-qty-cart')?.textContent) || 0;
      const count = qty < 1 ? 1 : qty;
      const heroImg = document.getElementById('detail-hero-img');
      if (heroImg) _flyAnimRect = heroImg.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          variant: variant.name,
          variantIdx: vi,
          hex: variant.hexVariated || variant.hex || item.hexBase,
          img: variant.image || item.image,
        });
      }
      const span = document.getElementById('detail-qty-cart');
      if (span) span.textContent = '0';
    });
    const detailListBtn = document.getElementById('detail-add-to-list');
    if (detailListBtn) detailListBtn.addEventListener('click', () => {
      state.listPickerItem = { id: item.id, variantIdx: vi, excludeLoved: true };
      render();
    });
  }

  // Update heart button in hero
  const heartBtn = app.querySelector('.detail-hero [data-heart]');
  if (heartBtn) {
    heartBtn.dataset.heartVi = vi;
    heartBtn.innerHTML = ICONS.heartLg(inWishlist);
  }
}

// ─── Detail Qty Events Helper ───
function attachDetailQtyEvents() {
  document.querySelectorAll('[data-detail-qty-plus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.dataset.detailQtyPlus;
      const span = document.getElementById('detail-qty-' + type);
      if (span) {
        const cur = parseInt(span.textContent) || 0;
        const max = type === 'cart' ? 40 - getCartTotal() : 40;
        if (cur < max) span.textContent = cur + 1;
      }
    });
  });
  document.querySelectorAll('[data-detail-qty-minus]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.dataset.detailQtyMinus;
      const span = document.getElementById('detail-qty-' + type);
      if (span) {
        const cur = parseInt(span.textContent) || 0;
        if (cur > 0) span.textContent = cur - 1;
      }
    });
  });
}

// ─── Wishlist Toast ───
function renderWishlistToast() {
  if (!state.wishlistToast) return '';
  const t = state.wishlistToast;
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
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
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

// ─── Render ───
async function render() {
  let content = '';
  switch (state.page) {
    case 'catalog': content = await renderCatalog(); break;
    case 'detail': content = await renderDetail(); break;
    case 'cart': content = renderCart(); break;
    case 'wishlist': content = await renderWishlist(); break;
    case 'settings': content = renderSettings(); break;
    case 'info': content = renderInfo(); break;
  }
  app.innerHTML = `<div id="ptr-indicator" class="ptr-indicator"></div>` + content + renderNav() + renderModal() + renderSearch() + renderWishlistToast() + renderListPicker() + ads.renderActivePopup(state.activePopup) + ads.renderAdToast(state.adToastVisible) + ads.renderFloatingNotif(state.floatingNotif);
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
        // Preserve existing home page state — don't reset items/category
        state.page = 'catalog';
        state.searchOpen = false;
        state._pageEnter = true;
        render();
        window.scrollTo(0, state.scrollY || 0);
      } else {
        // Save scroll position when leaving catalog
        if (state.page === 'catalog') state.scrollY = window.scrollY;
        state.page = target;
        state.searchOpen = false;
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
    if (card.closest('.search-overlay')) return; // handled by attachSearchResultEvents
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-heart]') || e.target.closest('[data-add-cart]') ||
          e.target.closest('.remove-btn') || e.target.closest('.wishlist-add-btn') ||
          e.target.closest('[data-remove-list-idx]')) return;
      state.scrollY = window.scrollY;
      state.selectedItemId = card.dataset.item;
      state.selectedVariantIdx = parseInt(card.dataset.vi) || 0;
      state.previousPage = 'catalog';
      state.searchOpen = false;
      state.searchQuery = '';
      state.searchResults = null;
      state.page = 'detail';
      state._pageEnter = true;
      loadItemDetail(card.dataset.item);
    });
  });

  // Heart buttons (skip search overlay — handled by attachSearchResultEvents)
  app.querySelectorAll('[data-heart]').forEach(btn => {
    if (btn.closest('.search-overlay')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vi = parseInt(btn.dataset.heartVi) || 0;
      toggleWishlist(btn.dataset.heart, vi);
    });
  });

  // Add to cart buttons (skip search overlay)
  app.querySelectorAll('[data-add-cart]').forEach(btn => {
    if (btn.closest('.search-overlay')) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-item]');
      const vi = card ? parseInt(card.dataset.vi) || 0 : 0;
      const img = card && card.querySelector('.item-thumb img');
      if (img) _flyAnimRect = img.getBoundingClientRect();
      addToCartFromIndex(btn.dataset.addCart, vi);
    });
  });

  // Load more (batch mode)
  const loadMore = document.getElementById('load-more');
  if (loadMore) loadMore.addEventListener('click', () => {
    state.isRandom ? loadMoreRandom() : loadExpandedCatalog();
  });

  // Infinite scroll (scroll mode + always for random)
  const scrollSentinel = document.getElementById('scroll-sentinel');
  if (scrollSentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !state.expandedLoading) {
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
    // Re-render search overlay without full page render to keep keyboard open
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
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
    if (state.previousPage === 'search' && state.savedSearch) {
      // Restore search state
      state.page = 'catalog';
      state.itemDetail = null;
      state.searchOpen = true;
      state.searchQuery = state.savedSearch.query;
      state.searchResults = state.savedSearch.results;
      state.searchFilterTags = state.savedSearch.filterTags;
      state.searchFilterOpen = state.savedSearch.filterOpen;
      const savedOverlayScroll = state.savedSearch.overlayScrollY;
      state.savedSearch = null;
      state.previousPage = null;
      state._pageEnter = true;
      await render();
      attachSearchResultEvents();
      attachSearchScrollObserver();
      const overlay = document.getElementById('search-overlay');
      if (overlay) overlay.scrollTop = savedOverlayScroll;
    } else {
      state.page = 'catalog';
      state.itemDetail = null;
      state.previousPage = null;
      state._pageEnter = true;
      await render();
      window.scrollTo(0, state.scrollY);
    }
  });

  // Variant pills — surgical update instead of full render
  app.querySelectorAll('[data-variant]').forEach(btn => {
    btn.addEventListener('click', () => {
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

  // Detail add to cart (with qty)
  const detailAddCart = document.getElementById('detail-add-cart');
  if (detailAddCart) detailAddCart.addEventListener('click', () => {
    if (state.itemDetail) {
      const vi = state.selectedVariantIdx;
      const variant = state.itemDetail.variants[vi] || state.itemDetail.variants[0];
      const qty = parseInt(document.getElementById('detail-qty-cart')?.textContent) || 0;
      const count = qty < 1 ? 1 : qty;
      const heroImg = document.getElementById('detail-hero-img');
      if (heroImg) _flyAnimRect = heroImg.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        addToCart({
          id: state.itemDetail.id,
          name: state.itemDetail.name,
          variant: variant.name,
          variantIdx: vi,
          hex: variant.hexVariated || variant.hex || state.itemDetail.hexBase,
          img: variant.image || state.itemDetail.image,
        });
      }
      const span = document.getElementById('detail-qty-cart');
      if (span) span.textContent = '0';
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

  // Cart duplicate by index
  app.querySelectorAll('[data-dupe-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (getCartTotal() >= 40) return;
      const idx = parseInt(btn.dataset.dupeIdx);
      const item = state.cart[idx];
      if (item) addToCart({ ...item });
    });
  });

  // Cart remove by index
  app.querySelectorAll('[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.removeIdx);
      state.cart.splice(idx, 1);
      storage.setCart(state.cart);
      render();
    });
  });

  // Clear entire cart
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', () => {
    if (confirm('Clear all items from your cart?')) {
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
      const img = card && card.querySelector('.item-thumb img');
      if (img) _flyAnimRect = img.getBoundingClientRect();
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
    const name = prompt('List name:');
    if (name && name.trim()) {
      state.wishlists.lists.push({
        id: Date.now().toString(36),
        name: name.trim(),
        cap: 40,
        items: [],
      });
      storage.setWishlists(state.wishlists);
      render();
    }
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
        render();
      }
    });
  });

  // Copy list order
  const copyListBtn = document.getElementById('copy-list-order');
  if (copyListBtn) copyListBtn.addEventListener('click', () => {
    const command = `${state.prefix}order ${lastRenderedListHexes.join(' ')}`;
    navigator.clipboard.writeText(command).then(() => {
      copyListBtn.innerHTML = `${ICONS.check} Copied!`;
      setTimeout(() => { copyListBtn.innerHTML = `${ICONS.copy} Copy Order`; }, 2000);
    });
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
    const name = prompt('List name:');
    if (name && name.trim()) {
      const newList = {
        id: Date.now().toString(36),
        name: name.trim(),
        cap: 40,
        items: [],
      };
      state.wishlists.lists.push(newList);
      storage.setWishlists(state.wishlists);
      render();
    }
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

  // Copy command
  const copyBtn = document.getElementById('copy-cmd');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const command = `${state.prefix}order ${state.cart.map(c => c.hex).join(' ')}`;
    navigator.clipboard.writeText(command).then(() => {
      copyBtn.innerHTML = `${ICONS.check} Copied!`;
      setTimeout(() => { copyBtn.innerHTML = `${ICONS.copy} Copy`; }, 2000);
    });
  });

  // Settings prefix
  const prefixInput = document.getElementById('prefix-input');
  if (prefixInput) prefixInput.addEventListener('input', (e) => {
    state.prefix = e.target.value;
    storage.setPrefix(state.prefix);
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

  // Clear data
  const clearBtn = document.getElementById('clear-data');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('This will clear your cart, wishlist, and prefix. Are you sure?')) {
      storage.clearAll();
      state.cart = [];
      state.wishlists = { lists: [{ id: '__loved__', name: 'Loved Items', cap: null, items: [] }] };
      state.viewingListId = null;
      state.prefix = '!';
      state.seenIntro = false;
      render();
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
        ads.dismissPopup(state.activePopup);
        state.activePopup = null;
        await render();
        if (state.searchOpen && state.searchResults) {
          attachSearchResultEvents();
          attachSearchScrollObserver();
        }
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
}

// ─── Ad Toast Helper ───
let adToastTimer = null;
function showAdToast() {
  clearTimeout(adToastTimer);
  state.adToastVisible = true;
  render();
  adToastTimer = setTimeout(() => {
    state.adToastVisible = false;
    const el = document.getElementById('promo-toast');
    if (el) el.remove();
  }, 3200);
}

// ─── Floating Notification Helpers ───
function dismissFloatingNotif() {
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
  if (isInWishlist(itemId, variantIdx)) {
    // Remove from ALL lists
    state.wishlists.lists.forEach(list => {
      list.items = list.items.filter(w => !(w.id === itemId && w.variantIdx === variantIdx));
    });
    storage.setWishlists(state.wishlists);
    state._heartPulse = { id: itemId, vi: variantIdx };
    await render();
  } else {
    // Add to Loved Items by default (single instance only)
    const loved = state.wishlists.lists.find(l => l.id === '__loved__');
    if (!loved.items.some(w => w.id === itemId && w.variantIdx === variantIdx)) {
      loved.items.push({ id: itemId, variantIdx });
    }
    storage.setWishlists(state.wishlists);
    showWishlistToast(itemId, variantIdx, 'Loved Items');
    state._heartPulse = { id: itemId, vi: variantIdx };
    await render();
  }
}

function getCartTotal() {
  return state.cart.length;
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
  if (state.cart.length >= 40) return;

  // Fire flying animation using snapshot captured by click handler
  if (_flyAnimRect && entry.img) {
    const cartTab = app.querySelector('[data-nav="cart"]');
    if (cartTab) {
      const endRect = cartTab.getBoundingClientRect();
      const sr = _flyAnimRect;
      const clone = document.createElement('img');
      clone.src = entry.img;
      clone.className = 'flying-item';
      clone.style.left = sr.left + sr.width / 2 - 22 + 'px';
      clone.style.top = sr.top + sr.height / 2 - 22 + 'px';
      clone.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in';
      clone.style.transform = 'scale(1) translate(0, 0)';
      clone.style.opacity = '1';
      document.body.appendChild(clone);
      const dx = endRect.left + endRect.width / 2 - (sr.left + sr.width / 2);
      const dy = endRect.top + endRect.height / 2 - (sr.top + sr.height / 2);
      requestAnimationFrame(() => {
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.25)`;
        clone.style.opacity = '0';
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
