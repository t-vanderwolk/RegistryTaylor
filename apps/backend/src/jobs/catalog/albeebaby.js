const { randomUUID, createHash } = require("node:crypto");
const prisma = require("../../../../packages/db/prisma.js");

function decodeHtml(value) {
  if (!value) {
    return "";
  }
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim();
}

function getTagValue(block, tag) {
  const safeTag = tag.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`<${safeTag}[^>]*>([\\s\\S]*?)</${safeTag}>`, "i");
  const match = block.match(regex);
  return match ? decodeHtml(match[1]) : null;
}

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

function parseCJ(xml) {
  if (typeof xml !== "string" || !xml.trim()) {
    return [];
  }
  const productRegex = /<product\b[^>]*>[\s\S]*?<\/product>/gi;
  const matches = xml.match(productRegex) || [];
  return matches
    .map((block) => {
      const sku = getTagValue(block, "sku") || getTagValue(block, "sku-number");
      const name =
        getTagValue(block, "name") ||
        getTagValue(block, "product-name") ||
        sku ||
        null;
      if (!name) {
        return null;
      }
      const price =
        getTagValue(block, "price") || getTagValue(block, "retail-price");
      const buyUrl =
        getTagValue(block, "buy-url") ||
        getTagValue(block, "link") ||
        getTagValue(block, "coupon-link");
      return {
        sku: sku || null,
        name,
        brand: getTagValue(block, "manufacturer") || getTagValue(block, "brand"),
        price: price || null,
        image:
          getTagValue(block, "image-url") ||
          getTagValue(block, "large-image") ||
          null,
        url: buyUrl || null,
        affiliateUrl:
          getTagValue(block, "tracking-url") ||
          getTagValue(block, "affiliate-url") ||
          buyUrl ||
          null,
        category: getTagValue(block, "category") || null,
      };
    })
    .filter(Boolean);
}

async function importAlbeeBabyCatalog() {
  console.log("🔄 Syncing Albee Baby catalog...");

  const apiUrl = process.env.CJ_API_URL;
  const apiKey = process.env.CJ_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn(
      "⚠️  Skipping Albee Baby import – CJ_API_URL or CJ_API_KEY is missing."
    );
    return 0;
  }

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `CJ feed request failed (${response.status} ${response.statusText})`
    );
  }

  const xml = await response.text();
  const products = parseCJ(xml);

  if (!products.length) {
    console.warn("⚠️  CJ feed returned no product entries.");
    return 0;
  }

  let imported = 0;
  for (const product of products) {
    const externalId =
      (product.sku || product.url || product.name || "").trim() || null;
    const id = ensureId(externalId, product.url, product.name);
    const where = externalId ? { externalId } : { id };

    await prisma.registryCatalogItem.upsert({
      where,
      update: {
        title: product.name,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: "Albee Baby",
        source: "cj",
      },
      create: {
        id,
        externalId,
        title: product.name,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: "Albee Baby",
        source: "cj",
      },
    });
    imported += 1;
  }

  console.log(`✅ Imported ${imported} Albee Baby catalog items`);
  return imported;
}

module.exports = {
  importAlbeeBabyCatalog,
  parseCJ,
};
