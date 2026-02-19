// Data loading and search
let catalogIndex = null; // { categories, items }
const categoryCache = {}; // display-slug -> items array

const BG_COLORS = ['#efd4dd', '#E8DFCF', '#D6DFC8', '#F2D9E0'];

export function getItemBg(index) {
  return BG_COLORS[index % BG_COLORS.length];
}

export async function loadCatalog() {
  if (catalogIndex) return catalogIndex;
  const resp = await fetch('data/catalog-index.json');
  catalogIndex = await resp.json();
  return catalogIndex;
}

export function getCategories() {
  return catalogIndex?.categories || [];
}

export function getItemsByCategory(category, offset = 0, limit = 50) {
  if (!catalogIndex) return { items: [], total: 0 };
  let items = catalogIndex.items;
  if (category && category !== 'All') {
    items = items.filter(i => i.c === category);
  }
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}

export function searchItems(query, offset = 0, limit = 50) {
  if (!catalogIndex || !query) return { items: [], total: 0 };
  const q = query.toLowerCase().trim();
  const items = catalogIndex.items.filter(i =>
    i.n.toLowerCase().includes(q) || i.t.includes(q)
  );
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}

export function getRandomItems(count = 20) {
  if (!catalogIndex) return [];
  const all = catalogIndex.items;
  const shuffled = [];
  const used = new Set();
  while (shuffled.length < count && shuffled.length < all.length) {
    const i = Math.floor(Math.random() * all.length);
    if (!used.has(i)) {
      used.add(i);
      shuffled.push(all[i]);
    }
  }
  return shuffled;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function getItemDetail(itemId) {
  // Find item in index to know its category
  if (!catalogIndex) await loadCatalog();
  const indexItem = catalogIndex.items.find(i => i.id === itemId);
  if (!indexItem) return null;

  const catSlug = slugify(indexItem.c);
  if (!categoryCache[catSlug]) {
    const resp = await fetch(`data/categories/${catSlug}.json`);
    categoryCache[catSlug] = await resp.json();
  }

  return categoryCache[catSlug].find(i => i.id === itemId) || null;
}

export function getIndexItem(itemId) {
  return catalogIndex?.items.find(i => i.id === itemId) || null;
}

export function getTotalCount() {
  return catalogIndex?.items.length || 0;
}

// ─── Expanded Variants (one card per variant) ───
const expandedCache = {}; // category slug -> expanded array

async function loadCategoryData(category) {
  const catSlug = slugify(category);
  if (!categoryCache[catSlug]) {
    const resp = await fetch(`data/categories/${catSlug}.json`);
    categoryCache[catSlug] = await resp.json();
  }
  return categoryCache[catSlug];
}

const COLOR_TAGS = new Set(['aqua','beige','black','blue','brown','colorful','gray','green','orange','pink','purple','red','white','yellow']);

function expandCategoryItems(categoryItems) {
  const expanded = [];
  for (const item of categoryItems) {
    // Separate non-color tags from parent item
    const nonColorTags = (item.tags || []).filter(t => !COLOR_TAGS.has(t.toLowerCase()));
    for (let vi = 0; vi < item.variants.length; vi++) {
      const v = item.variants[vi];
      // Build per-variant tags: non-color parent tags + this variant's colors only
      const variantColors = [v.color1, v.color2].filter(Boolean);
      const variantTags = [...nonColorTags, ...variantColors].join('|').toLowerCase();
      expanded.push({
        id: item.id,
        variantIdx: vi,
        n: item.name,
        v1: v.name,
        hex: v.hexVariated || v.hex || item.hexBase,
        img: v.image || item.image,
        c: item.category,
        t: variantTags,
      });
    }
  }
  return expanded;
}

export async function getExpandedByCategory(category, offset = 0, limit = 50) {
  if (!catalogIndex) return { items: [], total: 0, loading: false };
  const catSlug = slugify(category);

  if (!expandedCache[catSlug]) {
    const catData = await loadCategoryData(category);
    expandedCache[catSlug] = expandCategoryItems(catData);
  }

  const items = expandedCache[catSlug];
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}

export async function getExpandedAll(offset = 0, limit = 50) {
  if (!catalogIndex) return { items: [], total: 0 };

  // Load all categories that aren't cached yet
  const cats = catalogIndex.categories;
  const toLoad = cats.filter(c => !expandedCache[slugify(c.name)]);
  await Promise.all(toLoad.map(async (c) => {
    const catData = await loadCategoryData(c.name);
    expandedCache[slugify(c.name)] = expandCategoryItems(catData);
  }));

  // Merge all expanded
  if (!expandedCache._all) {
    const all = [];
    for (const c of cats) {
      all.push(...(expandedCache[slugify(c.name)] || []));
    }
    expandedCache._all = all;
  }

  return {
    items: expandedCache._all.slice(offset, offset + limit),
    total: expandedCache._all.length,
  };
}

export async function searchExpandedItems(query, offset = 0, limit = 50) {
  if (!catalogIndex) return { items: [], total: 0 };

  // Ensure all categories are loaded
  await getExpandedAll(0, 1);

  const all = expandedCache._all || [];
  if (!query) return { items: [], total: 0 };

  const q = query.toLowerCase().trim();
  const filtered = all.filter(i =>
    i.n.toLowerCase().includes(q) || i.t.includes(q)
  );
  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

// ─── Tag Extraction ───
let tagGroupsCache = null;

export function getAvailableTags() {
  if (tagGroupsCache) return tagGroupsCache;
  if (!catalogIndex) return {};

  const colorSet = new Set(['aqua','beige','black','blue','brown','colorful','gray','green','orange','pink','purple','red','white','yellow']);
  const styleSet = new Set(['active','cool','cute','elegant','gorgeous','simple']);
  const catalogSet = new Set(['for sale','not for sale','not in catalog']);

  const colors = new Set();
  const styles = new Set();
  const catalogStatus = new Set();
  const other = new Set();

  for (const item of catalogIndex.items) {
    for (const tag of item.t.split('|')) {
      const t = tag.trim().toLowerCase();
      if (!t) continue;
      if (colorSet.has(t)) colors.add(t);
      else if (styleSet.has(t)) styles.add(t);
      else if (catalogSet.has(t)) catalogStatus.add(t);
      else other.add(t);
    }
  }

  tagGroupsCache = {
    Colors: [...colors].sort(),
    Styles: [...styles].sort(),
    Catalog: [...catalogStatus].sort(),
    Other: [...other].sort(),
  };
  return tagGroupsCache;
}

export async function searchExpandedWithTags(query, tags = [], offset = 0, limit = 50) {
  if (!catalogIndex) return { items: [], total: 0 };
  await getExpandedAll(0, 1);
  const all = expandedCache._all || [];

  const q = query ? query.toLowerCase().trim() : '';
  const filtered = all.filter(i => {
    if (q && !(i.n.toLowerCase().includes(q) || i.t.includes(q))) return false;
    for (const tag of tags) {
      if (!i.t.includes(tag.toLowerCase())) return false;
    }
    return q || tags.length > 0;
  });
  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export async function getRandomExpandedItems(count = 20) {
  await getExpandedAll(0, 1);
  const all = expandedCache._all || [];
  const shuffled = [];
  const used = new Set();
  while (shuffled.length < count && shuffled.length < all.length) {
    const i = Math.floor(Math.random() * all.length);
    if (!used.has(i)) {
      used.add(i);
      shuffled.push(all[i]);
    }
  }
  return shuffled;
}
