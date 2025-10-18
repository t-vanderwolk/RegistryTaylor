import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import globals from "globals";
import { fileURLToPath } from "node:url";
import path from "node:path";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL(".", import.meta.url)));
const tsProjectPaths = [
  path.join(tsconfigRootDir, "apps/api/tsconfig.json"),
  path.join(tsconfigRootDir, "apps/web/tsconfig.json"),
];

const ignores = {
  name: "root/ignores",
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/coverage/**",
    "**/.turbo/**",
    "frontend/**",
    "backend/**",
  ],
};

const sharedLanguage = {
  name: "root/language-options",
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
};

const typeCheckedRules =
  (tsPlugin.configs["recommended-type-checked"] ??
    tsPlugin.configs.recommendedTypeChecked ??
    { rules: {} }).rules ?? {};

const relaxedTypeRules = {
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-misused-promises": [
    "warn",
    { checksVoidReturn: { attributes: false, arguments: false }, checksSpreads: false },
  ],
  "@typescript-eslint/no-floating-promises": ["warn", { ignoreVoid: true, ignoreIIFE: true }],
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/no-require-imports": "off",
  "no-undef": "off",
};

const typescriptConfig = {
  name: "root/typescript",
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      project: tsProjectPaths,
      tsconfigRootDir,
      projectService: true,
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    ...typeCheckedRules,
    ...relaxedTypeRules,
  },
};

const createWebOverrides = ({ prefix = "" } = {}) => [
  {
    name: prefix ? `web/${prefix}` : "web",
    files: [`${prefix}**/*.{js,jsx,ts,tsx}`],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        process: "readonly",
        React: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...(reactPlugin.configs.recommended?.rules ?? {}),
      ...(reactHooksPlugin.configs.recommended?.rules ?? {}),
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-no-target-blank": "warn",
      "react/no-unknown-property": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-duplicate-head": "off",
    },
  },
];

const createApiOverrides = ({ prefix = "" } = {}) => [
  {
    name: prefix ? `api/${prefix}` : "api",
    files: [`${prefix}**/*.ts`],
    languageOptions: {
      globals: {
        ...globals.node,
        Express: "readonly",
        Request: "readonly",
        Response: "readonly",
        NextFunction: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          allowSeparatedGroups: true,
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },
];

const nodeToolingConfig = {
  name: "root/node-tooling",
  files: [
    "**/next.config.{js,ts,mjs,cjs}",
    "**/tailwind.config.{js,ts}",
    "**/postcss.config.{js,ts}",
    "**/lint-staged.config.{js,ts}",
    "**/*.config.{js,ts,mjs,cjs}",
    "**/*.setup.{js,ts}",
  ],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
};

const prettierConfig = {
  name: "root/prettier",
  files: ["**/*.{js,jsx,ts,tsx}"],
  rules: {
    ...(prettier.rules ?? {}),
  },
};

export const baseConfig = [
  ignores,
  sharedLanguage,
  js.configs.recommended,
  typescriptConfig,
  nodeToolingConfig,
];

export const buildWebOverrides = (options) => createWebOverrides(options);

export const buildApiOverrides = (options) => createApiOverrides(options);

export const prettierConfigEntry = prettierConfig;

export default [
  ...baseConfig,
  ...createWebOverrides({ prefix: "apps/web/" }),
  ...createApiOverrides({ prefix: "apps/api/" }),
  prettierConfig,
];
