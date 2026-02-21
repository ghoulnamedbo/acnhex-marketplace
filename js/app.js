import * as storage from "./storage.js";
import * as data from "./data.js";
import * as reviews from "./reviews.js";

// ─── SVG Icons ───
const ICONS = {
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  heart: (filled) =>
    `<svg width="15" height="15" viewBox="0 0 24 24" fill="${filled ? "var(--blossoms)" : "none"}" stroke="${filled ? "var(--blossoms)" : "currentColor"}" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartLg: (filled) =>
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="${filled ? "var(--blossoms)" : "none"}" stroke="${filled ? "var(--blossoms)" : "currentColor"}" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
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
  page: "catalog",
  cart: storage.getCart(),
  wishlist: storage.getWishlist(),
  prefix: storage.getPrefix(),
  seenIntro: storage.getSeenIntro(),
  loadMode: storage.getLoadMode(),
  activeCategory: "All",
  selectedItemId: null,
  selectedVariantIdx: 0,
  itemDetail: null,
  searchOpen: false,
  searchQuery: "",
  searchResults: null,
  searchFilterTags: [],
  searchFilterOpen: false,
  loadedCount: 0,
  isRandom: false,
  randomItems: [],
  expandedItems: null,
  expandedTotal: 0,
  expandedLoading: false,
};

const app = document.getElementById("app");

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ─── Navigation ───
function renderNav() {
  const tabs = [
    { id: "catalog", label: "Browse", icon: ICONS.home },
    { id: "wishlist", label: "Wishlist", icon: ICONS.wishlistNav },
    { id: "cart", label: "Cart", icon: ICONS.cart, badge: state.cart.length },
    { id: "settings", label: "Settings", icon: ICONS.settings },
    { id: "info", label: "Info", icon: ICONS.info },
  ];
  const activePage = state.page === "detail" ? "catalog" : state.page;
  return `<nav class="bottom-nav">${tabs
    .map(
      (t) => `
    <button class="nav-tab ${activePage === t.id ? "active" : ""}" data-nav="${t.id}">
      <div style="position:relative">${t.icon}${t.badge ? `<span class="nav-badge">${t.badge}</span>` : ""}</div>
      <span>${t.label}</span>
    </button>`,
    )
    .join("")}</nav>`;
}

// ─── Image Helper ───
function itemImg(src, bg, size = "full") {
  const bgColor = bg || data.getItemBg(0);
  if (!src)
    return `<div class="emoji-fallback" style="background:${bgColor}">📦</div>`;
  return `<img src="${esc(src)}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=emoji-fallback>📦</span>'" alt="" style="background:${bgColor}">`;
}

// ─── Catalog Page ───
async function renderCatalog() {
  const categories = data.getCategories();
  const isRandom = state.isRandom;
  let items, total;

  if (isRandom) {
    items = state.randomItems;
    total = items.length;
  } else if (state.expandedItems) {
    items = state.expandedItems;
    total = state.expandedTotal;
  } else {
    // Fallback while loading
    const result = data.getItemsByCategory(
      state.activeCategory === "All" ? null : state.activeCategory,
      0,
      state.loadedCount + 50,
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
      <button class="header-btn" id="search-open">${ICONS.search}</button>
    </div>

    <div class="hero-banner" id="random-btn">
      <span class="leaf-bg">🍃</span>
      <p style="font-size:11px;color:rgba(255,255,255,0.75);margin-bottom:6px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase">Browse & Order</p>
      <h2 style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;line-height:1.35">Explore Random Items 🎲</h2>
      <button class="hero-btn">Surprise Me! ${ICONS.arrowRight}</button>
    </div>

    <div style="padding:0 24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 class="heading-section">Categories</h3>
      </div>
      <div class="categories-wrapper at-start" id="cat-wrapper">
        <button class="cat-arrow left hidden" id="cat-arrow-left">${ICONS.chevronLeft}</button>
        <button class="cat-arrow right" id="cat-arrow-right"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        <div class="categories-scroll hide-scrollbar" id="cat-scroll">
          <button class="cat-btn ${state.activeCategory === "All" ? "active" : ""}" data-cat="All">
            <div class="cat-icon"><span>🍃</span></div>
            <span class="cat-label">All</span>
          </button>
          ${categories
            .map(
              (c) => `
            <button class="cat-btn ${state.activeCategory === c.name ? "active" : ""}" data-cat="${esc(c.name)}">
              <div class="cat-icon"><span>${c.emoji}</span></div>
              <span class="cat-label">${esc(c.name)}</span>
            </button>`,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div style="padding:20px 24px 14px;display:flex;justify-content:space-between;align-items:center">
      <h3 class="heading-section">${isRandom ? "Random Picks" : state.activeCategory === "All" ? "All Items" : esc(state.activeCategory)}</h3>
      <span class="text-secondary">${total} found</span>
    </div>

    <div class="item-grid">
      ${items.map((item, idx) => renderItemCard(item, idx)).join("")}
    </div>

    ${!isRandom && items.length < total && state.loadMode === 'scroll' ? `<div id="scroll-sentinel" style="height:1px"></div>` : ""}
    ${!isRandom && items.length < total && state.loadMode !== 'scroll' ? `<button class="load-more-btn" id="load-more">Load More</button>` : ""}
  </div>`;
}

function renderItemCard(item, idx) {
  const bg = data.getItemBg(idx);
  const vi = item.variantIdx ?? 0;
  const inCart = state.cart.some(
    (c) => c.id === item.id && c.variantIdx === vi,
  );
  const inWishlist = state.wishlist.includes(item.id);
  const cartFull = state.cart.length >= 40;
  return `<div class="item-card" data-item="${esc(item.id)}" data-vi="${vi}">
    <div class="item-thumb" style="background:${bg}">
      ${item.img ? `<img src="${esc(item.img)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="heart-btn" data-heart="${esc(item.id)}">${ICONS.heart(inWishlist)}</button>
    </div>
    <div class="item-info">
      <p class="item-name">${esc(item.n)}</p>
      <div class="item-meta">
        <span class="item-variant">${esc(item.v1)}</span>
        <span class="hex-badge">${esc(item.hex)}</span>
      </div>
      <button class="add-cart-btn ${inCart ? "added" : ""}" data-add-cart="${esc(item.id)}" ${inCart || cartFull ? "disabled" : ""}>
        ${inCart ? `${ICONS.check} Added` : `${ICONS.plus} Add to Cart`}
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
  const inCart = state.cart.some(
    (c) => c.id === item.id && c.variantIdx === vi,
  );
  const inWishlist = state.wishlist.includes(item.id);
  const cartFull = state.cart.length >= 40;
  const reviewData = await reviews.generateReviewSection(item);

  const detailFields = [
    ["Hex ID", item.hexBase],
    ["Hex ID (Variated)", variant.hexVariated || variant.hex || item.hexBase],
    ["Size", item.size],
    ["Catalog", item.catalog],
    [
      "HHA Concepts",
      [item.hhaConcept1, item.hhaConcept2].filter(Boolean).join(", "),
    ],
    ["HHA Series", item.hhaSeries],
    ["HHA Set", item.hhaSet],
    [
      "Styles",
      (item.tags || [])
        .filter((t) =>
          ["active", "cool", "cute", "elegant", "gorgeous", "simple"].includes(
            t,
          ),
        )
        .join(", "),
    ],
    ["Colors", [variant.color1, variant.color2].filter(Boolean).join(", ")],
    ["DIY", item.diy],
  ].filter(([, v]) => v && v !== "NA");

  return `<div class="page">
    <div class="detail-hero" style="background:${bg}">
      ${variant.image ? `<img src="${esc(variant.image)}" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="glass-btn left" id="detail-back">${ICONS.chevronLeft}</button>
      <button class="glass-btn right" data-heart="${esc(item.id)}">${ICONS.heartLg(inWishlist)}</button>
    </div>

    <div class="detail-title" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">
      <h2 class="heading-lg" style="line-height:1.25">${esc(item.name)}</h2>
      <div class="detail-rating">
        <span style="font-size:14px">⭐</span>
        <span style="font-size:13px;font-weight:700">${reviewData.avgRating}</span>
      </div>
    </div>

    ${
      item.variants.length > 1
        ? `
    <div class="variant-carousel hide-scrollbar">
      ${item.variants
        .map(
          (v, i) => `
        <button class="variant-pill ${i === vi ? "active" : ""}" data-variant="${i}">${esc(v.name)}</button>
      `,
        )
        .join("")}
    </div>`
        : ""
    }

    <div class="tag-pills">
      ${(item.tags || [])
        .slice(0, 8)
        .map((t) => `<span class="tag-pill">${esc(t)}</span>`)
        .join("")}
    </div>

    <div class="details-card">
      <h4 class="label-upper" style="margin-bottom:16px">Details</h4>
      ${detailFields
        .map(
          ([label, val], i) => `
        <div class="detail-row">
          <span class="detail-label">${esc(label)}</span>
          <span class="detail-value">${esc(String(val))}</span>
        </div>`,
        )
        .join("")}
    </div>

    ${reviewData.html}

    <div class="sticky-cta">
      <button class="cta-btn-secondary" data-wishlist-toggle="${esc(item.id)}">
        ${inWishlist ? "💚 Remove from Wishlist" : "💚 Add to Wishlist"}
      </button>
      <button class="cta-btn ${inCart ? "added" : ""}" id="detail-add-cart" ${inCart || cartFull ? "disabled" : ""}>
        ${inCart ? `${ICONS.check} Already in Cart` : `🛒 Add to Cart`}
      </button>
    </div>
  </div>`;
}

// ─── Cart Page ───
function renderCart() {
  const cart = state.cart;
  const prefix = state.prefix;
  const command =
    cart.length > 0
      ? `${prefix}order ${cart.map((c) => c.hex).join(", ")}`
      : "";

  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Your Cart</h1>
      <p class="text-secondary" style="margin-bottom:16px">${cart.length} / 40 items · ${40 - cart.length} slots remaining</p>
      <div class="progress-bar">
        <div class="progress-fill ${cart.length > 35 ? "danger" : ""}" style="width:${(cart.length / 40) * 100}%"></div>
      </div>
    </div>

    ${
      cart.length === 0
        ? `
      <div class="empty-state">
        <p class="empty-emoji">🛒</p>
        <p class="empty-title">Cart is empty</p>
        <p class="empty-text">Browse the catalog to add items</p>
      </div>`
        : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${cart
          .map(
            (item) => `
          <div class="cart-item">
            <div class="cart-thumb" style="background:${data.getItemBg(0)}">
              ${item.img ? `<img src="${esc(item.img)}" onerror="this.outerHTML='📦'" alt="">` : "📦"}
            </div>
            <div class="cart-item-info">
              <p class="cart-item-name">${esc(item.name)}</p>
              <p class="cart-item-meta">${esc(item.variant)} · <span style="color:var(--pines)">${esc(item.hex)}</span></p>
            </div>
            <button class="remove-btn" data-remove="${esc(item.id)}|${item.variantIdx}">${ICONS.trash}</button>
          </div>`,
          )
          .join("")}
      </div>

      <div style="padding:28px 24px 0">
        <h4 class="label-upper" style="margin-bottom:12px">Bot Command</h4>
        <div class="code-block">
          <span class="code-keyword">${esc(prefix)}order</span> ${cart
            .map(
              (item, i) =>
                `<span class="code-value">${esc(item.hex)}</span>${i < cart.length - 1 ? '<span class="code-sep">, </span>' : ""}`,
            )
            .join("")}
          <button class="copy-btn" id="copy-cmd">${ICONS.copy} Copy</button>
        </div>
      </div>`
    }
  </div>`;
}

// ─── Wishlist Page ───
function renderWishlist() {
  const wishlistItems = state.wishlist
    .map((id) => data.getIndexItem(id))
    .filter(Boolean);

  return `<div class="page">
    <div class="page-header" style="padding-bottom:20px">
      <h1 class="heading-xl" style="margin-bottom:4px">Wishlist</h1>
      <p class="text-secondary">${wishlistItems.length} saved item${wishlistItems.length !== 1 ? "s" : ""}</p>
    </div>

    ${
      wishlistItems.length === 0
        ? `
      <div class="empty-state">
        <p class="empty-emoji">💚</p>
        <p class="empty-title">No saved items yet</p>
        <p class="empty-text">Tap the heart on items you love</p>
      </div>`
        : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${wishlistItems
          .map((item, idx) => {
            const inCart = state.cart.some((c) => c.id === item.id);
            return `<div class="wishlist-item" data-item="${esc(item.id)}">
            <div class="wishlist-thumb" style="background:${data.getItemBg(idx)}">
              ${item.img ? `<img src="${esc(item.img)}" onerror="this.outerHTML='📦'" alt="">` : "📦"}
            </div>
            <div style="flex:1;min-width:0">
              <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">${esc(item.n)}</p>
              <p style="font-size:10px;color:var(--text-secondary)">${esc(item.v1)} · ${esc(item.hex)}</p>
            </div>
            <div class="wishlist-actions">
              <button class="wishlist-add-btn ${inCart ? "added" : ""}" data-add-cart="${esc(item.id)}" ${inCart ? "disabled" : ""}>
                ${inCart ? ICONS.check : ICONS.plus}
              </button>
              <button class="remove-btn" data-remove-wishlist="${esc(item.id)}">${ICONS.trash}</button>
            </div>
          </div>`;
          })
          .join("")}
      </div>`
    }
  </div>`;
}

// ─── Settings Page ───
function renderSettings() {
  const presets = ["!", ".", "$", "?", "/"];
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Settings</h1>
      <p class="text-secondary" style="margin-bottom:28px">Configure your preferences</p>
    </div>

    <div style="padding:0 24px">
      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Bot Command Prefix</h4>
        <input type="text" class="prefix-input" id="prefix-input" value="${esc(state.prefix)}" maxlength="5">
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:16px">Quick Presets</h4>
        <div class="presets-grid">
          ${presets
            .map(
              (p) => `
            <button class="preset-btn ${state.prefix === p ? "active" : ""}" data-preset="${esc(p)}">${esc(p)}</button>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Preview</h4>
        <div class="code-block" style="border-radius:14px;padding:14px 16px;font-size:12px">
          <span class="code-keyword">${esc(state.prefix)}order</span>
          <span class="code-value">0x0A3F</span><span class="code-sep">,</span>
          <span class="code-value">0x1B2C</span>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Item Loading</h4>
        <div class="load-mode-options">
          <button class="load-mode-btn ${state.loadMode === "batch" ? "active" : ""}" data-settings-load="batch">
            <span class="load-mode-icon">📦</span>
            <span class="load-mode-label">Item Batches</span>
            <span class="load-mode-desc">Load 50 at a time</span>
          </button>
          <button class="load-mode-btn ${state.loadMode === "scroll" ? "active" : ""}" data-settings-load="scroll">
            <span class="load-mode-icon">🔄</span>
            <span class="load-mode-label">Continuous Scroll</span>
            <span class="load-mode-desc">Items load as you scroll</span>
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
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5">ACNHEX Market contains almost all items through the <strong>3.0 update</strong> of Animal Crossing: New Horizons.</p>
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
  if (state.seenIntro) return "";
  return `<div class="modal-overlay" id="intro-modal">
    <div class="modal-card">
      <p style="font-size:32px;margin-bottom:16px;text-align:center">🍃</p>
      <h2 style="font-size:20px;font-weight:700;color:var(--palm-leaf);text-align:center;margin-bottom:8px">Welcome to ACNHEX Market!</h2>
      <p style="font-size:12px;color:var(--text-secondary);text-align:center;margin-bottom:24px;line-height:1.5">Before you start, set your Discord order bot's command prefix.</p>

      <h4 class="label-upper" style="margin-bottom:10px">Prefix</h4>
      <input type="text" class="prefix-input" id="modal-prefix" value="${esc(state.prefix)}" maxlength="5" style="margin-bottom:16px">

      <div class="presets-grid" style="margin-bottom:20px">
        ${["!", ".", "$", "?", "/"]
          .map(
            (p) => `
          <button class="preset-btn ${state.prefix === p ? "active" : ""}" data-modal-preset="${p}">${p}</button>
        `,
          )
          .join("")}
      </div>

      <h4 class="label-upper" style="margin-bottom:10px">Preview</h4>
      <div class="code-block" id="modal-preview" style="border-radius:14px;padding:14px 16px;font-size:12px;margin-bottom:8px">
        <span class="code-keyword">${esc(state.prefix)}order</span>
        <span class="code-value">0x0A3F</span><span class="code-sep">,</span>
        <span class="code-value">0x1B2C</span>
      </div>

      <h4 class="label-upper" style="margin-bottom:10px;margin-top:20px">How should items load?</h4>
      <div class="load-mode-options">
        <button class="load-mode-btn ${state.loadMode === "batch" ? "active" : ""}" data-modal-load="batch">
          <span class="load-mode-icon">📦</span>
          <span class="load-mode-label">Item Batches</span>
          <span class="load-mode-desc">Load 50 items at a time</span>
        </button>
        <button class="load-mode-btn ${state.loadMode === "scroll" ? "active" : ""}" data-modal-load="scroll">
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
  if (!state.searchOpen) return "";
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
      <button class="filter-toggle-btn ${hasFilters ? "active" : ""}" id="filter-toggle">${ICONS.filter}${hasFilters ? `<span class="filter-badge">${state.searchFilterTags.length}</span>` : ""}</button>
      <button class="search-close-btn" id="search-close">✕</button>
    </div>
    ${
      state.searchFilterOpen
        ? `
    <div class="filter-panel" id="filter-panel">
      ${Object.entries(tagGroups)
        .map(
          ([group, tags]) => `
        <div class="filter-group">
          <h4 class="filter-group-label">${esc(group)}</h4>
          <div class="filter-tags">
            ${tags
              .map(
                (t) => `
              <button class="filter-tag ${state.searchFilterTags.includes(t) ? "active" : ""}" data-filter-tag="${esc(t)}">${esc(t)}</button>
            `,
              )
              .join("")}
          </div>
        </div>`,
        )
        .join("")}
      ${hasFilters ? `<button class="filter-clear-btn" id="filter-clear">Clear all filters</button>` : ""}
    </div>`
        : ""
    }
    ${
      hasFilters
        ? `
      <div class="active-filters hide-scrollbar">
        ${state.searchFilterTags
          .map(
            (t) => `
          <button class="active-filter-pill" data-remove-filter="${esc(t)}">${esc(t)} ✕</button>
        `,
          )
          .join("")}
      </div>`
        : ""
    }
    ${
      hasQuery
        ? `
      <p class="text-secondary" style="margin-bottom:16px">${results.total} result${results.total !== 1 ? "s" : ""}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ""}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? "s" : ""})` : ""}</p>
      <div class="item-grid">
        ${results.items.map((item, idx) => renderItemCard(item, idx)).join("")}
      </div>`
        : `
      <div class="empty-state">
        <p class="empty-emoji">🔍</p>
        <p class="empty-title">Search by name or tags</p>
        <p class="empty-text">Try "chair", "blue", "elegant", or "DIY"</p>
      </div>`
    }
  </div>`;
}

// ─── Search Helper ───
async function runSearch() {
  if (state.searchQuery || state.searchFilterTags.length > 0) {
    state.searchResults = await data.searchExpandedWithTags(
      state.searchQuery,
      state.searchFilterTags,
      0,
      50,
    );
  } else {
    state.searchResults = null;
  }
  render();
}

// ─── Load Expanded Catalog ───
async function loadExpandedCatalog() {
  if (state.expandedLoading) return;
  state.expandedLoading = true;
  let result;
  if (state.activeCategory === "All") {
    result = await data.getExpandedAll(0, state.loadedCount + 50);
  } else {
    result = await data.getExpandedByCategory(
      state.activeCategory,
      0,
      state.loadedCount + 50,
    );
  }
  state.expandedItems = result.items;
  state.expandedTotal = result.total;
  state.loadedCount = result.items.length;
  state.expandedLoading = false;
  render();
}

// ─── Render ───
async function render() {
  let content = "";
  switch (state.page) {
    case "catalog":
      content = await renderCatalog();
      break;
    case "detail":
      content = await renderDetail();
      break;
    case "cart":
      content = renderCart();
      break;
    case "wishlist":
      content = renderWishlist();
      break;
    case "settings":
      content = renderSettings();
      break;
    case "info":
      content = renderInfo();
      break;
  }
  app.innerHTML = content + renderNav() + renderModal() + renderSearch();
  attachEvents();
}

// ─── Event Handling ───
let searchDebounce = null;

function attachEvents() {
  // Nav tabs
  app.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.page = btn.dataset.nav;
      state.searchOpen = false;
      state.loadedCount = 0;
      state.isRandom = false;
      state.expandedItems = null;
      state.expandedTotal = 0;
      render();
      if (btn.dataset.nav === "catalog") loadExpandedCatalog();
    });
  });

  // Category buttons
  app.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.cat;
      state.loadedCount = 0;
      state.isRandom = false;
      state.expandedItems = null;
      state.expandedTotal = 0;
      render();
      loadExpandedCatalog();
    });
  });

  // Category carousel arrows
  const catScroll = document.getElementById("cat-scroll");
  const catWrapper = document.getElementById("cat-wrapper");
  const catArrowL = document.getElementById("cat-arrow-left");
  const catArrowR = document.getElementById("cat-arrow-right");
  if (catScroll && catWrapper) {
    const updateCatArrows = () => {
      const atStart = catScroll.scrollLeft <= 5;
      const atEnd =
        catScroll.scrollLeft >=
        catScroll.scrollWidth - catScroll.clientWidth - 5;
      catArrowL?.classList.toggle("hidden", atStart);
      catArrowR?.classList.toggle("hidden", atEnd);
      catWrapper.classList.toggle("at-start", atStart);
      catWrapper.classList.toggle("at-end", atEnd);
    };
    catScroll.addEventListener("scroll", updateCatArrows);
    updateCatArrows();
    if (catArrowL)
      catArrowL.addEventListener("click", () =>
        catScroll.scrollBy({ left: -200, behavior: "smooth" }),
      );
    if (catArrowR)
      catArrowR.addEventListener("click", () =>
        catScroll.scrollBy({ left: 200, behavior: "smooth" }),
      );
  }

  // Item cards
  app.querySelectorAll("[data-item]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (
        e.target.closest("[data-heart]") ||
        e.target.closest("[data-add-cart]") ||
        e.target.closest(".remove-btn") ||
        e.target.closest(".wishlist-add-btn") ||
        e.target.closest("[data-remove-wishlist]")
      )
        return;
      state.selectedItemId = card.dataset.item;
      state.selectedVariantIdx = parseInt(card.dataset.vi) || 0;
      state.searchOpen = false;
      state.searchQuery = "";
      state.searchResults = null;
      state.page = "detail";
      loadItemDetail(card.dataset.item);
    });
  });

  // Heart buttons
  app.querySelectorAll("[data-heart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.heart);
    });
  });

  // Add to cart buttons
  app.querySelectorAll("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest("[data-item]");
      const vi = card ? parseInt(card.dataset.vi) || 0 : 0;
      addToCartFromIndex(btn.dataset.addCart, vi);
    });
  });

  // Load more
  const loadMore = document.getElementById("load-more");
  if (loadMore)
    loadMore.addEventListener("click", () => {
      loadExpandedCatalog();
    });

  // Random items
  const randomBtn = document.getElementById("random-btn");
  if (randomBtn)
    randomBtn.addEventListener("click", async () => {
      state.isRandom = true;
      state.randomItems = await data.getRandomExpandedItems(20);
      render();
    });

  // Search
  const searchOpen = document.getElementById("search-open");
  if (searchOpen)
    searchOpen.addEventListener("click", () => {
      state.searchOpen = true;
      render();
      setTimeout(() => document.getElementById("search-input")?.focus(), 50);
    });
  const searchClose = document.getElementById("search-close");
  if (searchClose)
    searchClose.addEventListener("click", () => {
      state.searchOpen = false;
      state.searchQuery = "";
      state.searchResults = null;
      state.searchFilterTags = [];
      state.searchFilterOpen = false;
      render();
    });
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(async () => {
        state.searchQuery = e.target.value;
        await runSearch();
        setTimeout(() => {
          const inp = document.getElementById("search-input");
          if (inp) {
            inp.focus();
            inp.selectionStart = inp.selectionEnd = inp.value.length;
          }
        }, 10);
      }, 300);
    });
  }

  // Filter toggle
  const filterToggle = document.getElementById("filter-toggle");
  if (filterToggle)
    filterToggle.addEventListener("click", () => {
      state.searchFilterOpen = !state.searchFilterOpen;
      render();
      setTimeout(() => document.getElementById("search-input")?.focus(), 50);
    });

  // Filter tag buttons
  app.querySelectorAll("[data-filter-tag]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const tag = btn.dataset.filterTag;
      if (state.searchFilterTags.includes(tag)) {
        state.searchFilterTags = state.searchFilterTags.filter(
          (t) => t !== tag,
        );
      } else {
        state.searchFilterTags.push(tag);
      }
      await runSearch();
    });
  });

  // Remove individual filter pill
  app.querySelectorAll("[data-remove-filter]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.searchFilterTags = state.searchFilterTags.filter(
        (t) => t !== btn.dataset.removeFilter,
      );
      await runSearch();
    });
  });

  // Clear all filters
  const filterClear = document.getElementById("filter-clear");
  if (filterClear)
    filterClear.addEventListener("click", async () => {
      state.searchFilterTags = [];
      await runSearch();
    });

  // Detail page
  const detailBack = document.getElementById("detail-back");
  if (detailBack)
    detailBack.addEventListener("click", () => {
      state.page = "catalog";
      state.itemDetail = null;
      render();
    });

  // Variant pills
  app.querySelectorAll("[data-variant]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedVariantIdx = parseInt(btn.dataset.variant);
      render();
    });
  });

  // Detail add to cart
  const detailAddCart = document.getElementById("detail-add-cart");
  if (detailAddCart)
    detailAddCart.addEventListener("click", () => {
      if (state.itemDetail) {
        const vi = state.selectedVariantIdx;
        const variant =
          state.itemDetail.variants[vi] || state.itemDetail.variants[0];
        addToCart({
          id: state.itemDetail.id,
          name: state.itemDetail.name,
          variant: variant.name,
          variantIdx: vi,
          hex: variant.hexVariated || variant.hex || state.itemDetail.hexBase,
          img: variant.image || state.itemDetail.image,
        });
      }
    });

  // Wishlist toggle from detail
  app.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
    btn.addEventListener("click", () =>
      toggleWishlist(btn.dataset.wishlistToggle),
    );
  });

  // Cart remove
  app.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [id, vi] = btn.dataset.remove.split("|");
      state.cart = state.cart.filter(
        (c) => !(c.id === id && String(c.variantIdx) === vi),
      );
      storage.setCart(state.cart);
      render();
    });
  });

  // Wishlist remove
  app.querySelectorAll("[data-remove-wishlist]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.removeWishlist);
    });
  });

  // Copy command
  const copyBtn = document.getElementById("copy-cmd");
  if (copyBtn)
    copyBtn.addEventListener("click", () => {
      const command = `${state.prefix}order ${state.cart.map((c) => c.hex).join(", ")}`;
      navigator.clipboard.writeText(command).then(() => {
        copyBtn.innerHTML = `${ICONS.check} Copied!`;
        setTimeout(() => {
          copyBtn.innerHTML = `${ICONS.copy} Copy`;
        }, 2000);
      });
    });

  // Settings prefix
  const prefixInput = document.getElementById("prefix-input");
  if (prefixInput)
    prefixInput.addEventListener("input", (e) => {
      state.prefix = e.target.value;
      storage.setPrefix(state.prefix);
      render();
      setTimeout(() => {
        const inp = document.getElementById("prefix-input");
        if (inp) {
          inp.focus();
          inp.selectionStart = inp.selectionEnd = inp.value.length;
        }
      }, 10);
    });

  // Preset buttons
  app.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.prefix = btn.dataset.preset;
      storage.setPrefix(state.prefix);
      render();
    });
  });

  // Clear data
  const clearBtn = document.getElementById("clear-data");
  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      if (
        confirm(
          "This will clear your cart, wishlist, and prefix. Are you sure?",
        )
      ) {
        storage.clearAll();
        state.cart = [];
        state.wishlist = [];
        state.prefix = "!";
        state.seenIntro = false;
        render();
      }
    });

  // Modal
  const modalConfirm = document.getElementById("modal-confirm");
  if (modalConfirm)
    modalConfirm.addEventListener("click", () => {
      state.seenIntro = true;
      storage.setSeenIntro(true);
      storage.setPrefix(state.prefix);
      storage.setLoadMode(state.loadMode);
      render();
    });

  const modalPrefix = document.getElementById("modal-prefix");
  if (modalPrefix)
    modalPrefix.addEventListener("input", (e) => {
      state.prefix = e.target.value;
      const preview = document.getElementById("modal-preview");
      if (preview) {
        preview.innerHTML = `<span class="code-keyword">${esc(state.prefix)}order</span> <span class="code-value">0x0A3F</span><span class="code-sep">,</span> <span class="code-value">0x1B2C</span>`;
      }
      // Update preset active states
      app.querySelectorAll("[data-modal-preset]").forEach((b) => {
        b.classList.toggle("active", b.dataset.modalPreset === state.prefix);
      });
    });

  app.querySelectorAll("[data-modal-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.prefix = btn.dataset.modalPreset;
      const inp = document.getElementById("modal-prefix");
      if (inp) inp.value = state.prefix;
      const preview = document.getElementById("modal-preview");
      if (preview) {
        preview.innerHTML = `<span class="code-keyword">${esc(state.prefix)}order</span> <span class="code-value">0x0A3F</span><span class="code-sep">,</span> <span class="code-value">0x1B2C</span>`;
      }
      app.querySelectorAll("[data-modal-preset]").forEach((b) => {
        b.classList.toggle("active", b.dataset.modalPreset === state.prefix);
      });
    });
  });

  // Modal load mode buttons
  app.querySelectorAll("[data-modal-load]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.loadMode = btn.dataset.modalLoad;
      app.querySelectorAll("[data-modal-load]").forEach((b) => {
        b.classList.toggle("active", b.dataset.modalLoad === state.loadMode);
      });
    });
  });

  // Settings load mode buttons
  app.querySelectorAll("[data-settings-load]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.loadMode = btn.dataset.settingsLoad;
      storage.setLoadMode(state.loadMode);
      app.querySelectorAll("[data-settings-load]").forEach((b) => {
        b.classList.toggle("active", b.dataset.settingsLoad === state.loadMode);
      });
    });
  });

  // Infinite scroll observer
  const sentinel = document.getElementById("scroll-sentinel");
  if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadExpandedCatalog();
      }
    }, { rootMargin: "200px" });
    observer.observe(sentinel);
  }
}

// ─── Actions ───
function toggleWishlist(itemId) {
  if (state.wishlist.includes(itemId)) {
    state.wishlist = state.wishlist.filter((id) => id !== itemId);
  } else {
    state.wishlist.push(itemId);
  }
  storage.setWishlist(state.wishlist);
  render();
}

function addToCartFromIndex(itemId, variantIdx = 0) {
  if (state.cart.length >= 40) return;
  // Try to find expanded item info from currently displayed items
  const displayed = [
    ...(state.expandedItems || []),
    ...(state.randomItems || []),
    ...((state.searchResults && state.searchResults.items) || []),
  ];
  const expandedItem = displayed.find(
    (i) => i.id === itemId && (i.variantIdx ?? 0) === variantIdx,
  );
  if (expandedItem) {
    if (state.cart.some((c) => c.id === itemId && c.variantIdx === variantIdx))
      return;
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
  if (state.cart.some((c) => c.id === itemId && c.variantIdx === 0)) return;
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
  if (
    state.cart.some(
      (c) => c.id === entry.id && c.variantIdx === entry.variantIdx,
    )
  )
    return;
  state.cart.push(entry);
  storage.setCart(state.cart);
  render();
}

async function loadItemDetail(itemId) {
  state.itemDetail = null;
  render(); // Show loading
  state.itemDetail = await data.getItemDetail(itemId);
  render();
}

// ─── Init ───
async function init() {
  app.innerHTML = `<div class="loading" style="padding-top:40vh"><div class="spinner"></div><p class="text-secondary">Loading catalog...</p></div>`;
  await data.loadCatalog();
  render();
  loadExpandedCatalog();
}

init();
