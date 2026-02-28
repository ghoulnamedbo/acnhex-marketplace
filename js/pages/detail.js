// ─── Item Detail Page ───
// Full item detail with orbit variant carousel, reviews, similar items, and compare mode

import { esc } from '../utils.js';
import { ICONS } from '../shared/icons.js';
import { isInLovedList, isInCustomList, isInWishlist, getCartTotal } from '../shared/helpers.js';
import * as data from '../data.js';
import * as reviews from '../reviews.js';

// ─── Module-level caches ───
let _reviewCache = { itemId: null, data: null };
let _similarCache = { itemId: null, matches: null, badgeText: null };

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

export { thumbBgs };

// Style tags for similar items matching
const STYLE_TAGS = new Set(['active','cool','cute','elegant','gorgeous','simple']);

// ─── Clear caches when needed ───
export function clearDetailCaches() {
  _reviewCache = { itemId: null, data: null };
  _similarCache = { itemId: null, matches: null, badgeText: null };
}

// ─── Similar Items Section ───
async function renderSimilarItems(state, item) {
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
      const inWL = isInWishlist(state, o.id, 0);
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

    return `<div class="similar-section similar-section-padding">
      <div class="similar-header">
        <h4 class="label-upper similar-header-label"><span class="similar-header-emoji">🍃</span> SIMILAR ITEMS</h4>
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

// ─── Main Detail Page Render ───
export async function renderDetail(state) {
  if (!state.itemDetail) {
    return `<div class="page"><div class="loading"><div class="spinner"></div><p class="text-secondary">Loading...</p></div></div>`;
  }

  const item = state.itemDetail;
  const vi = state.selectedVariantIdx;
  const variant = item.variants[vi] || item.variants[0];
  const bg = data.getItemBg(0);
  const inLoved = isInLovedList(state, item.id, vi);
  const cartFull = getCartTotal(state) >= 40;
  const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;

  let reviewData;
  if (_reviewCache.itemId === item.id && _reviewCache.data) {
    reviewData = _reviewCache.data;
  } else {
    reviewData = await reviews.generateReviewSection(item);
    _reviewCache = { itemId: item.id, data: reviewData };
  }

  const similarHtml = await renderSimilarItems(state, item);

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
            const variantInLoved = isInLovedList(state, item.id, idx);
            const variantInCustom = isInCustomList(state, item.id, idx);
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${variantInLoved ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              ${variantInCustom ? '<div class="variant-orbit-list-dot">📋</div>' : ''}
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
            const variantInLoved = isInLovedList(state, item.id, idx);
            const variantInCustom = isInCustomList(state, item.id, idx);
            return `<div class="variant-orbit-item${isCenter ? ' variant-orbit-item--active' : ''}"
              data-variant-orbit="${idx}"
              data-orbit-pos="${pos}"
              data-bg="${thumbBgs[idx % thumbBgs.length]}">
              ${variantInLoved ? '<div class="variant-orbit-heart-dot">♥</div>' : ''}
              ${variantInCustom ? '<div class="variant-orbit-list-dot">📋</div>' : ''}
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
        <div class="detail-section-header">
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

    ${renderVariantDrawer(state, item, vi, thumbBgs)}
    ${renderCompareTray(state, item, thumbBgs)}
    ${renderDetailedView(state, item, vi, thumbBgs)}
  </div>`;
}

// ─── Variant Drawer Render ───
function renderVariantDrawer(state, item, vi, thumbBgs) {
  return `<div class="variant-drawer-backdrop${state.variantDrawerOpen ? ' variant-drawer-backdrop--open' : ''}" data-action="close-variant-drawer"></div>
    <div class="variant-drawer${state.variantDrawerOpen ? ' variant-drawer--open' : ''}">
      <div class="variant-drawer-handle"></div>
      <div class="variant-drawer-header">
        <span class="label-upper">All Variants</span>
        <span class="text-secondary">${item.variants.length} variants</span>
      </div>
      <div class="variant-drawer-table-header">
        <span></span><span>NAME</span><span>CLR 1</span><span>CLR 2</span><span>HEX</span>
      </div>
      <div class="variant-drawer-scroll">
        ${item.variants.map((v, idx) => {
          const isSel = idx === vi;
          const variantInLoved = isInLovedList(state, item.id, idx);
          const variantInCustom = isInCustomList(state, item.id, idx);
          return `<button class="variant-drawer-row${isSel ? ' variant-drawer-row--selected' : ''}" data-drawer-variant="${idx}">
            <div class="variant-drawer-thumb" style="background:${thumbBgs[idx % thumbBgs.length]}">
              <img src="${esc(v.image)}" alt="${esc(v.name)}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
              <span style="display:none;font-size:16px;">📦</span>
              ${variantInLoved ? '<div class="variant-drawer-heart-dot">♥</div>' : ''}
              ${variantInCustom ? '<div class="variant-drawer-list-dot">📋</div>' : ''}
            </div>
            <span class="variant-drawer-name">${esc(v.name)}</span>
            <span class="variant-drawer-color">${esc(v.color1 || '-')}</span>
            <span class="variant-drawer-color">${esc(v.color2 || '-')}</span>
            <span class="hex-copy-badge" data-hex="${esc(v.hexVariated || v.hex || item.hexBase)}">${esc((v.hexVariated || v.hex || item.hexBase).slice(-4).toUpperCase())}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="variant-drawer-footer">
        <button class="variant-drawer-add-all-btn" id="add-all-variants-to-list">
          <span>💚</span> Add all ${item.variants.length} variants to list
        </button>
      </div>
    </div>`;
}

// ─── Compare Tray Render ───
function renderCompareTray(state, item, thumbBgs) {
  if (item.variants.length < 8) return '';

  return `<div class="compare-tray${state.compareModalOpen ? ' compare-tray--open' : ''}">
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
    ${state.compareZoomIdx !== null ? renderCompareZoomCard(state, item, thumbBgs) : ''}`;
}

// ─── Compare Zoom Card Render ───
function renderCompareZoomCard(state, item, thumbBgs) {
  const zv = item.variants[state.compareZoomIdx];
  const zhex = zv.hexVariated || zv.hex || item.hexBase;
  const qtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === state.compareZoomIdx).length;
  const cartFull = getCartTotal(state) >= 40;
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
}

// ─── Detailed View Card Render ───
function renderDetailedView(state, item, vi, thumbBgs) {
  if (!state.detailedViewOpen) return '';

  const dv = item.variants[vi];
  const dvHex = dv.hexVariated || dv.hex || item.hexBase;
  const dvQtyInCart = state.cart.filter(c => c.id === item.id && c.variantIdx === vi).length;
  const dvCartFull = getCartTotal(state) >= 40;
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
}
