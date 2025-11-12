#!/usr/bin/env node

const { statSync } = require("node:fs");
const { execSync } = require("node:child_process");
const path = require("node:path");

const dashboardDir = path.resolve(__dirname, "../apps/dashboard");
const buildDir = path.join(dashboardDir, ".next");

function hasNextBuild() {
  try {
    const stats = statSync(buildDir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function main() {
  if (hasNextBuild()) {
    console.log("✅ Next.js build already present – skipping build step.");
    return;
  }

  console.log("⚙️  No Next.js build found. Running dashboard build…");
  execSync("pnpm --filter taylor-made-app build", {
    stdio: "inherit",
  });
}

try {
  main();
} catch (error) {
  console.error("Failed to ensure Next.js build exists:", error);
  process.exit(1);
}
