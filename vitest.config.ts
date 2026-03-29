import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'packages/eslint-plugin-code-policy/src'),
      '@tests': path.resolve(import.meta.dirname, 'packages/eslint-plugin-code-policy/tests'),
    },
  },
  test: {
    include: ['packages/**/tests/**/*.test.ts'],
  },
})
