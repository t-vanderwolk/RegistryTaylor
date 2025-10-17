const path = require("path");

const baseConfig = require("./apps/web/tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: (baseConfig.content ?? []).map((pattern) =>
    pattern.startsWith("./")
      ? path.posix.join("./apps/web", pattern.slice(2))
      : pattern
  ),
};
