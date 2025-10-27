const cache = new Map();

const getTtl = () => {
  const ttlMinutes = Number(process.env.MACROBABY_CACHE_TTL_MINUTES || 15);
  return Math.max(1, ttlMinutes) * 60 * 1000;
};

const normaliseProduct = (product) => {
  if (!product) return null;
  const price =
    product.price_cents ??
    (product.price ? Math.round(Number(product.price) * 100) : null);

  return {
    id: product.id || product.product_id || product.sku || null,
    title: product.title || product.name || 'Unnamed product',
    brand: product.brand || product.manufacturer || null,
    category: product.category || product.categories?.[0] || null,
    imageUrl: product.image || product.image_url || product.primary_image || null,
    affiliateUrl: product.url || product.link || product.affiliate_url || null,
    priceCents: price,
    metadata: {
      raw: product,
    },
  };
};

const safeFetch = async (urlString, options = {}) => {
  if (typeof fetch !== 'function') {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.MACROBABY_TIMEOUT_MS || 4000)
  );

  try {
    const response = await fetch(urlString, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

exports.fetchProducts = async ({ categories = [] } = {}) => {
  const apiUrl = process.env.MACROBABY_API_URL;
  const affiliateId = process.env.MACROBABY_AFFILIATE_ID || process.env.MACROBABY_AFFILIATE;

  if (!apiUrl || !affiliateId) {
    return [];
  }

  const canonicalCategories = Array.from(new Set(categories.filter(Boolean))).sort();
  const key = JSON.stringify({ categories: canonicalCategories });

  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const url = new URL(apiUrl);
  url.searchParams.set('affiliate_id', affiliateId);
  url.searchParams.set('limit', process.env.MACROBABY_MAX_RESULTS || 16);

  if (canonicalCategories.length) {
    url.searchParams.set('category', canonicalCategories.join(','));
  }

  const payload = await safeFetch(url.toString());
  const products = Array.isArray(payload?.products)
    ? payload.products
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  const normalised = products
    .map(normaliseProduct)
    .filter(Boolean)
    .slice(0, Number(process.env.MACROBABY_MAX_RESULTS || 16));

  cache.set(key, {
    data: normalised,
    expiresAt: Date.now() + getTtl(),
  });

  return normalised;
};
