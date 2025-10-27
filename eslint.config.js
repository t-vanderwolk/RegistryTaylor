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
];
