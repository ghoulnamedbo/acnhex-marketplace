// ─── Wishlist Page ───
// Multi-list wishlist system with collection progress tracker

import { esc } from '../utils.js';
import { ICONS } from '../shared/icons.js';
import * as data from '../data.js';

// Module-level state for wishlist detail rendering
let lastRenderedListHexes = [];

export function getLastRenderedListHexes() {
  return lastRenderedListHexes;
}

// ─── Helpers ───
export function getTotalWishlistItems(state) {
  return state.wishlists.lists.reduce((sum, l) => sum + l.items.length, 0);
}

export function getCollectionProgress(state) {
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

// ─── Render Functions ───
export async function renderWishlist(state) {
  if (state.viewingListId) return renderWishlistDetail(state);

  const lists = state.wishlists.lists;
  const totalItems = getTotalWishlistItems(state);

  const progress = getCollectionProgress(state);
  const overallPct = progress.totalItems > 0 ? ((progress.totalWishlisted / progress.totalItems) * 100).toFixed(1) : 0;

  return `<div class="page">
    <div class="page-header page-header--flex">
      <div>
        <h1 class="heading-xl mb-4">Wishlist</h1>
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
      <div class="content-wrapper--flex">
        ${lists.map(list => {
          // Get first 4 items for thumbnail preview
          const thumbItems = list.items.slice(0, 4);
          const extraCount = list.items.length > 4 ? list.items.length - 4 : 0;
          return `
          <div class="wishlist-item${list.id !== '__loved__' ? ' draggable-list' : ''}" data-view-list="${esc(list.id)}" tabindex="0" role="button" style="cursor:pointer;border-left:${list.id === '__loved__' ? '4px solid var(--pines)' : '4px solid transparent'}">
            ${list.id !== '__loved__' ? `<div class="wl-drag-handle" data-drag-handle="${esc(list.id)}">☰</div>` : ''}
            <div class="wl-emoji-icon${list.id !== '__loved__' ? ' wl-emoji-editable' : ''}" ${list.id !== '__loved__' ? `data-edit-emoji="${esc(list.id)}"` : ''} style="background:${list.id === '__loved__' ? 'var(--tag-bg)' : 'var(--bg)'}">
              <span class="emoji-fallback">${list.emoji || (list.id === '__loved__' ? '💚' : '📋')}</span>
              ${list.id !== '__loved__' ? '<div class="wl-emoji-edit-badge">✎</div>' : ''}
            </div>
            <div class="wl-list-inner">
              <div class="wl-list-header-row">
                <p class="wl-list-name wl-list-name-text">${esc(list.name)}</p>
                ${list.id !== '__loved__' ? `
                <div class="wl-action-btns">
                  <button class="wl-rename-btn" data-rename-list="${esc(list.id)}" title="Rename list">✏</button>
                  <button class="wl-dup-btn" data-dup-list="${esc(list.id)}" title="Duplicate list">⧉</button>
                  <button class="remove-btn" data-delete-list="${esc(list.id)}">${ICONS.trash}</button>
                </div>` : ''}
              </div>
              <p class="wl-list-count">${list.items.length} items${list.items.length > 40 ? ` · ${Math.ceil(list.items.length / 40)} orders` : ''}</p>
              ${thumbItems.length > 0 ? `
              <div class="wl-thumb-strip">
                ${thumbItems.map((it, i) => `<div class="wl-thumb" style="background:${data.getItemBg(i)}" data-thumb-item="${esc(it.id)}" data-thumb-vi="${it.variantIdx || 0}"></div>`).join('')}
                ${extraCount > 0 ? `<div class="wl-thumb-extra">+${extraCount}</div>` : ''}
              </div>` : ''}
            </div>
            ${list.id === '__loved__' ? '<div class="wl-list-chevron">›</div>' : ''}
          </div>`;
        }).join('')}
      </div>`}

    <div class="create-list-wrapper">
      <button class="cta-btn-secondary" id="create-new-list" style="width:100%">+ Create New List</button>
    </div>
  </div>`;
}

export async function renderWishlistDetail(state) {
  const list = state.wishlists.lists.find(l => l.id === state.viewingListId);
  if (!list) { return ''; } // Caller should handle this case

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
    <div class="wl-detail-header">
      <div class="wl-detail-header-left">
        <button class="glass-btn glass-btn--static" id="list-back">${ICONS.chevronLeft}</button>
        <div class="wl-detail-title-wrap">
          <div class="wl-detail-title-row">
            <span class="wl-detail-emoji">${listEmoji}</span>
            <h2 class="wl-detail-title">${esc(list.name)}</h2>
          </div>
          <p class="wl-detail-count">${itemCountText}</p>
        </div>
      </div>
    </div>

    ${entries.length > 0 && list.id !== '__loved__' ? `
    <div class="wl-export-row">
      <button class="export-btn" id="export-list-btn">📤 Export List</button>
      <button class="export-btn share-image-btn" id="share-image-btn">📸 Share as Image</button>
    </div>` : ''}

    ${entries.length === 0 ? `
      <div class="wl-empty-state">
        <div class="wl-empty-emoji">${listEmoji}</div>
        <div class="wl-empty-title">${list.id === '__loved__' ? 'No loved items yet' : 'This list is feeling lonely!'}</div>
        <div class="wl-empty-text">${list.id === '__loved__'
          ? 'Tap ♡ on any item to start your collection'
          : 'Browse some items to fill it up 🍃'}</div>
        <button class="cta-btn mt-20" id="start-browsing-btn" style="padding:12px 24px;border-radius:50px">Start Browsing</button>
      </div>` : `
      ${entries.length <= 40 && entries.length > 0 ? `
      <div class="px-20 pb-10 flex-row justify-end">
        <button class="select-all-btn" id="wl-select-all">${state.wishlistSelected.size === entries.length ? '☑ Deselect All' : '☐ Select All'}</button>
      </div>` : ''}
      <div class="wishlist-items-wrapper" id="wishlist-items-container">
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
                <div class="wl-left-half wl-item-link" data-item="${esc(item.id)}" data-vi="${vi}" tabindex="0" role="button">
                  <div class="wishlist-detail-thumb" style="background:${data.getItemBg(globalIdx)}">
                    ${item.img ? `<img src="${esc(item.img)}" style="width:38px;height:38px;object-fit:contain" onerror="this.outerHTML='📦'" alt="">` : '📦'}
                  </div>
                  <div class="wl-item-info">
                    <div class="wl-item-name">${esc(item.n)}</div>
                    <div class="wl-item-meta">
                      ${esc(item.v1)}
                      <span class="wl-hex-pill">${esc(item.hex.slice(-4))}</span>
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
      <div class="receipt-section">
        <div class="receipt-tear-line">
          <span class="receipt-tear-label">✂ tear here</span>
        </div>
        <div class="receipt-header-row">
          <span class="receipt-header-label">Bot Command${entries.length > 40 ? 's' : ''}</span>
          <span class="receipt-header-count">${entries.length} items</span>
        </div>
        ${entries.length > 40 ? `
        <div class="receipt-split-notice">
          <span class="receipt-split-icon">📦</span>
          <span class="receipt-split-text">Split into ${Math.ceil(entries.length / 40)} orders (40-item bot limit per order)</span>
        </div>` : ''}
        ${(() => {
          const chunks = [];
          for (let i = 0; i < entries.length; i += 40) {
            chunks.push(entries.slice(i, i + 40));
          }
          return chunks.map((chunk, chunkIdx) => `
            <div class="receipt-block copy-list-order-chunk${chunkIdx > 0 ? ' mt-12' : ''}" data-chunk-idx="${chunkIdx}" ${chunks.length === 1 ? 'id="copy-list-order"' : ''}>
              <div class="receipt-tape"></div>
              ${chunks.length > 1 ? `<div class="receipt-chunk-label">Order ${chunkIdx + 1} of ${chunks.length}</div>` : ''}
              <div class="receipt-barcode">${Array.from({length:30}, () => `<span style="width:${Math.random()>.5?3:1.5}px"></span>`).join('')}</div>
              <div class="receipt-ship-to">SHIP TO: Discord</div>
              ${chunk.map(item => `<div class="receipt-item"><span>• ${esc(item.n)}</span><span class="hex">${esc(item.hex.slice(-4))}</span></div>`).join('')}
              <div class="receipt-cmd">${esc(state.prefix)}order ${chunk.map(e => e.hex).join(' ')}</div>
              <div class="receipt-copy-hint">📋 tap to copy</div>
            </div>
          `).join('');
        })()}
        <div class="receipt-nook-footer">✦ NOOK INC. CERTIFIED ✦</div>
      </div>` : ''}`}
  </div>`;
}
