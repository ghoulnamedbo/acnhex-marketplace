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
