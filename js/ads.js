// ─── Fake Ads Module ───
// In-universe Animal Crossing ads for ACNHEX Market
import NookSounds from './sounds.js';

// ─── Ad Preferences Helper ───
function getPrefs() {
  return window.getAdPrefs ? window.getAdPrefs() : { enabled: true, banners: true, interstitials: true, popups: true, floatingNotifs: true };
}

// ─── Inline Banner Ad Data ───
const INLINE_BANNERS = [
  // 1. Redd — "Scam popup" style with fake reviews & promo code
  {
    cls: 'promo-redd',
    layout: 'scam',
    icon: '🖼️',
    title: "Redd's Totally Legitimate Art Emporium",
    body: '"100% REAL paintings, cousin! Would I lie?"',
    rating: '⭐⭐⭐⭐⭐',
    ratingCount: '4,127 verified reviews',
    price: 'Starting at 4,980 bells',
    promoCode: 'Use code COUSIN for 10% off',
    finePrint: '* code doesn\'t actually work',
    extra: '',
  },
  // 2. Sahara — "Mystery box" style with animated reveal
  {
    cls: 'promo-sahara',
    layout: 'mystery',
    icon: '🐪',
    title: "Sahara's Rug Warehouse",
    subtitle: 'MYSTERY COLLECTION',
    body: 'You never know what you\'ll get. That\'s the fun part, <span class="italic-accent">wallah!</span>',
    mysteryItems: ['Wallpaper', 'Flooring', 'Rug'],
    cta: 'Unwrap Mystery',
    finePrint: '* All sales final. No refunds. No exchanges. No eye contact.',
    extra: '',
  },
  // 3. CJ — "App store listing" style
  {
    cls: 'promo-cj',
    layout: 'appstore',
    icon: '🐟',
    title: "CJ's Fish Prints",
    subtitle: 'SEASIDE STUDIO',
    body: 'Turn your catch into wall-worthy art. Models available.',
    rating: '⭐⭐⭐⭐⭐',
    ratingCount: '2.3K',
    appSize: '3 fish req.',
    ctaLabel: 'Commission',
    quote: '"Bring me 3 and I\'ll make it EPIC, nyuk!"',
    extra: '',
  },
  // 4. Kicks — "Product card" style with price & sizes
  {
    cls: 'promo-kicks',
    layout: 'product',
    icon: '👟',
    title: "Kicks' Shoe Boutique",
    body: 'Step up your island style, mate!',
    productName: 'Pleather Ankle Boots',
    price: '2,800',
    originalPrice: '4,200',
    sizes: ['S', 'M', 'L'],
    rating: '⭐⭐⭐⭐⭐',
    ratingCount: '891',
    tag: 'Best Seller',
    extra: '',
  },
  // 5. Gracie Grace — Luxury centered layout
  {
    cls: 'promo-gracie',
    layout: 'luxury',
    icon: null,
    isGracie: true,
    extra: '',
  },
  // 6. Brewster — "Minimalist menu" style
  {
    cls: 'promo-brewster',
    layout: 'menu',
    icon: '☕',
    title: 'The Roost',
    menuItems: [
      { item: 'House Blend', price: '200' },
      { item: 'Pigeon Milk Latte', price: '350' },
      { item: 'Silence', price: 'Free' },
    ],
    quote: '"...Coo."',
    extra: '<span class="steam-dots">♨️</span>',
  },
  // 7. Leif — "Seasonal sale" style with progress bar
  {
    cls: 'promo-leif',
    layout: 'sale',
    icon: '🌺',
    title: "Leif's Garden Shop",
    body: 'Shrubs, flowers & hedges. Make your island bloom, yeah!',
    saleName: '🌱 SPRING BLOWOUT',
    discount: '40% OFF',
    progressLabel: '73% claimed',
    progressPercent: 73,
    cta: 'Shop Now',
    extra: '',
  },
  // 8. Wisp — "Spooky choice" style with two options
  {
    cls: 'promo-wisp',
    layout: 'choice',
    icon: '👻',
    title: "Wisp's Spirit Shop",
    body: 'Gather my spirit pieces and choose your reward...',
    optionA: '✨ Something new',
    optionB: '💰 Something expensive',
    quote: '"P-please don\'t tell anyone you saw me..."',
    extra: '<span class="wisp-stars">✨ ⭐ ✨</span>',
  },
  // 9. Daisy Mae — "Stock ticker" style for turnips
  {
    cls: 'promo-daisy',
    layout: 'ticker',
    icon: '🍀',
    title: "Daisy Mae's Turnip Co.",
    tickerLabel: 'TNIP',
    tickerPrice: '98',
    tickerChange: '▼ 12',
    tickerTrend: 'down',
    body: "Buy low, sell high! Gran-gran's secret recipe.",
    tag: '📈 Sundays Only — AM Hours',
    finePrint: '* Past turnip performance does not guarantee future results.',
    extra: '',
  },
  // 10. Blathers — "Museum exhibit card" style
  {
    cls: 'promo-blathers',
    layout: 'exhibit',
    icon: '🦉',
    title: 'Museum of Natural History',
    subtitle: 'CURATED BY BLATHERS',
    exhibits: [
      { emoji: '🦴', name: 'Fossils' },
      { emoji: '🐛', name: 'Bugs' },
      { emoji: '🐟', name: 'Fish' },
      { emoji: '🎨', name: 'Art' },
    ],
    body: 'Free assessments. Bug donations... tolerated.',
    quote: '"Hoo! Do keep insects at a safe distance."',
    extra: '',
  },
  // 11. Pascal — "Fortune cookie / wisdom card" style
  {
    cls: 'promo-pascal',
    layout: 'wisdom',
    icon: '🧪',
    title: "Pascal's Pearl Wisdom",
    body: 'Trade a scallop, receive enlightenment.',
    wisdomQuote: '"Maaan... like, what even IS furniture? Is a chair just a shelf for your butt?"',
    cta: '🐚 Trade Scallop',
    extra: '',
  },
  // 12. Label — "Fashion challenge" scorecard style
  {
    cls: 'promo-label',
    layout: 'challenge',
    icon: '🏷️',
    title: "Label's Fashion Check",
    body: 'Pass the vibe check. Win Able Sisters coupons.',
    challengeTheme: "Today's Theme",
    challengeWord: 'THEATRICAL',
    rewards: ['Tailor Ticket', 'Able Coupon', 'Label\'s Love'],
    extra: '',
  },
  // 13. Katrina — "Fortune teller" style with mystic layout
  {
    cls: 'promo-katrina',
    layout: 'fortune',
    icon: '🔮',
    title: "Katrina's Fortune Shop",
    body: 'Know your luck before you shake that tree.',
    fortuneLabel: "TODAY'S READING",
    fortuneResult: '✦ GREAT MISFORTUNE ✦',
    fortuneDetail: 'Belongings luck: terrible',
    quote: '"The stars... do not lie."',
    price: '1,000 bells per reading',
    extra: '<span class="fortune-stars">✦ ✧ ✦ ✧</span>',
  },
  // 14. Flick — "Artist commission" style with portfolio vibe
  {
    cls: 'promo-flick',
    layout: 'commission',
    icon: '🦋',
    title: "Flick's Bug Commissions",
    subtitle: 'ARTISAN SCULPTOR',
    body: 'Every bug is a masterpiece waiting to happen.',
    commissionSteps: ['Bring 3 of same bug', 'I sculpt it', 'ART IS BORN'],
    quote: '"Bugs are the purest form of beauty."',
    turnaround: 'Next-day delivery',
    extra: '',
  },
  // 15. Celeste — "Event flyer" style for meteor showers
  {
    cls: 'promo-celeste',
    layout: 'event',
    icon: '🪐',
    title: "Celeste's Star Fragment Exchange",
    eventName: 'METEOR SHOWER',
    eventDetail: 'Tonight • After 7 PM',
    body: 'Wish upon a star. Craft wands & celestial DIYs.',
    features: ['Star Fragments', 'Zodiac DIYs', 'Wand Recipes'],
    quote: '"The cosmos has so much to teach us, hoo!"',
    extra: '<span class="celeste-sparkles">⭐ ✨ ⭐</span>',
  },
  // 16. Gullivarrr — "Treasure map" style
  {
    cls: 'promo-gullivarrr',
    layout: 'treasure',
    icon: '🏴‍☠️',
    title: "Gullivarrr's Pirate Treasures",
    body: 'Find me communicator parts, earn pirate booty!',
    lootTable: [
      { emoji: '🗡️', name: 'Pirate Sword' },
      { emoji: '👑', name: 'Pirate Crown' },
      { emoji: '🛳️', name: 'Pirate Ship' },
    ],
    quote: '"Arrr... where be me phone?"',
    tag: '☠️ X MARKS THE SPOT',
    extra: '',
  },
  // 17. Harriet — "Salon booking" style with services
  {
    cls: 'promo-harriet',
    layout: 'salon',
    icon: '💄',
    title: 'Shampoodle Salon',
    subtitle: 'BY HARRIET',
    body: 'New styles, new colors, new you.',
    services: ['Haircut', 'Color', 'Perm'],
    cta: 'Book Appointment',
    tag: '✂️ Walk-ins Welcome',
    extra: '',
  },
  // 18. K.K. Slider — "Concert ticket" style
  {
    cls: 'promo-kk',
    layout: 'ticket',
    icon: '🎸',
    title: 'K.K. Slider',
    eventName: 'LIVE IN CONCERT',
    eventDetail: 'Saturday • 8 PM • The Plaza',
    body: 'Requests welcome. No cover charge.',
    features: ['Live Performance', 'Song Requests', 'Free Copies'],
    quote: '"Music should be free, man."',
    extra: '<span class="music-notes">♪ ♫ ♪</span>',
  },
  // 19. Tortimer — "Retro travel ad" / vintage postcard style
  {
    cls: 'promo-tortimer',
    layout: 'postcard',
    icon: '🐢',
    title: "Tortimer's Island Tours",
    subtitle: 'EST. 2001',
    body: 'Minigames, rare bugs, tropical fruit.',
    features: ['Bug-Off', 'Fishing Tourney', 'Fruit Picking'],
    quote: '"Back in my day, we had REAL islands."',
    tag: '🌴 Senior Discount Available',
    extra: '',
  },
  // 20. Able Sisters — "Coupon/ticket" with tear line
  {
    cls: 'promo-able',
    layout: 'coupon',
    icon: '🧵',
    title: 'Able Sisters',
    couponValue: '50% OFF',
    couponDetail: 'All Custom Designs',
    couponCode: 'SABLE4EVER',
    body: 'End-of-season clearance. In spirit.',
    finePrint: '* Discount is spiritual, not mathematical.',
    extra: '',
  },
  // 21. Resetti — "System alert / warning popup" style
  {
    cls: 'promo-resetti',
    layout: 'alert',
    icon: '😰',
    title: '⚠️ SAVE DATA WARNING',
    body: 'Your island may be at risk. Resetti\'s Save Data Insurance protects what matters.',
    alertLevel: 'THREAT LEVEL: HIGH',
    features: ['Auto-backup every 3 min', '24/7 mole patrol', 'Rage-quit coverage'],
    cta: 'PROTECT MY ISLAND',
    quote: '"DON\'T. RESET. YOUR. GAME."',
    extra: '<span class="alert-flash">Warning</span>',
  },
  // 22. Rover — "Travel booking" style with destination cards
  {
    cls: 'promo-rover',
    layout: 'booking',
    icon: '🚌',
    title: "Rover's Travel Bureau",
    subtitle: 'NEW LEAF ADVENTURES',
    body: "Moving to a new town? First trip's on me!",
    destinations: [
      { emoji: '🏝️', name: 'Island' },
      { emoji: '🏕️', name: 'Camp' },
      { emoji: '🏘️', name: 'Town' },
    ],
    quote: '"So... what\'s your name? Haha, just kidding."',
    cta: 'Plan My Trip',
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

  const badge = '<span class="promo-badge">Ad</span>';
  const extra = ad.extra || '';

  // ── Gracie Grace: luxury centered layout
  if (ad.isGracie) {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}
      <div class="banner-inner">
        <div class="gracie-brand">Gracie Grace</div>
        <div class="gracie-title">Luxury, Darling.</div>
        <div class="gracie-tagline">If you have to ask the price, you can't afford it.</div>
        <div class="gracie-cta">Shop Collection</div>
      </div>
    </div>`;
  }

  // ── Layout: scam (Redd)
  if (ad.layout === 'scam') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-rating"><span class="promo-stars">${ad.rating}</span> <span class="promo-rating-count">(${ad.ratingCount})</span></div>
          <div class="promo-price">${ad.price}</div>
          <div class="promo-divider"></div>
          <div class="promo-code">🎫 ${ad.promoCode}</div>
          <div class="promo-fine-print">${ad.finePrint}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: mystery (Sahara)
  if (ad.layout === 'mystery') {
    const items = ad.mysteryItems.map(i => `<span class="mystery-item">❓ ${i}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="mystery-items">${items}</div>
          <div class="promo-cta-btn">${ad.cta}</div>
          <div class="promo-fine-print">${ad.finePrint}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: appstore (CJ)
  if (ad.layout === 'appstore') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon promo-icon-app">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <div class="promo-subtitle">${ad.subtitle}</div>
          <div class="promo-app-meta">
            <span class="promo-stars">${ad.rating}</span>
            <span class="promo-rating-count">${ad.ratingCount}</span>
            <span class="promo-app-size">${ad.appSize}</span>
          </div>
          ${ad.quote ? `<span class="promo-quote">${ad.quote}</span>` : ''}
        </div>
        <div class="promo-install-btn">${ad.ctaLabel}</div>
      </div>
    </div>`;
  }

  // ── Layout: product (Kicks)
  if (ad.layout === 'product') {
    const sizes = ad.sizes.map(s => `<span class="size-chip">${s}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <span class="promo-hot-tag">${ad.tag}</span>
          <h3>${ad.title}</h3>
          <p class="promo-product-name">${ad.productName}</p>
          <div class="promo-price-row">
            <span class="promo-price">${ad.price} 🔔</span>
            <span class="promo-original-price">${ad.originalPrice}</span>
          </div>
          <div class="promo-sizes">${sizes}</div>
          <div class="promo-rating"><span class="promo-stars">${ad.rating}</span> <span class="promo-rating-count">(${ad.ratingCount})</span></div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: menu (Brewster)
  if (ad.layout === 'menu') {
    const menuRows = ad.menuItems.map(m =>
      `<div class="menu-row"><span class="menu-item-name">${m.item}</span><span class="menu-dots"></span><span class="menu-item-price">${m.price}${m.price !== 'Free' ? ' 🔔' : ''}</span></div>`
    ).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <div class="promo-menu">${menuRows}</div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: sale (Leif)
  if (ad.layout === 'sale') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-sale-badge">${ad.saleName}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-discount">${ad.discount}</div>
          <div class="promo-progress-wrap">
            <div class="promo-progress-bar" style="width:${ad.progressPercent}%"></div>
          </div>
          <div class="promo-progress-label">${ad.progressLabel}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: choice (Wisp)
  if (ad.layout === 'choice') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-choices">
            <span class="promo-choice-btn">${ad.optionA}</span>
            <span class="promo-choice-btn">${ad.optionB}</span>
          </div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: ticker (Daisy Mae)
  if (ad.layout === 'ticker') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <div class="promo-ticker">
            <span class="ticker-symbol">${ad.tickerLabel}</span>
            <span class="ticker-price">${ad.tickerPrice} 🔔</span>
            <span class="ticker-change ${ad.tickerTrend}">${ad.tickerChange}</span>
          </div>
          <p>${ad.body}</p>
          <span class="promo-tag">${ad.tag}</span>
          <div class="promo-fine-print">${ad.finePrint}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: exhibit (Blathers)
  if (ad.layout === 'exhibit') {
    const wings = ad.exhibits.map(e => `<span class="exhibit-wing"><span class="exhibit-emoji">${e.emoji}</span><span class="exhibit-name">${e.name}</span></span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <div class="exhibit-wings">${wings}</div>
          <p>${ad.body}</p>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: wisdom (Pascal)
  if (ad.layout === 'wisdom') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-wisdom-card">
            <div class="wisdom-quote">${ad.wisdomQuote}</div>
          </div>
          <div class="promo-cta-btn">${ad.cta}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: challenge (Label)
  if (ad.layout === 'challenge') {
    const rewardChips = ad.rewards.map(r => `<span class="reward-chip">🎁 ${r}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-challenge-theme">${ad.challengeTheme}</div>
          <div class="promo-challenge-word">${ad.challengeWord}</div>
          <div class="promo-rewards">${rewardChips}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: fortune (Katrina)
  if (ad.layout === 'fortune') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="promo-fortune-label">${ad.fortuneLabel}</div>
          <div class="promo-fortune-result">${ad.fortuneResult}</div>
          <div class="promo-fortune-detail">${ad.fortuneDetail}</div>
          <span class="promo-quote">${ad.quote}</span>
          <div class="promo-fortune-price">${ad.price}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: commission (Flick)
  if (ad.layout === 'commission') {
    const steps = ad.commissionSteps.map((s, i) =>
      `<span class="commission-step"><span class="step-num">${i + 1}</span>${s}</span>`
    ).join('<span class="step-arrow">→</span>');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="commission-steps">${steps}</div>
          <span class="promo-quote">${ad.quote}</span>
          <div class="promo-turnaround">⏱️ ${ad.turnaround}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: event (Celeste)
  if (ad.layout === 'event') {
    const feats = ad.features.map(f => `<span class="event-feature">${f}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-event-name">${ad.eventName}</div>
          <h3>${ad.title}</h3>
          <div class="promo-event-detail">${ad.eventDetail}</div>
          <div class="event-features">${feats}</div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: treasure (Gullivarrr)
  if (ad.layout === 'treasure') {
    const loot = ad.lootTable.map(l => `<span class="loot-item"><span class="loot-emoji">${l.emoji}</span><span class="loot-name">${l.name}</span></span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="loot-table">${loot}</div>
          <span class="promo-tag">${ad.tag}</span>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: salon (Harriet)
  if (ad.layout === 'salon') {
    const svc = ad.services.map(s => `<span class="salon-service">✂️ ${s}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="salon-services">${svc}</div>
          <div class="promo-cta-btn">${ad.cta}</div>
          <span class="promo-tag">${ad.tag}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: ticket (K.K.)
  if (ad.layout === 'ticket') {
    const feats = ad.features.map(f => `<span class="ticket-feature">${f}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-event-name">${ad.eventName}</div>
          <h3>${ad.title}</h3>
          <div class="promo-event-detail">${ad.eventDetail}</div>
          <div class="ticket-features">${feats}</div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: postcard (Tortimer)
  if (ad.layout === 'postcard') {
    const feats = ad.features.map(f => `<span class="postcard-feature">🌴 ${f}</span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="postcard-features">${feats}</div>
          <span class="promo-quote">${ad.quote}</span>
          <span class="promo-tag">${ad.tag}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: coupon (Able Sisters)
  if (ad.layout === 'coupon') {
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="coupon-left">
          <div class="promo-icon">${ad.icon}</div>
          <div class="coupon-value">${ad.couponValue}</div>
          <div class="coupon-detail">${ad.couponDetail}</div>
        </div>
        <div class="coupon-tear"></div>
        <div class="promo-text coupon-right">
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="coupon-code">Code: ${ad.couponCode}</div>
          <div class="promo-fine-print">${ad.finePrint}</div>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: alert (Resetti)
  if (ad.layout === 'alert') {
    const feats = ad.features.map(f => `<div class="alert-feature">✓ ${f}</div>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <h3>${ad.title}</h3>
          <div class="promo-alert-level">${ad.alertLevel}</div>
          <p>${ad.body}</p>
          <div class="alert-features">${feats}</div>
          <div class="promo-cta-btn promo-cta-alert">${ad.cta}</div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Layout: booking (Rover)
  if (ad.layout === 'booking') {
    const dests = ad.destinations.map(d => `<span class="dest-card"><span class="dest-emoji">${d.emoji}</span><span class="dest-name">${d.name}</span></span>`).join('');
    return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
      ${badge}${extra}
      <div class="banner-inner">
        <div class="promo-icon">${ad.icon}</div>
        <div class="promo-text">
          <div class="promo-subtitle">${ad.subtitle}</div>
          <h3>${ad.title}</h3>
          <p>${ad.body}</p>
          <div class="dest-cards">${dests}</div>
          <div class="promo-cta-btn">${ad.cta}</div>
          <span class="promo-quote">${ad.quote}</span>
        </div>
      </div>
    </div>`;
  }

  // ── Fallback: generic layout
  let bottomContent = '';
  if (ad.tag) bottomContent = `<span class="promo-tag">${ad.tag}</span>`;
  if (ad.quote) bottomContent = `<span class="promo-quote">${ad.quote}</span>`;

  return `<div class="nook-promo nook-flyer ${ad.cls}" data-nook-promo>
    ${badge}${extra}
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

// 60% chance of showing, max 1 per session (per category until one shows)
// Decision is made once and cached so re-renders produce the same result
let interstitialDecided = false;
let interstitialVisible = false;

function shouldShowInterstitial() {
  if (interstitialShownThisSession) return false;
  if (!interstitialDecided) {
    interstitialDecided = true;
    interstitialVisible = Math.random() <= 0.6;
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

  const prefs = getPrefs();
  const interType = ensureGridInterstitial();
  let html = '';
  let interstitialInserted = false;
  let bannersInserted = 0;
  // Scale max banners with grid size instead of a fixed cap
  const maxBanners = Math.max(1, Math.floor(items.length / BANNER_INTERVAL));

  for (let idx = 0; idx < items.length; idx++) {
    html += renderItemCardFn(items[idx], idx);

    // Insert interstitial after item 17 (30% chance, only on initial load)
    if (prefs.enabled && prefs.interstitials && idx === 16 && !interstitialInserted && shouldShowInterstitial()) {
      html += renderInterstitialAd(interType);
      interstitialInserted = true;
      NookSounds.play('interstitial');
    }

    // Insert a banner ad every BANNER_INTERVAL items
    if (prefs.enabled && prefs.banners && (idx + 1) % BANNER_INTERVAL === 0 && idx < items.length - 1 && bannersInserted < maxBanners) {
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
  const prefs = getPrefs();
  if (!prefs.enabled || !prefs.floatingNotifs) return null;
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

  const prefs = getPrefs();
  if (!prefs.enabled || !prefs.popups) return null;

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
