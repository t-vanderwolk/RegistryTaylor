const globals = require("globals");
const js = require("@eslint/js");
const nextPlugin = require("@next/eslint-plugin-next");
const reactHooks = require("eslint-plugin-react-hooks");
const tsParser = require("@typescript-eslint/parser");

const nextCore = nextPlugin.configs["core-web-vitals"];
const nextRecommended = nextPlugin.configs.recommended;

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "**/.next/**",
      "apps/dashboard/node_modules/**",
      "apps/backend/node_modules/**",
      "frontend/node_modules/**",
      "backend/node_modules/**",
      "apps/dashboard/.next/**",
      "frontend/build/**",
      "apps/backend/dist/**",
      "backend/dist/**",
      "**/coverage/**",
      "**/*.config.js",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...(nextRecommended?.rules ?? {}),
      ...(nextCore?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off",
      "no-console": "off",
    },
  },
];
