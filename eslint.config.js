<<<<<<< HEAD
import globals from "globals";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

const nextCore = nextPlugin.configs["core-web-vitals"];
const nextTs = nextPlugin.configs["recommended"];

export default [
  {
    ignores: [
      "node_modules/**",
      "**/.next/**",
      "apps/dashboard/node_modules/**",
      "apps/backend/node_modules/**",
      "frontend/node_modules/**",
      "apps/dashboard/.next/**",
      "frontend/build/**",
      "apps/backend/dist/**",
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
      ...(nextTs?.rules ?? {}),
      ...(nextCore?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
=======
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.prototype.throwIfAborted !== 'function') {
  AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
    if (this.aborted) {
      const reason = this.reason || new Error('Aborted');
      throw reason instanceof Error ? reason : new Error(String(reason));
    }
  };
}

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'frontend/node_modules/**',
      'backend/node_modules/**',
      'frontend/build/**',
      'backend/dist/**',
      '**/coverage/**',
      '**/*.config.js',
    ],
  },
  ...compat.config(require('./.eslintrc.json')),
>>>>>>> heroku/main
];
