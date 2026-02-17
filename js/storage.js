/**
 * Storage module - handles all localStorage operations
 * Manages: prefix, wishlist, cart
 */

const Storage = {
  KEYS: {
    PREFIX: 'acnhex_prefix',
    WISHLIST: 'acnhex_wishlist',
    CART: 'acnhex_cart'
  },

  // ============ PREFIX ============

  getPrefix() {
    return localStorage.getItem(this.KEYS.PREFIX) || null;
  },

  setPrefix(prefix) {
    localStorage.setItem(this.KEYS.PREFIX, prefix.trim());
  },

  hasPrefix() {
    const prefix = this.getPrefix();
    return prefix !== null && prefix.length > 0;
  },

  // ============ WISHLIST ============
  // Stored as array of item identifiers: { name, filename }

  getWishlist() {
    const data = localStorage.getItem(this.KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  },

  addToWishlist(item) {
    const wishlist = this.getWishlist();
    // Use filename as unique identifier since names can repeat
    if (!wishlist.some(w => w.filename === item.filename)) {
      wishlist.push({
        name: item.name,
        filename: item.filename
      });
      localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(wishlist));
    }
  },

  removeFromWishlist(filename) {
    const wishlist = this.getWishlist();
    const filtered = wishlist.filter(w => w.filename !== filename);
    localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(filtered));
  },

  isInWishlist(filename) {
    const wishlist = this.getWishlist();
    return wishlist.some(w => w.filename === filename);
  },

  // ============ CART ============
  // Stored as array: { name, filename, variation, hexId, hexIdFull, image, quantity }

  getCart() {
    const data = localStorage.getItem(this.KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  addToCart(item, quantity = 1) {
    const cart = this.getCart();
    const totalItems = this.getCartTotalCount();

    // Check 40-item cap
    if (totalItems + quantity > 40) {
      return { success: false, message: `Cannot add ${quantity} items. Cart limit is 40 items. You have ${totalItems} items.` };
    }

    // Check if same item+variation exists
    const existingIndex = cart.findIndex(c => c.filename === item.filename);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        name: item.name,
        filename: item.filename,
        variation: item.variation || 'NA',
        hexId: item.hexId,
        hexIdFull: item.hexIdFull || item.hexId,
        image: item.image,
        quantity: quantity
      });
    }

    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    return { success: true };
  },

  updateCartQuantity(filename, quantity) {
    const cart = this.getCart();
    const item = cart.find(c => c.filename === filename);

    if (item) {
      const currentTotal = this.getCartTotalCount();
      const difference = quantity - item.quantity;

      if (currentTotal + difference > 40) {
        return { success: false, message: 'Cannot exceed 40 items in cart.' };
      }

      item.quantity = quantity;
      localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    }
    return { success: true };
  },

  removeFromCart(filename) {
    const cart = this.getCart();
    const filtered = cart.filter(c => c.filename !== filename);
    localStorage.setItem(this.KEYS.CART, JSON.stringify(filtered));
  },

  clearCart() {
    localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
  },

  getCartTotalCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // ============ CLEAR ALL ============

  clearAllData() {
    localStorage.removeItem(this.KEYS.PREFIX);
    localStorage.removeItem(this.KEYS.WISHLIST);
    localStorage.removeItem(this.KEYS.CART);
  }
};

export default Storage;
