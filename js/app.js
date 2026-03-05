import * as storage from './storage.js';
import * as data from './data.js';
import * as reviews from './reviews.js';
import * as ads from './ads.js';
import NookSounds from './sounds.js';
import { esc } from './utils.js';

// ─── Page Modules ───
import { renderInfo } from './pages/info.js';
import { renderSettings } from './pages/settings.js';
import { renderCart } from './pages/cart.js';
import { renderWishlist, getLastRenderedListHexes } from './pages/wishlist.js';
// Note: Catalog uses local render functions due to search integration complexity
import { renderDetail, clearDetailCaches } from './pages/detail.js';

// ─── SVG Icons (restored) ───
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
  movePickerItem: null, // { itemId, variantIdx, sourceListId, itemIndex }
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
  searchFilterReminderVisible: false, // Only true when returning to search with existing filters
  searchWithinCategory: false, // When true, search scoped to activeCategory
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
  compareModalOpen: false,
  compareVariants: [], // array of variant indices being compared
  compareZoomIdx: null, // index of variant being viewed in zoom/card mode
  detailedViewOpen: false, // full-screen card view for current variant
  cardMotionEnabled: storage.getCardMotionEnabled(),
  // Saved detail state for tab switching
  _savedDetailState: null,
  // Import/Export modals
  showExportModal: false,
  showImportModal: false,
  seenExportInfo: storage.getSeenExportInfo(),
  // Emoji picker
  emojiPickerFor: null,
  // Theme
  theme: storage.getTheme(),
  // Recently viewed items
  recentlyViewed: storage.getRecentlyViewed(),
  // Wishlist group selection (not persisted - resets on navigation)
  wishlistSelected: new Set(),
  // For moving selected items between lists
  _movingFromList: null,
  // Duplicate picker modal data { targetListId, targetListName, items, duplicates }
  duplicatePickerData: null,
  // Saved wishlist list ID when navigating away
  _savedWishlistListId: null,
};

const app = document.getElementById('app');

// ─── Theme Management ───
function applyTheme(theme) {
  let effectiveTheme = theme;
  if (theme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', effectiveTheme === 'dark' ? 'dark' : '');
}

function initTheme() {
  applyTheme(state.theme);
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'system') {
      applyTheme('system');
    }
  });
}

// Apply theme immediately (before DOM content loads fully)
initTheme();

// ─── Hash-Based Routing ───
let _hashUpdatePending = false; // Prevent hashchange listener from triggering during programmatic updates

function updateHash() {
  // Build hash from current state
  let hash = '#/';
  if (state.page === 'catalog') {
    hash = '#/catalog';
  } else if (state.page === 'detail' && state.selectedItemId) {
    hash = `#/detail/${state.selectedItemId}`;
    if (state.selectedVariantIdx > 0) {
      hash += `/${state.selectedVariantIdx}`;
    }
  } else if (state.page === 'cart') {
    hash = '#/cart';
  } else if (state.page === 'wishlist') {
    if (state.viewingListId) {
      hash = `#/wishlist/${state.viewingListId}`;
    } else {
      hash = '#/wishlist';
    }
  } else if (state.page === 'settings') {
    hash = '#/settings';
  } else if (state.page === 'info') {
    hash = '#/info';
  }

  // Only update if different to avoid history spam
  if (window.location.hash !== hash) {
    _hashUpdatePending = true;
    window.location.hash = hash;
    // Reset flag after a tick
    setTimeout(() => { _hashUpdatePending = false; }, 0);
  }
}

async function parseHashAndNavigate() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace('#/', '').split('/').filter(Boolean);
  const route = parts[0] || 'catalog';

  // Don't navigate if already on the same page (with same params)
  if (route === 'catalog' && state.page === 'catalog' && !state.viewingListId) return false;
  if (route === 'cart' && state.page === 'cart') return false;
  if (route === 'settings' && state.page === 'settings') return false;
  if (route === 'info' && state.page === 'info') return false;

  switch (route) {
    case 'catalog':
    case '':
      state.page = 'catalog';
      state.viewingListId = null;
      state._pageEnter = true;
      return true;

    case 'detail':
      const itemId = parts[1];
      const variantIdx = parseInt(parts[2]) || 0;
      if (itemId) {
        // Check if we're already viewing this item+variant
        if (state.page === 'detail' && state.selectedItemId === itemId && state.selectedVariantIdx === variantIdx) {
          return false;
        }
        state.page = 'detail';
        state.selectedItemId = itemId;
        state.selectedVariantIdx = variantIdx;
        state.itemDetail = null;
        state.similarScrollLeft = 0;
        state._detailScrollY = undefined;
        state.detailsExpanded = false;
        state.variantDrawerOpen = false;
        state._pageEnter = true;
        // Load the item detail
        state.itemDetail = await data.getItemDetail(itemId);
        // Track recently viewed
        trackRecentlyViewed(itemId, variantIdx);
        return true;
      }
      // Invalid detail route, fall back to catalog
      state.page = 'catalog';
      state._pageEnter = true;
      return true;

    case 'cart':
      state.page = 'cart';
      state._pageEnter = true;
      // Clear search filters when leaving catalog (session-only persistence)
      state.searchFilterTags = [];
      state.searchFilterReminderVisible = false;
      return true;

    case 'wishlist':
      state.page = 'wishlist';
      const listId = parts[1];
      if (listId && state.wishlists) {
        // Verify the list exists
        const listExists = state.wishlists.lists.some(l => l.id === listId);
        state.viewingListId = listExists ? listId : null;
      } else {
        state.viewingListId = null;
      }
      state._pageEnter = true;
      // Clear search filters when leaving catalog (session-only persistence)
      state.searchFilterTags = [];
      state.searchFilterReminderVisible = false;
      return true;

    case 'settings':
      state.page = 'settings';
      state._pageEnter = true;
      // Clear search filters when leaving catalog (session-only persistence)
      state.searchFilterTags = [];
      state.searchFilterReminderVisible = false;
      return true;

    case 'info':
      state.page = 'info';
      state._pageEnter = true;
      // Clear search filters when leaving catalog (session-only persistence)
      state.searchFilterTags = [];
      state.searchFilterReminderVisible = false;
      return true;

    default:
      // Unknown route, go to catalog
      state.page = 'catalog';
      state._pageEnter = true;
      return true;
  }
}

// Listen for browser back/forward
window.addEventListener('hashchange', async () => {
  if (_hashUpdatePending) return; // Ignore programmatic hash updates
  const navigated = await parseHashAndNavigate();
  if (navigated) {
    render();
  }
});

// ─── Wishlists Init & Helpers ───
const EMOJIS = [
  // Objects & Items
  '📋','📁','📦','🎁','🛒','💼','🎒','👜','👛','🧳',
  // Home & Furniture
  '🏠','🏡','🛋️','🪑','🛏️','🚪','🪟','🛁','🚿','🪴',
  // Nature & Plants
  '🌸','🌺','🌻','🌹','🌷','💐','🌿','🍀','🌴','🌳','🌲','🍃','🍂','🌵','🪻',
  // Animals
  '🐱','🐶','🐰','🦊','🐻','🐼','🐨','🦁','🐯','🐸','🐟','🐠','🦋','🐝','🐞','🦆','🦉','🐧','🦩','🦜',
  // Food & Drinks
  '🍎','🍊','🍋','🍇','🍓','🍑','🍒','🥑','🍕','🍔','🍰','🧁','🍩','🍪','☕','🧋','🍵',
  // Activities & Hobbies
  '🎮','🎲','🎯','🎨','🎭','🎪','🎬','📷','🎸','🎹','🎵','🎶','📚','✏️','🖌️','🧵','🧶','🎣','⛳','🏄',
  // Celestial & Weather
  '⭐','🌟','✨','💫','🌙','☀️','🌈','☁️','❄️','🔥','💧',
  // Hearts & Symbols
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💝','💕',
  // Gems & Sparkles
  '💎','💍','👑','🏆','🎖️','🔮','🪩',
  // Misc Objects
  '🔔','🎀','🪄','🗝️','🔑','💡','🕯️','🪔','📱','💻','⌚','📺','🎧',
  // Cute & Toys
  '🧸','🪆','🎠','🎡','🎢','🎈','🎉','🎊',
  // Travel & Places
  '🏝️','🏖️','⛰️','🗻','🌋','🏕️','🗼','🗽','🎡','✈️','🚀','⛵',
  // Faces & Expressions
  '😊','🥰','😎','🤩','😴','🥳','😇','🤗',
  // Hands & Gestures
  '👍','👏','🙌','💪','🤝','✌️','🤞','👋',
  // Zodiac
  '♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓',
  // Seasons
  '🎃','🎄','🎅','🎆','🎇','🧧','🪻','🐣',
];

function initWishlists() {
  let wl = storage.getWishlists();
  if (!wl) {
    // Migrate from old flat wishlist
    let oldList = storage.getWishlist();
    // Handle old plain string format
    if (oldList.length > 0 && typeof oldList[0] === 'string') {
      oldList = oldList.map(id => ({ id, variantIdx: 0 }));
    }
    wl = { lists: [{ id: '__loved__', name: 'Loved Items', cap: null, items: oldList, emoji: '💚' }] };
    storage.setWishlists(wl);
  }
  // Migrate: add emoji to existing lists if missing
  let needsSave = false;
  for (const list of wl.lists) {
    if (!list.emoji) {
      list.emoji = list.id === '__loved__' ? '💚' : '📋';
      needsSave = true;
    }
  }
  if (needsSave) storage.setWishlists(wl);
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

// Check if item is in the Loved list (index 0)
function isInLovedList(id, variantIdx = 0) {
  const lovedList = state.wishlists.lists[0];
  if (!lovedList) return false;
  return lovedList.items.some(w => w.id === id && w.variantIdx === variantIdx);
}

// Check if item is in any custom list (index 1+)
function isInCustomList(id, variantIdx = 0) {
  return state.wishlists.lists.slice(1).some(list =>
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

let simpleToastTimer = null;
function showToast(message) {
  clearTimeout(simpleToastTimer);
  // Remove any existing simple toast
  const existing = document.getElementById('simple-toast');
  if (existing) existing.remove();
  // Create and show new toast
  const toast = document.createElement('div');
  toast.id = 'simple-toast';
  toast.className = 'wishlist-toast';
  toast.innerHTML = `<span>${esc(message)}</span>`;
  document.getElementById('app').appendChild(toast);
  simpleToastTimer = setTimeout(() => {
    toast.remove();
  }, 2500);
}

function getTotalWishlistItems() {
  return state.wishlists.lists.reduce((sum, l) => sum + l.items.length, 0);
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

// ─── Recently Viewed Section ───
async function _localRenderRecentlyViewed() {
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

      const inWL = isInWishlist(entry.id, vi);
      const hex = variant.hexVariated || variant.hex || item.hexBase;
      const idx = cards.length;
      const bg = data.getItemBg(idx);
      const qtyInCart = getCartQtyForItem(entry.id, vi);

      // Use same structure as item cards
      cards.push(`<div class="item-card recent-item-card" data-item="${esc(entry.id)}" data-vi="${vi}">
        <div class="item-thumb" style="background:${bg}">
          ${variant.image ? `<img src="${esc(variant.image)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
          <button class="heart-btn" data-heart="${esc(entry.id)}" data-heart-vi="${vi}">${ICONS.heart(inWL)}</button>
          ${qtyInCart > 0 ? '<span class="in-cart-dot"></span>' : ''}
        </div>
        <div class="item-info">
          <p class="item-name">${esc(item.name)}</p>
          <div class="item-meta">
            <span class="item-variant">${esc(variant.name)}</span>
            <span class="hex-badge">${esc(getShortHex(hex))}</span>
          </div>
        </div>
      </div>`);
    } catch (e) {
      // Skip items that fail to load
    }
  }

  if (cards.length === 0) return '';

  return `<div class="recent-section" style="padding:16px 24px 0">
    <div class="recent-header">
      <h4 class="label-upper" style="margin:0;display:flex;align-items:center;gap:6px"><span style="font-size:14px">🕐</span> RECENTLY VIEWED</h4>
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

// ─── Catalog Page ───
async function _localRenderCatalog() {
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
    return _localRenderCatalogWithSearch();
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

    ${await _localRenderRecentlyViewed()}

    ${await _localRenderDailyPick()}

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
      ${ads.renderItemGridWithAds(items, _localRenderItemCard)}
    </div>

    ${items.length < total && !isRandom && state.loadMode === 'batch' ? `<button class="load-more-btn" id="load-more">Load More</button>` : ''}
    ${items.length < total && !isRandom && state.loadMode === 'scroll' ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
    ${isRandom && items.length < total ? `<div id="scroll-sentinel" style="height:1px"></div>` : ''}
  </div>`;
}

// ─── Search Autocomplete Suggestions ───
function getTagSuggestions(query) {
  if (!query || query.length < 3) return [];
  const q = query.toLowerCase().trim();
  const tagGroups = data.getAvailableTags();
  const suggestions = [];

  // Check colors (can be primary or secondary)
  const colors = tagGroups['Color 1 (Primary)'] || [];
  for (const color of colors) {
    if (color.startsWith(q) && suggestions.length < 4) {
      if (!state.searchFilterTags.includes('c1:' + color)) {
        suggestions.push({ label: color, tag: 'c1:' + color, type: 'primary color' });
      }
      if (!state.searchFilterTags.includes('c2:' + color)) {
        suggestions.push({ label: color, tag: 'c2:' + color, type: 'secondary color' });
      }
    }
  }

  // Check styles
  const styles = tagGroups['Styles'] || [];
  for (const style of styles) {
    if (style.startsWith(q) && !state.searchFilterTags.includes(style) && suggestions.length < 4) {
      suggestions.push({ label: style, tag: style, type: 'style' });
    }
  }

  // Check catalog status
  const catalog = tagGroups['Catalog'] || [];
  for (const cat of catalog) {
    if (cat.startsWith(q) && !state.searchFilterTags.includes(cat) && suggestions.length < 4) {
      suggestions.push({ label: cat, tag: cat, type: 'catalog' });
    }
  }

  // Check other tags (antique, bathtub, etc.)
  const other = tagGroups['Other'] || [];
  for (const tag of other) {
    if (tag.startsWith(q) && !state.searchFilterTags.includes(tag) && suggestions.length < 4) {
      suggestions.push({ label: tag, tag: tag, type: 'other' });
    }
  }

  return suggestions.slice(0, 4);
}

// ─── Catalog with Integrated Search ───
function _localRenderCatalogWithSearch() {
  const results = state.searchResults || { items: [], total: 0 };
  const hasFilters = state.searchFilterTags.length > 0;
  const hasQuery = state.searchQuery || hasFilters;
  const tagGroups = data.getAvailableTags();
  const suggestions = !state.searchFilterOpen ? getTagSuggestions(state.searchQuery) : [];

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
      ${state.searchFilterReminderVisible && !state.searchFilterOpen ? `
      <div class="filter-reminder-banner">
        <span class="filter-reminder-text">${state.searchFilterTags.length} active filter${state.searchFilterTags.length !== 1 ? 's' : ''}: ${state.searchFilterTags.slice(0, 2).map(t => t.startsWith('c1:') ? t.slice(3) : t.startsWith('c2:') ? t.slice(3) : t).join(', ')}${state.searchFilterTags.length > 2 ? '...' : ''}</span>
        <button class="filter-reminder-clear" id="filter-reminder-clear">Clear</button>
        <button class="filter-reminder-dismiss" id="filter-reminder-dismiss">✕</button>
      </div>` : ''}
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
      ${suggestions.length > 0 ? `
        <div class="search-autocomplete">
          <span class="autocomplete-hint">Add filter:</span>
          ${suggestions.map(s => `<button class="autocomplete-chip" data-autocomplete-tag="${esc(s.tag)}">+ ${esc(s.label)}${s.type.includes('color') ? ` (${s.type === 'primary color' ? '1' : '2'})` : ''}</button>`).join('')}
        </div>` : ''}
      ${state.activeCategory !== 'All' ? (() => {
        const cat = data.getCategories().find(c => c.name === state.activeCategory);
        const emoji = cat ? cat.emoji : '';
        return `<button class="search-scope-toggle ${state.searchWithinCategory ? 'active' : ''}" id="search-scope-toggle">
          ${emoji} Search within ${esc(state.activeCategory)}
        </button>`;
      })() : ''}
    </div>
    <div id="search-results">
      ${hasQuery ? `
        <div style="padding:16px 24px 8px;display:flex;justify-content:space-between;align-items:center">
          <p class="text-secondary">${results.total} result${results.total !== 1 ? 's' : ''}${state.searchQuery ? ` for "${esc(state.searchQuery)}"` : ''}${hasFilters ? ` (${state.searchFilterTags.length} filter${state.searchFilterTags.length !== 1 ? 's' : ''})` : ''}</p>
        </div>
        <div class="item-grid">
          ${results.items.map((item, idx) => _localRenderItemCard(item, idx)).join('')}
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

function _localRenderItemCard(item, idx) {
  const bg = data.getItemBg(idx);
  const vi = item.variantIdx ?? 0;
  const inLoved = isInLovedList(item.id, vi);
  const cartFull = getCartTotal() >= 40;
  const qtyInCart = getCartQtyForItem(item.id, vi);
  const showCounter = qtyInCart > 0;
  return `<div class="item-card" data-item="${esc(item.id)}" data-vi="${vi}">
    <div class="item-thumb" style="background:${bg}">
      ${item.img ? `<img src="${esc(item.img)}" loading="lazy" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
      <button class="heart-btn" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heart(inLoved)}</button>
      ${qtyInCart > 0 ? '<span class="in-cart-dot"></span>' : ''}
    </div>
    <div class="item-info">
      <p class="item-name">${esc(item.n)}</p>
      <div class="item-meta">
        <span class="item-variant">${esc(item.v1)}</span>
        <span class="hex-badge">${esc(getShortHex(item.hex))}</span>
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

async function _localRenderDetail() {
  if (!state.itemDetail) {
    return `<div class="page"><div class="loading"><div class="spinner"></div><p class="text-secondary">Loading...</p></div></div>`;
  }

  const item = state.itemDetail;
  const vi = state.selectedVariantIdx;
  const variant = item.variants[vi] || item.variants[0];
  const bg = data.getItemBg(0);
  const inLoved = isInLovedList(item.id, vi);
  const cartFull = getCartTotal() >= 40;
  const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;
  let reviewData;
  if (_reviewCache.itemId === item.id && _reviewCache.data) {
    reviewData = _reviewCache.data;
  } else {
    reviewData = await reviews.generateReviewSection(item);
    _reviewCache = { itemId: item.id, data: reviewData };
  }
  const similarHtml = await _localRenderSimilarItems(item);

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
      <button class="glass-btn right" data-heart="${esc(item.id)}" data-heart-vi="${vi}">${ICONS.heartLg(inLoved)}</button>

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
            const inLoved = isInLovedList(item.id, idx);
            const inCustom = isInCustomList(item.id, idx);
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${inLoved ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              ${inCustom ? '<div class="variant-orbit-list-dot">📋</div>' : ''}
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

        <div class="detail-hero-actions">
          <button class="detail-hero-action-btn" data-action="open-detailed-view">🃏 Card</button>
          ${item.variants.length >= 8 ? `<button class="detail-hero-action-btn" data-action="open-compare">⚖️ Compare</button>` : ''}
          ${item.variants.length > 1 ? `<button class="detail-hero-action-btn" data-action="open-variant-drawer">☰ All ${item.variants.length}</button>` : ''}
        </div>
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
            const inLoved = isInLovedList(item.id, idx);
            const inCustom = isInCustomList(item.id, idx);
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-orbit-pos="${pos}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${inLoved ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              ${inCustom ? '<div class="variant-orbit-list-dot">📋</div>' : ''}
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

        <div class="detail-hero-actions">
          <button class="detail-hero-action-btn" data-action="open-detailed-view">🃏 Card</button>
          ${item.variants.length >= 8 ? `<button class="detail-hero-action-btn" data-action="open-compare">⚖️ Compare</button>` : ''}
          ${item.variants.length > 1 ? `<button class="detail-hero-action-btn" data-action="open-variant-drawer">☰ All ${item.variants.length}</button>` : ''}
        </div>
      </div>`;
        }
      })() : `
      <div class="detail-single-variant">
        ${variant.image ? `<img src="${esc(variant.image)}" onerror="this.outerHTML='<span class=emoji-fallback>📦</span>'" alt="">` : '<span class="emoji-fallback">📦</span>'}
        <div class="detail-hero-actions detail-hero-actions--single">
          <button class="detail-hero-action-btn" data-action="open-detailed-view">🃏 Card</button>
        </div>
      </div>`}
    </div>

    <div class="detail-content">
      <div class="detail-title-row">
        <div class="detail-title-left">
          <h2 class="heading-lg">${esc(item.name)}${item.variants.length > 1 ? ` <span class="detail-title-dot">•</span> <span class="detail-title-variant">${esc(variant.name)}</span>` : ''}</h2>
          <div class="tag-pills tag-pills--inline">
            ${(item.tags || []).slice(0, 6).map(t => `<span class="tag-pill">${esc(t)}</span>`).join('')}
          </div>
        </div>
        <div class="detail-title-right">
          <div class="detail-rating">
            <span>⭐</span>
            <span class="detail-rating-value">${reviewData.avgRating}</span>
          </div>
        </div>
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
        <span></span><span>NAME</span><span>CLR 1</span><span>CLR 2</span><span>HEX</span><span>CART</span>
      </div>
      <div class="variant-drawer-scroll">
        ${item.variants.map((v, idx) => {
          const isSel = idx === vi;
          const inLoved = isInLovedList(item.id, idx);
          const inCustom = isInCustomList(item.id, idx);
          const variantQty = getCartQtyForItem(item.id, idx);
          const cartFull = getCartTotal() >= 40;
          return `<button class="variant-drawer-row${isSel ? ' variant-drawer-row--selected' : ''}" data-drawer-variant="${idx}">
            <div class="variant-drawer-thumb" style="background:${thumbBgs[idx % thumbBgs.length]}">
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <span style="display:none;font-size:16px;">📦</span>
              ${inLoved ? '<div class="variant-drawer-heart-dot">♥</div>' : ''}
              ${inCustom ? '<div class="variant-drawer-list-dot">📋</div>' : ''}
            </div>
            <span class="variant-drawer-name">${esc(v.name)}</span>
            <span class="variant-drawer-color">${esc(v.color1 || '-')}</span>
            <span class="variant-drawer-color">${esc(v.color2 || '-')}</span>
            <span class="hex-copy-badge" data-hex="${esc(v.hexVariated || v.hex || item.hexBase)}">${esc((v.hexVariated || v.hex || item.hexBase).slice(-4).toUpperCase())}</span>
            <span class="variant-drawer-cart-btn${variantQty > 0 ? ' has-qty' : ''}" data-drawer-cart="${idx}" data-item-id="${esc(item.id)}" ${cartFull && variantQty === 0 ? 'disabled' : ''}>${variantQty > 0 ? variantQty : '+'}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="variant-drawer-footer">
        <button class="variant-drawer-add-all-btn" id="add-all-variants-to-list">
          <span>💚</span> Add all ${item.variants.length} variants to list
        </button>
      </div>
    </div>

    ${item.variants.length >= 8 ? `
    <div class="compare-tray${state.compareModalOpen ? ' compare-tray--open' : ''}">
      <div class="compare-tray-header">
        <span class="compare-tray-title">Compare <span class="compare-tray-count">${state.compareVariants.length}/5</span></span>
        <button class="compare-tray-close" data-action="close-compare">✕</button>
      </div>
      <div class="compare-tray-grid">
        ${item.variants.map((v, idx) => {
          const isSelected = state.compareVariants.includes(idx);
          const isDisabled = !isSelected && state.compareVariants.length >= 5;
          return `<button class="compare-tray-item${isSelected ? ' compare-tray-item--selected' : ''}${isDisabled ? ' compare-tray-item--disabled' : ''}"
            data-compare-toggle="${idx}" ${isDisabled ? 'disabled' : ''}>
            <div class="compare-tray-thumb" style="background:${thumbBgs[idx % thumbBgs.length]}">
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy">
            </div>
            <span class="compare-tray-name">${esc(v.name)}</span>
            ${isSelected ? '<span class="compare-tray-check">✓</span>' : ''}
          </button>`;
        }).join('')}
      </div>
      ${state.compareVariants.length >= 2 ? `
      <div class="compare-carousel-wrap">
        <div class="compare-carousel" id="compare-carousel">
          ${state.compareVariants.map((idx, pos) => {
            const v = item.variants[idx];
            const hex = v.hexVariated || v.hex || item.hexBase;
            return `<div class="compare-card" data-compare-zoom="${idx}" style="--card-bg:${thumbBgs[idx % thumbBgs.length]}">
              <div class="compare-card-img">
                <img src="${esc(v.image)}" alt="${esc(v.name)}">
              </div>
              <div class="compare-card-info">
                <span class="compare-card-name">${esc(v.name)}</span>
                <div class="compare-card-colors">
                  ${v.color1 ? `<span class="compare-card-color">${esc(v.color1)}</span>` : ''}
                  ${v.color2 ? `<span class="compare-card-color">${esc(v.color2)}</span>` : ''}
                </div>
                <button class="hex-copy-badge" data-hex="${esc(hex)}">${esc(hex.slice(-6))}</button>
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="compare-carousel-dots">
          ${state.compareVariants.map((idx, pos) => `<span class="compare-carousel-dot${pos === 0 ? ' active' : ''}" data-compare-dot="${pos}"></span>`).join('')}
        </div>
      </div>
      ` : '<p class="compare-tray-hint">Select at least 2 variants to compare</p>'}
    </div>
    ${state.compareZoomIdx !== null ? (() => {
      const zv = item.variants[state.compareZoomIdx];
      const zhex = zv.hexVariated || zv.hex || item.hexBase;
      const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === state.compareZoomIdx).length;
      const cartFull = getCartTotal() >= 40;
      const isInList = state.wishlists.lists.some(list => list.items.some(wi => wi.id === item.id && wi.variantIdx === state.compareZoomIdx));
      return `<div class="compare-zoom-backdrop" data-action="close-zoom"></div>
      <div class="compare-zoom-card${state.cardMotionEnabled ? ' compare-zoom-card--motion' : ''}"
           id="compare-zoom-card"
           style="--card-bg:${thumbBgs[state.compareZoomIdx % thumbBgs.length]}">
        <div class="compare-zoom-img">
          <img src="${esc(zv.image)}" alt="${esc(zv.name)}">
        </div>
        <div class="compare-zoom-details">
          <h3 class="compare-zoom-name">${esc(zv.name)}</h3>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Color 1</span>
            <span class="compare-zoom-value">${esc(zv.color1 || '-')}</span>
          </div>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Color 2</span>
            <span class="compare-zoom-value">${esc(zv.color2 || '-')}</span>
          </div>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Hex</span>
            <button class="hex-copy-badge" data-hex="${esc(zhex)}">${esc(zhex.slice(-6))}</button>
          </div>
          <div class="compare-zoom-actions">
            ${qtyInCart > 0 ? `
            <div class="compare-zoom-qty">
              <button class="compare-zoom-qty-btn" data-compare-cart-minus="${state.compareZoomIdx}">−</button>
              <span class="compare-zoom-qty-val">${qtyInCart}</span>
              <button class="compare-zoom-qty-btn" data-compare-cart-plus="${state.compareZoomIdx}" ${cartFull ? 'disabled' : ''}>+</button>
            </div>
            ` : `
            <button class="compare-zoom-btn" data-compare-cart="${state.compareZoomIdx}" ${cartFull ? 'disabled' : ''}>+ Cart</button>
            `}
            <button class="compare-zoom-btn" data-compare-list="${state.compareZoomIdx}">${isInList ? '💚 Saved' : '📋 List'}</button>
          </div>
        </div>
      </div>`;
    })() : ''}
    ` : ''}

    ${state.detailedViewOpen ? (() => {
      const dv = item.variants[vi];
      const dvHex = dv.hexVariated || dv.hex || item.hexBase;
      const dvQtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;
      const dvCartFull = getCartTotal() >= 40;
      const dvInList = state.wishlists.lists.some(list => list.items.some(wi => wi.id === item.id && wi.variantIdx === vi));
      return `<div class="compare-zoom-backdrop" data-action="close-detailed-view"></div>
      <div class="compare-zoom-card${state.cardMotionEnabled ? ' compare-zoom-card--motion' : ''}"
           id="detailed-view-card"
           style="--card-bg:${thumbBgs[vi % thumbBgs.length]}">
        <div class="compare-zoom-img">
          <img src="${esc(dv.image)}" alt="${esc(dv.name)}">
        </div>
        <div class="compare-zoom-details">
          <h3 class="compare-zoom-name">${esc(dv.name)}</h3>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Color 1</span>
            <span class="compare-zoom-value">${esc(dv.color1 || '-')}</span>
          </div>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Color 2</span>
            <span class="compare-zoom-value">${esc(dv.color2 || '-')}</span>
          </div>
          <div class="compare-zoom-row">
            <span class="compare-zoom-label">Hex</span>
            <button class="hex-copy-badge" data-hex="${esc(dvHex)}">${esc(dvHex.slice(-6))}</button>
          </div>
          <div class="compare-zoom-actions">
            ${dvQtyInCart > 0 ? `
            <div class="compare-zoom-qty">
              <button class="compare-zoom-qty-btn" data-detail-view-cart-minus>−</button>
              <span class="compare-zoom-qty-val">${dvQtyInCart}</span>
              <button class="compare-zoom-qty-btn" data-detail-view-cart-plus ${dvCartFull ? 'disabled' : ''}>+</button>
            </div>
            ` : `
            <button class="compare-zoom-btn" data-action="detail-view-add-cart" ${dvCartFull ? 'disabled' : ''}>+ Cart</button>
            `}
            <button class="compare-zoom-btn" data-action="detail-view-add-list">${dvInList ? '💚 Saved' : '📋 List'}</button>
          </div>
        </div>
      </div>`;
    })() : ''}
  </div>`;
}

// ─── Similar Items Section ───
const STYLE_TAGS = new Set(['active','cool','cute','elegant','gorgeous','simple']);
let _similarCache = { itemId: null, matches: null, badgeText: null };

async function _localRenderSimilarItems(item) {
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

function _localRenderCart() {
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

    ${_localRenderPastOrders()}
  </div>`;
}

// ─── Past Orders Helper ───
function _localRenderPastOrders() {
  const history = storage.getOrderHistory();
  if (history.length === 0) return '';

  return `
    <div class="past-orders-section">
      <div class="past-orders-header">
        <span class="past-orders-title">📜 Past Orders</span>
        <span class="past-orders-count">${history.length} saved</span>
      </div>
      <div class="past-orders-list">
        ${history.map((order, idx) => {
          const date = new Date(order.timestamp);
          const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          const timeStr = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
          const itemCount = order.items.length;
          const thumbItems = order.items.slice(0, 5);
          const extraCount = order.items.length > 5 ? order.items.length - 5 : 0;
          return `
          <div class="past-order-card" data-order-idx="${idx}">
            <div class="past-order-meta">
              <span class="past-order-date">${dateStr} at ${timeStr}</span>
              <span class="past-order-items">${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="past-order-thumbs">
              ${thumbItems.map((item, i) => `
                <div class="past-order-thumb" style="background:${data.getItemBg(i)}">
                  ${item.img ? `<img src="${esc(item.img)}" alt="" onerror="this.outerHTML='📦'">` : '📦'}
                </div>
              `).join('')}
              ${extraCount > 0 ? `<div class="past-order-thumb-extra">+${extraCount}</div>` : ''}
            </div>
            <div class="past-order-actions">
              <button class="past-order-copy-btn" data-copy-order="${idx}" title="Copy command">📋 Copy</button>
              <button class="past-order-reload-btn" data-reload-order="${idx}" title="Reload to cart">♻ Reload</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ─── Share Wishlist as Image ───
async function generateWishlistImage(list, entries, loadedImages) {
  const itemSize = 80;
  const labelHeight = 28;
  const cellHeight = itemSize + labelHeight;
  const cellWidth = 110;
  const maxItemsPerRow = 5;
  const padding = 24;
  const headerHeight = 70;
  const footerHeight = 40;
  const columnGap = 24;
  const orderLabelHeight = 32;

  // Split entries into orders of 40
  const orders = [];
  for (let i = 0; i < entries.length; i += 40) {
    orders.push(entries.slice(i, i + 40));
  }

  // Calculate actual items per row (fit to content, max 5)
  const actualItemsPerRow = Math.min(entries.length, maxItemsPerRow);

  // Calculate dimensions for each order column
  const getOrderHeight = (order) => {
    const rows = Math.ceil(order.length / maxItemsPerRow);
    return orderLabelHeight + (rows * cellHeight) + 10;
  };

  const maxOrderHeight = Math.max(...orders.map(getOrderHeight));
  const columnWidth = actualItemsPerRow * cellWidth;
  const totalWidth = padding * 2 + (orders.length * columnWidth) + ((orders.length - 1) * columnGap);
  const totalHeight = headerHeight + maxOrderHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth * 2;
  canvas.height = totalHeight * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = '#faf7f2';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Header background
  ctx.fillStyle = '#6a823e';
  ctx.fillRect(0, 0, totalWidth, headerHeight);

  // Header text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ACNHEX Market ✦', totalWidth / 2, 18);

  // List name
  ctx.font = 'bold 16px "Space Mono", monospace';
  const listTitle = `${list.emoji || '📋'} ${list.name}`;
  ctx.fillText(listTitle.length > 30 ? listTitle.slice(0, 30) + '...' : listTitle, totalWidth / 2, 42);

  // Item count
  ctx.font = '10px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  const orderText = orders.length > 1 ? ` · ${orders.length} orders` : '';
  ctx.fillText(`${entries.length} item${entries.length !== 1 ? 's' : ''}${orderText}`, totalWidth / 2, 58);

  // Draw each order column
  orders.forEach((order, orderIdx) => {
    const colX = padding + orderIdx * (columnWidth + columnGap);
    const colY = headerHeight + 8;

    // Order label (if multiple orders)
    if (orders.length > 1) {
      ctx.fillStyle = '#364023';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Order ${orderIdx + 1} of ${orders.length}`, colX, colY + 14);

      // Perforated separator line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#b8b0a4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(colX, colY + 24);
      ctx.lineTo(colX + columnWidth - 16, colY + 24);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw items
    const gridStartY = colY + (orders.length > 1 ? orderLabelHeight : 8);

    order.forEach((item, idx) => {
      const row = Math.floor(idx / maxItemsPerRow);
      const col = idx % maxItemsPerRow;

      // Calculate how many items are in this row for centering
      const rowStart = row * maxItemsPerRow;
      const itemsInThisRow = Math.min(maxItemsPerRow, order.length - rowStart);
      const rowOffset = (actualItemsPerRow - itemsInThisRow) * cellWidth / 2;

      const x = colX + rowOffset + col * cellWidth;
      const y = gridStartY + row * cellHeight;

      // Draw perforated lines between items
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#d1cac0';
      ctx.lineWidth = 1;

      // Right border (except last in row)
      if (col < itemsInThisRow - 1) {
        ctx.beginPath();
        ctx.moveTo(x + cellWidth - 8, y + 4);
        ctx.lineTo(x + cellWidth - 8, y + cellHeight - 4);
        ctx.stroke();
      }

      // Bottom border (except last row of this order)
      const isLastRow = row === Math.ceil(order.length / maxItemsPerRow) - 1;
      if (!isLastRow) {
        ctx.beginPath();
        ctx.moveTo(x + 4, y + cellHeight - 2);
        ctx.lineTo(x + cellWidth - 12, y + cellHeight - 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw image (no background, just the item)
      const img = loadedImages[item.id + '_' + item._vi];
      if (img) {
        const imgX = x + (cellWidth - itemSize) / 2;
        ctx.drawImage(img, imgX, y, itemSize, itemSize);
      }

      // Hex code + variant label beneath (truncate hex to last 4 chars)
      const vi = item._vi;
      const varLabel = vi === 0 ? 'og' : `v${vi}`;
      const shortHex = item.hex.slice(-4);

      ctx.fillStyle = '#6a823e';
      ctx.font = 'bold 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(shortHex, x + cellWidth / 2, y + itemSize + 12);

      ctx.fillStyle = '#9a9484';
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText(varLabel, x + cellWidth / 2, y + itemSize + 24);
    });
  });

  // Footer
  const footerY = totalHeight - footerHeight + 8;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#b8b0a4';
  ctx.beginPath();
  ctx.moveTo(padding, footerY);
  ctx.lineTo(totalWidth - padding, footerY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#9a9484';
  ctx.font = '9px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Generated by ACNHEX Market · ' + new Date().toLocaleDateString(), totalWidth / 2, footerY + 18);

  return canvas.toDataURL('image/png');
}

async function shareWishlistAsImage() {
  const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
  if (!list || list.items.length === 0) {
    showToast('Add items first');
    return;
  }

  showToast('📸 Generating image...');

  // Build entries like renderWishlistDetail does
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
      hex: variant.hex,
      img: variant.image,
      _vi: vi,
    });
  }

  if (entries.length === 0) {
    showToast('No items to share');
    return;
  }

  // Preload images
  const loadedImages = {};
  await Promise.all(entries.map(item => {
    return new Promise((resolve) => {
      if (!item.img) { resolve(); return; }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { loadedImages[item.id + '_' + item._vi] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = item.img;
    });
  }));

  const dataUrl = await generateWishlistImage(list, entries, loadedImages);

  // Try native share if available, otherwise download
  if (navigator.share && navigator.canShare) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${list.name}-wishlist.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `${list.name} - ACNHEX Market` });
        return;
      }
    } catch (e) {
      // Fall through to download
    }
  }

  // Download fallback
  const link = document.createElement('a');
  link.download = `${list.name.replace(/[^a-z0-9]/gi, '-')}-wishlist.png`;
  link.href = dataUrl;
  link.click();
  showToast('📸 Image downloaded!');
}

// ─── Daily Pick Helper ───
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

async function _localRenderDailyPick() {
  const seed = getDailyPickSeed();
  const quipIndex = seed % DAILY_PICK_QUIPS.length;
  const quip = DAILY_PICK_QUIPS[quipIndex];

  // Use getItemDetail with a deterministic item ID from the index
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
    <div class="daily-pick-section" style="padding:0 24px;margin-top:16px">
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

// ─── Collection Progress Helper ───
function getCollectionProgress() {
  const categories = data.getCategories();
  const allWishlistedIds = new Set();

  // Gather all unique item IDs from all wishlists
  for (const list of state.wishlists.lists) {
    for (const item of list.items) {
      allWishlistedIds.add(item.id);
    }
  }

  // Count wishlisted items per category
  const catCounts = {};
  for (const cat of categories) {
    catCounts[cat.name] = { total: cat.count, wishlisted: 0, emoji: cat.emoji };
  }

  // Look up each wishlisted item's category
  for (const id of allWishlistedIds) {
    const item = data.getIndexItem(id);
    if (item && catCounts[item.c]) {
      catCounts[item.c].wishlisted++;
    }
  }

  // Calculate totals
  const totalItems = categories.reduce((sum, c) => sum + c.count, 0);
  const totalWishlisted = allWishlistedIds.size;

  return { totalItems, totalWishlisted, catCounts, categories };
}

// ─── Wishlist Page (local functions - kept for reference) ───

async function _localRenderWishlist() {
  if (state.viewingListId) return _localRenderWishlistDetail();

  const lists = state.wishlists.lists;
  const totalItems = getTotalWishlistItems();

  const progress = getCollectionProgress();
  const overallPct = progress.totalItems > 0 ? ((progress.totalWishlisted / progress.totalItems) * 100).toFixed(1) : 0;

  return `<div class="page">
    <div class="page-header" style="padding-bottom:20px;display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h1 class="heading-xl" style="margin-bottom:4px">Wishlist</h1>
        <p class="text-secondary">${lists.length} list${lists.length !== 1 ? 's' : ''} · ${totalItems} item${totalItems !== 1 ? 's' : ''}</p>
      </div>
      <button class="import-btn" id="import-list-btn"><span class="emoji">📥</span> Import</button>
    </div>

    <!-- Collection Progress Card -->
    <div class="collection-progress-card" style="margin:0 24px 16px">
      <button class="collection-progress-toggle" id="collection-toggle">
        <span class="collection-progress-title">📊 Collection Progress</span>
        <span class="collection-progress-summary">${progress.totalWishlisted} / ${progress.totalItems} (${overallPct}%)</span>
        <span class="collection-progress-chevron" id="collection-chevron">▼</span>
      </button>
      <div class="collection-progress-content" id="collection-content" style="display:none">
        <div class="collection-overall">
          <div class="collection-overall-label">Overall Progress</div>
          <div class="collection-progress-bar">
            <div class="collection-progress-fill" style="width:${overallPct}%"></div>
          </div>
          <div class="collection-overall-stats">${progress.totalWishlisted} of ${progress.totalItems} items</div>
        </div>
        <div class="collection-categories">
          ${progress.categories.map(cat => {
            const c = progress.catCounts[cat.name];
            const pct = c.total > 0 ? ((c.wishlisted / c.total) * 100).toFixed(0) : 0;
            return `
            <div class="collection-cat-row">
              <span class="collection-cat-name">${c.emoji} ${esc(cat.name)}</span>
              <div class="collection-cat-bar">
                <div class="collection-cat-fill" style="width:${pct}%"></div>
              </div>
              <span class="collection-cat-stats">${c.wishlisted}/${c.total}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    ${lists.length === 0 ? `
      <div class="empty-state">
        <p class="empty-emoji">💚</p>
        <p class="empty-title">No lists yet</p>
        <p class="empty-text">Tap the heart on items you love</p>
      </div>` : `
      <div style="padding:0 24px;display:flex;flex-direction:column;gap:12px">
        ${lists.map(list => {
          // Get first 4 items for thumbnail preview
          const thumbItems = list.items.slice(0, 4);
          const extraCount = list.items.length > 4 ? list.items.length - 4 : 0;
          return `
          <div class="wishlist-item" data-view-list="${esc(list.id)}" style="cursor:pointer;border-left:${list.id === '__loved__' ? '4px solid var(--pines)' : '4px solid transparent'}">
            <div class="wl-emoji-icon${list.id !== '__loved__' ? ' wl-emoji-editable' : ''}" ${list.id !== '__loved__' ? `data-edit-emoji="${esc(list.id)}"` : ''} style="background:${list.id === '__loved__' ? 'var(--tag-bg)' : 'var(--bg)'}">
              <span class="emoji-fallback">${list.emoji || (list.id === '__loved__' ? '💚' : '📋')}</span>
              ${list.id !== '__loved__' ? '<div class="wl-emoji-edit-badge">✎</div>' : ''}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <p style="font-size:13px;font-weight:700;margin-bottom:0;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0">${esc(list.name)}</p>
                ${list.id !== '__loved__' ? `
                <div style="display:flex;gap:4px;flex-shrink:0">
                  <button class="wl-rename-btn" data-rename-list="${esc(list.id)}" title="Rename list">✏</button>
                  <button class="wl-dup-btn" data-dup-list="${esc(list.id)}" title="Duplicate list">⧉</button>
                  <button class="remove-btn" data-delete-list="${esc(list.id)}">${ICONS.trash}</button>
                </div>` : ''}
              </div>
              <p style="font-size:10px;color:var(--text-secondary);margin-top:2px">${list.items.length} items${list.items.length > 40 ? ` · ${Math.ceil(list.items.length / 40)} orders` : ''}</p>
              ${thumbItems.length > 0 ? `
              <div class="wl-thumb-strip">
                ${thumbItems.map((it, i) => `<div class="wl-thumb" style="background:${data.getItemBg(i)}" data-thumb-item="${esc(it.id)}" data-thumb-vi="${it.variantIdx || 0}"></div>`).join('')}
                ${extraCount > 0 ? `<div class="wl-thumb-extra">+${extraCount}</div>` : ''}
              </div>` : ''}
            </div>
            ${list.id === '__loved__' ? '<div style="color:var(--text-light);font-size:14px;flex-shrink:0">›</div>' : ''}
          </div>`;
        }).join('')}
      </div>`}

    <div style="padding:20px 24px">
      <button class="cta-btn-secondary" id="create-new-list" style="width:100%">+ Create New List</button>
    </div>
  </div>`;
}

async function _localRenderWishlistDetail() {
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
  // Note: lastRenderedListHexes now managed by module

  const listEmoji = list.emoji || (list.id === '__loved__' ? '💚' : '📋');
  const orderCount = Math.ceil(entries.length / 40);
  const itemCountText = entries.length === 0 ? '0 items' :
    orderCount > 1 ? `${entries.length} items · ${orderCount} orders` : `${entries.length} items`;

  // Group entries into chunks of 40 for display
  const groups = [];
  for (let i = 0; i < entries.length; i += 40) {
    groups.push(entries.slice(i, i + 40));
  }

  const selectedCount = state.wishlistSelected.size;

  return `<div class="page">
    <div style="padding:16px 20px 14px;display:flex;align-items:flex-start;gap:12px">
      <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
        <button class="glass-btn" id="list-back" style="position:static;flex-shrink:0">${ICONS.chevronLeft}</button>
        <div style="min-width:0">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:18px">${listEmoji}</span>
            <h2 style="font-size:20px;font-weight:700;color:var(--palm-leaf);letter-spacing:-0.02em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(list.name)}</h2>
          </div>
          <p style="font-size:10px;color:var(--text-secondary);margin-top:2px">${itemCountText}</p>
        </div>
      </div>
    </div>

    ${entries.length > 0 && list.id !== '__loved__' ? `
    <div style="padding:0 20px 10px;display:flex;gap:6px;flex-wrap:wrap">
      <button class="export-btn" id="export-list-btn">📤 Export List</button>
      <button class="export-btn share-image-btn" id="share-image-btn">📸 Share as Image</button>
    </div>` : ''}

    ${entries.length === 0 ? `
      <div style="text-align:center;padding:60px 40px">
        <div style="font-size:48px;margin-bottom:12px">🍃</div>
        <div style="font-size:14px;font-weight:700;color:var(--palm-leaf)">Nothing here yet</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:6px;line-height:1.6">Browse the catalog and tap the heart<br>to add items to this list.</div>
        <button class="cta-btn" id="start-browsing-btn" style="margin-top:20px;padding:12px 24px;border-radius:50px">Start Browsing</button>
      </div>` : `
      ${entries.length <= 40 && entries.length > 0 ? `
      <div style="padding:0 20px 10px;display:flex;justify-content:flex-end">
        <button class="select-all-btn" id="wl-select-all" style="font-size:10px;font-weight:700;color:var(--pines);background:var(--tag-bg);border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-family:'Space Mono',monospace">${state.wishlistSelected.size === entries.length ? '☑ Deselect All' : '☐ Select All'}</button>
      </div>` : ''}
      <div style="padding:0 12px 20px" id="wishlist-items-container">
        ${groups.map((group, groupIdx) => {
          const startIdx = groupIdx * 40;
          const endIdx = startIdx + group.length;
          const allInGroupSelected = group.every((_, i) => state.wishlistSelected.has(startIdx + i));

          return `
            ${groupIdx > 0 ? '<div class="wishlist-order-split"></div>' : ''}
            ${groups.length > 1 ? `
            <div class="wishlist-group-header">
              <div class="wishlist-check ${allInGroupSelected ? 'on' : 'off'}" data-group-check="${groupIdx}">${allInGroupSelected ? '✓' : ''}</div>
              <span class="wishlist-group-badge">G${groupIdx + 1}</span>
              <span class="wishlist-group-title">Order ${groupIdx + 1} of ${groups.length}</span>
              <span class="wishlist-group-range">Items ${startIdx + 1}–${endIdx} · ${group.length} items</span>
            </div>` : ''}
            ${group.map((item, localIdx) => {
              const globalIdx = startIdx + localIdx;
              const vi = item._vi || 0;
              const isSelected = state.wishlistSelected.has(globalIdx);
              return `<div class="wishlist-detail-row ${isSelected ? 'selected' : ''}" data-global-idx="${globalIdx}" data-wl-select="${globalIdx}">
                <div class="wl-left-half wl-item-link" data-item="${esc(item.id)}" data-vi="${vi}">
                  <div class="wishlist-detail-thumb" style="background:${data.getItemBg(globalIdx)}">
                    ${item.img ? `<img src="${esc(item.img)}" style="width:38px;height:38px;object-fit:contain" onerror="this.outerHTML='📦'" alt="">` : '📦'}
                  </div>
                  <div class="wl-item-info">
                    <div style="font-size:12px;font-weight:700;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(item.n)}</div>
                    <div style="font-size:10px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;margin-top:2px">
                      ${esc(item.v1)}
                      <span style="font-size:9px;font-weight:700;background:var(--tag-bg);color:var(--pines);padding:1px 6px;border-radius:50px">${esc(item.hex.slice(-4))}</span>
                    </div>
                  </div>
                </div>
                <div class="wl-right-half" data-wl-select="${globalIdx}">
                  <div class="wishlist-check ${isSelected ? 'on' : 'off'}">${isSelected ? '✓' : ''}</div>
                </div>
              </div>`;
            }).join('')}
          `;
        }).join('')}
      </div>

      ${selectedCount > 0 ? `
      <div class="wishlist-select-bar" id="wishlist-select-bar">
        <span class="wishlist-select-count">${selectedCount} selected</span>
        <button class="wishlist-select-move" id="wl-select-move">↗ Move</button>
        <button class="wishlist-select-delete" id="wl-select-delete">🗑 Delete</button>
        <button class="wishlist-select-cart" id="wl-select-cart">🛒 Add to Cart</button>
      </div>` : ''}

      ${list.id !== '__loved__' ? `
      <!-- Receipt / Bot Command Section -->
      <div style="padding:0 20px 16px">
        <div style="border-top:2px dashed var(--border);margin:4px 0 16px;position:relative">
          <span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:var(--bg);padding:0 8px;font-size:9px;color:var(--text-light)">✂ tear here</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;font-weight:700;color:var(--palm-leaf);text-transform:uppercase;letter-spacing:0.1em">Bot Command${entries.length > 40 ? 's' : ''}</span>
          <span style="font-size:10px;color:var(--text-secondary)">${entries.length} items</span>
        </div>
        ${entries.length > 40 ? `
        <div style="background:var(--tag-bg);border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">📦</span>
          <span style="font-size:11px;color:var(--palm-leaf)">Split into ${Math.ceil(entries.length / 40)} orders (40-item bot limit per order)</span>
        </div>` : ''}
        ${(() => {
          const chunks = [];
          for (let i = 0; i < entries.length; i += 40) {
            chunks.push(entries.slice(i, i + 40));
          }
          return chunks.map((chunk, chunkIdx) => `
            <div class="receipt-block copy-list-order-chunk" data-chunk-idx="${chunkIdx}" ${chunks.length === 1 ? 'id="copy-list-order"' : ''} style="${chunkIdx > 0 ? 'margin-top:12px' : ''}">
              <div class="receipt-tape"></div>
              ${chunks.length > 1 ? `<div style="font-size:10px;font-weight:700;color:var(--pines);text-align:center;margin-bottom:6px">Order ${chunkIdx + 1} of ${chunks.length}</div>` : ''}
              <div class="receipt-barcode">${Array.from({length:30}, () => `<span style="width:${Math.random()>.5?3:1.5}px"></span>`).join('')}</div>
              <div style="font-size:9px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px">SHIP TO: Discord</div>
              ${chunk.map(item => `<div class="receipt-item"><span>• ${esc(item.n)}</span><span class="hex">${esc(item.hex.slice(-4))}</span></div>`).join('')}
              <div class="receipt-cmd">${esc(state.prefix)}order ${chunk.map(e => e.hex).join(' ')}</div>
              <div style="text-align:center;margin-top:8px;font-size:9px;color:var(--text-secondary);cursor:pointer">📋 tap to copy</div>
            </div>
          `).join('');
        })()}
        <div style="text-align:center;margin-top:10px;font-size:9px;color:var(--text-light)">✦ NOOK INC. CERTIFIED ✦</div>
      </div>` : ''}`}
  </div>`;
}

// ─── Settings Page ───
function _localRenderSettings() {
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
        <h4 class="label-upper" style="margin-bottom:14px">🌙 Appearance</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Choose your preferred theme for the app.</p>
        <div class="theme-options">
          <button class="theme-btn ${state.theme === 'light' ? 'active' : ''}" data-theme="light">
            <span class="theme-icon">☀️</span>
            <span class="theme-label">Light</span>
          </button>
          <button class="theme-btn ${state.theme === 'dark' ? 'active' : ''}" data-theme="dark">
            <span class="theme-icon">🌙</span>
            <span class="theme-label">Dark</span>
          </button>
          <button class="theme-btn ${state.theme === 'system' ? 'active' : ''}" data-theme="system">
            <span class="theme-icon">💻</span>
            <span class="theme-label">System</span>
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">🃏 Card Effects</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Enable interactive motion effects when viewing cards in compare mode.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">Card Motion</span>
          <label class="toggle-container">
            <input type="checkbox" id="cardMotionToggle" ${state.cardMotionEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <p class="text-secondary" style="font-size:10px;margin-top:8px">Cards move with your mouse on desktop</p>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">⌨️ Keyboard Shortcuts</h4>
        <div class="keyboard-shortcuts-list">
          <div class="shortcut-row">
            <span class="shortcut-keys"><kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd></span>
            <span class="shortcut-desc">Open search</span>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-keys"><kbd>Esc</kbd></span>
            <span class="shortcut-desc">Close search / modals</span>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-keys"><kbd>1</kbd>-<kbd>5</kbd></span>
            <span class="shortcut-desc">Switch tabs</span>
          </div>
          <div class="shortcut-row">
            <span class="shortcut-keys"><kbd>←</kbd> <kbd>→</kbd></span>
            <span class="shortcut-desc">Prev / next variant</span>
          </div>
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
function _localRenderInfo() {
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
      <p style="font-size:10px;color:var(--text-light);margin-bottom:4px">Version 2.0.8</p>
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
        ${results.items.map((item, idx) => _localRenderItemCard(item, idx)).join('')}
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
    const scopeCategory = state.searchWithinCategory ? state.activeCategory : null;
    state.searchResults = await data.searchExpandedWithTags(state.searchQuery, state.searchFilterTags, 0, 50, scopeCategory);
  } else {
    state.searchResults = null;
  }
  const container = document.getElementById('search-results');
  if (container) {
    container.innerHTML = renderSearchResultsHTML();
    attachSearchResultEvents();
    attachSearchScrollObserver();
    // Re-render active filter pills and autocomplete
    updateFilterPills();
    updateAutocomplete();
  } else {
    render();
  }
}

function updateAutocomplete() {
  // Only show autocomplete when filter panel is closed
  if (state.searchFilterOpen) {
    const existing = document.querySelector('.search-autocomplete');
    if (existing) existing.remove();
    return;
  }

  const suggestions = getTagSuggestions(state.searchQuery);
  let autocompleteContainer = document.querySelector('.search-autocomplete');

  if (suggestions.length > 0) {
    const html = `<div class="search-autocomplete">
      <span class="autocomplete-hint">Add filter:</span>
      ${suggestions.map(s => `<button class="autocomplete-chip" data-autocomplete-tag="${esc(s.tag)}">+ ${esc(s.label)}${s.type.includes('color') ? ` (${s.type === 'primary color' ? '1' : '2'})` : ''}</button>`).join('')}
    </div>`;

    if (autocompleteContainer) {
      autocompleteContainer.outerHTML = html;
    } else {
      // Insert after active-filters or at end of search-section
      const activeFilters = document.querySelector('.active-filters');
      const searchSection = document.querySelector('.search-section');
      if (activeFilters) {
        activeFilters.insertAdjacentHTML('afterend', html);
      } else if (searchSection) {
        searchSection.insertAdjacentHTML('beforeend', html);
      }
    }
    // Attach click handlers
    document.querySelectorAll('[data-autocomplete-tag]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tag = btn.dataset.autocompleteTag;
        if (!state.searchFilterTags.includes(tag)) {
          state.searchFilterTags.push(tag);
          const tagLabel = tag.startsWith('c1:') || tag.startsWith('c2:') ? tag.slice(3) : tag;
          if (state.searchQuery.toLowerCase().includes(tagLabel)) {
            state.searchQuery = state.searchQuery.toLowerCase().replace(tagLabel, '').trim();
            const input = document.getElementById('search-input');
            if (input) input.value = state.searchQuery;
          }
          await runSearch();
        }
      });
    });
  } else if (autocompleteContainer) {
    autocompleteContainer.remove();
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
      // Insert inside .search-section at the end (before closing tag)
      const searchSection = document.querySelector('.search-section');
      if (searchSection) {
        searchSection.insertAdjacentHTML('beforeend', pillsHTML);
      }
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
    const isActive = state.searchFilterTags.includes(btn.dataset.filterTag);
    if (isActive) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

async function loadMoreSearchResults() {
  if (searchScrollLoading || !state.searchResults) return;
  if (state.searchResults.items.length >= state.searchResults.total) return;
  searchScrollLoading = true;
  const scopeCategory = state.searchWithinCategory ? state.activeCategory : null;
  const more = await data.searchExpandedWithTags(
    state.searchQuery, state.searchFilterTags,
    state.searchResults.items.length, 50, scopeCategory
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
  const inLoved = isInLovedList(item.id, vi);
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

  // Update heart button in hero (pink only for Loved list)
  const heartBtn = app.querySelector('.detail-hero-orbit [data-heart]');
  if (heartBtn) {
    heartBtn.dataset.heartVi = vi;
    heartBtn.innerHTML = ICONS.heartLg(inLoved);
  }

  // Update URL hash with new variant
  updateHash();
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
    // Skip if already has listener (prevents double-attach)
    if (badge.dataset.hexListenerAttached) return;
    badge.dataset.hexListenerAttached = 'true';

    // Store original text for rapid tap handling
    badge.dataset.originalHex = badge.textContent;

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      // Read data-hex at click time (not closure)
      const hex = e.currentTarget.getAttribute('data-hex');
      if (!hex) return;

      navigator.clipboard.writeText(hex).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = hex; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
      });

      // Clear any existing timeout for rapid tap handling
      if (badge._hexCopyTimeout) {
        clearTimeout(badge._hexCopyTimeout);
      }

      // Reset animation by removing and re-adding class
      badge.classList.remove('hex-copy-badge--copied');
      void badge.offsetWidth; // Force reflow to restart animation
      badge.classList.add('hex-copy-badge--copied');

      badge.textContent = '✓ Copied!';
      hapticTick();
      NookSounds.play('hexCopy');

      badge._hexCopyTimeout = setTimeout(() => {
        badge.classList.remove('hex-copy-badge--copied');
        badge.textContent = badge.dataset.originalHex;
        badge._hexCopyTimeout = null;
      }, 600);
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

// Fly to cart animation
function flyToCart(sourceEl, targetEl) {
  if (!sourceEl || !targetEl) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  // Clone the image
  const flyingEl = document.createElement('img');
  flyingEl.src = sourceEl.src;
  flyingEl.className = 'flying-item';
  flyingEl.style.left = `${sourceRect.left}px`;
  flyingEl.style.top = `${sourceRect.top}px`;
  flyingEl.style.width = `${sourceRect.width}px`;
  flyingEl.style.height = `${sourceRect.height}px`;
  document.body.appendChild(flyingEl);

  // Calculate the distance to fly
  const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  // Animate
  requestAnimationFrame(() => {
    flyingEl.style.transition = 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    flyingEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
    flyingEl.style.opacity = '0.6';
  });

  // Clean up and pulse the cart icon
  setTimeout(() => {
    flyingEl.remove();
    targetEl.classList.add('cart-pulse');
    setTimeout(() => targetEl.classList.remove('cart-pulse'), 250);
  }, 450);
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
  const variantNameEl = document.querySelector('.detail-title-variant');
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

  // Update URL hash with new variant
  updateHash();
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
  }
  // Mobile gyro effect removed - was too jittery
}

// Update orbit heart/list dots after wishlist changes
function refreshOrbitHeartDots() {
  if (!state.itemDetail) return;
  const itemId = state.itemDetail.id;

  document.querySelectorAll('.variant-orbit-item').forEach((el) => {
    const variantIdx = parseInt(el.dataset.variantOrbit, 10);
    const inLoved = isInLovedList(itemId, variantIdx);
    const inCustom = isInCustomList(itemId, variantIdx);

    // Handle loved heart dot
    const heartDot = el.querySelector('.variant-orbit-heart-dot');
    if (inLoved && !heartDot) {
      el.insertAdjacentHTML('afterbegin', '<div class="variant-orbit-heart-dot">♥</div>');
    } else if (!inLoved && heartDot) {
      heartDot.remove();
    }

    // Handle custom list dot
    const listDot = el.querySelector('.variant-orbit-list-dot');
    if (inCustom && !listDot) {
      el.insertAdjacentHTML('afterbegin', '<div class="variant-orbit-list-dot">📋</div>');
    } else if (!inCustom && listDot) {
      listDot.remove();
    }
  });

  // Also update drawer heart/list dots
  document.querySelectorAll('.variant-drawer-row').forEach((row, idx) => {
    const thumb = row.querySelector('.variant-drawer-thumb');
    if (!thumb) return;
    const inLoved = isInLovedList(itemId, idx);
    const inCustom = isInCustomList(itemId, idx);

    // Handle loved heart dot
    const heartDot = thumb.querySelector('.variant-drawer-heart-dot');
    if (inLoved && !heartDot) {
      thumb.insertAdjacentHTML('beforeend', '<div class="variant-drawer-heart-dot">♥</div>');
    } else if (!inLoved && heartDot) {
      heartDot.remove();
    }

    // Handle custom list dot
    const listDot = thumb.querySelector('.variant-drawer-list-dot');
    if (inCustom && !listDot) {
      thumb.insertAdjacentHTML('beforeend', '<div class="variant-drawer-list-dot">📋</div>');
    } else if (!inCustom && listDot) {
      listDot.remove();
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
  if (t.action === 'move') {
    return `<div class="wishlist-toast" id="wl-toast">
      <span>Moved to <strong>${esc(t.listName)}</strong></span>
    </div>`;
  }
  if (t.action === 'full') {
    return `<div class="wishlist-toast" id="wl-toast">
      <span><strong>${esc(t.listName)}</strong> is full</span>
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
          const lovedDisabled = item.excludeLoved && list.id === '__loved__';
          const isLoved = list.id === '__loved__';
          return `<button class="list-pick-btn ${isLoved && inThis ? 'active' : ''} ${lovedDisabled ? 'greyed' : ''}" data-pick-list="${esc(list.id)}" ${lovedDisabled ? 'disabled' : ''}>
            <span>${esc(list.name)}</span>
            <span style="font-size:10px;color:var(--text-light)">${list.items.length} items${!isLoved && inThis ? ' · has item' : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="cta-btn-secondary" id="create-list-from-picker" style="margin-bottom:12px;width:100%">+ New List</button>
      <button class="search-close-btn" id="close-list-picker" style="width:100%">Done</button>
    </div>
  </div>`;
}

// ─── Move Picker Modal (move item to another list) ───
function renderMovePicker() {
  if (!state.movePickerItem) return '';
  const item = state.movePickerItem;
  const sourceListId = item.sourceListId;
  return `<div class="modal-overlay" id="move-picker-overlay">
    <div class="modal-card">
      <h2 style="font-size:16px;font-weight:700;margin-bottom:16px;color:var(--palm-leaf)">Move to List</h2>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;-webkit-overflow-scrolling:touch">
        ${state.wishlists.lists.filter(list => list.id !== sourceListId).map(list => {
          const inThis = list.items.some(w => w.id === item.itemId && w.variantIdx === item.variantIdx);
          return `<button class="list-pick-btn" data-move-to-list="${esc(list.id)}">
            <span>${esc(list.name)}</span>
            <span style="font-size:10px;color:var(--text-light)">${list.items.length} items${inThis ? ' · already in list' : ''}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="search-close-btn" id="close-move-picker" style="width:100%">Cancel</button>
    </div>
  </div>`;
}

// ─── Set Picker Modal (add entire set to a list) ───
function renderSetPicker() {
  if (!state.setPickerItems || state.setPickerItems.length === 0) return '';
  const setName = state.setPickerName || 'Set';
  const isMoving = !!state._movingFromList;
  const title = isMoving ? `Move ${esc(setName)}` : `Save ${esc(setName)} Series`;
  return `<div class="modal-overlay" id="set-picker-overlay">
    <div class="modal-card">
      <h2 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--palm-leaf)">${title}</h2>
      <p style="font-size:12px;color:var(--text-light);margin-bottom:16px">${state.setPickerItems.length} items will be ${isMoving ? 'moved' : 'added'}</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;-webkit-overflow-scrolling:touch">
        ${state.wishlists.lists.map(list => {
          const isLoved = list.id === '__loved__';
          const isSourceList = isMoving && list.id === state._movingFromList;
          const isDisabled = isLoved || isSourceList;
          const disabledReason = isSourceList ? ' · current list' : '';
          return `<button class="list-pick-btn ${isDisabled ? 'greyed' : ''}" data-set-pick-list="${esc(list.id)}" ${isDisabled ? 'disabled' : ''}>
            <span>${esc(list.name)}</span>
            <span style="font-size:10px;color:var(--text-light)">${list.items.length} items${disabledReason}</span>
          </button>`;
        }).join('')}
      </div>
      <button class="cta-btn-secondary" id="create-list-from-set-picker" style="margin-bottom:12px;width:100%">+ New List</button>
      <button class="search-close-btn" id="close-set-picker" style="width:100%">Cancel</button>
    </div>
  </div>`;
}

// ─── Duplicate Picker Modal (handle duplicates when moving items) ───
function renderDuplicatePicker() {
  if (!state.duplicatePickerData) return '';
  const { targetListName, items, uniqueDupeCount, totalInTarget, sourceDupeCount } = state.duplicatePickerData;
  const totalCount = items.length;
  const newCount = totalCount - sourceDupeCount; // non-duplicate items

  // For replace: can only replace as many as exist in target
  const canReplace = Math.min(sourceDupeCount, totalInTarget);
  const extrasStayInSource = sourceDupeCount - canReplace;

  return `<div class="modal-overlay" id="duplicate-picker-overlay">
    <div class="modal-card" style="max-width:340px">
      <h2 style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--palm-leaf)">Duplicates Found</h2>
      <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;line-height:1.5">
        ${uniqueDupeCount === 1 ? 'An item type' : `${uniqueDupeCount} item types`} already exist in <strong>${esc(targetListName)}</strong>.<br>
        <span style="font-size:11px">${totalInTarget} in list · ${sourceDupeCount} being moved</span>
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
        <button class="cta-btn" id="dupe-keep-separate" style="padding:14px 16px;font-size:12px">
          <span style="display:block;font-weight:700">Keep Both</span>
          <span style="display:block;font-size:10px;opacity:0.8;margin-top:2px">Move all ${totalCount} items (allows duplicates)</span>
        </button>
        <button class="cta-btn-secondary" id="dupe-replace" style="padding:14px 16px;font-size:12px">
          <span style="display:block;font-weight:700">Replace Duplicates</span>
          <span style="display:block;font-size:10px;opacity:0.7;margin-top:2px">Update ${canReplace} existing${newCount > 0 ? ` + add ${newCount} new` : ''}${extrasStayInSource > 0 ? ` (${extrasStayInSource} stay)` : ''}</span>
        </button>
        <button class="cta-btn-secondary" id="dupe-skip" style="padding:14px 16px;font-size:12px">
          <span style="display:block;font-weight:700">Skip Duplicates</span>
          <span style="display:block;font-size:10px;opacity:0.7;margin-top:2px">${newCount > 0 ? `Only move ${newCount} new items` : 'No new items to move'}${sourceDupeCount > 0 ? ` (${sourceDupeCount} stay)` : ''}</span>
        </button>
      </div>
      <button class="search-close-btn" id="close-duplicate-picker" style="width:100%">Cancel</button>
    </div>
  </div>`;
}

// ─── Export Modal ───
function renderExportModal() {
  if (!state.showExportModal) return '';
  const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
  if (!list) return '';

  const listHexes = getLastRenderedListHexes();
  const hexString = listHexes.join(' ');

  return `<div class="sheet-overlay" id="export-modal-overlay">
    <div class="sheet-modal">
      <div class="sheet-handle"></div>
      <div style="flex-shrink:0">
        <div class="sheet-title">📤 Export List</div>
        <div class="sheet-subtitle" style="margin-bottom:12px">${listHexes.length} items from "${esc(list.name)}"</div>
      </div>
      <div class="sheet-scroll">
        ${!state.seenExportInfo ? `
        <div class="export-info-blurb">
          <span class="icon">💡</span>
          <span>You can share this code with anyone using ACNHEX Market! They can paste it using the <strong>Import</strong> button on their Wishlist tab to recreate your list. Works across browsers and devices.</span>
        </div>` : ''}
        <textarea class="import-export-textarea" id="export-textarea" readonly style="margin-bottom:8px">${esc(hexString)}</textarea>
      </div>
      <div class="sheet-buttons" style="margin-top:8px">
        <button class="sheet-btn-secondary" id="close-export-modal">Done</button>
        <button class="sheet-btn-primary" id="copy-export-btn">📋 Copy</button>
      </div>
    </div>
  </div>`;
}

// ─── Import Modal ───
function renderImportModal() {
  if (!state.showImportModal) return '';

  return `<div class="sheet-overlay" id="import-modal-overlay">
    <div class="sheet-modal">
      <div class="sheet-handle"></div>
      <div style="flex-shrink:0">
        <div class="sheet-title">📥 Import List</div>
        <div class="sheet-subtitle">Paste space-separated hex IDs from an exported list.</div>
      </div>
      <div class="sheet-scroll">
        <textarea class="import-export-textarea" id="import-textarea" placeholder="000000480000206A 0000000100003019 ..."></textarea>
      </div>
      <div class="sheet-buttons">
        <button class="sheet-btn-secondary" id="close-import-modal">Cancel</button>
        <button class="sheet-btn-primary" id="do-import-btn">Import</button>
      </div>
    </div>
  </div>`;
}

// ─── Emoji Picker ───
function renderEmojiPicker() {
  if (!state.emojiPickerFor) return '';
  const list = state.wishlists.lists.find(l => l.id === state.emojiPickerFor);
  if (!list) return '';

  return `<div class="sheet-overlay" id="emoji-picker-overlay">
    <div class="sheet-modal">
      <div class="sheet-handle"></div>
      <div style="font-size:11px;font-weight:700;color:var(--palm-leaf);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.1em">Choose Icon</div>
      <div class="sheet-scroll">
        <div class="emoji-grid">
          ${EMOJIS.map(em => `<button class="emoji-grid-btn${list.emoji === em ? ' active' : ''}" data-pick-emoji="${em}">${em}</button>`).join('')}
        </div>
      </div>
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
  // Capture cart progress bar width before DOM replacement for smooth transition
  const prevProgressFill = app.querySelector('.ledger-progress-fill');
  state._prevCartProgressWidth = prevProgressFill ? prevProgressFill.style.width : null;

  // Reset order FAB dismissed state on page change
  _orderFabDismissed = false;

  let content = '';
  switch (state.page) {
    case 'catalog': content = await _localRenderCatalog(); break;
    case 'detail': content = await renderDetail(state); break;
    case 'cart': content = renderCart(state); break;
    case 'wishlist': content = await renderWishlist(state); break;
    case 'settings': content = renderSettings(state); break;
    case 'info': content = renderInfo(); break;
  }
  app.innerHTML = `<div id="ptr-indicator" class="ptr-indicator"></div>` + content + renderNav() + renderModal() + renderSearch() + renderWishlistToast() + renderListPicker() + renderMovePicker() + renderSetPicker() + renderDuplicatePicker() + renderExportModal() + renderImportModal() + renderEmojiPicker() + ads.renderActivePopup(state.activePopup) + ads.renderAdToast(state.adToastVisible) + ads.renderFloatingNotif(state.floatingNotif) + renderJumpFab();
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

  // Load thumbnail images for wishlist overview
  loadWishlistThumbs();

  // Update URL hash to reflect current state
  updateHash();
}

// Load item images for wishlist thumbnail strip
async function loadWishlistThumbs() {
  const thumbs = app.querySelectorAll('[data-thumb-item]');
  if (thumbs.length === 0) return;

  for (const thumb of thumbs) {
    const itemId = thumb.dataset.thumbItem;
    const variantIdx = parseInt(thumb.dataset.thumbVi) || 0;

    // Try to get variant-specific image
    let imgSrc = null;
    if (variantIdx > 0) {
      // Need full item detail to get variant image
      const detail = await data.getItemDetail(itemId);
      if (detail && detail.variants && detail.variants[variantIdx]) {
        imgSrc = detail.variants[variantIdx].image || detail.image;
      }
    }

    // Fall back to index item image if no variant image found
    if (!imgSrc) {
      const indexItem = data.getIndexItem(itemId);
      if (indexItem && indexItem.img) {
        imgSrc = indexItem.img;
      }
    }

    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.loading = 'lazy';
      img.style.cssText = 'width:24px;height:24px;object-fit:contain';
      img.onerror = () => img.style.display = 'none';
      thumb.appendChild(img);
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
        } else if (state.page === 'wishlist' && state.viewingListId) {
          // Save which list was being viewed when leaving wishlist
          state._savedWishlistListId = state.viewingListId;
        }
        state.page = target;
        if (target === 'wishlist') {
          // Restore previously viewed list if coming back to wishlist
          if (state._savedWishlistListId) {
            // Verify the list still exists
            const listExists = state.wishlists && state.wishlists.lists.some(l => l.id === state._savedWishlistListId);
            state.viewingListId = listExists ? state._savedWishlistListId : null;
          }
          // Don't clear selection - let user keep their selection when switching tabs
        }
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

  // Jump FAB handlers
  const jumpTopFab = document.getElementById('jump-top-fab');
  if (jumpTopFab) {
    jumpTopFab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const jumpOrderFab = document.getElementById('jump-order-fab');
  if (jumpOrderFab) {
    jumpOrderFab.addEventListener('click', () => {
      const direction = jumpOrderFab.dataset.direction;

      // Dismiss FAB
      _orderFabDismissed = true;
      jumpOrderFab.classList.remove('visible');

      if (direction === 'up') {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Scroll to order section
        const target = document.querySelector('.shipping-label') ||
                       document.querySelector('.receipt-section') ||
                       document.querySelector('.wl-export-row') ||
                       document.querySelector('.copy-list-order-chunk');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  // Update FAB visibility on initial render
  updateJumpFabVisibility();

  // Category buttons
  app.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', async () => {
      NookSounds.play('categoryTap');
      state.activeCategory = btn.dataset.cat;
      state.loadedCount = 0;
      state.expandedItems = null;
      state.expandedTotal = 0;
      ads.resetGridInterstitial();
      const catScrollEl = document.getElementById('cat-scroll');
      if (catScrollEl) state.catScrollLeft = catScrollEl.scrollLeft;
      state._pageEnter = true;

      // "All" category always shows random picks
      if (btn.dataset.cat === 'All') {
        state.isRandom = true;
        state.randomUsedIndices = new Set();
        state.randomItems = await data.getRandomExpandedItems(50, state.randomUsedIndices);
        render();
      } else {
        state.isRandom = false;
        render();
        loadExpandedCatalog();
      }
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
          e.target.closest('[data-remove-list-idx]') || e.target.closest('[data-move-list-idx]') ||
          e.target.closest('.wishlist-check') || e.target.closest('[data-item-check]') || e.target.closest('[data-group-check]')) return;
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

  // Daily Pick card
  const dailyPick = document.querySelector('[data-daily-pick]');
  if (dailyPick) dailyPick.addEventListener('click', () => {
    state.detailHistory = [];
    state.scrollY = window.scrollY;
    state.previousPage = 'catalog';
    state.selectedItemId = dailyPick.dataset.dailyPick;
    state.selectedVariantIdx = parseInt(dailyPick.dataset.dailyVi) || 0;
    state.page = 'detail';
    state._pageEnter = true;
    loadItemDetail(dailyPick.dataset.dailyPick);
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
    // Show reminder only when returning to search with existing filters
    state.searchFilterReminderVisible = state.searchFilterTags.length > 0;
    state.searchOpen = true;
    render();
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  });
  const searchOpenLabel = document.getElementById('search-open-label');
  if (searchOpenLabel) searchOpenLabel.addEventListener('click', () => {
    // Show reminder only when returning to search with existing filters
    state.searchFilterReminderVisible = state.searchFilterTags.length > 0;
    state.searchOpen = true;
    render();
    setTimeout(() => document.getElementById('search-input')?.focus(), 50);
  });
  const searchClose = document.getElementById('search-close');
  if (searchClose) searchClose.addEventListener('click', () => {
    state.searchOpen = false;
    state.searchQuery = '';
    state.searchResults = null;
    // Keep filters - they persist until page navigation or explicit clear
    state.searchFilterOpen = false;
    state.searchWithinCategory = false; // Reset scope toggle on close
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

  // Search within category toggle
  const scopeToggle = document.getElementById('search-scope-toggle');
  if (scopeToggle) scopeToggle.addEventListener('click', async () => {
    state.searchWithinCategory = !state.searchWithinCategory;
    scopeToggle.classList.toggle('active', state.searchWithinCategory);
    await runSearch();
  });

  // Autocomplete chip click - add as filter
  app.querySelectorAll('[data-autocomplete-tag]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const tag = btn.dataset.autocompleteTag;
      if (!state.searchFilterTags.includes(tag)) {
        state.searchFilterTags.push(tag);
        // Clear the query text that matched this tag
        const tagLabel = tag.startsWith('c1:') || tag.startsWith('c2:') ? tag.slice(3) : tag;
        if (state.searchQuery.toLowerCase().includes(tagLabel)) {
          state.searchQuery = state.searchQuery.toLowerCase().replace(tagLabel, '').trim();
          const input = document.getElementById('search-input');
          if (input) input.value = state.searchQuery;
        }
        await runSearch();
      }
    });
  });

  // Clear all filters
  const filterClear = document.getElementById('filter-clear');
  if (filterClear) filterClear.addEventListener('click', async () => {
    state.searchFilterTags = [];
    await runSearch();
  });

  // Filter reminder banner handlers
  const filterReminderBanner = document.querySelector('.filter-reminder-banner');
  const filterReminderClear = document.getElementById('filter-reminder-clear');
  if (filterReminderClear) filterReminderClear.addEventListener('click', async () => {
    // Fade out banner then clear filters
    if (filterReminderBanner) {
      filterReminderBanner.style.transition = 'opacity 0.15s ease-out';
      filterReminderBanner.style.opacity = '0';
      await new Promise(r => setTimeout(r, 150));
    }
    state.searchFilterTags = [];
    state.searchFilterReminderVisible = false;
    render(); // Full re-render to update banner and results
  });
  const filterReminderDismiss = document.getElementById('filter-reminder-dismiss');
  if (filterReminderDismiss) filterReminderDismiss.addEventListener('click', () => {
    // Fade out banner then dismiss
    if (filterReminderBanner) {
      filterReminderBanner.style.transition = 'opacity 0.15s ease-out';
      filterReminderBanner.style.opacity = '0';
      setTimeout(() => {
        state.searchFilterReminderVisible = false;
        render();
      }, 150);
    } else {
      state.searchFilterReminderVisible = false;
      render();
    }
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
      state.compareModalOpen = false;
      state.compareVariants = [];
      state.compareZoomIdx = null;
      state.searchOpen = true;
      state.searchQuery = state.savedSearch.query;
      state.searchResults = state.savedSearch.results;
      state.searchFilterTags = state.savedSearch.filterTags;
      state.searchFilterOpen = state.savedSearch.filterOpen;
      state.searchFilterReminderVisible = false; // Don't show reminder when returning from detail
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
      state.compareModalOpen = false;
      state.compareVariants = [];
      state.compareZoomIdx = null;
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

  // Recently viewed carousel arrows
  const recentScroll = document.getElementById('recent-scroll');
  const recentArrowL = document.getElementById('recent-arrow-left');
  const recentArrowR = document.getElementById('recent-arrow-right');
  if (recentScroll) {
    const updateRecentArrows = () => {
      if (recentArrowL) recentArrowL.classList.toggle('hidden', recentScroll.scrollLeft <= 4);
      if (recentArrowR) recentArrowR.classList.toggle('hidden', recentScroll.scrollLeft >= recentScroll.scrollWidth - recentScroll.clientWidth - 4);
    };
    recentScroll.addEventListener('scroll', updateRecentArrows, { passive: true });
    updateRecentArrows();
    if (recentArrowL) recentArrowL.addEventListener('click', () => recentScroll.scrollBy({ left: -300, behavior: 'smooth' }));
    if (recentArrowR) recentArrowR.addEventListener('click', () => recentScroll.scrollBy({ left: 300, behavior: 'smooth' }));
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
      state.variantDrawerOpen = true;
      document.querySelector('.variant-drawer')?.classList.add('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.add('variant-drawer-backdrop--open');
    });
  });
  document.querySelectorAll('[data-action="close-variant-drawer"]').forEach(el => {
    el.addEventListener('click', () => {
      state.variantDrawerOpen = false;
      document.querySelector('.variant-drawer')?.classList.remove('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.remove('variant-drawer-backdrop--open');
    });
  });

  // Compare modal open/close
  document.querySelectorAll('[data-action="open-compare"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.compareModalOpen = true;
      state.compareVariants = []; // Start with empty selection - let user choose
      state.compareZoomIdx = null;
      render();
    });
  });
  document.querySelectorAll('[data-action="close-compare"]').forEach(el => {
    el.addEventListener('click', () => {
      state.compareModalOpen = false;
      state.compareVariants = [];
      state.compareZoomIdx = null;
      render();
    });
  });

  // Compare zoom card open/close
  document.querySelectorAll('[data-compare-zoom]').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.compareZoom);
      state.compareZoomIdx = idx;
      render();
      // Setup motion tracking after render
      setTimeout(() => initCompareCardMotion(), 50);
    });
  });
  document.querySelectorAll('[data-action="close-zoom"]').forEach(el => {
    el.addEventListener('click', () => {
      state.compareZoomIdx = null;
      render();
    });
  });

  // Compare variant toggle
  document.querySelectorAll('[data-compare-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.compareToggle);
      if (state.compareVariants.includes(idx)) {
        state.compareVariants = state.compareVariants.filter(i => i !== idx);
      } else if (state.compareVariants.length < 5) {
        state.compareVariants.push(idx);
      }
      render();
    });
  });

  // Compare add to cart - card persists, with bounce animation and fly effect
  document.querySelectorAll('[data-compare-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.compareCart);
      const item = state.itemDetail;
      if (!item) return;
      if (getCartTotal() >= 40) {
        showToast('Cart is full (40 items)');
        return;
      }
      const variant = item.variants[idx];
      state.cart.push({
        id: item.id,
        variantIdx: idx,
        name: item.name,
        variant: variant.name,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image,
      });
      storage.setCart(state.cart);
      hapticTick();

      // Bounce the card
      const card = document.getElementById('compare-zoom-card');
      if (card) {
        card.classList.add('compare-zoom-card--bounce');
        setTimeout(() => card.classList.remove('compare-zoom-card--bounce'), 200);
      }

      // Fly to cart animation
      const cardImg = card?.querySelector('.compare-zoom-img img');
      const cartNav = document.querySelector('[data-nav="cart"]');
      if (cardImg && cartNav) {
        flyToCart(cardImg, cartNav);
      }

      showToast(`Added ${item.name} (${variant.name}) to cart`);
      // Don't close zoom - just re-render to update button state
      render();
      // Re-init motion after render
      setTimeout(() => initCompareCardMotion(), 50);
    });
  });

  // Compare add to list - opens list picker on top of zoom card
  document.querySelectorAll('[data-compare-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.compareList);
      const item = state.itemDetail;
      if (!item) return;
      const variant = item.variants[idx];
      state.listPickerItem = {
        id: item.id,
        variantIdx: idx,
        name: item.name,
        variant: variant.name,
        img: variant.image,
      };
      // Keep zoom card open - list picker appears on top
      render();
    });
  });

  // Compare cart quantity plus
  document.querySelectorAll('[data-compare-cart-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.compareCartPlus);
      const item = state.itemDetail;
      if (!item || getCartTotal() >= 40) return;
      const variant = item.variants[idx];
      state.cart.push({
        id: item.id,
        variantIdx: idx,
        name: item.name,
        variant: variant.name,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image,
      });
      storage.setCart(state.cart);
      hapticTick();

      // Bounce the card
      const card = document.getElementById('compare-zoom-card');
      if (card) {
        card.classList.add('compare-zoom-card--bounce');
        setTimeout(() => card.classList.remove('compare-zoom-card--bounce'), 200);
      }

      // Fly to cart
      const cardImg = card?.querySelector('.compare-zoom-img img');
      const cartNav = document.querySelector('[data-nav="cart"]');
      if (cardImg && cartNav) flyToCart(cardImg, cartNav);

      render();
      setTimeout(() => initCompareCardMotion(), 50);
    });
  });

  // Compare cart quantity minus
  document.querySelectorAll('[data-compare-cart-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.compareCartMinus);
      const item = state.itemDetail;
      if (!item) return;

      // Remove one instance from cart
      const cartIdx = state.cart.findIndex(c => c.id === item.id && c.variantIdx === idx);
      if (cartIdx !== -1) {
        state.cart.splice(cartIdx, 1);
        storage.setCart(state.cart);
        hapticTick();
      }

      render();
      setTimeout(() => initCompareCardMotion(), 50);
    });
  });

  // ─── Detailed View Card ───
  // Open detailed view
  document.querySelectorAll('[data-action="open-detailed-view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.detailedViewOpen = true;
      render();
      setTimeout(() => initDetailedViewCardMotion(), 50);
    });
  });

  // Close detailed view
  document.querySelectorAll('[data-action="close-detailed-view"]').forEach(el => {
    el.addEventListener('click', () => {
      state.detailedViewOpen = false;
      render();
    });
  });

  // Detailed view add to cart
  document.querySelectorAll('[data-action="detail-view-add-cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.itemDetail;
      if (!item || getCartTotal() >= 40) return;
      const vi = state.selectedVariantIdx;
      const variant = item.variants[vi];
      state.cart.push({
        id: item.id,
        variantIdx: vi,
        name: item.name,
        variant: variant.name,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image,
      });
      storage.setCart(state.cart);
      hapticTick();

      // Bounce the card
      const card = document.getElementById('detailed-view-card');
      if (card) {
        card.classList.add('compare-zoom-card--bounce');
        setTimeout(() => card.classList.remove('compare-zoom-card--bounce'), 200);
      }

      // Fly to cart
      const cardImg = card?.querySelector('.compare-zoom-img img');
      const cartNav = document.querySelector('[data-nav="cart"]');
      if (cardImg && cartNav) flyToCart(cardImg, cartNav);

      showToast(`Added ${item.name} (${variant.name}) to cart`);
      render();
      setTimeout(() => initDetailedViewCardMotion(), 50);
    });
  });

  // Detailed view cart quantity plus
  document.querySelectorAll('[data-detail-view-cart-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.itemDetail;
      if (!item || getCartTotal() >= 40) return;
      const vi = state.selectedVariantIdx;
      const variant = item.variants[vi];
      state.cart.push({
        id: item.id,
        variantIdx: vi,
        name: item.name,
        variant: variant.name,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image,
      });
      storage.setCart(state.cart);
      hapticTick();

      // Bounce the card
      const card = document.getElementById('detailed-view-card');
      if (card) {
        card.classList.add('compare-zoom-card--bounce');
        setTimeout(() => card.classList.remove('compare-zoom-card--bounce'), 200);
      }

      // Fly to cart
      const cardImg = card?.querySelector('.compare-zoom-img img');
      const cartNav = document.querySelector('[data-nav="cart"]');
      if (cardImg && cartNav) flyToCart(cardImg, cartNav);

      render();
      setTimeout(() => initDetailedViewCardMotion(), 50);
    });
  });

  // Detailed view cart quantity minus
  document.querySelectorAll('[data-detail-view-cart-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.itemDetail;
      if (!item) return;
      const vi = state.selectedVariantIdx;

      // Remove one instance from cart
      const cartIdx = state.cart.findIndex(c => c.id === item.id && c.variantIdx === vi);
      if (cartIdx !== -1) {
        state.cart.splice(cartIdx, 1);
        storage.setCart(state.cart);
        hapticTick();
      }

      render();
      setTimeout(() => initDetailedViewCardMotion(), 50);
    });
  });

  // Detailed view add to list
  document.querySelectorAll('[data-action="detail-view-add-list"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.itemDetail;
      if (!item) return;
      const vi = state.selectedVariantIdx;
      const variant = item.variants[vi];
      state.listPickerItem = {
        id: item.id,
        variantIdx: vi,
        name: item.name,
        variant: variant.name,
        img: variant.image,
      };
      // Keep detailed view open - list picker appears on top
      render();
    });
  });

  // Compare carousel scroll tracking for dots
  const compareCarousel = document.getElementById('compare-carousel');
  if (compareCarousel) {
    compareCarousel.addEventListener('scroll', () => {
      const scrollLeft = compareCarousel.scrollLeft;
      const cardWidth = 152; // 140px card + 12px gap
      const activeIdx = Math.round(scrollLeft / cardWidth);
      const dots = document.querySelectorAll('.compare-carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    });
  }

  // Compare carousel dot clicks
  document.querySelectorAll('[data-compare-dot]').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.compareDot);
      const carousel = document.getElementById('compare-carousel');
      if (carousel) {
        const cardWidth = 152;
        carousel.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      }
    });
  });

  // Variant drawer cart buttons
  document.querySelectorAll('.variant-drawer-cart-btn[data-drawer-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.hasAttribute('disabled')) return;
      const variantIdx = parseInt(btn.dataset.drawerCart);
      const itemId = btn.dataset.itemId;
      if (!state.itemDetail || getCartTotal() >= 40) return;
      const item = state.itemDetail;
      const variant = item.variants[variantIdx];
      if (!variant) return;
      // Capture thumbnail position for fly animation
      const row = btn.closest('.variant-drawer-row');
      const thumb = row?.querySelector('.variant-drawer-thumb');
      if (thumb) _flyAnimRect = thumb.getBoundingClientRect();
      addToCart({
        id: item.id,
        name: item.name,
        variant: variant.name,
        variantIdx: variantIdx,
        hex: variant.hexVariated || variant.hex || item.hexBase,
        img: variant.image,
      });
      // Update button to show new quantity
      const newQty = getCartQtyForItem(item.id, variantIdx);
      btn.textContent = newQty > 0 ? newQty : '+';
      btn.classList.toggle('has-qty', newQty > 0);
    });
  });

  // Variant drawer row clicks
  document.querySelectorAll('.variant-drawer-row').forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't close drawer if clicking hex copy badge or cart button
      if (e.target.closest('.hex-copy-badge') || e.target.closest('.variant-drawer-cart-btn')) return;
      const idx = parseInt(row.dataset.drawerVariant);
      state.selectedVariantIdx = idx;
      hapticTick();
      updateOrbitAndDetail();
      state.variantDrawerOpen = false;
      document.querySelector('.variant-drawer')?.classList.remove('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.remove('variant-drawer-backdrop--open');
    });
  });

  // Add all variants to list button
  const addAllVariantsBtn = document.getElementById('add-all-variants-to-list');
  if (addAllVariantsBtn && state.itemDetail) {
    addAllVariantsBtn.addEventListener('click', () => {
      const item = state.itemDetail;
      // Create entries for all variants
      state.setPickerItems = item.variants.map((v, idx) => ({
        id: item.id,
        name: item.name,
        variant: v.name,
        variantIdx: idx,
        img: v.image || item.image,
      }));
      state.setPickerName = `${item.name} (all variants)`;
      // Close variant drawer
      state.variantDrawerOpen = false;
      document.querySelector('.variant-drawer')?.classList.remove('variant-drawer--open');
      document.querySelector('.variant-drawer-backdrop')?.classList.remove('variant-drawer-backdrop--open');
      render();
    });
  }

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

  // Add Set to Cart button (with sequential fly animations)
  document.querySelectorAll('[data-set-cart]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const setName = btn.dataset.setCart;
      btn.classList.add('detail-set-action-btn--loading');

      const setItems = await data.getItemsBySet(setName);

      // Capture button rect for fly animation source
      const btnRect = btn.getBoundingClientRect();
      let addedCount = 0;
      let delay = 0;

      for (const item of setItems) {
        if (getCartTotal() + addedCount >= 40) break;
        const v = item.variants[0];

        // Schedule each item with staggered delay for sequential fly effect
        ((itemData, d) => {
          setTimeout(() => {
            _flyAnimRect = btnRect;  // Set fly source before each add
            addToCart({
              id: itemData.id,
              name: itemData.name,
              variant: itemData.v.name,
              variantIdx: 0,
              hex: itemData.v.hexVariated || itemData.v.hex || itemData.hexBase,
              img: itemData.v.image || itemData.image,
            });
          }, d);
        })({ id: item.id, name: item.name, v, hexBase: item.hexBase, image: item.image }, delay);

        delay += 100;  // 100ms between each fly animation
        addedCount++;
      }

      // Show success after all items scheduled
      setTimeout(() => {
        btn.classList.remove('detail-set-action-btn--loading');
        if (addedCount > 0) {
          btn.classList.add('detail-set-action-btn--added');
          hapticTick();
          NookSounds.play('addToCart');
          setTimeout(() => btn.classList.remove('detail-set-action-btn--added'), 1500);
        }
      }, delay);
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

  // Animate cart progress bar from previous width to new width
  const cartProgressFill = app.querySelector('.ledger-progress-fill[data-target-width]');
  if (cartProgressFill) {
    const startWidth = state._prevCartProgressWidth || '0%';
    const targetWidth = cartProgressFill.dataset.targetWidth + '%';
    // Set starting width and force layout calculation
    cartProgressFill.style.width = startWidth;
    cartProgressFill.getBoundingClientRect();
    // Animate to target width
    requestAnimationFrame(() => {
      cartProgressFill.style.width = targetWidth;
    });
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
        row.style.animation = 'slideOutRight 0.2s ease-in forwards';
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

  // Cart item tap to view detail
  app.querySelectorAll('.ledger-row-link[data-cart-item-id]').forEach(link => {
    link.addEventListener('click', () => {
      const itemId = link.dataset.cartItemId;
      const vi = parseInt(link.dataset.cartItemVi) || 0;
      state.selectedItemId = itemId;
      state.selectedVariantIdx = vi;
      state.previousPage = 'cart';
      state.page = 'detail';
      state._pageEnter = true;
      loadItemDetail(itemId);
    });
  });

  // Clear entire cart (save to history first)
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', () => {
    if (confirm('Clear all items from your cart?')) {
      // Save current cart to order history before clearing
      if (state.cart.length > 0) {
        const prefix = state.prefix;
        const hexes = state.cart.map(c => c.hex);
        const command = `${prefix}order ${hexes.join(' ')}`;
        const snapshot = {
          items: [...state.cart],
          timestamp: Date.now(),
          command: command
        };
        const history = storage.getOrderHistory();
        history.unshift(snapshot); // Add to front
        // Keep only last 10 orders
        if (history.length > 10) history.length = 10;
        storage.setOrderHistory(history);
      }
      NookSounds.play('clearCart');
      state.cart = [];
      storage.setCart(state.cart);
      render();
    }
  });

  // Past orders - Copy command
  app.querySelectorAll('[data-copy-order]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.copyOrder);
      const history = storage.getOrderHistory();
      if (idx >= 0 && idx < history.length) {
        const order = history[idx];
        try {
          await navigator.clipboard.writeText(order.command);
          NookSounds.play('copy');
          showToast('📋 Command copied!');
        } catch {
          showToast('Failed to copy');
        }
      }
    });
  });

  // Past orders - Reload to cart
  app.querySelectorAll('[data-reload-order]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.reloadOrder);
      const history = storage.getOrderHistory();
      if (idx >= 0 && idx < history.length) {
        const order = history[idx];
        // Check if current cart is non-empty and confirm
        if (state.cart.length > 0) {
          if (!confirm('This will replace your current cart. Continue?')) return;
        }
        // Reload the order items to cart
        state.cart = [...order.items];
        storage.setCart(state.cart);
        NookSounds.play('addToCart');
        showToast(`♻ Reloaded ${order.items.length} item${order.items.length !== 1 ? 's' : ''}`);
        render();
      }
    });
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

  // Move item to another list - open move picker
  app.querySelectorAll('[data-move-list-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.moveListIdx);
      const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
      if (list && idx >= 0 && idx < list.items.length) {
        const item = list.items[idx];
        state.movePickerItem = {
          itemId: item.id,
          variantIdx: item.variantIdx || 0,
          sourceListId: state.viewingListId,
          itemIndex: idx,
        };
        render();
      }
    });
  });

  // Move picker - select destination list
  app.querySelectorAll('[data-move-to-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      const destListId = btn.dataset.moveToList;
      if (!state.movePickerItem) return;

      const sourceList = state.wishlists.lists.find(l => l.id === state.movePickerItem.sourceListId);
      const destList = state.wishlists.lists.find(l => l.id === destListId);
      if (!sourceList || !destList) return;

      // Check destination capacity
      if (destList.cap !== null && destList.items.length >= destList.cap) {
        state.wishlistToast = { listId: destListId, listName: destList.name, action: 'full' };
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          state.wishlistToast = null;
          const el = document.getElementById('wl-toast');
          if (el) el.remove();
        }, 3000);
        state.movePickerItem = null;
        render();
        return;
      }

      // Get item data before removing
      const itemData = sourceList.items[state.movePickerItem.itemIndex];
      if (!itemData) return;

      // Remove from source list
      sourceList.items.splice(state.movePickerItem.itemIndex, 1);

      // Add to destination list (if not already there)
      const alreadyInDest = destList.items.some(w => w.id === itemData.id && w.variantIdx === (itemData.variantIdx || 0));
      if (!alreadyInDest) {
        destList.items.push({
          id: itemData.id,
          variantIdx: itemData.variantIdx || 0,
          addedAt: Date.now(),
        });
      }

      storage.setWishlists(state.wishlists);
      hapticTick();
      NookSounds.play('addToList');
      state.wishlistToast = { listId: destListId, listName: destList.name, action: 'move' };
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        state.wishlistToast = null;
        const el = document.getElementById('wl-toast');
        if (el) el.remove();
      }, 3000);

      state.movePickerItem = null;
      render();
    });
  });

  // Close move picker
  const closeMovePickerBtn = document.getElementById('close-move-picker');
  if (closeMovePickerBtn) closeMovePickerBtn.addEventListener('click', () => {
    state.movePickerItem = null;
    render();
  });
  // Also close on overlay click
  const movePickerOverlay = document.getElementById('move-picker-overlay');
  if (movePickerOverlay) movePickerOverlay.addEventListener('click', (e) => {
    if (e.target === movePickerOverlay) {
      state.movePickerItem = null;
      render();
    }
  });

  // View list detail
  app.querySelectorAll('[data-view-list]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-list]')) return;
      if (e.target.closest('[data-edit-emoji]')) return;
      if (e.target.closest('[data-dup-list]')) return;
      if (e.target.closest('[data-rename-list]')) return;
      state.viewingListId = btn.dataset.viewList;
      render();
    });
  });

  // List back button
  const listBack = document.getElementById('list-back');
  if (listBack) listBack.addEventListener('click', () => {
    state.viewingListId = null;
    state.wishlistSelected.clear(); // Clear selection when leaving detail
    render();
  });

  // Collection progress toggle
  const collectionToggle = document.getElementById('collection-toggle');
  if (collectionToggle) collectionToggle.addEventListener('click', () => {
    const content = document.getElementById('collection-content');
    const chevron = document.getElementById('collection-chevron');
    if (content && chevron) {
      const isOpen = content.style.display !== 'none';
      content.style.display = isOpen ? 'none' : 'block';
      chevron.textContent = isOpen ? '▼' : '▲';
    }
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
        state.wishlists.lists.push({ id: Date.now().toString(36), name, emoji: '📋', cap: null, items: [] });
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

  // Edit emoji button (opens picker)
  app.querySelectorAll('[data-edit-emoji]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.emojiPickerFor = btn.dataset.editEmoji;
      render();
    });
  });

  // Emoji picker overlay (close on backdrop click)
  const emojiOverlay = document.getElementById('emoji-picker-overlay');
  if (emojiOverlay) {
    emojiOverlay.addEventListener('click', (e) => {
      if (e.target === emojiOverlay) {
        state.emojiPickerFor = null;
        render();
      }
    });
  }

  // Emoji grid buttons
  app.querySelectorAll('[data-pick-emoji]').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.pickEmoji;
      const list = state.wishlists.lists.find(l => l.id === state.emojiPickerFor);
      if (list) {
        list.emoji = emoji;
        storage.setWishlists(state.wishlists);
      }
      state.emojiPickerFor = null;
      render();
    });
  });

  // Rename list button
  app.querySelectorAll('[data-rename-list]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const listId = btn.dataset.renameList;
      const list = state.wishlists.lists.find(l => l.id === listId);
      if (list) {
        const newName = prompt('Rename list:', list.name);
        if (newName && newName.trim() && newName.trim() !== list.name) {
          list.name = newName.trim();
          storage.setWishlists(state.wishlists);
          NookSounds.play('click');
          render();
          showToast('✏️ List renamed!');
        }
      }
    });
  });

  // Duplicate list button
  app.querySelectorAll('[data-dup-list]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const listId = btn.dataset.dupList;
      const original = state.wishlists.lists.find(l => l.id === listId);
      if (original) {
        const newList = {
          id: 'list_' + Date.now(),
          name: original.name + ' (copy)',
          emoji: original.emoji,
          cap: null,
          items: [...original.items],
        };
        state.wishlists.lists.push(newList);
        storage.setWishlists(state.wishlists);
        NookSounds.play('newList');
        await render();
        showToast('📋 List duplicated!');
      }
    });
  });

  // Copy list order (receipt block click) - handles both single and chunked orders
  document.querySelectorAll('.copy-list-order-chunk, #copy-list-order').forEach(block => {
    block.addEventListener('click', () => {
      NookSounds.play('copyCommand');

      // Get chunk index if this is a chunked order
      const chunkIdx = parseInt(block.dataset.chunkIdx || '0', 10);
      const chunkSize = 40;
      const listHexes = getLastRenderedListHexes();
      const start = chunkIdx * chunkSize;
      const end = Math.min(start + chunkSize, listHexes.length);
      const chunkHexes = listHexes.slice(start, end);
      const command = `${state.prefix}order ${chunkHexes.join(' ')}`;
      const totalChunks = Math.ceil(listHexes.length / chunkSize);

      const showCopied = () => {
        const orderLabel = totalChunks > 1 ? ` (Order ${chunkIdx + 1}/${totalChunks})` : '';
        showToast(`📦 Copied to clipboard!${orderLabel}`);
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
        // Other lists: always add (allow duplicates, no cap)
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
        state.wishlists.lists.push({ id: Date.now().toString(36), name, emoji: '📋', cap: null, items: [] });
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

  // Helper function to perform move/add with duplicate handling
  // mode: 'skip' = skip duplicates, 'keep' = allow duplicates, 'replace' = replace existing
  function performMoveOrAdd(listId, items, dupeMode) {
    const list = state.wishlists.lists.find(l => l.id === listId);
    if (!list) return;

    // Snapshot original target list BEFORE any modifications
    // This ensures we only check duplicates against items that existed before this operation
    const originalTargetItems = list.items.map((w, idx) => ({
      id: w.id,
      variantIdx: w.variantIdx,
      originalIdx: idx
    }));

    // Track which source indices were actually moved (for selective removal from source)
    const movedSourceIndices = [];
    // Track which original target items have been "used" (for replace mode)
    const usedOriginalIndices = new Set();
    let addedCount = 0;
    let replacedCount = 0;

    if (dupeMode === 'keep') {
      // Keep mode: add ALL items, allowing duplicates in target
      for (const item of items) {
        list.items.push({
          id: item.id,
          variantIdx: item.variantIdx,
          addedAt: Date.now(),
        });
        addedCount++;
        if (item.sourceIdx !== undefined) {
          movedSourceIndices.push(item.sourceIdx);
        }
      }
    } else if (dupeMode === 'skip') {
      // Skip mode: only add items that don't ORIGINALLY exist in target
      // Duplicates stay in source list, but multiple copies of same NEW item all get moved
      for (const item of items) {
        // Check against ORIGINAL target items only
        const existsInOriginal = originalTargetItems.some(w =>
          w.id === item.id && w.variantIdx === item.variantIdx
        );
        if (existsInOriginal) {
          // Skip - don't add to movedSourceIndices, so it stays in source
          continue;
        }
        list.items.push({
          id: item.id,
          variantIdx: item.variantIdx,
          addedAt: Date.now(),
        });
        addedCount++;
        if (item.sourceIdx !== undefined) {
          movedSourceIndices.push(item.sourceIdx);
        }
      }
    } else if (dupeMode === 'replace') {
      // Replace mode: for items that ORIGINALLY exist in target, update them in-place
      // Extra source copies beyond original target count stay in source
      for (const item of items) {
        // Find an ORIGINAL target item that matches AND hasn't been used yet
        const originalMatch = originalTargetItems.find(w =>
          w.id === item.id && w.variantIdx === item.variantIdx && !usedOriginalIndices.has(w.originalIdx)
        );

        if (originalMatch) {
          // Replace this target item (just update timestamp)
          list.items[originalMatch.originalIdx].addedAt = Date.now();
          usedOriginalIndices.add(originalMatch.originalIdx);
          replacedCount++;
          if (item.sourceIdx !== undefined) {
            movedSourceIndices.push(item.sourceIdx);
          }
        } else {
          // No matching ORIGINAL target to replace
          // Check if this item type existed in original - if so, extras stay in source
          const typeExistedInOriginal = originalTargetItems.some(w =>
            w.id === item.id && w.variantIdx === item.variantIdx
          );
          if (typeExistedInOriginal) {
            // This is an "extra" - don't move it, leave in source
            continue;
          }
          // This is a new item type - add it
          list.items.push({
            id: item.id,
            variantIdx: item.variantIdx,
            addedAt: Date.now(),
          });
          addedCount++;
          if (item.sourceIdx !== undefined) {
            movedSourceIndices.push(item.sourceIdx);
          }
        }
      }
    }

    // If this was a move operation, remove ONLY the items that were actually moved
    if (state._movingFromList && movedSourceIndices.length > 0) {
      const sourceList = state.wishlists.lists.find(l => l.id === state._movingFromList);
      if (sourceList) {
        // Sort descending for safe removal
        const sortedIndices = [...movedSourceIndices].sort((a, b) => b - a);
        for (const idx of sortedIndices) {
          if (idx >= 0 && idx < sourceList.items.length) {
            sourceList.items.splice(idx, 1);
          }
        }
      }
    }

    if (addedCount > 0 || replacedCount > 0) {
      storage.setWishlists(state.wishlists);
      hapticTick();
      NookSounds.play('addToList');
      state.wishlistToast = { listId, listName: list.name, action: state._movingFromList ? 'move' : 'add' };
      // Auto-clear toast after 3 seconds
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        state.wishlistToast = null;
        const el = document.getElementById('wl-toast');
        if (el) el.remove();
      }, 3000);
    }

    state.setPickerItems = null;
    state.setPickerName = null;
    state._movingFromList = null;
    state.duplicatePickerData = null;
    state.wishlistSelected.clear();
    render();
  }

  // Set picker — pick a list for entire set
  app.querySelectorAll('[data-set-pick-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      const listId = btn.dataset.setPickList;
      const items = state.setPickerItems;
      if (!items || items.length === 0) return;

      const list = state.wishlists.lists.find(l => l.id === listId);
      if (!list) return;

      // If moving to the same list, just clear selection (shouldn't happen now since button is disabled)
      if (state._movingFromList && state._movingFromList === listId) {
        state.setPickerItems = null;
        state.setPickerName = null;
        state._movingFromList = null;
        state.wishlistSelected.clear();
        render();
        return;
      }

      // Check for duplicates when moving items
      if (state._movingFromList) {
        // Find all source items that match something in target
        const duplicateItems = items.filter(item =>
          list.items.some(w => w.id === item.id && w.variantIdx === item.variantIdx)
        );

        // Count unique item types that are duplicates
        const uniqueDupeKeys = new Set(duplicateItems.map(item => `${item.id}:${item.variantIdx}`));
        // Count how many of each duplicate type exist in target
        const targetDupeCounts = {};
        for (const item of duplicateItems) {
          const key = `${item.id}:${item.variantIdx}`;
          if (!targetDupeCounts[key]) {
            targetDupeCounts[key] = list.items.filter(w => w.id === item.id && w.variantIdx === item.variantIdx).length;
          }
        }
        const totalInTarget = Object.values(targetDupeCounts).reduce((a, b) => a + b, 0);

        if (duplicateItems.length > 0) {
          // Show duplicate picker modal
          state.duplicatePickerData = {
            targetListId: listId,
            targetListName: list.name,
            items: items,
            duplicateItems: duplicateItems, // source items that match target
            uniqueDupeCount: uniqueDupeKeys.size, // unique item types
            totalInTarget: totalInTarget, // how many copies exist in target
            sourceDupeCount: duplicateItems.length, // how many source items are dupes
          };
          render();
          return;
        }
      }

      // No duplicates or not moving — proceed normally
      performMoveOrAdd(listId, items, 'skip');
    });
  });

  // Create new list from set picker (matches original list picker styling)
  const createFromSetPicker = document.getElementById('create-list-from-set-picker');
  if (createFromSetPicker) createFromSetPicker.addEventListener('click', () => {
    // Replace button with styled inline form (matching original list picker)
    createFromSetPicker.outerHTML = `<div style="display:flex;gap:8px;margin-bottom:12px" id="set-picker-list-form">
      <input type="text" id="set-picker-list-input" class="prefix-input" placeholder="List name..." autofocus style="flex:1;width:auto;margin:0">
      <button class="preset-btn active" id="set-picker-list-confirm" style="width:auto;padding:0 18px;font-size:18px">✓</button>
    </div>`;

    const inp = document.getElementById('set-picker-list-input');
    const doCreate = () => {
      const name = (inp.value || '').trim();
      if (!name) return;
      // Create new list WITHOUT auto-adding items (user clicks list to add)
      state.wishlists.lists.push({ id: Date.now().toString(36), name, emoji: '📋', cap: null, items: [] });
      storage.setWishlists(state.wishlists);
      // Re-render to show new list in picker (keep modal open)
      render();
    };

    document.getElementById('set-picker-list-confirm').addEventListener('click', doCreate);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreate(); });
    inp.focus();
  });

  // Close set picker
  const closeSetPicker = document.getElementById('close-set-picker');
  if (closeSetPicker) closeSetPicker.addEventListener('click', () => {
    state.setPickerItems = null;
    state.setPickerName = null;
    state._movingFromList = null;
    render();
  });

  // Also close set picker on overlay click
  const setPickerOverlay = document.getElementById('set-picker-overlay');
  if (setPickerOverlay) setPickerOverlay.addEventListener('click', (e) => {
    if (e.target === setPickerOverlay) {
      state.setPickerItems = null;
      state.setPickerName = null;
      state._movingFromList = null;
      render();
    }
  });

  // Duplicate picker — Keep Both (allow duplicates)
  const dupeKeepSeparate = document.getElementById('dupe-keep-separate');
  if (dupeKeepSeparate) dupeKeepSeparate.addEventListener('click', () => {
    if (!state.duplicatePickerData) return;
    const { targetListId, items } = state.duplicatePickerData;
    performMoveOrAdd(targetListId, items, 'keep');
  });

  // Duplicate picker — Replace duplicates
  const dupeReplace = document.getElementById('dupe-replace');
  if (dupeReplace) dupeReplace.addEventListener('click', () => {
    if (!state.duplicatePickerData) return;
    const { targetListId, items } = state.duplicatePickerData;
    performMoveOrAdd(targetListId, items, 'replace');
  });

  // Duplicate picker — Skip duplicates
  const dupeSkip = document.getElementById('dupe-skip');
  if (dupeSkip) dupeSkip.addEventListener('click', () => {
    if (!state.duplicatePickerData) return;
    const { targetListId, items } = state.duplicatePickerData;
    performMoveOrAdd(targetListId, items, 'skip');
  });

  // Close duplicate picker
  const closeDupePicker = document.getElementById('close-duplicate-picker');
  if (closeDupePicker) closeDupePicker.addEventListener('click', () => {
    state.duplicatePickerData = null;
    render();
  });

  // Also close duplicate picker on overlay click
  const dupePickerOverlay = document.getElementById('duplicate-picker-overlay');
  if (dupePickerOverlay) dupePickerOverlay.addEventListener('click', (e) => {
    if (e.target === dupePickerOverlay) {
      state.duplicatePickerData = null;
      render();
    }
  });

  // Export list button (open export modal)
  const exportListBtn = document.getElementById('export-list-btn');
  if (exportListBtn) exportListBtn.addEventListener('click', () => {
    state.showExportModal = true;
    render();
  });

  // Share as image button
  const shareImageBtn = document.getElementById('share-image-btn');
  if (shareImageBtn) shareImageBtn.addEventListener('click', shareWishlistAsImage);

  // Wishlist group selection system - delegated click handling
  const wishlistContainer = document.getElementById('wishlist-items-container');
  if (wishlistContainer) {
    wishlistContainer.addEventListener('click', (e) => {
      // Handle left-half click - go to item detail
      const leftHalf = e.target.closest('.wl-left-half');
      if (leftHalf) {
        const itemId = leftHalf.dataset.item;
        const vi = parseInt(leftHalf.dataset.vi) || 0;
        if (itemId) {
          state.selectedVariantIdx = vi;
          state.page = 'detail';
          state._pageEnter = true;
          loadItemDetail(itemId);
        }
        return;
      }

      // Handle right-half click - toggle selection
      const rightHalf = e.target.closest('.wl-right-half[data-wl-select]');
      if (rightHalf) {
        const idx = parseInt(rightHalf.dataset.wlSelect, 10);
        if (state.wishlistSelected.has(idx)) {
          state.wishlistSelected.delete(idx);
        } else {
          state.wishlistSelected.add(idx);
        }
        render();
        return;
      }

      // Handle group checkbox
      const groupCheck = e.target.closest('[data-group-check]');
      if (groupCheck) {
        const groupIdx = parseInt(groupCheck.dataset.groupCheck, 10);
        const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
        if (!list) return;
        const startIdx = groupIdx * 40;
        const endIdx = Math.min(startIdx + 40, list.items.length);

        // Check if all items in group are selected
        let allSelected = true;
        for (let i = startIdx; i < endIdx; i++) {
          if (!state.wishlistSelected.has(i)) {
            allSelected = false;
            break;
          }
        }

        // Toggle: if all selected, deselect all; otherwise select all
        for (let i = startIdx; i < endIdx; i++) {
          if (allSelected) {
            state.wishlistSelected.delete(i);
          } else {
            state.wishlistSelected.add(i);
          }
        }
        render();
        return;
      }
    });
  }

  // Selection bar - Move button (opens move picker for selected items)
  const wlSelectMove = document.getElementById('wl-select-move');
  if (wlSelectMove) wlSelectMove.addEventListener('click', async () => {
    const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
    if (!list) return;

    // Collect selected items for the set picker
    const selectedIndices = Array.from(state.wishlistSelected).sort((a, b) => a - b);
    const itemsToMove = [];

    for (const idx of selectedIndices) {
      const item = list.items[idx];
      if (!item) continue;
      const detail = await data.getItemDetail(item.id);
      if (!detail) continue;
      const vi = item.variantIdx || 0;
      const variant = detail.variants[vi] || detail.variants[0];

      itemsToMove.push({
        id: item.id,
        name: detail.name,
        variant: variant.name,
        variantIdx: vi,
        img: variant.image || detail.image,
        sourceIdx: idx, // Track source index for removal after move
      });
    }

    if (itemsToMove.length === 0) return;

    // Use set picker for moving items
    state.setPickerItems = itemsToMove;
    state.setPickerName = `${itemsToMove.length} selected items`;
    state._movingFromList = state.viewingListId; // Track source list for removal
    render();
  });

  // Selection bar - Delete button
  const wlSelectDelete = document.getElementById('wl-select-delete');
  if (wlSelectDelete) wlSelectDelete.addEventListener('click', async () => {
    const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
    if (!list) return;

    const selectedIndices = Array.from(state.wishlistSelected).sort((a, b) => b - a); // Sort descending for removal
    const removedCount = selectedIndices.length;

    // Remove items by index (from highest to lowest to preserve indices)
    for (const idx of selectedIndices) {
      if (idx >= 0 && idx < list.items.length) {
        list.items.splice(idx, 1);
      }
    }

    storage.setWishlists(state.wishlists);
    state.wishlistSelected.clear();
    NookSounds.play('removeItem');
    const toastMsg = `🗑 Removed ${removedCount} item${removedCount > 1 ? 's' : ''}`;
    await render();
    showToast(toastMsg);
  });

  // Selection bar - Add to Cart button
  const wlSelectCart = document.getElementById('wl-select-cart');
  if (wlSelectCart) wlSelectCart.addEventListener('click', async () => {
    const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
    if (!list) return;

    const remaining = 40 - state.cart.length;
    if (remaining <= 0) {
      NookSounds.play('cartFull');
      showToast('Cart is full (40/40)');
      return;
    }

    // Get selected items sorted by index - limit to first 40 selected, then to cart space
    const selectedIndices = Array.from(state.wishlistSelected).sort((a, b) => a - b);
    const totalSelected = selectedIndices.length;
    const cappedTo40 = selectedIndices.slice(0, 40); // First 40 selected items only
    const itemsToAdd = cappedTo40.slice(0, remaining); // Then limit to cart space

    // Collect item data for fly animation
    const itemsData = [];
    for (const idx of itemsToAdd) {
      const item = list.items[idx];
      if (!item) continue;
      const detail = await data.getItemDetail(item.id);
      if (!detail) continue;
      const vi = item.variantIdx || 0;
      const variant = detail.variants[vi] || detail.variants[0];

      itemsData.push({
        id: item.id,
        name: detail.name,
        variant: variant.name,
        variantIdx: vi,
        hex: variant.hexVariated || variant.hex || detail.hexBase,
        img: variant.image || detail.image,
        idx: idx,
      });
    }

    if (itemsData.length === 0) return;

    // Get cart nav button position for fly animation target
    const cartNavBtn = document.querySelector('[data-nav="cart"]');
    const cartRect = cartNavBtn ? cartNavBtn.getBoundingClientRect() : null;

    // Animate items flying to cart one by one
    const flyDelay = Math.min(80, 800 / itemsData.length); // Faster for more items

    for (let i = 0; i < itemsData.length; i++) {
      const itemData = itemsData[i];
      const row = document.querySelector(`[data-global-idx="${itemData.idx}"]`);

      if (row && cartRect) {
        const rowRect = row.getBoundingClientRect();

        // Create fly element
        const flyEl = document.createElement('div');
        flyEl.className = 'cart-fly-item';
        flyEl.innerHTML = itemData.img ?
          `<img src="${itemData.img}" style="width:100%;height:100%;object-fit:contain;border-radius:8px">` :
          '📦';
        flyEl.style.cssText = `
          position: fixed;
          left: ${rowRect.left + 30}px;
          top: ${rowRect.top + 10}px;
          width: 36px;
          height: 36px;
          z-index: 1000;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: var(--card);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(flyEl);

        // Animate to cart - fly and disappear
        setTimeout(() => {
          flyEl.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
          flyEl.style.left = `${cartRect.left + cartRect.width / 2 - 18}px`;
          flyEl.style.top = `${cartRect.top + cartRect.height / 2 - 18}px`;
          flyEl.style.transform = 'scale(0)';
          flyEl.style.opacity = '0';
        }, 10);

        // Remove element after animation completes
        setTimeout(() => {
          flyEl.remove();
        }, 360);
      }

      // Add to cart with delay
      await new Promise(resolve => setTimeout(resolve, flyDelay));

      state.cart.push({
        id: itemData.id,
        name: itemData.name,
        variant: itemData.variant,
        variantIdx: itemData.variantIdx,
        hex: itemData.hex,
        img: itemData.img,
      });
    }

    storage.setCart(state.cart);
    NookSounds.play('addToCart');
    state._cartBounce = true;
    state.wishlistSelected.clear();

    // Store toast message to show after render
    const addedCount = itemsData.length;
    let toastMsg;
    if (addedCount < totalSelected) {
      toastMsg = `🛒 Added ${addedCount}/${totalSelected} items. Add remaining after ordering.`;
    } else {
      toastMsg = '🛒 Added to cart!';
    }
    await render();
    // Show toast after render completes (so it doesn't get removed)
    showToast(toastMsg);
  });

  // Start Browsing button (empty wishlist state)
  const startBrowsingBtn = document.getElementById('start-browsing-btn');
  if (startBrowsingBtn) startBrowsingBtn.addEventListener('click', () => {
    state.viewingListId = null;
    state.page = 'catalog';
    state._pageEnter = true;
    render();
  });

  // Select All button for wishlist (when <= 40 items)
  const wlSelectAll = document.getElementById('wl-select-all');
  if (wlSelectAll) wlSelectAll.addEventListener('click', () => {
    const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
    if (!list) return;
    const totalItems = list.items.length;

    // Toggle: if all selected, deselect all; otherwise select all
    if (state.wishlistSelected.size === totalItems) {
      state.wishlistSelected.clear();
    } else {
      for (let i = 0; i < totalItems; i++) {
        state.wishlistSelected.add(i);
      }
    }
    render();
  });

  // Wishlist item link clicks (name/image) - navigate to item detail
  document.querySelectorAll('.wl-item-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = el.dataset.item;
      const vi = parseInt(el.dataset.vi) || 0;
      if (itemId) {
        state.selectedVariantIdx = vi;
        state.page = 'detail';
        state._pageEnter = true;
        loadItemDetail(itemId);
      }
    });
  });

  // Export modal - close button
  const closeExportModal = document.getElementById('close-export-modal');
  if (closeExportModal) closeExportModal.addEventListener('click', () => {
    state.showExportModal = false;
    render();
  });

  // Export modal - overlay click to close
  const exportModalOverlay = document.getElementById('export-modal-overlay');
  if (exportModalOverlay) exportModalOverlay.addEventListener('click', (e) => {
    if (e.target === exportModalOverlay) {
      state.showExportModal = false;
      render();
    }
  });

  // Export modal - copy button
  const copyExportBtn = document.getElementById('copy-export-btn');
  if (copyExportBtn) copyExportBtn.addEventListener('click', () => {
    NookSounds.play('copyCommand');
    const hexString = getLastRenderedListHexes().join(' ');

    const showCopied = () => {
      copyExportBtn.innerHTML = '✓ Copied!';
      // Set the flag so the info blurb won't show next time
      if (!state.seenExportInfo) {
        state.seenExportInfo = true;
        storage.setSeenExportInfo(true);
      }
      setTimeout(() => { copyExportBtn.innerHTML = '📋 Copy'; }, 2000);
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
      navigator.clipboard.writeText(hexString).then(showCopied).catch(() => {
        fallbackCopy(hexString);
        showCopied();
      });
    } else {
      fallbackCopy(hexString);
      showCopied();
    }
  });

  // Export textarea - select all on focus
  const exportTextarea = document.getElementById('export-textarea');
  if (exportTextarea) exportTextarea.addEventListener('focus', () => {
    exportTextarea.select();
  });

  // Import list button (open import modal)
  const importListBtn = document.getElementById('import-list-btn');
  if (importListBtn) importListBtn.addEventListener('click', () => {
    state.showImportModal = true;
    render();
  });

  // Import modal - close button
  const closeImportModal = document.getElementById('close-import-modal');
  if (closeImportModal) closeImportModal.addEventListener('click', () => {
    state.showImportModal = false;
    render();
  });

  // Import modal - overlay click to close
  const importModalOverlay = document.getElementById('import-modal-overlay');
  if (importModalOverlay) importModalOverlay.addEventListener('click', (e) => {
    if (e.target === importModalOverlay) {
      state.showImportModal = false;
      render();
    }
  });

  // Import modal - do import button
  const doImportBtn = document.getElementById('do-import-btn');
  if (doImportBtn) doImportBtn.addEventListener('click', async () => {
    const textarea = document.getElementById('import-textarea');
    if (!textarea) return;

    const text = textarea.value.trim();
    if (!text) {
      showToast('Paste hex IDs first');
      return;
    }

    // Parse the input: split by whitespace, trim, filter empties
    const tokens = text.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      showToast('No valid hex IDs found');
      return;
    }

    // Ensure expanded items are loaded for lookup
    await data.getExpandedAll(0, 1);

    // Resolve each hex to {id, variantIdx}
    const resolved = [];
    let skipped = 0;
    for (const token of tokens) {
      // Validate hex characters only
      if (!/^[0-9A-Fa-f]+$/.test(token)) {
        skipped++;
        continue;
      }
      const result = data.lookupByHex(token);
      if (result) {
        // No cap on wishlists - add all resolved items
        resolved.push(result);
      } else {
        skipped++;
      }
    }

    if (resolved.length === 0) {
      showToast('No valid items found');
      return;
    }

    // Create a new wishlist with the imported items
    const newList = {
      id: 'imported_' + Date.now(),
      name: 'Imported List',
      emoji: '📥',
      cap: null,
      items: resolved,
    };

    state.wishlists.lists.push(newList);
    storage.setWishlists(state.wishlists);
    NookSounds.play('newList');

    // Close modal and show toast
    state.showImportModal = false;
    const toastMsg = skipped > 0
      ? `📥 Imported ${resolved.length} items (${skipped} skipped)`
      : `📥 Imported ${resolved.length} items`;

    await render();
    showToast(toastMsg);
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

  // Theme toggle
  app.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = btn.dataset.theme;
      state.theme = newTheme;
      storage.setTheme(newTheme);
      applyTheme(newTheme);
      app.querySelectorAll('[data-theme]').forEach(b => {
        b.classList.toggle('active', b.dataset.theme === newTheme);
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

  // Card motion toggle
  const cardMotionToggle = document.getElementById('cardMotionToggle');
  if (cardMotionToggle) cardMotionToggle.addEventListener('change', (e) => {
    state.cardMotionEnabled = e.target.checked;
    storage.setCardMotionEnabled(state.cardMotionEnabled);
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
      // Navigate to home page (clears hash) and hard refresh
      window.location.href = window.location.pathname;
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
  // Check if in Loved list specifically (not any list) to determine toggle action
  const wasInLoved = isInLovedList(itemId, variantIdx);
  if (wasInLoved) {
    // Remove from Loved list only
    const loved = state.wishlists.lists.find(l => l.id === '__loved__');
    if (loved) {
      loved.items = loved.items.filter(w => !(w.id === itemId && w.variantIdx === variantIdx));
    }
    storage.setWishlists(state.wishlists);
    NookSounds.play('heartRemove');
    showWishlistToast(itemId, variantIdx, 'Loved Items', true);
  } else {
    // Add to Loved Items (single instance only)
    const loved = state.wishlists.lists.find(l => l.id === '__loved__');
    if (!loved.items.some(w => w.id === itemId && w.variantIdx === variantIdx)) {
      loved.items.push({ id: itemId, variantIdx });
    }
    storage.setWishlists(state.wishlists);
    NookSounds.play('heartAdd');
    showWishlistToast(itemId, variantIdx, 'Loved Items');
  }
  // Track the correct state for UI updates
  const wasIn = wasInLoved;

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

  // Update in-cart dots on item cards
  document.querySelectorAll('.item-card[data-item]').forEach(card => {
    const itemId = card.dataset.item;
    const vi = parseInt(card.dataset.vi) || 0;
    const qty = getCartQtyForItem(itemId, vi);
    const thumb = card.querySelector('.item-thumb');
    let dot = thumb?.querySelector('.in-cart-dot');
    if (qty > 0 && !dot && thumb) {
      thumb.insertAdjacentHTML('beforeend', '<span class="in-cart-dot"></span>');
    } else if (qty === 0 && dot) {
      dot.remove();
    }
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

  if (state.searchOpen || state.variantDrawerOpen) {
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

// ─── Recently Viewed Tracking ───
function trackRecentlyViewed(id, variantIdx) {
  const entry = { id, variantIdx, timestamp: Date.now() };
  // Remove existing entry for this id+variantIdx
  const filtered = state.recentlyViewed.filter(
    e => !(e.id === id && e.variantIdx === variantIdx)
  );
  // Add to front
  filtered.unshift(entry);
  // Limit to 20
  state.recentlyViewed = filtered.slice(0, 20);
  storage.setRecentlyViewed(state.recentlyViewed);
}

async function loadItemDetail(itemId) {
  state.itemDetail = null;
  clearDetailCaches(); // clear similar items and reviews cache for new item
  state.similarScrollLeft = 0; // reset similar carousel scroll for new item
  state._detailScrollY = undefined; // prevent restoring old scroll position
  state.detailsExpanded = false; // reset collapsible details
  state.variantDrawerOpen = false; // reset variant drawer
  state.itemsViewed++;
  render(); // Show loading
  window.scrollTo(0, 0);
  state.itemDetail = await data.getItemDetail(itemId);
  state._pageEnter = true;

  // Track recently viewed item
  trackRecentlyViewed(itemId, state.selectedVariantIdx);

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

// ─── Jump FAB (Floating Action Button) ───
function renderJumpFab() {
  // Show on catalog, search, cart (with items), wishlist detail
  const showTop = state.page === 'catalog' || state.searchOpen;
  const showOrder = (state.page === 'cart' && state.cart.length > 0) ||
                    (state.page === 'wishlist' && state.viewingListId);

  if (!showTop && !showOrder) return '';

  if (showOrder) {
    // Dual arrows - direction controlled by JS
    return `<button class="jump-fab" id="jump-order-fab" data-direction="down">
      <svg class="fab-icon-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      <svg class="fab-icon-up" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
    </button>`;
  }

  // Up arrow to jump to top
  return `<button class="jump-fab" id="jump-top-fab"><svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg></button>`;
}

let _orderFabDismissed = false;

function updateJumpFabVisibility() {
  const fab = document.getElementById('jump-top-fab') || document.getElementById('jump-order-fab');
  if (!fab) return;

  const scrollY = window.scrollY || 0;
  const threshold = 400;

  if (fab.id === 'jump-top-fab') {
    // Show when scrolled past threshold, hide when near top
    fab.classList.toggle('visible', scrollY > threshold);
  } else {
    // Jump to order FAB
    const target = document.querySelector('.shipping-label') ||
                   document.querySelector('.receipt-section') ||
                   document.querySelector('.wl-export-row') ||
                   document.querySelector('.copy-list-order-chunk');

    if (!target) {
      fab.classList.remove('visible');
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const targetInView = targetRect.top < window.innerHeight && targetRect.bottom > 0;
    const targetAbove = targetRect.bottom < 0; // Target scrolled past (above viewport)
    const targetBelow = targetRect.top > window.innerHeight; // Target below viewport

    // Reset dismissed state when target goes out of view below (scrolled back up)
    if (targetBelow) {
      _orderFabDismissed = false;
    }

    // Set direction: up if target is above, down if target is below
    fab.dataset.direction = targetAbove ? 'up' : 'down';

    // Show FAB only when: scrolled enough, target NOT in view, and not dismissed
    const shouldShow = scrollY > threshold && !targetInView && !_orderFabDismissed;
    fab.classList.toggle('visible', shouldShow);
  }
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

    // Update FAB visibility
    updateJumpFabVisibility();
  }, { passive: true });
}

// ─── Init ───
async function init() {
  app.innerHTML = `<div class="loading" style="padding-top:40vh"><div class="spinner"></div><p class="text-secondary">Loading catalog...</p></div>`;
  await data.loadCatalog();

  // Parse URL hash to determine initial navigation state
  const hashNavigated = await parseHashAndNavigate();

  // Only set up random items if we're on catalog page (default or hash-routed)
  if (state.page === 'catalog') {
    state.isRandom = true;
    state.randomUsedIndices = new Set();
    state.randomItems = await data.getRandomExpandedItems(50, state.randomUsedIndices);
  }

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

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();

  // Initialize offline indicator
  initOfflineIndicator();
}

// ─── Compare Card Motion ───
let cardMotionCleanup = null;

function initCompareCardMotion() {
  const card = document.getElementById('compare-zoom-card');
  if (!card || !state.cardMotionEnabled) return;

  // Clean up any previous listeners
  if (cardMotionCleanup) cardMotionCleanup();

  // Mouse motion on desktop - only react when mouse is within proximity
  const PROXIMITY_THRESHOLD = 200; // px distance to start tracking
  let isInProximity = false;

  const handleMouseMove = (e) => {
    if (!state.cardMotionEnabled) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from mouse to card center
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only track when mouse is fairly close to the card
    const cardRadius = Math.max(rect.width, rect.height) / 2;
    if (distance > cardRadius + PROXIMITY_THRESHOLD) {
      // Mouse is far away - card stays flat
      if (isInProximity) {
        isInProximity = false;
        card.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
      return;
    }

    isInProximity = true;
    // Scale rotation based on proximity - closer = more responsive
    const proximityFactor = 1 - Math.max(0, (distance - cardRadius) / PROXIMITY_THRESHOLD);
    const rotateY = ((dx) / (rect.width / 2)) * 8 * proximityFactor;
    const rotateX = -((dy) / (rect.height / 2)) * 8 * proximityFactor;
    card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    isInProximity = false;
    card.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  document.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  // Mobile gyro effect removed - was too jittery

  // Store cleanup function
  cardMotionCleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
}

// ─── Detailed View Card Motion ───
let detailedViewMotionCleanup = null;

function initDetailedViewCardMotion() {
  const card = document.getElementById('detailed-view-card');
  if (!card || !state.cardMotionEnabled) return;

  // Clean up any previous listeners
  if (detailedViewMotionCleanup) detailedViewMotionCleanup();

  // Mouse motion on desktop - only react when mouse is within proximity
  const PROXIMITY_THRESHOLD = 200;
  let isInProximity = false;

  const handleMouseMove = (e) => {
    if (!state.cardMotionEnabled) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const cardRadius = Math.max(rect.width, rect.height) / 2;
    if (distance > cardRadius + PROXIMITY_THRESHOLD) {
      if (isInProximity) {
        isInProximity = false;
        card.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
      return;
    }

    isInProximity = true;
    const proximityFactor = 1 - Math.max(0, (distance - cardRadius) / PROXIMITY_THRESHOLD);
    const rotateY = ((dx) / (rect.width / 2)) * 8 * proximityFactor;
    const rotateX = -((dy) / (rect.height / 2)) * 8 * proximityFactor;
    card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    isInProximity = false;
    card.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  document.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  // Mobile gyro effect removed - was too jittery

  detailedViewMotionCleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
}

// ─── Keyboard Shortcuts ───
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in input/textarea
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable
    );

    // Escape always works (to close things)
    if (e.key === 'Escape') {
      e.preventDefault();
      // Close in priority order: popup > search > variant drawer > sheet modals
      if (state.activePopup) {
        state.activePopup = null;
        render();
        return;
      }
      if (state.searchOpen) {
        state.searchOpen = false;
        state.searchQuery = '';
        state.searchResults = null;
        // Keep filters - they persist until page navigation or explicit clear
        state.searchFilterOpen = false;
        render();
        return;
      }
      if (state.variantDrawerOpen) {
        state.variantDrawerOpen = false;
        render();
        return;
      }
      if (state.detailedViewOpen) {
        state.detailedViewOpen = false;
        render();
        return;
      }
      if (state.compareZoomIdx !== null) {
        state.compareZoomIdx = null;
        render();
        return;
      }
      if (state.compareModalOpen) {
        state.compareModalOpen = false;
        state.compareVariants = [];
        state.compareZoomIdx = null;
        render();
        return;
      }
      // Check for any sheet modals and close them
      const sheetModal = document.querySelector('.sheet-modal');
      if (sheetModal) {
        const closeBtn = sheetModal.querySelector('[id^="close-"]');
        if (closeBtn) closeBtn.click();
        return;
      }
      return;
    }

    // Skip other shortcuts if typing
    if (isTyping) return;

    // "/" or Ctrl+K → Open search
    if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      // Show reminder only when returning to search with existing filters
      state.searchFilterReminderVisible = state.searchFilterTags.length > 0;
      state.searchOpen = true;
      render();
      // Focus search input after render
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 50);
      return;
    }

    // 1-5 → Navigate to tabs
    if (['1', '2', '3', '4', '5'].includes(e.key)) {
      const pages = ['catalog', 'wishlist', 'cart', 'settings', 'info'];
      const pageIdx = parseInt(e.key) - 1;
      if (state.page !== pages[pageIdx]) {
        state.page = pages[pageIdx];
        state.viewingListId = null;
        state.selectedItemId = null;
        updateHash();
        render();
      }
      return;
    }

    // ← / → → Previous/next variant on detail page
    if (state.page === 'detail' && state.itemDetail && state.itemDetail.variants.length > 1) {
      const count = state.itemDetail.variants.length;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.selectedVariantIdx = (state.selectedVariantIdx - 1 + count) % count;
        updateHash();
        render();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.selectedVariantIdx = (state.selectedVariantIdx + 1) % count;
        updateHash();
        render();
        return;
      }
    }
  });
}

// ─── Offline Indicator ───
function initOfflineIndicator() {
  // Create the banner element
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.className = 'offline-banner';
  document.body.appendChild(banner);

  let dismissTimer = null;

  function showOffline() {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    banner.innerHTML = '📡 You\'re offline — browsing cached data';
    banner.className = 'offline-banner offline-banner--offline offline-banner--visible';
  }

  function showOnline() {
    banner.innerHTML = '✅ Back online';
    banner.className = 'offline-banner offline-banner--online offline-banner--visible';
    dismissTimer = setTimeout(() => {
      banner.classList.remove('offline-banner--visible');
      dismissTimer = null;
    }, 2000);
  }

  // Check initial state
  if (!navigator.onLine) {
    showOffline();
  }

  // Listen for online/offline events
  window.addEventListener('offline', showOffline);
  window.addEventListener('online', showOnline);
}

init();
