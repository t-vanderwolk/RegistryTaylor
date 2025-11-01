const { randomUUID, createHash } = require("node:crypto");
const prisma = require("../../../../packages/db/prisma.js");

function coerceNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]+/g, "");
    if (!cleaned) {
      return null;
    }
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function ensureId(externalId, url, title) {
  if (externalId) {
    return externalId;
  }
  if (url) {
    return createHash("sha256").update(url).digest("hex");
  }
  if (title) {
    return createHash("sha256").update(title).digest("hex");
  }
  return randomUUID();
}

function normaliseImpactProduct(raw) {
  if (!raw) {
    return null;
  }
  const externalId =
    (raw.sku || raw.productSku || raw.id || raw.productId || "").trim() || null;
  const title =
    raw.title || raw.name || raw.productName || raw.displayName || externalId;
  if (!title) {
    return null;
  }
  return {
    externalId,
    title,
    brand: raw.brand || raw.merchant || null,
    price: raw.price || raw.salePrice || raw.retailPrice || null,
    category: raw.category || raw.vertical || null,
    image: raw.image || raw.imageUrl || raw.image_url || null,
    url: raw.url || raw.landingPage || raw.purchaseLink || null,
    affiliateUrl:
      raw.affiliateUrl || raw.clickUrl || raw.trackingUrl || raw.url || null,
    retailer: raw.retailer || raw.advertiser || raw.brand || "Impact Network",
  };
}

async function importImpactCatalog() {
  console.log("🔄 Syncing Impact catalog...");

  const apiUrl = process.env.IMPACT_API_URL;
  const apiKey = process.env.IMPACT_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn(
      "⚠️  Skipping Impact import – IMPACT_API_URL or IMPACT_API_KEY is missing."
    );
    return 0;
  }

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Impact feed request failed (${response.status} ${response.statusText})`
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    console.error("⚠️  Failed to parse Impact feed JSON:", error.message);
    return 0;
  }

  const candidates = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  if (!candidates.length) {
    console.warn("⚠️  Impact feed returned no product entries.");
    return 0;
  }

  let imported = 0;
  for (const raw of candidates) {
    const product = normaliseImpactProduct(raw);
    if (!product) {
      continue;
    }
    const { externalId, title } = product;
    const id = ensureId(externalId, product.url, title);
    const where = externalId ? { externalId } : { id };

    await prisma.registryCatalogItem.upsert({
      where,
      update: {
        title,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: product.retailer ?? null,
        source: "impact",
      },
      create: {
        id,
        externalId,
        title,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: product.retailer ?? null,
        source: "impact",
      },
    });
    imported += 1;
  }

  console.log(`✅ Imported ${imported} Impact catalog items`);
  return imported;
}

module.exports = {
  importImpactCatalog,
};
