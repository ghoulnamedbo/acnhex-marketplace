// ─── Info Page ───
// About page with credits, version info, and install instructions

import { ICONS } from '../shared/icons.js';

export function renderInfo() {
  return `<div class="page">
    <div class="page-header">
      <h1 class="heading-xl" style="margin-bottom:4px">Info</h1>
      <p class="text-secondary" style="margin-bottom:28px">About ACNHEX Market</p>
    </div>

    <div style="padding:0 24px;display:flex;flex-direction:column;gap:14px">
      <div class="credit-card primary">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="credit-icon" style="background:var(--tag-bg)">📊</div>
          <div style="flex:1;min-width:0">
            <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">ACNH Spreadsheet</p>
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5">Primary source for item images, hex IDs, variant data, and catalog information.</p>
          </div>
        </div>
        <a href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit?gid=310491205#gid=310491205" target="_blank" rel="noopener noreferrer" class="credit-link">${ICONS.external} View Spreadsheet</a>
      </div>

      <div class="credit-card">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="credit-icon" style="background:var(--dolce-pink)">📱</div>
          <div>
            <p style="font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">Version Info</p>
            <p style="font-size:11px;color:var(--text-secondary);line-height:1.5">ACNHEX Market contains all items through the <strong>2.0.8 update</strong> of Animal Crossing: New Horizons.</p>
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
      <p style="font-size:16px;font-weight:700;margin-bottom:2px;color:var(--palm-leaf)">ACNHEX Market</p>
      <p style="font-size:10px;color:var(--text-light);margin-bottom:4px">Version 2.0.8</p>
      <p style="font-size:10px;color:var(--text-light)">A community tool for ACNH players</p>
    </div>
  </div>`;
}
