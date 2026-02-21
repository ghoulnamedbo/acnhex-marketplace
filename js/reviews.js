// Villager review generation for item detail pages
let villagersData = null;
let templatesData = null;

async function ensureData() {
  if (villagersData && templatesData) return;
  const [v, t] = await Promise.all([
    villagersData ? villagersData : fetch('data/villagers.json').then(r => r.json()),
    templatesData ? templatesData : fetch('data/review-templates.json').then(r => r.json()),
  ]);
  villagersData = v;
  templatesData = t;
}

function pickRandom(arr, count) {
  const indices = arr.map((_, i) => i);
  const result = [];
  for (let i = 0; i < count && i < indices.length; i++) {
    const j = i + Math.floor(Math.random() * (indices.length - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
    result.push(arr[indices[i]]);
  }
  return result;
}

function randomStarRating() {
  const weights = [12, 10, 15, 25, 38];
  const total = 100;
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i + 1;
  }
  return 5;
}

function getTemplate(category, personality, subtype, starRating) {
  const key = `${personality}_${subtype}`;
  const byPersonality = templatesData.templates[key];
  if (!byPersonality) return null;
  const byStar = byPersonality[String(starRating)];
  if (!byStar) return null;
  const templates = byStar[category];
  if (!templates || templates.length === 0) return null;
  return templates[Math.floor(Math.random() * templates.length)];
}

function escRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectPlural(name) {
  const singularExceptions = ['bass','dress','grass','glass','canvas','compass','cactus','cosmos','octopus','atlas','chess','mess','across','process','harness','mattress','headdress'];
  const lower = name.toLowerCase();
  const lastWord = lower.split(/\s+/).pop();
  if (singularExceptions.includes(lastWord)) return false;
  if (lastWord.endsWith('ss') || lastWord.endsWith('us') || lastWord.endsWith('is')) return false;
  return lastWord.endsWith('s');
}

// Convert a 3rd-person singular present verb to its base/plural form
function depluralize(verb) {
  const v = verb.toLowerCase();
  // -ies → -y (carries → carry, loses → no, flies → fly)
  if (v.endsWith('ies') && v.length > 3) return verb.slice(0, -3) + 'y';
  // -ches/-shes/-xes/-zes/-ses → remove -es (catches → catch, bunches → bunch)
  if (v.endsWith('ches') || v.endsWith('shes') || v.endsWith('xes') || v.endsWith('zes')) return verb.slice(0, -2);
  // -ses → -s or drop -es depending on root (loses → lose, closes → close)
  if (v.endsWith('ses') && v.length > 3) return verb.slice(0, -1);
  // -oes → -o (goes → go)
  if (v.endsWith('oes') && v.length > 3) return verb.slice(0, -2);
  // generic -s ending (looks → look, wobbles → wobble, sits → sit)
  if (v.endsWith('s') && v.length > 2) return verb.slice(0, -1);
  return verb;
}

function fillTemplate(template, villager, itemName, category) {
  let result = template
    .replace(/\[Item Name\]/g, itemName)
    .replace(/\[Catchphrase\]/g, villager.catchphrase)
    .replace(/\[Hobby\]/g, villager.hobby || '')
    .replace(/\[Favorite Song\]/g, villager.favoriteSong || '')
    .replace(/\[Default Umbrella\]/g, villager.defaultUmbrella || '')
    .replace(/\[Wallpaper\]/g, villager.wallpaper || '')
    .replace(/\[Flooring\]/g, villager.flooring || '')
    .replace(/\[Category\]/g, category)
    .replace(/\[Villager\]/g, villager.name);

  // Grammar correction for plural item names (e.g. "Socks", "Insects", "Gyroids")
  if (detectPlural(itemName)) {
    const esc = escRegex(itemName);
    result = result
      // this/these
      .replace(new RegExp(`\\bthis ${esc}\\b`, 'gi'), (m) => (m[0] === 'T' ? 'These' : 'these') + m.slice(4))
      // is/are, was/were, has/have
      .replace(new RegExp(`\\b${esc} is\\b`, 'gi'), `${itemName} are`)
      .replace(new RegExp(`\\b${esc} was\\b`, 'gi'), `${itemName} were`)
      .replace(new RegExp(`\\b${esc} has\\b`, 'gi'), `${itemName} have`)
      // doesn't → don't
      .replace(new RegExp(`\\b${esc} doesn't\\b`, 'gi'), `${itemName} don't`)
      // 3rd-person singular verbs → base form (looks→look, carries→carry, etc.)
      .replace(new RegExp(`\\b(${esc}) ([A-Za-z]+s)\\b`, 'g'), (match, name, verb) => {
        const base = depluralize(verb);
        return base !== verb ? `${name} ${base}` : match;
      });
  }
  return result;
}

function reviewDate(birthday) {
  const year = 2020 + Math.floor(Math.random() * 7);
  const [month, day] = birthday.split('/');
  const date = new Date(year, parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function starSvgs(count, size = 12) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    const fill = i < count ? '#f5a623' : '#EDE5DF';
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }
  return html;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export async function generateReviewSection(item) {
  await ensureData();

  const reviewCount = Math.floor(Math.random() * 25) + 1;
  const selectedVillagers = pickRandom(villagersData, reviewCount);
  const category = item.category;

  const reviews = selectedVillagers.map(villager => {
    const stars = randomStarRating();
    const template = getTemplate(category, villager.personality, villager.subtype, stars);
    const text = template
      ? fillTemplate(template, villager, item.name, category)
      : `This ${item.name} is interesting, ${villager.catchphrase}!`;
    return { villager, stars, text, date: reviewDate(villager.birthday) };
  });

  const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
  const avgRating = (totalStars / reviews.length).toFixed(1);
  const distribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => distribution[r.stars - 1]++);
  const maxCount = Math.max(...distribution, 1);

  // Rating summary with bar chart
  let barsHtml = '';
  for (let s = 5; s >= 1; s--) {
    const count = distribution[s - 1];
    const pct = Math.round((count / reviews.length) * 100);
    barsHtml += `
      <div class="reviews-bar-row">
        <span class="reviews-bar-label">${s}</span>
        <span class="reviews-bar-star">★</span>
        <div class="reviews-bar-track">
          <div class="reviews-bar-fill" style="width:${(count / maxCount) * 100}%"></div>
        </div>
        <span class="reviews-bar-pct">${pct}%</span>
      </div>`;
  }

  // Individual review cards
  let reviewsHtml = '';
  for (const r of reviews) {
    reviewsHtml += `
      <div class="review-item">
        <div class="review-header">
          <img class="review-avatar" src="${esc(r.villager.photo)}" alt="" loading="lazy" onerror="this.style.display='none'">
          <div class="review-info">
            <span class="review-name">${esc(r.villager.name)}</span>
            <div class="review-meta">
              <span class="review-stars-small">${starSvgs(r.stars, 11)}</span>
              <span class="review-date">${esc(r.date)}</span>
            </div>
          </div>
        </div>
        <p class="review-text">${esc(r.text)}</p>
      </div>`;
  }

  const html = `
    <div class="reviews-card">
      <h4 class="label-upper" style="margin-bottom:16px">Villager Reviews</h4>
      <div class="reviews-summary">
        <div class="reviews-score">
          <span class="reviews-big-number">${avgRating}</span>
          <div class="reviews-stars">${starSvgs(Math.round(parseFloat(avgRating)), 14)}</div>
          <span class="reviews-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="reviews-bars">${barsHtml}</div>
      </div>
      <div class="reviews-list">${reviewsHtml}</div>
    </div>`;

  return { html, avgRating, totalReviews: reviews.length };
}
