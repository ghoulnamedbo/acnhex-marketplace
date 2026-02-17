/**
 * Data module - loads and processes the item database
 */

const Data = {
  raw: null,
  items: [],
  categories: [],
  loaded: false,

  async load() {
    if (this.loaded) return this.items;

    try {
      const response = await fetch('/database.json');
      this.raw = await response.json();
      this.categories = Object.keys(this.raw);
      this.processItems();
      this.loaded = true;
      console.log(`Loaded ${this.items.length} items across ${this.categories.length} categories`);
      return this.items;
    } catch (error) {
      console.error('Failed to load database:', error);
      throw error;
    }
  },

  processItems() {
    // Flatten all categories into a single array with category info
    // Group variants together under a single base item
    const itemMap = new Map();

    for (const category of this.categories) {
      const categoryItems = this.raw[category];

      for (const item of categoryItems) {
        // Create a base key from name (to group variants)
        const baseKey = `${category}::${item.Name}`;

        // Get image URL (different fields for different categories)
        const image = item['Closet Image'] || item['Image'] || item['Album Image'] || '';

        // Get the full hex ID with variation if available
        const hexIdFull = item['Hex ID w/variation'] || item['Hex ID'];

        const variantData = {
          variation: item.Variation || 'NA',
          filename: item.Filename,
          image: image,
          hexId: item['Hex ID'],
          hexIdFull: hexIdFull,
          color1: item['Color 1'] || '',
          color2: item['Color 2'] || ''
        };

        if (itemMap.has(baseKey)) {
          // Add variant to existing item
          itemMap.get(baseKey).variants.push(variantData);
        } else {
          // Create new base item
          itemMap.set(baseKey, {
            name: item.Name,
            category: category,
            baseHexId: item['Hex ID'],
            catalog: item.Catalog || '',
            style1: item['Style 1'] || '',
            style2: item['Style 2'] || '',
            labelThemes: item['Label Themes'] || '',
            hhaConcept1: item['HHA Concept 1'] || '',
            hhaConcept2: item['HHA Concept 2'] || '',
            hhaSeries: item['HHA Series'] || '',
            hhaSet: item['HHA Set'] || '',
            size: item.Size || '',
            tag: item.Tag || '',
            diy: item.DIY || '',
            variants: [variantData]
          });
        }
      }
    }

    this.items = Array.from(itemMap.values());
  },

  // Get unique values for filters
  getUniqueValues(field) {
    const values = new Set();

    for (const item of this.items) {
      let value = item[field];
      if (value && value !== '' && value !== 'NA' && value !== 'None') {
        // Handle semicolon-separated values (like Label Themes)
        if (typeof value === 'string' && value.includes(';')) {
          value.split(';').forEach(v => values.add(v.trim()));
        } else {
          values.add(value);
        }
      }
    }

    return Array.from(values).sort();
  },

  // Get all unique colors from variants
  getUniqueColors() {
    const colors = new Set();

    for (const item of this.items) {
      for (const variant of item.variants) {
        if (variant.color1 && variant.color1 !== '') colors.add(variant.color1);
        if (variant.color2 && variant.color2 !== '') colors.add(variant.color2);
      }
    }

    return Array.from(colors).sort();
  },

  // Search items by name
  searchByName(query) {
    const lowerQuery = query.toLowerCase();
    return this.items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter items
  filterItems(filters) {
    return this.items.filter(item => {
      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (item.category !== filters.category) return false;
      }

      // Catalog filter (catalogable)
      if (filters.catalog) {
        if (item.catalog !== filters.catalog) return false;
      }

      // Style filter
      if (filters.style) {
        if (item.style1 !== filters.style && item.style2 !== filters.style) return false;
      }

      // Set filter (HHA Set)
      if (filters.set) {
        if (item.hhaSet !== filters.set) return false;
      }

      // Color filter - check if any variant has the color
      if (filters.color) {
        const hasColor = item.variants.some(v =>
          v.color1 === filters.color || v.color2 === filters.color
        );
        if (!hasColor) return false;
      }

      // Search query
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(lowerQuery)) return false;
      }

      return true;
    });
  },

  // Get item by base name and category
  getItem(category, name) {
    return this.items.find(item =>
      item.category === category && item.name === name
    );
  },

  // Get item by filename (for wishlist/cart lookups)
  getItemByFilename(filename) {
    for (const item of this.items) {
      const variant = item.variants.find(v => v.filename === filename);
      if (variant) {
        return { item, variant };
      }
    }
    return null;
  }
};

export default Data;
