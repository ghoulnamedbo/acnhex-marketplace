// localStorage wrapper — all keys prefixed with acnhex_
const KEYS = {
  cart: 'acnhex_cart',
  wishlist: 'acnhex_wishlist',
  prefix: 'acnhex_prefix',
  seenIntro: 'acnhex_seen_intro',
  loadMode: 'acnhex_load_mode',
  wishlists: 'acnhex_wishlists',
  soundEnabled: 'acnhex_sound_enabled',
  soundVolume: 'acnhex_sound_volume',
  adsEnabled: 'acnhex_ads_enabled',
  adsBanners: 'acnhex_ads_banners',
  adsInterstitials: 'acnhex_ads_interstitials',
  adsPopups: 'acnhex_ads_popups',
  adsFloating: 'acnhex_ads_floating',
  cookieDismissed: 'acnhex_cookie_dismissed',
  seenExportInfo: 'acnhex_seen_export_info',
  theme: 'acnhex_theme',
  recentlyViewed: 'acnhex_recent',
};

function get(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function set(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function getCart() { return get(KEYS.cart, []); }
export function setCart(cart) { set(KEYS.cart, cart); }

export function getWishlist() { return get(KEYS.wishlist, []); }
export function setWishlist(list) { set(KEYS.wishlist, list); }

export function getPrefix() { return get(KEYS.prefix, '!'); }
export function setPrefix(p) { set(KEYS.prefix, p); }

export function getSeenIntro() { return get(KEYS.seenIntro, false); }
export function setSeenIntro(v) { set(KEYS.seenIntro, v); }

export function getLoadMode() { return get(KEYS.loadMode, 'batch'); }
export function setLoadMode(m) { set(KEYS.loadMode, m); }

export function getWishlists() { return get(KEYS.wishlists, null); }
export function setWishlists(data) { set(KEYS.wishlists, data); }

export function getSeenExportInfo() { return get(KEYS.seenExportInfo, false); }
export function setSeenExportInfo(v) { set(KEYS.seenExportInfo, v); }

export function getTheme() { return get(KEYS.theme, 'system'); }
export function setTheme(t) { set(KEYS.theme, t); }

export function getRecentlyViewed() { return get(KEYS.recentlyViewed, []); }
export function setRecentlyViewed(items) { set(KEYS.recentlyViewed, items); }

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
