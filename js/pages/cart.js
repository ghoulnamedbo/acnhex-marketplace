// ─── Cart Page ───
// Order ledger with bot command generation and past orders

import { esc } from '../utils.js';
import * as data from '../data.js';
import * as storage from '../storage.js';

// ─── Constants ───
const CART_EMPTY_QUOTES = [
  "Your pockets are empty! Time to go shopping, hm?",
  "No items? Nook Inc. believes in you! Browse away!",
  "Even a journey of 40 items begins with a single add!",
  "Tom Nook is tapping his foot… go find something nice!",
];

// ─── Helpers ───
export function getShortHex(hex) {
  if (!hex) return '';
  return hex.length > 6 ? hex.slice(-4).toUpperCase() : hex.toUpperCase();
}

export function getCartTotal(state) {
  return state.cart.length;
}

// ─── Render Functions ───
export function renderCart(state) {
  const cart = state.cart;
  const prefix = state.prefix;
  const total = getCartTotal(state);
  const hexes = cart.map(c => c.hex);
  const uniqueItems = new Set(cart.map(c => `${c.id}_${c.variantIdx ?? 0}`)).size;

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
          <div class="ledger-progress-fill ${total > 35 ? 'danger' : ''}" data-target-width="${(total / 40) * 100}"></div>
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
            <div class="ledger-row-link" data-cart-item-id="${esc(item.id)}" data-cart-item-vi="${item.variantIdx ?? 0}">
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
            </div>
            <button class="ledger-dupe-btn" data-dupe-idx="${idx}" ${getCartTotal(state) >= 40 ? 'disabled' : ''}>+</button>
            <button class="ledger-remove-btn" data-remove-idx="${idx}">✕</button>
          </div>`).join('')}
      </div>

      <!-- Order Summary -->
      <div class="cart-summary-line">${uniqueItems} unique item${uniqueItems !== 1 ? 's' : ''}, ${total} total</div>

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

    ${renderPastOrders()}
  </div>`;
}

export function renderPastOrders() {
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
