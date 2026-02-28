// ─── Info Page ───
// About page with credits, version info, and install instructions

import { ICONS } from '../shared/icons.js';

export function renderInfo() {
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl mb-4">Info</h1>
      <p class="text-secondary mb-28">About ACNHEX Market</p>
    </div>

    <div class="content-wrapper--gap-14">
      <div class="credit-card primary">
        <div class="credit-card-row">
          <div class="credit-icon credit-icon--tag">📊</div>
          <div class="credit-card-content">
            <p class="credit-card-title">ACNH Spreadsheet</p>
            <p class="credit-card-desc">Primary source for item images, hex IDs, variant data, and catalog information.</p>
          </div>
        </div>
        <a href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit?gid=310491205#gid=310491205" target="_blank" rel="noopener noreferrer" class="credit-link">${ICONS.external} View Spreadsheet</a>
      </div>

      <div class="credit-card">
        <div class="credit-card-row">
          <div class="credit-icon credit-icon--pink">📱</div>
          <div>
            <p class="credit-card-title">Version Info</p>
            <p class="credit-card-desc">ACNHEX Market contains all items through the <strong>2.0.8 update</strong> of Animal Crossing: New Horizons.</p>
          </div>
        </div>
      </div>

      <div class="install-card">
        <h4>📱 Install on iOS</h4>
        <p>Open in Safari → Tap Share → Add to Home Screen</p>
      </div>

      <div class="install-card">
        <h4>📱 Install on Android</h4>
        <p>Open in Chrome → Tap ⋮ menu → Install App or Add to Home Screen</p>
      </div>
    </div>

    <div class="app-footer">
      <div class="app-footer-icon">🍃</div>
      <p class="app-footer-name">ACNHEX Market</p>
      <p class="app-footer-version">Version 2.0.8</p>
      <p class="app-footer-tagline">A community tool for ACNH players</p>
    </div>
  </div>`;
}
