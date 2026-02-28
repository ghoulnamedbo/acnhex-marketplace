// ─── Shared Helper Functions ───
// Common utilities used across multiple page modules

// Check if item variant is in the Loved Items list (first list)
export function isInLovedList(state, id, variantIdx = 0) {
  const lovedList = state.wishlists.lists[0];
  if (!lovedList) return false;
  return lovedList.items.some(w => w.id === id && w.variantIdx === variantIdx);
}

// Check if item is in any custom list (index 1+)
export function isInCustomList(state, id, variantIdx = 0) {
  return state.wishlists.lists.slice(1).some(list =>
    list.items.some(w => w.id === id && w.variantIdx === variantIdx)
  );
}

// Check if item variant is in any wishlist
export function isInWishlist(state, id, variantIdx = 0) {
  return state.wishlists.lists.some(list =>
    list.items.some(w => w.id === id && w.variantIdx === variantIdx)
  );
}

// Find which list contains an item
export function findItemList(state, id, variantIdx = 0) {
  return state.wishlists.lists.find(list =>
    list.items.some(w => w.id === id && w.variantIdx === variantIdx)
  );
}

// Get cart total count
export function getCartTotal(state) {
  return state.cart.length;
}

// Get quantity of specific item+variant in cart
export function getCartQtyForItem(state, itemId, variantIdx) {
  return state.cart.filter(c => c.id === itemId && c.variantIdx === variantIdx).length;
}

// Get shortened hex code (last 4 characters)
export function getShortHex(hex) {
  if (!hex) return '';
  return hex.length > 6 ? hex.slice(-4).toUpperCase() : hex.toUpperCase();
}
