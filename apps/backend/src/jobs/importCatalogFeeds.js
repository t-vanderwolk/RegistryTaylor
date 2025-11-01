const { importAlbeeBabyCatalog } = require("./catalog/albeebaby.js");
const { importImpactCatalog } = require("./catalog/impact.js");
const { importSilverCrossCatalog } = require("./catalog/silvercross.js");

async function importCatalogFeeds() {
  console.log("🚀 Starting catalog imports...");
  await importAlbeeBabyCatalog();
  await importImpactCatalog();
  await importSilverCrossCatalog();
  console.log("✨ Catalog feeds complete!");
}

module.exports = {
  importCatalogFeeds,
};

if (require.main === module) {
  importCatalogFeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
