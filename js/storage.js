// localStorage wrapper — all keys prefixed with acnhex_
const KEYS = {
  cart: 'acnhex_cart',
  wishlist: 'acnhex_wishlist',
  prefix: 'acnhex_prefix',
  seenIntro: 'acnhex_seen_intro',
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

export function clearAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
