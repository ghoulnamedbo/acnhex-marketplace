/**
 * Main App Module - handles routing, UI state, and coordination
 */

import Storage from './storage.js';
import Data from './data.js';

const App = {
  currentPage: 'home',
  currentItem: null,
  filters: {
    category: 'all',
    catalog: null,
    style: null,
    set: null,
    color: null,
    search: ''
  },

  // Pagination
  itemsPerPage: 50,
  currentlyShown: 0,
  filteredItems: [],

  // Item detail state
  selectedVariantIndex: 0,
  quantity: 1,

  // Color mapping for swatches
  colorMap: {
    'White': '#FFFFFF',
    'Black': '#2D2D2D',
    'Gray': '#808080',
    'Red': '#E74C3C',
    'Orange': '#E67E22',
    'Yellow': '#F1C40F',
    'Green': '#27AE60',
    'Blue': '#3498DB',
    'Aqua': '#00CED1',
    'Purple': '#9B59B6',
    'Pink': '#FF69B4',
    'Brown': '#8B4513',
    'Beige': '#D4B896',
    'Colorful': 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #FFE66D)',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0',
    'Copper': '#B87333'
  },

  async init() {
    console.log('Initializing ACNHEX...');

    // Register service worker
    this.registerServiceWorker();

    // Load data
    await Data.load();

    // Setup event listeners
    this.setupEventListeners();

    // Check for prefix
    if (!Storage.hasPrefix()) {
      this.showPrefixModal();
    } else {
      this.navigateTo('home');
    }

    // Update cart badge
    this.updateCartBadge();
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  },

  setupEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.navigateTo(page);
      });
    });

    // Cart icon in header
    document.getElementById('cart-btn').addEventListener('click', () => {
      this.showCart();
    });

    // Prefix modal submit
    const prefixInput = document.getElementById('prefix-input');
    const prefixSubmit = document.getElementById('prefix-submit');

    prefixSubmit.addEventListener('click', () => {
      this.handlePrefixSubmit();
    });

    // Allow Enter key to submit prefix
    prefixInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handlePrefixSubmit();
      }
    });

    // Close modals on backdrop click (except prefix modal if no prefix saved)
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          // Don't allow closing prefix modal if no prefix is set
          if (modal.id === 'prefix-modal' && !Storage.hasPrefix()) {
            return;
          }
          this.closeModal(modal.id);
        }
      });
    });
  },

  // ============ PREFIX HANDLING ============

  handlePrefixSubmit() {
    const input = document.getElementById('prefix-input');
    const prefix = input.value.trim();

    if (!prefix) {
      this.showToast('Please enter a prefix');
      input.focus();
      return;
    }

    // Save prefix
    Storage.setPrefix(prefix);

    // Close modal and navigate to home
    this.closeModal('prefix-modal');
    this.navigateTo('home');

    this.showToast(`Prefix "${prefix}" saved!`);
  },

  // ============ NAVIGATION ============

  navigateTo(page) {
    this.currentPage = page;

    // Update nav active state (hide active for item-detail)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Show/hide bottom nav on item detail page
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = page === 'item-detail' ? 'none' : 'flex';
    }

    // Adjust body padding for item detail page
    document.body.style.paddingBottom = page === 'item-detail' ? '0' : '90px';

    // Render page content
    const content = document.getElementById('main-content');

    switch (page) {
      case 'home':
        this.renderHome(content);
        break;
      case 'wishlist':
        this.renderWishlist(content);
        break;
      case 'settings':
        this.renderSettings(content);
        break;
      case 'item-detail':
        this.renderItemDetail(content);
        break;
    }
  },

  // ============ CART BADGE ============

  updateCartBadge() {
    const count = Storage.getCartTotalCount();
    const badge = document.getElementById('cart-badge');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  // ============ MODALS ============

  showPrefixModal() {
    document.getElementById('prefix-modal').classList.add('active');
  },

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  },

  showCart() {
    this.renderCart();
    document.getElementById('cart-modal').classList.add('active');
  },

  showItemDetail(item) {
    this.currentItem = item;
    this.selectedVariantIndex = 0;
    this.quantity = 1;
    this.navigateTo('item-detail');
  },

  // ============ TOAST NOTIFICATIONS ============

  showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  },

  // ============ RENDER METHODS ============

  renderHome(container) {
    // Build category chips HTML
    const categoryChipsHtml = Data.categories.map(cat => `
      <button class="category-chip ${this.filters.category === cat ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    // Determine section title
    const sectionTitle = this.filters.search ? 'SEARCH RESULTS' : 'ALL ITEMS';

    container.innerHTML = `
      <div class="home-page">
        <!-- Search and Filter -->
        <div class="search-container">
          <div class="search-bar">
            <img src="./Assets/Search.png" alt="Search">
            <input
              type="text"
              id="search-input"
              placeholder="Search items..."
              value="${this.filters.search}"
              autocomplete="off"
              autocapitalize="off"
            >
          </div>
          <button id="filter-btn" class="filter-btn">
            <img src="./Assets/Filter_icon.png" alt="Filter">
            FILTER
          </button>
        </div>

        <!-- Category Chips -->
        <div class="category-chips">
          <button class="category-chip ${this.filters.category === 'all' ? 'active' : ''}" data-category="all">
            All
          </button>
          ${categoryChipsHtml}
        </div>

        <!-- Section Title -->
        <div class="section-title">${sectionTitle}</div>

        <!-- Item Grid -->
        <div id="item-grid" class="item-grid"></div>

        <!-- Load More Button -->
        <div id="load-more-container" class="load-more-container"></div>
      </div>
    `;

    // Setup home page event listeners
    this.setupHomeEventListeners();

    // Initial item grid render
    this.currentlyShown = 0;
    this.updateItemGrid(true);
  },

  setupHomeEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('search-input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filters.search = e.target.value.trim();
        this.updateItemGrid();
        // Update section title
        const titleEl = document.querySelector('.section-title');
        if (titleEl) {
          titleEl.textContent = this.filters.search ? 'SEARCH RESULTS' : 'ALL ITEMS';
        }
      }, 300);
    });

    // Category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.filters.category = category;

        // Update active state
        document.querySelectorAll('.category-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.category === category);
        });

        this.updateItemGrid();
      });
    });

    // Filter button
    document.getElementById('filter-btn').addEventListener('click', () => {
      this.showFilterModal();
    });
  },

  updateItemGrid(reset = false) {
    // Get filtered items
    this.filteredItems = Data.filterItems(this.filters);

    const grid = document.getElementById('item-grid');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (!grid) return;

    // Reset pagination if needed
    if (reset) {
      this.currentlyShown = 0;
      grid.innerHTML = '';
    }

    // Get next batch of items
    const startIndex = this.currentlyShown;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredItems.length);
    const itemsToShow = this.filteredItems.slice(startIndex, endIndex);

    // Render item cards
    if (itemsToShow.length === 0 && this.currentlyShown === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-title">No items found</div>
          <div class="empty-state-text">Try adjusting your search or filters</div>
        </div>
      `;
      loadMoreContainer.innerHTML = '';
      return;
    }

    // Append new cards
    const cardsHtml = itemsToShow.map(item => this.renderItemCard(item)).join('');
    grid.insertAdjacentHTML('beforeend', cardsHtml);

    this.currentlyShown = endIndex;

    // Setup listeners for new cards
    this.setupItemCardListeners();

    // Show/hide load more button
    if (this.currentlyShown < this.filteredItems.length) {
      const remaining = this.filteredItems.length - this.currentlyShown;
      loadMoreContainer.innerHTML = `
        <button id="load-more-btn" class="btn btn-secondary load-more-btn">
          Load More (${remaining} remaining)
        </button>
      `;
      document.getElementById('load-more-btn').addEventListener('click', () => {
        this.updateItemGrid(false);
      });
    } else {
      loadMoreContainer.innerHTML = this.currentlyShown > 0 ? `
        <p class="items-count">${this.filteredItems.length} items total</p>
      ` : '';
    }
  },

  renderItemCard(item) {
    // Get first variant for display
    const defaultVariant = item.variants[0];
    const isWishlisted = Storage.isInWishlist(defaultVariant.filename);

    // Get unique colors from variants (max 5 swatches)
    const colors = [...new Set(item.variants.map(v => v.color1).filter(c => c))].slice(0, 5);

    // Build color swatches HTML
    const swatchesHtml = colors.map(color => {
      const bgColor = this.colorMap[color] || '#CCCCCC';
      const isGradient = bgColor.includes('gradient');
      const style = isGradient ? `background: ${bgColor}` : `background-color: ${bgColor}`;
      return `<div class="color-swatch" style="${style}" title="${color}"></div>`;
    }).join('');

    // Encode item data for the card
    const itemKey = `${item.category}::${item.name}`;

    return `
      <div class="item-card" data-item-key="${itemKey}">
        <button class="item-card-add" data-item-key="${itemKey}" title="Quick add to cart">
          <img src="./Assets/Add_to_bag_icon.png" alt="Add">
        </button>
        <button class="item-card-wishlist" data-filename="${defaultVariant.filename}" title="Add to wishlist">
          <img src="./Assets/${isWishlisted ? 'Wishlistbutton_active' : 'Wishlistbutton_unactive'}.png" alt="Wishlist">
        </button>
        <div class="item-card-image">
          <img src="${defaultVariant.image}" alt="${item.name}" loading="lazy" onerror="this.src='./Assets/logo_header.png'">
        </div>
        <div class="item-card-name" title="${item.name}">${item.name}</div>
        <div class="item-card-colors">${swatchesHtml}</div>
      </div>
    `;
  },

  setupItemCardListeners() {
    // Card click - open detail modal
    document.querySelectorAll('.item-card').forEach(card => {
      // Remove existing listeners by cloning (prevents duplicates)
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);

      newCard.addEventListener('click', (e) => {
        // Ignore clicks on buttons
        if (e.target.closest('.item-card-wishlist') || e.target.closest('.item-card-add')) {
          return;
        }

        const itemKey = newCard.dataset.itemKey;
        const [category, name] = itemKey.split('::');
        const item = Data.getItem(category, name);

        if (item) {
          this.showItemDetail(item);
        }
      });

      // Wishlist button
      const wishlistBtn = newCard.querySelector('.item-card-wishlist');
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const filename = wishlistBtn.dataset.filename;
        this.toggleWishlist(filename, wishlistBtn);
      });

      // Quick add button
      const addBtn = newCard.querySelector('.item-card-add');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemKey = addBtn.dataset.itemKey;
        const [category, name] = itemKey.split('::');
        const item = Data.getItem(category, name);

        if (item) {
          // If single variant, add directly; otherwise open detail modal
          if (item.variants.length === 1) {
            this.quickAddToCart(item, item.variants[0]);
          } else {
            this.showItemDetail(item);
          }
        }
      });
    });
  },

  toggleWishlist(filename, buttonEl) {
    const isWishlisted = Storage.isInWishlist(filename);

    if (isWishlisted) {
      Storage.removeFromWishlist(filename);
      buttonEl.querySelector('img').src = './Assets/Wishlistbutton_unactive.png';
      this.showToast('Removed from wishlist');
    } else {
      const result = Data.getItemByFilename(filename);
      if (result) {
        Storage.addToWishlist({
          name: result.item.name,
          filename: filename
        });
        buttonEl.querySelector('img').src = './Assets/Wishlistbutton_active.png';
        this.showToast('Added to wishlist');
      }
    }
  },

  quickAddToCart(item, variant) {
    const result = Storage.addToCart({
      name: item.name,
      filename: variant.filename,
      variation: variant.variation,
      hexId: variant.hexId,
      hexIdFull: variant.hexIdFull,
      image: variant.image
    }, 1);

    if (result.success) {
      this.updateCartBadge();
      this.showToast(`Added ${item.name} to cart`);
    } else {
      this.showToast(result.message);
    }
  },

  showFilterModal() {
    // Get unique values for filters
    const styles = Data.getUniqueValues('style1');
    const sets = Data.getUniqueValues('hhaSet');
    const colors = Data.getUniqueColors();

    // Catalog options
    const catalogOptions = ['For sale', 'Not for sale', 'Not in catalog'];

    // Build filter modal content
    const filterContent = document.getElementById('filter-content');
    filterContent.innerHTML = `
      <div class="filter-modal-inner">
        <h2 class="modal-title">Filters</h2>

        <!-- Catalog Filter -->
        <div class="filter-group">
          <label class="filter-label">Catalogue Status</label>
          <div class="filter-chips">
            <button class="filter-chip ${!this.filters.catalog ? 'active' : ''}" data-filter="catalog" data-value="">
              All
            </button>
            ${catalogOptions.map(opt => `
              <button class="filter-chip ${this.filters.catalog === opt ? 'active' : ''}" data-filter="catalog" data-value="${opt}">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Style Filter -->
        <div class="filter-group">
          <label class="filter-label">Style</label>
          <select id="filter-style" class="filter-select">
            <option value="">All Styles</option>
            ${styles.map(style => `
              <option value="${style}" ${this.filters.style === style ? 'selected' : ''}>${style}</option>
            `).join('')}
          </select>
        </div>

        <!-- Set Filter -->
        <div class="filter-group">
          <label class="filter-label">Set</label>
          <select id="filter-set" class="filter-select">
            <option value="">All Sets</option>
            ${sets.map(set => `
              <option value="${set}" ${this.filters.set === set ? 'selected' : ''}>${set}</option>
            `).join('')}
          </select>
        </div>

        <!-- Color Filter -->
        <div class="filter-group">
          <label class="filter-label">Color</label>
          <div class="filter-colors">
            <button class="filter-color-btn ${!this.filters.color ? 'active' : ''}" data-color="" title="All Colors">
              <span class="filter-color-all">All</span>
            </button>
            ${colors.map(color => {
              const bgColor = this.colorMap[color] || '#CCCCCC';
              const isGradient = bgColor.includes('gradient');
              const style = isGradient ? `background: ${bgColor}` : `background-color: ${bgColor}`;
              const isActive = this.filters.color === color;
              return `
                <button class="filter-color-btn ${isActive ? 'active' : ''}" data-color="${color}" title="${color}">
                  <span class="filter-color-swatch" style="${style}"></span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="filter-actions">
          <button id="clear-filters-btn" class="btn btn-secondary">Clear All</button>
          <button id="apply-filters-btn" class="btn btn-primary">Apply Filters</button>
        </div>
      </div>
    `;

    // Show modal
    document.getElementById('filter-modal').classList.add('active');

    // Setup filter event listeners
    this.setupFilterListeners();
  },

  setupFilterListeners() {
    // Catalog chips
    document.querySelectorAll('[data-filter="catalog"]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-filter="catalog"]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Color buttons
    document.querySelectorAll('.filter-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Clear filters
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
      // Reset all filter UI
      document.querySelectorAll('[data-filter="catalog"]').forEach(c => {
        c.classList.toggle('active', c.dataset.value === '');
      });
      document.getElementById('filter-style').value = '';
      document.getElementById('filter-set').value = '';
      document.querySelectorAll('.filter-color-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.color === '');
      });
    });

    // Apply filters
    document.getElementById('apply-filters-btn').addEventListener('click', () => {
      // Get selected values
      const activeCatalog = document.querySelector('[data-filter="catalog"].active');
      const activeColor = document.querySelector('.filter-color-btn.active');

      this.filters.catalog = activeCatalog ? activeCatalog.dataset.value || null : null;
      this.filters.style = document.getElementById('filter-style').value || null;
      this.filters.set = document.getElementById('filter-set').value || null;
      this.filters.color = activeColor ? activeColor.dataset.color || null : null;

      // Close modal
      this.closeModal('filter-modal');

      // Update grid
      this.currentlyShown = 0;
      this.updateItemGrid(true);

      // Show toast with active filter count
      const activeCount = [this.filters.catalog, this.filters.style, this.filters.set, this.filters.color].filter(f => f).length;
      if (activeCount > 0) {
        this.showToast(`${activeCount} filter${activeCount > 1 ? 's' : ''} applied`);
      }
    });
  },

  renderWishlist(container) {
    const wishlist = Storage.getWishlist();

    // Build wishlist items
    let contentHtml = '';

    if (wishlist.length === 0) {
      contentHtml = `
        <div class="empty-state">
          <img src="./Assets/Wishlistbutton_unactive.png" alt="Empty" class="empty-state-icon">
          <div class="empty-state-title">Your wishlist is empty</div>
          <div class="empty-state-text">Tap the heart icon on items to add them here</div>
        </div>
      `;
    } else {
      // Build item cards from wishlist
      const cardsHtml = wishlist.map(wishlistItem => {
        const result = Data.getItemByFilename(wishlistItem.filename);
        if (!result) return '';

        const { item, variant } = result;

        // Get unique colors from all variants (max 5 swatches)
        const colors = [...new Set(item.variants.map(v => v.color1).filter(c => c))].slice(0, 5);
        const swatchesHtml = colors.map(color => {
          const bgColor = this.colorMap[color] || '#CCCCCC';
          const isGradient = bgColor.includes('gradient');
          const style = isGradient ? `background: ${bgColor}` : `background-color: ${bgColor}`;
          return `<div class="color-swatch" style="${style}" title="${color}"></div>`;
        }).join('');

        const itemKey = `${item.category}::${item.name}`;

        return `
          <div class="item-card" data-item-key="${itemKey}">
            <button class="item-card-add" data-item-key="${itemKey}" title="Add to cart">
              <img src="./Assets/Add_to_bag_icon.png" alt="Add">
            </button>
            <button class="item-card-wishlist" data-filename="${variant.filename}" title="Remove from wishlist">
              <img src="./Assets/Wishlistbutton_active.png" alt="Wishlist">
            </button>
            <div class="item-card-image">
              <img src="${variant.image}" alt="${item.name}" loading="lazy" onerror="this.src='./Assets/logo_header.png'">
            </div>
            <div class="item-card-name" title="${item.name}">${item.name}</div>
            <div class="item-card-colors">${swatchesHtml}</div>
          </div>
        `;
      }).join('');

      contentHtml = `
        <div class="section-title">MY WISHLIST</div>
        <div class="wishlist-count">${wishlist.length} item${wishlist.length !== 1 ? 's' : ''}</div>
        <div id="wishlist-grid" class="item-grid">
          ${cardsHtml}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="wishlist-page">
        ${contentHtml}
      </div>
    `;

    // Setup event listeners if there are items
    if (wishlist.length > 0) {
      this.setupWishlistListeners();
    }
  },

  setupWishlistListeners() {
    // Card click - open detail
    document.querySelectorAll('.wishlist-page .item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.item-card-wishlist') || e.target.closest('.item-card-add')) {
          return;
        }

        const itemKey = card.dataset.itemKey;
        const [category, name] = itemKey.split('::');
        const item = Data.getItem(category, name);

        if (item) {
          this.showItemDetail(item);
        }
      });

      // Wishlist button - remove from wishlist
      const wishlistBtn = card.querySelector('.item-card-wishlist');
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const filename = wishlistBtn.dataset.filename;
        Storage.removeFromWishlist(filename);
        this.showToast('Removed from wishlist');
        // Re-render the wishlist page
        this.renderWishlist(document.getElementById('main-content'));
      });

      // Add button
      const addBtn = card.querySelector('.item-card-add');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const itemKey = addBtn.dataset.itemKey;
        const [category, name] = itemKey.split('::');
        const item = Data.getItem(category, name);

        if (item) {
          if (item.variants.length === 1) {
            this.quickAddToCart(item, item.variants[0]);
          } else {
            this.showItemDetail(item);
          }
        }
      });
    });
  },

  renderSettings(container) {
    const currentPrefix = Storage.getPrefix() || '';

    container.innerHTML = `
      <div class="settings-page">
        <div class="section-title">SETTINGS</div>

        <!-- Prefix Section -->
        <div class="settings-section">
          <div class="settings-card">
            <div class="settings-card-header">
              <span class="settings-card-title">Bot Prefix</span>
            </div>
            <p class="settings-card-desc">
              Your Discord order bot prefix. Found in the "order bot help" channel.
            </p>
            <div class="prefix-edit-row">
              <input
                type="text"
                id="prefix-edit-input"
                class="input-field"
                value="${currentPrefix}"
                placeholder="e.g., *order"
              >
              <button id="save-prefix-btn" class="btn btn-primary save-prefix-btn">Save</button>
            </div>
          </div>
        </div>

        <!-- Data Management Section -->
        <div class="settings-section">
          <div class="settings-card settings-card-danger">
            <div class="settings-card-header">
              <span class="settings-card-title">Clear All Data</span>
            </div>
            <p class="settings-card-desc">
              This will delete your saved prefix, wishlist, and cart. You'll need to set up your prefix again.
            </p>
            <button id="clear-data-btn" class="btn btn-danger">Clear All Data</button>
          </div>
        </div>

        <!-- Install Instructions Section -->
        <div class="settings-section">
          <div class="settings-card">
            <div class="settings-card-header">
              <span class="settings-card-title">Add to Home Screen</span>
            </div>
            <p class="settings-card-desc">
              Install this app on your device for quick access and offline use.
            </p>

            <div class="install-instructions">
              <div class="install-platform">
                <div class="install-platform-title">
                  <span class="install-icon">🍎</span> iOS (Safari)
                </div>
                <ol class="install-steps">
                  <li>Tap the <strong>Share</strong> button (square with arrow) at the bottom of Safari</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right corner</li>
                </ol>
              </div>

              <div class="install-platform">
                <div class="install-platform-title">
                  <span class="install-icon">🤖</span> Android (Chrome)
                </div>
                <ol class="install-steps">
                  <li>Tap the <strong>three-dot menu</strong> (⋮) in the top right of Chrome</li>
                  <li>Tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></li>
                  <li>Tap <strong>"Add"</strong> to confirm</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- App Info -->
        <div class="settings-footer">
          <p>ACNHEX Marketplace</p>
          <p class="settings-footer-sub">Animal Crossing: New Horizons Order Helper</p>
        </div>
      </div>
    `;

    // Setup event listeners
    this.setupSettingsListeners();
  },

  setupSettingsListeners() {
    // Save prefix
    document.getElementById('save-prefix-btn').addEventListener('click', () => {
      const input = document.getElementById('prefix-edit-input');
      const newPrefix = input.value.trim();

      if (!newPrefix) {
        this.showToast('Please enter a prefix');
        input.focus();
        return;
      }

      Storage.setPrefix(newPrefix);
      this.showToast(`Prefix updated to "${newPrefix}"`);
    });

    // Allow Enter key to save prefix
    document.getElementById('prefix-edit-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('save-prefix-btn').click();
      }
    });

    // Clear all data
    document.getElementById('clear-data-btn').addEventListener('click', () => {
      this.showConfirmDialog(
        'Clear All Data?',
        'This will permanently delete your prefix, wishlist, and cart. This action cannot be undone.',
        'Clear Everything',
        () => {
          Storage.clearAllData();
          this.updateCartBadge();
          this.showToast('All data cleared');
          // Show prefix modal
          this.showPrefixModal();
        }
      );
    });
  },

  showConfirmDialog(title, message, confirmText, onConfirm) {
    // Create confirm dialog
    const dialog = document.createElement('div');
    dialog.className = 'modal active';
    dialog.id = 'confirm-dialog';
    dialog.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">${title}</h2>
        <p class="modal-text">${message}</p>
        <div class="confirm-actions">
          <button id="confirm-cancel" class="btn btn-secondary">Cancel</button>
          <button id="confirm-ok" class="btn btn-danger">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Event listeners
    document.getElementById('confirm-cancel').addEventListener('click', () => {
      dialog.remove();
    });

    document.getElementById('confirm-ok').addEventListener('click', () => {
      dialog.remove();
      onConfirm();
    });

    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });
  },

  renderCart() {
    const cart = Storage.getCart();
    const totalCount = Storage.getCartTotalCount();
    const prefix = Storage.getPrefix() || '*order';

    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
      cartContent.innerHTML = `
        <div class="cart-page">
          <div class="cart-header">
            <button id="cart-close-btn" class="back-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 class="cart-title">MY CART</h1>
            <div style="width: 40px;"></div>
          </div>
          <div class="empty-state">
            <img src="./Assets/bag.png" alt="Empty cart" class="empty-state-icon">
            <div class="empty-state-title">Your cart is empty</div>
            <div class="empty-state-text">Add items to generate your order command</div>
          </div>
        </div>
      `;
    } else {
      // Build cart items HTML
      const itemsHtml = cart.map(item => `
        <div class="cart-item" data-filename="${item.filename}">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='./Assets/logo_header.png'">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-variant">${item.variation !== 'NA' ? item.variation : 'Default'}</div>
            <div class="cart-item-qty">Qty: ${item.quantity}</div>
          </div>
          <button class="cart-item-remove" data-filename="${item.filename}" title="Remove">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `).join('');

      // Generate the command preview
      const hexIds = [];
      cart.forEach(item => {
        // Use the full hex ID (16-char) if available, otherwise use the 4-char one
        const hexToUse = item.hexIdFull || item.hexId;
        for (let i = 0; i < item.quantity; i++) {
          hexIds.push(hexToUse);
        }
      });
      const command = `${prefix} ${hexIds.join(' ')}`;

      cartContent.innerHTML = `
        <div class="cart-page">
          <div class="cart-header">
            <button id="cart-close-btn" class="back-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 class="cart-title">MY CART</h1>
            <div style="width: 40px;"></div>
          </div>

          <div class="cart-count">${totalCount} / 40 items</div>

          <div class="cart-items">
            ${itemsHtml}
          </div>

          <div class="cart-checkout">
            <div class="checkout-section">
              <div class="checkout-label">ORDER COMMAND</div>
              <div class="checkout-command" id="command-preview">${command}</div>
              <button id="copy-order-btn" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy Order Command
              </button>
            </div>

            <button id="clear-cart-btn" class="btn btn-secondary clear-cart-btn">
              Clear Cart
            </button>
          </div>
        </div>
      `;
    }

    // Setup event listeners
    this.setupCartListeners();
  },

  setupCartListeners() {
    // Close button
    document.getElementById('cart-close-btn').addEventListener('click', () => {
      this.closeModal('cart-modal');
    });

    // Remove item buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const filename = btn.dataset.filename;
        Storage.removeFromCart(filename);
        this.updateCartBadge();
        this.renderCart(); // Re-render cart
        this.showToast('Item removed from cart');
      });
    });

    // Copy order button
    const copyBtn = document.getElementById('copy-order-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const command = document.getElementById('command-preview').textContent;

        try {
          await navigator.clipboard.writeText(command);
          this.showToast('Copied to clipboard!');
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = command;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          this.showToast('Copied to clipboard!');
        }
      });
    }

    // Clear cart button
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.showConfirmDialog(
          'Clear Cart?',
          'This will remove all items from your cart.',
          'Clear Cart',
          () => {
            Storage.clearCart();
            this.updateCartBadge();
            this.renderCart();
            this.showToast('Cart cleared');
          }
        );
      });
    }
  },

  renderItemDetail(container) {
    const item = this.currentItem;
    if (!item) {
      this.navigateTo('home');
      return;
    }

    const selectedVariant = item.variants[this.selectedVariantIndex];
    const isWishlisted = Storage.isInWishlist(selectedVariant.filename);

    // Build variants grid HTML
    const variantsHtml = item.variants.map((variant, index) => {
      const isSelected = index === this.selectedVariantIndex;
      return `
        <div class="variant-item ${isSelected ? 'selected' : ''}" data-index="${index}">
          <img src="${variant.image}" alt="${variant.variation}" loading="lazy" onerror="this.src='./Assets/logo_header.png'">
        </div>
      `;
    }).join('');

    // Build item info rows
    const infoRows = [];
    if (selectedVariant.variation && selectedVariant.variation !== 'NA') {
      infoRows.push({ label: 'VARIATION', value: selectedVariant.variation });
    }
    if (item.size) {
      infoRows.push({ label: 'SIZE', value: item.size });
    }
    if (item.catalog) {
      infoRows.push({ label: 'CATALOGUE', value: item.catalog });
    }
    if (item.hhaConcept1 && item.hhaConcept1 !== 'None') {
      infoRows.push({ label: 'HHA CONCEPT 1', value: item.hhaConcept1 });
    }
    if (item.hhaConcept2 && item.hhaConcept2 !== 'None') {
      infoRows.push({ label: 'HHA CONCEPT 2', value: item.hhaConcept2 });
    }
    if (item.hhaSet && item.hhaSet !== 'None') {
      infoRows.push({ label: 'SET', value: item.hhaSet });
    }
    if (item.hhaSeries && item.hhaSeries !== 'None') {
      infoRows.push({ label: 'SERIES', value: item.hhaSeries });
    }

    const infoHtml = infoRows.map(row => `
      <div class="info-row">
        <span class="info-label">${row.label}</span>
        <span class="info-value">${row.value}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="item-detail-page">
        <!-- Header -->
        <div class="detail-header">
          <button id="back-btn" class="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="detail-title">${item.name}</h1>
          <button id="detail-wishlist-btn" class="detail-wishlist-btn" data-filename="${selectedVariant.filename}">
            <img src="./Assets/${isWishlisted ? 'Wishlistbutton_active' : 'Wishlistbutton_unactive'}.png" alt="Wishlist">
          </button>
        </div>

        <!-- Main Image -->
        <div class="detail-image-container">
          <div class="detail-image">
            <img id="detail-main-image" src="${selectedVariant.image}" alt="${item.name}" onerror="this.src='./Assets/logo_header.png'">
          </div>
        </div>

        <!-- Variations Section -->
        ${item.variants.length > 1 ? `
          <div class="detail-section">
            <div class="detail-section-title">VARIATIONS</div>
            <div class="variants-grid">
              ${variantsHtml}
            </div>
          </div>
        ` : ''}

        <!-- Quantity and Add to Bag -->
        <div class="detail-actions">
          <div class="quantity-selector">
            <button id="qty-minus" class="qty-btn">−</button>
            <span id="qty-value" class="qty-value">${this.quantity}</span>
            <button id="qty-plus" class="qty-btn">+</button>
          </div>
          <button id="add-to-bag-btn" class="btn btn-pink add-to-bag-btn">
            ADD TO BAG
          </button>
        </div>

        <!-- Item Info -->
        ${infoRows.length > 0 ? `
          <div class="detail-section">
            <div class="detail-section-title">ITEM INFO</div>
            <div class="info-table">
              ${infoHtml}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Setup event listeners
    this.setupItemDetailListeners();
  },

  setupItemDetailListeners() {
    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
      this.navigateTo('home');
    });

    // Wishlist button
    const wishlistBtn = document.getElementById('detail-wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
      const filename = wishlistBtn.dataset.filename;
      const isWishlisted = Storage.isInWishlist(filename);

      if (isWishlisted) {
        Storage.removeFromWishlist(filename);
        wishlistBtn.querySelector('img').src = './Assets/Wishlistbutton_unactive.png';
        this.showToast('Removed from wishlist');
      } else {
        Storage.addToWishlist({
          name: this.currentItem.name,
          filename: filename
        });
        wishlistBtn.querySelector('img').src = './Assets/Wishlistbutton_active.png';
        this.showToast('Added to wishlist');
      }
    });

    // Variant selection
    document.querySelectorAll('.variant-item').forEach(variantEl => {
      variantEl.addEventListener('click', () => {
        const index = parseInt(variantEl.dataset.index);
        this.selectedVariantIndex = index;

        // Update selected state
        document.querySelectorAll('.variant-item').forEach(v => {
          v.classList.toggle('selected', parseInt(v.dataset.index) === index);
        });

        // Update main image
        const variant = this.currentItem.variants[index];
        document.getElementById('detail-main-image').src = variant.image;

        // Update wishlist button state
        const isWishlisted = Storage.isInWishlist(variant.filename);
        wishlistBtn.dataset.filename = variant.filename;
        wishlistBtn.querySelector('img').src = `/Assets/${isWishlisted ? 'Wishlistbutton_active' : 'Wishlistbutton_unactive'}.png`;
      });
    });

    // Quantity buttons
    document.getElementById('qty-minus').addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        document.getElementById('qty-value').textContent = this.quantity;
      }
    });

    document.getElementById('qty-plus').addEventListener('click', () => {
      const currentCartCount = Storage.getCartTotalCount();
      if (currentCartCount + this.quantity < 40) {
        this.quantity++;
        document.getElementById('qty-value').textContent = this.quantity;
      } else {
        this.showToast('Cart limit is 40 items');
      }
    });

    // Add to bag
    document.getElementById('add-to-bag-btn').addEventListener('click', () => {
      const variant = this.currentItem.variants[this.selectedVariantIndex];

      const result = Storage.addToCart({
        name: this.currentItem.name,
        filename: variant.filename,
        variation: variant.variation,
        hexId: variant.hexId,
        hexIdFull: variant.hexIdFull,
        image: variant.image
      }, this.quantity);

      if (result.success) {
        this.updateCartBadge();
        this.showToast(`Added ${this.quantity}x ${this.currentItem.name} to cart`);
        // Reset quantity
        this.quantity = 1;
        document.getElementById('qty-value').textContent = this.quantity;
      } else {
        this.showToast(result.message);
      }
    });
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

export default App;
