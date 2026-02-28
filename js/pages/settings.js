// ─── Settings Page ───
// Bot prefix configuration, sound settings, theme, and other preferences

import { esc } from '../utils.js';

export function renderSettings(state) {
  const presets = ['!', '.', '$', '?', '/'];
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Settings</h1>
      <p class="text-secondary" style="margin-bottom:28px">Configure your bot prefix</p>
    </div>

    <div style="padding:0 24px">
      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Bot Command Prefix</h4>
        <input type="text" class="prefix-input" id="prefix-input" value="${esc(state.prefix)}" maxlength="5">
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:16px">Quick Presets</h4>
        <div class="presets-grid">
          ${presets.map(p => `
            <button class="preset-btn ${state.prefix === p ? 'active' : ''}" data-preset="${esc(p)}">${esc(p)}</button>
          `).join('')}
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Preview</h4>
        <div class="code-block" style="border-radius:14px;padding:14px 16px;font-size:12px">
          <span class="code-keyword">${esc(state.prefix)}order</span>
          <span class="code-value">0x0A3F</span>
          <span class="code-value">0x1B2C</span>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Item Loading</h4>
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

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">Nook Inc. Sound Package</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Adds soft pocket sounds to browsing. Tom Nook approved.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">🔊 Sound Effects</span>
          <label class="toggle-container">
            <input type="checkbox" id="soundToggle" ${state.soundEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="sound-volume-row ${state.soundEnabled ? '' : 'disabled'}">
          <span style="font-size:11px;color:var(--text-secondary)">🔈</span>
          <input type="range" id="soundVolume" class="sound-slider" min="0" max="1" step="0.05" value="${state.soundVolume}" ${state.soundEnabled ? '' : 'disabled'}>
          <span style="font-size:11px;color:var(--text-secondary)">🔊</span>
          <span id="volumeLabel" class="volume-label">${Math.round(state.soundVolume * 100)}%</span>
        </div>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">🌙 Appearance</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Choose your preferred theme for the app.</p>
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

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">🃏 Card Effects</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Enable interactive motion effects when viewing cards in compare mode.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">Card Motion</span>
          <label class="toggle-container">
            <input type="checkbox" id="cardMotionToggle" ${state.cardMotionEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <p class="text-secondary" style="font-size:10px;margin-top:8px">Cards move with your mouse (desktop) or device tilt (mobile)</p>
      </div>

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">⌨️ Keyboard Shortcuts</h4>
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

      <div class="settings-card">
        <h4 class="label-upper" style="margin-bottom:14px">🦝 Fake Promos</h4>
        <p class="text-secondary" style="font-size:11px;margin-bottom:14px">Toggle the in-universe Animal Crossing fake ads and promos.</p>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;font-weight:700">Enable Fake Ads</span>
          <label class="toggle-container">
            <input type="checkbox" id="adsToggle" ${state.adsEnabled ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
        <div class="ad-options-group ${state.adsEnabled ? '' : 'disabled'}" id="adOptionsGroup">
          <div class="ad-toggle-row">
            <span>🖼️ Banner Ads</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsBannersToggle" ${state.adsBanners ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>📺 Full-page Interstitials</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsInterstitialsToggle" ${state.adsInterstitials ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>💬 Popup Overlays</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsPopupsToggle" ${state.adsPopups ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="ad-toggle-row">
            <span>🔔 Floating Notifications</span>
            <label class="toggle-container toggle-small">
              <input type="checkbox" id="adsFloatingToggle" ${state.adsFloatingNotifs ? 'checked' : ''} ${state.adsEnabled ? '' : 'disabled'}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card" style="border:1px solid var(--dolce-pink)">
        <h4 class="label-upper" style="margin-bottom:14px;color:var(--danger)">Danger Zone</h4>
        <button class="clear-btn" id="clear-data">Clear All Data</button>
      </div>
    </div>
  </div>`;
}
