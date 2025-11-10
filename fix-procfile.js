#!/usr/bin/env node
import fs from "fs";
import path from "path";

const possiblePaths = [
  "apps/backend/src/server.js",
  "backend/src/server.js",
  "apps/backend/dist/server.js",
  "backend/dist/server.js",
  "server.js"
];

const found = possiblePaths.find(p => fs.existsSync(path.resolve(p)));

if (!found) {
  console.error("❌ Could not find any server.js in expected locations:");
  console.error(possiblePaths.map(p => " - " + p).join("\n"));
  process.exit(1);
}

const procfileContent = `web: node ${found}\n`;
fs.writeFileSync("Procfile", procfileContent);

console.log("✅ Procfile updated successfully!");
console.log("→ Now running server from:", found);