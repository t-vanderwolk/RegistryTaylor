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
];
