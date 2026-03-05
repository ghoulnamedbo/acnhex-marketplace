// ─── Settings Page ───
// Bot prefix configuration, sound settings, theme, and other preferences

import { esc } from '../utils.js';

export function renderSettings(state) {
  const presets = ['!', '.', '$', '?', '/'];
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl mb-4">Settings</h1>
      <p class="text-secondary mb-12">Configure your bot prefix</p>
      <div class="settings-jump-links">
        <button class="jump-chip" data-jump="settings-prefix">Prefix</button>
        <button class="jump-chip" data-jump="settings-sound">Sound</button>
        <button class="jump-chip" data-jump="settings-appearance">Theme</button>
        <button class="jump-chip" data-jump="settings-promos">Promos</button>
        <button class="jump-chip" data-jump="settings-danger">Data</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="settings-card" id="settings-prefix">
        <h4 class="label-upper mb-14">Bot Command Prefix</h4>
        <input type="text" class="prefix-input" id="prefix-input" value="${esc(state.prefix)}" maxlength="5">
      </div>

      <div class="settings-card">
        <h4 class="label-upper mb-16">Quick Presets</h4>
        <div class="presets-grid">
          ${presets.map(p => `
            <button class="preset-btn ${state.prefix === p ? 'active' : ''}" data-preset="${esc(p)}">${esc(p)}</button>
          `).join('')}
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper mb-14">Preview</h4>
        <div class="code-block code-block--settings">
          <span class="code-keyword">${esc(state.prefix)}order</span>
          <span class="code-value">0x0A3F</span>
          <span class="code-value">0x1B2C</span>
        </div>
      </div>

      <div class="settings-card" id="settings-loading">
        <h4 class="label-upper mb-14">Item Loading</h4>
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

      <div class="settings-card" id="settings-sound">
        <h4 class="label-upper mb-14">Nook Inc. Sound Package</h4>
        <p class="settings-desc">Adds soft pocket sounds to browsing. Tom Nook approved.</p>
        <div class="settings-toggle-row">
          <span class="settings-toggle-label">🔊 Sound Effects</span>
          <label class="toggle-container">
            <input type="checkbox" id="soundToggle" ${state.soundEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="sound-volume-row ${state.soundEnabled ? '' : 'disabled'}">
          <span class="settings-volume-icon">🔈</span>
          <input type="range" id="soundVolume" class="sound-slider" min="0" max="1" step="0.05" value="${state.soundVolume}" ${state.soundEnabled ? '' : 'disabled'}>
          <span class="settings-volume-icon">🔊</span>
          <span id="volumeLabel" class="volume-label">${Math.round(state.soundVolume * 100)}%</span>
        </div>
        <div class="sound-preview-row">
          <span class="settings-preview-label">Preview:</span>
          <button class="sound-preview-btn" data-preview-sound="addToCart">🛒 Cart</button>
          <button class="sound-preview-btn" data-preview-sound="heartAdd">💚 Heart</button>
          <button class="sound-preview-btn" data-preview-sound="copyCommand">📋 Copy</button>
        </div>
      </div>

      <div class="settings-card" id="settings-appearance">
        <h4 class="label-upper mb-14">🌙 Appearance</h4>
        <p class="settings-desc">Choose your preferred theme for the app.</p>
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

      <div class="settings-card" id="settings-motion">
        <h4 class="label-upper mb-14">🃏 Card Effects</h4>
        <p class="settings-desc">Enable interactive motion effects when viewing cards in compare mode.</p>
        <div class="settings-toggle-row">
          <span class="settings-toggle-label">Card Motion</span>
          <label class="toggle-container">
            <input type="checkbox" id="cardMotionToggle" ${state.cardMotionEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <p class="text-secondary mt-8" style="font-size:10px">Cards move with your mouse on desktop</p>
      </div>

      <div class="settings-card" id="settings-shortcuts">
        <h4 class="label-upper mb-14">⌨️ Keyboard Shortcuts</h4>
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

      <div class="settings-card" id="settings-promos">
        <h4 class="label-upper mb-14">🦝 Fake Promos</h4>
        <p class="settings-desc">Toggle the in-universe Animal Crossing fake ads and promos.</p>
        <div class="settings-toggle-row">
          <span class="settings-toggle-label">Enable Fake Ads</span>
          <label class="toggle-container">
            <input type="checkbox" id="adsToggle" ${state.adsEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="ad-options-group ${state.adsEnabled ? '' : 'disabled'}" id="adOptionsGroup">
          <div class="ad-toggle-row">
            <span>🖼️ Banner Ads</span>
            <div class="ad-toggle-actions">
              <button class="ad-preview-btn" data-preview-ad="banner">👁 Preview</button>
              <label class="toggle-container toggle-small">
                <input type="checkbox" id="adsBannersToggle" ${state.adsBanners ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
              </label>
            </div>
          </div>
          <div class="ad-preview-slot" id="preview-banner"></div>
          <div class="ad-toggle-row">
            <span>📺 Full-page Interstitials</span>
            <div class="ad-toggle-actions">
              <button class="ad-preview-btn" data-preview-ad="interstitial">👁 Preview</button>
              <label class="toggle-container toggle-small">
                <input type="checkbox" id="adsInterstitialsToggle" ${state.adsInterstitials ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
              </label>
            </div>
          </div>
          <div class="ad-preview-slot" id="preview-interstitial"></div>
          <div class="ad-toggle-row">
            <span>💬 Popup Overlays</span>
            <div class="ad-toggle-actions">
              <button class="ad-preview-btn" data-preview-ad="popup">👁 Preview</button>
              <label class="toggle-container toggle-small">
                <input type="checkbox" id="adsPopupsToggle" ${state.adsPopups ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
              </label>
            </div>
          </div>
          <div class="ad-preview-slot" id="preview-popup"></div>
          <div class="ad-toggle-row">
            <span>🔔 Floating Notifications</span>
            <div class="ad-toggle-actions">
              <button class="ad-preview-btn" data-preview-ad="notification">👁 Preview</button>
              <label class="toggle-container toggle-small">
                <input type="checkbox" id="adsFloatingToggle" ${state.adsFloatingNotifs ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
              </label>
            </div>
          </div>
          <div class="ad-preview-slot" id="preview-notification"></div>
        </div>
      </div>

      <div class="settings-card settings-card--danger" id="settings-danger">
        <h4 class="label-upper label-upper--danger mb-14">Danger Zone</h4>
        <button class="clear-btn" id="clear-data">Clear All Data</button>
      </div>
    </div>
  </div>`;
}
