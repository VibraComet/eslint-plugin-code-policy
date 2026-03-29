import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'
import importX from 'eslint-plugin-import-x'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // ── Core presets (strictest possible) ──────────────
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ── SonarJS recommended (code smell detection) ────
  sonarjs.configs.recommended,

  // ── Prettier (must be last preset) ────────────────
  prettierConfig,

  // ── Global ignores ─────────────────────────────────
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      'eslint.config.ts',
      'vitest.config.ts',
    ],
  },

  // ── Source code (strictest) ────────────────────────
  {
    files: ['packages/**/*.ts', 'examples/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
      unicorn,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      // ── Correctness ─────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', // delegated to unused-imports
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],

      // ── Style & consistency ─────────────────────────
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // ── Core ESLint extras ──────────────────────────
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'off', // handled by @typescript-eslint/no-implied-eval
      '@typescript-eslint/no-implied-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'off', // handled by import-x/no-duplicates
      curly: ['error', 'multi-line'],
      'no-throw-literal': 'off', // handled by @typescript-eslint
      '@typescript-eslint/only-throw-error': 'error',

      // ── Unused imports (auto-fixable) ───────────────
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // ── Import hygiene (import-x) ───────────────────
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-cycle': ['error', { maxDepth: 2 }],
      'import-x/no-self-import': 'error',

      // ── Unicorn (curated best practices) ────────────
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],

      // ── SonarJS overrides (disable overlaps) ────────
      'sonarjs/class-name': 'off', // handled by @typescript-eslint/naming-convention
      'sonarjs/no-fallthrough': 'off', // handled by core no-fallthrough
      'sonarjs/unused-import': 'off', // handled by unused-imports plugin
      'sonarjs/no-unused-vars': 'off', // handled by unused-imports plugin
      'sonarjs/no-dead-store': 'off', // handled by unused-imports plugin
      'sonarjs/fixme-tag': 'warn', // downgrade to warn (useful during dev)
      'sonarjs/todo-tag': 'warn', // downgrade to warn (useful during dev)
      'sonarjs/cognitive-complexity': ['error', 10], // maximum strictness
      'sonarjs/no-nested-conditional': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-nested-functions': 'off', // conflicts with ESLint rule factories
    },
  },

  // ── Rule implementation files (ESLint's AST API is any-typed) ──
  {
    files: [
      'packages/**/src/rules/**/*.ts',
      'packages/**/src/configs/**/*.ts',
      'packages/**/src/utils/is-component-node.ts',
      'packages/**/src/utils/get-enclosing-component.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'sonarjs/cognitive-complexity': 'off', // AST visitors are inherently complex
      'sonarjs/no-nested-conditional': 'off', // AST node type narrowing requires nesting
      'sonarjs/different-types-comparison': 'off', // AST node types are dynamically typed
    },
  },

  // ── Test files (relaxed where needed) ──────────────
  {
    files: ['packages/**/tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/no-hardcoded-secrets': 'off',
      'sonarjs/cognitive-complexity': 'off',
    },
  },

  // ── Config/script files (no type info available) ───
  {
    files: ['**/*.mjs', '**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
])
