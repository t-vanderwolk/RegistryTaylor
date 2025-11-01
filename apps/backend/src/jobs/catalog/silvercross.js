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

function sanitiseCell(value) {
  if (value === undefined || value === null) {
    return "";
  }
  let cleaned = String(value);
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.replace(/""/g, '"').trim();
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(sanitiseCell);
}

function parseCsv(text) {
  if (typeof text !== "string" || !text.trim()) {
    return [];
  }
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) {
    return [];
  }
  const headers = splitCsvLine(lines[0]).map((key) => key.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });
}

function normaliseSilverCrossProduct(raw) {
  if (!raw) {
    return null;
  }
  const externalId =
    (raw.sku || raw.id || raw.product_id || raw["product id"] || "").trim() ||
    null;
  const title =
    raw.title || raw.name || raw["product name"] || raw.model || externalId;
  if (!title) {
    return null;
  }

  return {
    externalId,
    title,
    brand: raw.brand || "Silver Cross",
    price: raw.price || raw["msrp"] || null,
    category: raw.category || raw.department || null,
    image: raw.image || raw["image url"] || raw["image_url"] || null,
    url:
      raw.url ||
      raw.link ||
      raw["product url"] ||
      raw["product link"] ||
      null,
    affiliateUrl:
      raw.affiliateurl ||
      raw["affiliate url"] ||
      raw["tracking url"] ||
      raw.url ||
      null,
    retailer: raw.retailer || raw.brand || "Silver Cross",
  };
}

async function importSilverCrossCatalog() {
  console.log("🔄 Syncing Silver Cross catalog...");

  const feedUrl = process.env.SILVERCROSS_FEED_URL;
  if (!feedUrl) {
    console.warn(
      "⚠️  Skipping Silver Cross import – SILVERCROSS_FEED_URL is missing."
    );
    return 0;
  }

  const response = await fetch(feedUrl, {
    headers: {
      Accept: "text/csv,application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Silver Cross feed request failed (${response.status} ${response.statusText})`
    );
  }

  const csv = await response.text();
  const products = parseCsv(csv).map(normaliseSilverCrossProduct).filter(Boolean);

  if (!products.length) {
    console.warn("⚠️  Silver Cross feed returned no product entries.");
    return 0;
  }

  let imported = 0;
  for (const product of products) {
    const id = ensureId(product.externalId, product.url, product.title);
    const where = product.externalId ? { externalId: product.externalId } : { id };

    await prisma.registryCatalogItem.upsert({
      where,
      update: {
        title: product.title,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: product.retailer ?? "Silver Cross",
        source: "silvercross",
      },
      create: {
        id,
        externalId: product.externalId,
        title: product.title,
        brand: product.brand ?? null,
        price: coerceNumber(product.price),
        category: product.category ?? null,
        image: product.image ?? null,
        url: product.url ?? null,
        affiliateUrl: product.affiliateUrl ?? product.url ?? null,
        retailer: product.retailer ?? "Silver Cross",
        source: "silvercross",
      },
    });

    imported += 1;
  }

  console.log(`✅ Imported ${imported} Silver Cross catalog items`);
  return imported;
}

module.exports = {
  importSilverCrossCatalog,
};
