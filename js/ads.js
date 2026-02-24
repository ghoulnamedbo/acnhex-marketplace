// ─── Fake Ads Module ───
// In-universe Animal Crossing ads for ACNHEX Market

// ─── Inline Banner Ad Data ───
const INLINE_BANNERS = [
  {
    cls: 'promo-redd',
    icon: '\u{1F5BC}\uFE0F',
    title: "Redd's Totally Legitimate Art Emporium",
    body: '100% real paintings. No forgeries. Cousin\'s honor.',
    tag: '\u2726 GUARANTEED AUTHENTIC \u2726',
    extra: '',
  },
  {
    cls: 'promo-sahara',
    icon: '\u{1F42A}',
    title: "Sahara's Rug Warehouse",
    body: 'Mysterious wallpapers &amp; flooring you won\'t believe, <span class="italic-accent">wallah!</span>',
    extra: '',
  },
  {
    cls: 'promo-cj',
    icon: '\u{1F41F}',
    title: "CJ's Fish Prints",
    body: 'Turn your catch into wall-worthy ART. Models available.',
    quote: '"Bring me 3 and I\'ll make it EPIC, nyuk!"',
    extra: '',
  },
  {
    cls: 'promo-kicks',
    icon: '\u{1F45F}',
    title: "Kicks' Shoe Boutique",
    body: 'Socks, shoes &amp; bags. Step up your island style, mate!',
    stars: true,
    extra: '',
  },
  {
    cls: 'promo-gracie',
    icon: null,
    isGracie: true,
    extra: '',
  },
  {
    cls: 'promo-brewster',
    icon: '\u2615',
    title: 'The Roost Caf\u00E9',
    body: 'Pigeon milk blend. Brewed fresh. No conversation required.',
    quote: '"...Coo."',
    extra: '<span class="steam-dots">\u2668\uFE0F</span>',
  },
  {
    cls: 'promo-leif',
    icon: '\u{1F33A}',
    title: "Leif's Garden Shop",
    body: 'Shrubs, flowers &amp; hedges. Make your island bloom, yeah!',
    tag: '\u{1F331} Spring Sale',
    extra: '',
  },
  {
    cls: 'promo-wisp',
    icon: '\u{1F47B}',
    title: "Wisp's Spirit Shop",
    body: 'Something new... or something expensive. Your choice.',
    quote: '"Please don\'t tell anyone you saw me..."',
    extra: '<span class="wisp-stars">\u2728 \u2B50 \u2728</span>',
  },
  {
    cls: 'promo-daisy',
    icon: '\u{1F340}',
    title: "Daisy Mae's Turnip Co.",
    body: "Buy low, sell high! Gran-gran's secret recipe for profit.",
    tag: '\u{1F4C8} Hot Tips Inside',
    extra: '<span class="corner-badge" style="background-color:rgba(93,64,55,0.15);color:#5D4037;">Sundays Only</span>',
  },
  {
    cls: 'promo-blathers',
    icon: '\u{1F989}',
    title: 'The Museum Gift Shop',
    body: 'Fossils assessed free of charge. Bug donations... tolerated.',
    quote: '"Hoo! Please keep insects at a distance."',
    extra: '',
  },
  {
    cls: 'promo-pascal',
    icon: '\u{1F9AA}',
    title: "Pascal's Pearl Wisdom",
    body: 'Trade a scallop, get a pearl. And maybe some life advice.',
    quote: '"Maaan... like, what even IS furniture?"',
    extra: '',
  },
  {
    cls: 'promo-label',
    icon: '\u{1F3F7}\uFE0F',
    title: "Label's Fashion Check",
    body: 'Pass the vibe check. Get a free Able Sisters coupon.',
    tag: '\u2702\uFE0F Style Challenge',
    extra: '',
  },
  {
    cls: 'promo-katrina',
    icon: '\u{1F52E}',
    title: "Katrina's Fortune Shop",
    body: 'Know your luck before you shake that tree.',
    quote: '"Your future... is clouded with bells."',
    extra: '<span class="fortune-stars">\u2726 \u2727 \u2726 \u2727</span>',
  },
  {
    cls: 'promo-flick',
    icon: '\u{1F98B}',
    title: "Flick's Bug Commissions",
    body: "Bring me any 3 bugs and I'll sculpt a masterpiece. ART IS LIFE.",
    quote: '"Bugs are the purest form of beauty."',
    extra: '',
  },
  {
    cls: 'promo-celeste',
    icon: '\u{1FA90}',
    title: "Celeste's Star Fragment Exchange",
    body: 'Wish upon a star. Craft wands &amp; celestial furniture.',
    quote: '"The cosmos has so much to teach us, hoo!"',
    extra: '<span class="celeste-sparkles">\u2B50 \u2728 \u2B50</span>',
  },
  {
    cls: 'promo-gullivarrr',
    icon: '\u{1F3F4}\u200D\u2620\uFE0F',
    title: "Gullivarrr's Pirate Treasures",
    body: "Find me communicator parts and I'll reward ye with booty, matey!",
    quote: '"Arrr... where be me phone?"',
    extra: '',
  },
  {
    cls: 'promo-harriet',
    icon: '\u{1F484}',
    title: 'Shampoodle Salon',
    body: 'New hairstyles, new colors, new you. Walk-ins welcome!',
    tag: '\u2702\uFE0F Glow Up Season',
    extra: '',
  },
  {
    cls: 'promo-kk',
    icon: '\u{1F3B8}',
    title: 'K.K. Slider Live!',
    body: 'Saturday nights at the plaza. Requests welcome. No cover charge.',
    quote: '"Music should be free, man."',
    extra: '<span class="music-notes">\u266A \u266B \u266A</span>',
  },
  {
    cls: 'promo-tortimer',
    icon: '\u{1F422}',
    title: "Tortimer's Island Tours",
    body: 'Minigames, rare bugs, tropical fruit. The old mayor remembers.',
    quote: '"Back in my day, we had REAL islands."',
    extra: '',
  },
  {
    cls: 'promo-able',
    icon: '\u{1F9F5}',
    title: 'Able Sisters Clearance',
    body: 'End-of-season blowout. All custom designs 50% off (in spirit).',
    tag: '\u{1F6CD}\uFE0F While Supplies Last',
    extra: '',
  },
  {
    cls: 'promo-resetti',
    icon: '\u{1F630}',
    title: "Resetti's Save Data Insurance",
    body: "Protect your island. Auto-save not enough? We've got you.",
    quote: '"DON\'T. RESET. YOUR. GAME."',
    extra: '<span class="alert-flash">Warning</span>',
  },
  {
    cls: 'promo-rover',
    icon: '\u{1F68C}',
    title: "Rover's Travel Bureau",
    body: "Moving to a new town? I can help with that. First trip's on me!",
    quote: '"So... what\'s your name? Haha, just kidding."',
    extra: '',
  },
];

// ─── Interstitial Ad Data ───
const INTERSTITIALS = [
  { type: 'mortgage' },
  { type: 'gazette' },
  { type: 'shopping' },
  { type: 'dodo' },
];

// ─── Notification-Style Ad Data ───
const NOTIFICATIONS = [
  {
    cls: 'notif-nooklink',
    icon: '\u{1F4F1}',
    title: 'NookLink\u2122 Pro',
    body: 'Sync your catalog across devices. Only 2,999 bells/mo.',
    time: '2m ago',
  },
  {
    cls: 'notif-hhp',
    icon: '\u{1F3E1}',
    title: 'Happy Home Paradise',
    body: 'Design vacation homes! Lottie needs your help on the archipelago.',
    time: '5m ago',
  },
  {
    cls: 'notif-sale',
    icon: '\u{1F389}',
    title: "Flash Sale at Nook's Cranny!",
    body: 'Hot item today: Gold toilet. First come, first served.',
    time: 'Just now',
  },
  {
    cls: 'notif-kk',
    icon: '\u{1F3B5}',
    title: 'New K.K. Song Dropped',
    body: '"K.K. Steppe" now available. Request it Saturday night.',
    time: '12m ago',
  },
  {
    cls: 'notif-celeste',
    icon: '\u{1F320}',
    title: 'Meteor Shower Tonight!',
    body: 'Celeste spotted near the museum. Wish on stars for fragments.',
    time: '30m ago',
  },
  {
    cls: 'notif-turnip',
    icon: '\u{1F4B0}',
    title: 'Turnip Prices Spiking!',
    body: "Nook's Cranny buying at 547 bells. Sell now before PM.",
    time: '1m ago',
  },
];

// ─── Shuffle Utility ───
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Banner Pool (shuffled, cycles through all before repeating) ───
let bannerPool = [];
let bannerPoolIdx = 0;

function resetBannerPool() {
  bannerPool = shuffleArray(INLINE_BANNERS);
  bannerPoolIdx = 0;
}

export function getNextBannerAd() {
  if (bannerPoolIdx >= bannerPool.length) resetBannerPool();
  return bannerPool[bannerPoolIdx++];
}

// Initialize pool
resetBannerPool();

// ─── Render: Inline Banner Ad ───
export function renderBannerAd(ad) {
  if (!ad) ad = getNextBannerAd();

  if (ad.isGracie) {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      <span class="promo-badge">Ad</span>
      <div class="banner-inner">
        <div class="gracie-brand">Gracie Grace</div>
        <div class="gracie-title">Luxury, Darling.</div>
        <div class="gracie-tagline">If you have to ask the price, you can't afford it.</div>
        <div class="gracie-cta">Shop Collection</div>
      </div>
    </div>`;
  }

  let bottomContent = '';
  if (ad.tag) bottomContent = `<span class="promo-tag">${ad.tag}</span>`;
  if (ad.quote) bottomContent = `<span class="promo-quote">${ad.quote}</span>`;
  if (ad.stars) bottomContent = `<div class="stars">\u2B50\u2B50\u2B50\u2B50\u2B50</div>`;

  return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
    <span class="promo-badge">Ad</span>
    ${ad.extra}
    <div class="banner-inner">
      <div class="promo-icon">${ad.icon}</div>
      <div class="promo-text">
        <h3>${ad.title}</h3>
        <p>${ad.body}</p>
        ${bottomContent}
      </div>
    </div>
  </div>`;
}

// ─── Render: Interstitial Ads ───
function renderMortgage() {
  return `<div class="nook-interstitial nook-flyer" data-nook-promo>
    <span class="promo-badge">Ad</span>
    <div class="nook-mortgage">
      <div class="mortgage-top">Nook Inc. Financial</div>
      <div class="mortgage-icon">\u{1F3E0}</div>
      <div class="mortgage-title">Home Loan Refinancing</div>
      <div class="mortgage-body-text">Upgrade your tent. Expand your rooms.<br>Tom Nook believes in you. Probably.</div>
      <div class="mortgage-rate">
        <span class="rate-num">0%</span>
        <span class="rate-label">APR*</span>
      </div>
      <br>
      <div class="mortgage-cta">Apply Now</div>
      <div class="mortgage-fine">* 0% APR. Infinite repayment period. Nook Inc. reserves the right to guilt-trip you daily.</div>
    </div>
  </div>`;
}

function renderGazette() {
  return `<div class="nook-interstitial nook-flyer" data-nook-promo>
    <span class="gazette-badge">Sponsored</span>
    <div class="nook-gazette">
      <div class="gazette-header">
        <div class="gazette-name">The Island Gazette</div>
        <div class="gazette-date">Isabelle's Morning Announcements</div>
      </div>
      <div class="gazette-body">
        <div class="gazette-headline">BREAKING: Local Resident Orders 40 Items in Single Cart, Stuns Community</div>
        <div class="gazette-excerpt">Sources close to Resident Services confirm the haul included 12 variations of the same lamp. "I just really like the blue one," the resident was quoted as saying. Isabelle declined to comment but was seen wagging her tail approvingly.</div>
        <div class="gazette-cta">Read More \u2192</div>
      </div>
    </div>
  </div>`;
}

function renderNookShopping() {
  return `<div class="nook-interstitial nook-flyer" data-nook-promo>
    <span class="promo-badge">Ad</span>
    <div class="nook-shopping">
      <div class="shopping-scanline"></div>
      <div class="shopping-channel">Nook Shopping Channel</div>
      <div class="shopping-icon">\u{1F4FA}</div>
      <div class="shopping-title">Tonight's Featured Items!</div>
      <div class="shopping-sub">Order now from the comfort of your home. Free delivery to your mailbox by tomorrow!</div>
      <div class="shopping-price-row">
        <div class="shopping-item">
          <span class="si-emoji">\u{1F6CB}\uFE0F</span>
          <div class="si-price">12,000</div>
          <div class="si-label">Bells</div>
        </div>
        <div class="shopping-item">
          <span class="si-emoji">\u{1F5BC}\uFE0F</span>
          <div class="si-price">3,200</div>
          <div class="si-label">Bells</div>
        </div>
        <div class="shopping-item">
          <span class="si-emoji">\u{1F48E}</span>
          <div class="si-price">88,000</div>
          <div class="si-label">Bells</div>
        </div>
      </div>
      <div class="shopping-cta">Shop Now</div>
      <div class="shopping-fine">* Items rotate daily. Nook Shopping is not responsible for buyer's remorse.</div>
    </div>
  </div>`;
}

function renderDodo() {
  return `<div class="nook-interstitial nook-flyer" data-nook-promo>
    <span class="promo-badge">Ad</span>
    <div class="nook-dodo">
      <div class="dodo-clouds"></div>
      <div class="dodo-brand">Dodo Airlines</div>
      <div class="dodo-icon">\u2708\uFE0F</div>
      <div class="dodo-title">Fly Dodo. Fly Free.</div>
      <div class="dodo-sub">Mystery island tours, friend visits &amp; more.<br>Now serving 25,000+ destinations.</div>
      <div class="dodo-routes">
        <span class="dodo-route">Mystery Islands</span>
        <span class="dodo-route">Friend Visits</span>
        <span class="dodo-route">Dream Trips</span>
      </div>
      <div class="dodo-cta">Book a Flight</div>
      <div class="dodo-fine">* Dodo Airlines cannot guarantee safe landing. Wilbur is doing his best.</div>
    </div>
  </div>`;
}

const INTERSTITIAL_RENDERERS = {
  mortgage: renderMortgage,
  gazette: renderGazette,
  shopping: renderNookShopping,
  dodo: renderDodo,
};

export function renderInterstitialAd(type) {
  const renderer = INTERSTITIAL_RENDERERS[type];
  return renderer ? renderer() : '';
}

// ─── Pick random interstitials for the catalog page ───
let interstitialPool = [];
let interstitialIdx = 0;

function resetInterstitialPool() {
  interstitialPool = shuffleArray(INTERSTITIALS);
  interstitialIdx = 0;
}
resetInterstitialPool();

export function getNextInterstitial() {
  if (interstitialIdx >= interstitialPool.length) resetInterstitialPool();
  return interstitialPool[interstitialIdx++];
}

// (Static notification section removed — notifications are floating overlays only)

// ─── Render: Popup Modals ───
function renderPopupPremium() {
  return `<div class="promo-popup-overlay" id="promo-popup-overlay" data-popup-type="premium">
    <div class="promo-popup-dim" data-popup-dismiss></div>
    <div class="modal-box modal-premium">
      <div class="modal-header">
        <button class="close-btn" data-popup-dismiss>&times;</button>
        <span class="sparkle-icon">\u2728</span>
        <h3>Nook Inc. Premium</h3>
        <div class="tier-label">Gold Leaf Tier</div>
      </div>
      <div class="modal-body">
        <div class="feature-list">
          <div class="feature-row"><span class="f-icon">\u{1F4E6}</span><span class="f-text"><strong>80-item</strong> cart limit</span></div>
          <div class="feature-row"><span class="f-icon">\u{1F9A4}</span><span class="f-text"><strong>Priority</strong> Dodo delivery</span></div>
          <div class="feature-row"><span class="f-icon">\u{1F3F7}\uFE0F</span><span class="f-text"><strong>Exclusive</strong> Nook Shopping deals</span></div>
        </div>
        <div class="price-block"><span class="price-amount">49,999 \u{1F514}</span><span class="price-period">bells / month</span></div>
        <button class="cta-button" data-popup-dismiss>Subscribe Now \u{1F343}</button>
        <div class="fine-print-premium">* No actual bells required. Nook Inc. is not responsible for any debts, real or imagined. Tom Nook sends his regards.</div>
      </div>
    </div>
  </div>`;
}

function renderPopupVisitor() {
  return `<div class="promo-popup-overlay" id="promo-popup-overlay" data-popup-type="visitor">
    <div class="promo-popup-dim" data-popup-dismiss></div>
    <div class="modal-box modal-visitor">
      <div class="modal-header">
        <span class="confetti-strip">\u{1F389}\u{1F38A}\u2728\u{1F389}\u{1F38A}\u2728\u{1F389}\u{1F38A}\u2728\u{1F389}\u{1F38A}\u2728</span>
        <button class="close-btn" data-popup-dismiss>&times;</button>
        <span class="big-party">\u{1F38A}</span>
        <h3>\u{1F6A8} You're the 1,000th<br>visitor today!! \u{1F6A8}</h3>
        <div class="visitor-sub">Congratulations, Islander!</div>
      </div>
      <div class="modal-body">
        <div class="miles-box"><span class="m-icon">\u{1F3AB}</span><div class="m-info"><div class="m-amount">10,000</div><div class="m-label">Nook Miles</div></div></div>
        <button class="visitor-cta" data-popup-dismiss>\u{1F389} Claim My Miles!</button>
        <div class="fine-print">* Nook Miles are non-transferable, non-redeemable, and entirely fictional. By clicking you agree to let Tom Nook add this to your mortgage.</div>
      </div>
    </div>
  </div>`;
}

function renderPopupTurnip() {
  return `<div class="promo-popup-overlay" id="promo-popup-overlay" data-popup-type="turnip">
    <div class="promo-popup-dim" data-popup-dismiss></div>
    <div class="modal-box modal-turnip">
      <div class="modal-header">
        <button class="close-btn" data-popup-dismiss>&times;</button>
        <span class="m-emoji">\u{1F4C8}</span>
        <h3>Stalk Market Alert!</h3>
        <div class="t-sub">Live Turnip Prices</div>
      </div>
      <div class="modal-body">
        <div class="turnip-ticker">
          <div class="ticker-card"><div class="ticker-label">Buy Price</div><div class="ticker-value">98</div><div class="ticker-trend down">\u25BC Sun AM</div></div>
          <div class="ticker-card"><div class="ticker-label">Sell Price</div><div class="ticker-value">547</div><div class="ticker-trend up">\u25B2 Thu PM</div></div>
        </div>
        <div class="turnip-disclaimer">Prices refresh every island-hour. Act fast!</div>
        <button class="turnip-cta" data-popup-dismiss>\u{1F340} Check My Island</button>
        <div class="fine-print">* Turnip prices are entirely made up. Daisy Mae is not affiliated with this ad.</div>
      </div>
    </div>
  </div>`;
}

function renderPopupLottie() {
  return `<div class="promo-popup-overlay" id="promo-popup-overlay" data-popup-type="lottie">
    <div class="promo-popup-dim" data-popup-dismiss></div>
    <div class="modal-box modal-lottie">
      <div class="modal-header">
        <button class="close-btn" data-popup-dismiss>&times;</button>
        <span class="m-emoji">\u{1F3E1}</span>
        <h3>Happy Home Paradise</h3>
        <div class="l-sub">Now Hiring</div>
      </div>
      <div class="modal-body">
        <div class="room-preview">
          <div class="room-card"><span class="room-emoji">\u{1F6CB}\uFE0F</span><div class="room-name">Living Room</div></div>
          <div class="room-card"><span class="room-emoji">\u{1F373}</span><div class="room-name">Kitchen</div></div>
          <div class="room-card"><span class="room-emoji">\u{1F6C1}</span><div class="room-name">Bathroom</div></div>
        </div>
        <div class="lottie-pitch">Design dream vacation homes for villagers on a tropical archipelago!</div>
        <button class="lottie-cta" data-popup-dismiss>\u2708\uFE0F Visit the Archipelago</button>
        <div class="fine-print">* Travel is one-way. Lottie cannot guarantee return flights. Poki accepted.</div>
      </div>
    </div>
  </div>`;
}

function renderPopupCookie() {
  return `<div class="promo-popup-overlay" id="promo-popup-overlay" data-popup-type="cookie">
    <div class="promo-popup-dim"></div>
    <div class="modal-box modal-cookie">
      <div class="modal-header">
        <button class="close-btn" data-popup-dismiss>&times;</button>
        <span class="m-emoji">\u{1F36A}</span>
        <h3>This Island Uses Cookies</h3>
      </div>
      <div class="modal-body">
        <div class="cookie-text">Nook Inc. uses cookies to track your browsing habits, shopping preferences, and general island vibe. We definitely won't sell this data to Redd.</div>
        <div class="cookie-btns">
          <button class="cookie-btn cookie-accept" data-popup-dismiss>Accept All \u{1F36A}</button>
          <button class="cookie-btn cookie-decline" data-popup-dismiss>Reject</button>
        </div>
        <div style="margin-top:10px;" class="fine-print">* "Reject" button is decorative. Nook Inc. already has your data. Thank you for your cooperation.</div>
      </div>
    </div>
  </div>`;
}

const POPUP_RENDERERS = {
  premium: renderPopupPremium,
  visitor: renderPopupVisitor,
  turnip: renderPopupTurnip,
  lottie: renderPopupLottie,
  cookie: renderPopupCookie,
};

// ─── Popup State Management ───
export function shouldShowPopup(type) {
  if (type === 'cookie') {
    return !localStorage.getItem('acnhex_cookie_dismissed');
  }
  return !sessionStorage.getItem(`acnhex_popup_${type}`);
}

export function dismissPopup(type) {
  if (type === 'cookie') {
    localStorage.setItem('acnhex_cookie_dismissed', '1');
  }
  sessionStorage.setItem(`acnhex_popup_${type}`, '1');
}

export function renderActivePopup(activePopupType) {
  if (!activePopupType) return '';
  const renderer = POPUP_RENDERERS[activePopupType];
  return renderer ? renderer() : '';
}

// ─── Toast ───
export function renderAdToast(visible) {
  if (!visible) return '';
  return `<div class="promo-toast" id="promo-toast">
    <div class="promo-toast-bar">
      <span class="promo-toast-icon">\u{1F343}</span>
      Nook Inc. thanks you for your interest!
    </div>
  </div>`;
}

// ─── Catalog Page Ad Helpers ───
// Pick one random interstitial per page load for the grid
let gridInterstitialType = null;
let interstitialShownThisSession = false;

function ensureGridInterstitial() {
  if (!gridInterstitialType) {
    const inter = getNextInterstitial();
    gridInterstitialType = inter.type;
  }
  return gridInterstitialType;
}

// 30% chance of showing, max 1 per session (only on initial home load)
// Decision is made once and cached so re-renders produce the same result
let interstitialDecided = false;
let interstitialVisible = false;

function shouldShowInterstitial() {
  if (interstitialShownThisSession) return false;
  if (!interstitialDecided) {
    interstitialDecided = true;
    interstitialVisible = Math.random() <= 0.3;
  }
  if (interstitialVisible) {
    interstitialShownThisSession = true;
    return true;
  }
  return false;
}

// Reset the grid interstitial on category change / page refresh
export function resetGridInterstitial() {
  gridInterstitialType = null;
  interstitialDecided = false;
  interstitialVisible = false;
  resetBannerPool(); // fresh shuffle for new category
}

// Determines how to interleave ads into the item grid
const BANNER_INTERVAL = 25; // fixed interval: one banner ad every 25 items

export function renderItemGridWithAds(items, renderItemCardFn) {
  // Reset pool index (not the shuffle) so re-renders produce the same banners
  bannerPoolIdx = 0;

  const interType = ensureGridInterstitial();
  let html = '';
  let interstitialInserted = false;
  let bannersInserted = 0;
  // Scale max banners with grid size instead of a fixed cap
  const maxBanners = Math.max(1, Math.floor(items.length / BANNER_INTERVAL));

  for (let idx = 0; idx < items.length; idx++) {
    html += renderItemCardFn(items[idx], idx);

    // Insert interstitial after item 17 (30% chance, only on initial load)
    if (idx === 16 && !interstitialInserted && shouldShowInterstitial()) {
      html += renderInterstitialAd(interType);
      interstitialInserted = true;
    }

    // Insert a banner ad every BANNER_INTERVAL items
    if ((idx + 1) % BANNER_INTERVAL === 0 && idx < items.length - 1 && bannersInserted < maxBanners) {
      html += renderBannerAd(getNextBannerAd());
      bannersInserted++;
    }
  }
  return html;
}

// Keep renderCatalogAdSection for backwards compatibility but return empty
// (interstitials are now inside the grid)
export function renderCatalogAdSection() {
  return '';
}

// ─── Floating Notification Ads ───
let floatingNotifShownCount = 0;
const FLOATING_NOTIF_MAX = 2; // max per session
let floatingNotifPool = [];
let floatingNotifIdx = 0;

function resetFloatingNotifPool() {
  floatingNotifPool = shuffleArray(NOTIFICATIONS);
  floatingNotifIdx = 0;
}
resetFloatingNotifPool();

export function getNextFloatingNotif() {
  if (floatingNotifShownCount >= FLOATING_NOTIF_MAX) return null;
  if (floatingNotifIdx >= floatingNotifPool.length) resetFloatingNotifPool();
  floatingNotifShownCount++;
  return floatingNotifPool[floatingNotifIdx++];
}

export function renderFloatingNotif(notif) {
  if (!notif) return '';
  return `<div class="floating-notif-container" id="floating-notif-container">
    <div class="floating-notif ${notif.cls}" id="floating-notif" data-nook-promo>
      <div class="notif-icon">${notif.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${notif.title}</div>
        <div class="notif-body">${notif.body}</div>
      </div>
      <div class="notif-time">${notif.time}</div>
      <button class="notif-dismiss" id="notif-dismiss">&times;</button>
      <div class="notif-promo-badge">Sponsored</div>
    </div>
  </div>`;
}

export function canShowFloatingNotif() {
  return floatingNotifShownCount < FLOATING_NOTIF_MAX;
}

// ─── Popup Global Cooldown ───
let lastPopupTime = 0;
const POPUP_COOLDOWN = 180000; // 3 minutes between popups

function isPopupOnCooldown() {
  if (lastPopupTime === 0) return false;
  return (Date.now() - lastPopupTime) < POPUP_COOLDOWN;
}

export function markPopupShown() {
  lastPopupTime = Date.now();
}

// Popup trigger logic: specific triggers per popup type
export function checkPopupTrigger(triggerContext) {
  // triggerContext = { type: 'init'|'nav'|'cartAdd'|'timer', adPageViews, sessionStart, itemsViewed }

  // Cookie popup takes priority on first visit (exempt from cooldown)
  if (shouldShowPopup('cookie')) return 'cookie';

  // Global cooldown: no popup within 3 minutes of another
  if (isPopupOnCooldown()) return null;

  const trigger = triggerContext.type;

  // Nook Inc. Premium: show once after first cart add in session (5% chance)
  if (trigger === 'cartAdd' && shouldShowPopup('premium')) {
    if (Math.random() < 0.05) return 'premium';
    return null;
  }

  // 1000th Visitor: show after viewing 50+ items or 5+ navigations (5% chance, once per session)
  if (trigger === 'nav' && shouldShowPopup('visitor')) {
    if (((triggerContext.itemsViewed || 0) >= 50 || (triggerContext.adPageViews || 0) >= 5) && Math.random() < 0.05) {
      return 'visitor';
    }
  }

  // Stalk Market Ticker: ~5% chance on home page visit (once per session)
  if (trigger === 'nav' && shouldShowPopup('turnip')) {
    if (Math.random() < 0.05) {
      return 'turnip';
    }
  }

  // Happy Home Paradise: show after 2+ minutes browsing (once per session)
  if (trigger === 'timer' && shouldShowPopup('lottie')) {
    const elapsed = Date.now() - (triggerContext.sessionStart || Date.now());
    if (elapsed >= 120000) { // 2 minutes
      return 'lottie';
    }
  }

  return null;
}
