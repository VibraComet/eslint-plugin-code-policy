# Architecture

This document describes the internal design of `eslint-plugin-code-policy` for contributors and AI agents working on the codebase.

---

## Project Layout

```
eslint-plugin-code-policy/            # Monorepo root (pnpm workspaces)
├── packages/
│   └── eslint-plugin-code-policy/    # The published npm package
│       ├── src/
│       │   ├── index.ts              # Plugin entry point (meta + rules + configs)
│       │   ├── rules/                # One file per rule
│       │   │   ├── atomic-file.ts
│       │   │   ├── no-inline-types.ts
│       │   │   ├── public-api-imports.ts
│       │   │   ├── no-cross-module-deep-imports.ts
│       │   │   └── view-logic-separation.ts
│       │   ├── configs/              # Shareable flat config presets
│       │   │   ├── recommended.ts    # Base config (all 5 rules as error)
│       │   │   ├── strict.ts         # Extends recommended
│       │   │   ├── react.ts          # Extends recommended
│       │   │   └── next.ts           # Extends recommended
│       │   ├── types/                # Shared TypeScript types
│       │   └── utils/                # Internal helpers (one per file)
│       ├── tests/
│       │   ├── rules/                # Per-rule test suites
│       │   ├── fixtures/             # Shared test fixtures
│       │   └── utils/                # Utility tests
│       ├── docs/
│       │   └── rules/                # Per-rule documentation (5 markdown files)
│       ├── dist/                     # Build output (CJS + ESM + .d.ts)
│       ├── tsup.config.ts            # Bundle configuration
│       ├── tsconfig.json             # Development TypeScript config
│       ├── tsconfig.build.json       # Build-only TypeScript config (DTS emit)
│       └── package.json              # Published package metadata
├── examples/
│   └── nextjs-app/                   # Working example project
├── llms.txt                          # AI agent documentation index
├── llms-full.txt                     # Full documentation for AI agents
├── ARCHITECTURE.md                   # This file
├── CONTRIBUTING.md                   # Development and contribution workflow
├── README.md                         # Project overview
├── eslint.config.mjs                 # Root ESLint config (dogfoods this plugin)
├── tsconfig.base.json                # Shared compiler options
├── pnpm-workspace.yaml               # Workspace definition
└── package.json                      # Monorepo root scripts
```

---

## ESLint Plugin Anatomy

The plugin exports a single default object from `src/index.ts`:

```ts
const plugin = {
  meta: {
    name: 'eslint-plugin-code-policy',
    version: '0.1.0',
  },
  rules: {
    'atomic-file': atomicFileRule,
    'no-inline-types': noInlineTypesRule,
    'view-logic-separation': viewLogicSeparationRule,
    'public-api-imports': publicApiImportsRule,
    'no-cross-module-deep-imports': noCrossModuleDeepImportsRule,
  },
  configs: {
    recommended,
    strict,
    react,
    next,
  },
}
```

ESLint flat config consumes this object. Users either spread a preset (`codePolicy.configs.recommended`) or register the plugin manually and enable individual rules.

---

## Rule Anatomy

Each rule is a standard ESLint `Rule.RuleModule` object:

```ts
import type { Rule } from 'eslint'

export default {
  meta: {
    type: 'problem', // 'problem' | 'suggestion' | 'layout'
    docs: {
      description: '...',
      recommended: true,
    },
    fixable: undefined, // or 'code' | 'whitespace'
    schema: [], // JSON Schema for rule options
    messages: {
      messageId: 'Error message with {{interpolated}} values.',
    },
  },
  create(context) {
    return {
      // AST visitor methods
      Program(node) {
        /* ... */
      },
      ImportDeclaration(node) {
        /* ... */
      },
    }
  },
} as Rule.RuleModule
```

### Rule categories

| Category          | Rules                                                | What they check                                |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Architectural     | `atomic-file`, `no-inline-types`                     | File-level structure and single responsibility |
| Import boundaries | `public-api-imports`, `no-cross-module-deep-imports` | Module boundary enforcement                    |
| View / Logic      | `view-logic-separation`                              | React component purity                         |

### How rules detect patterns

- **`atomic-file`**: Walks `Program.body`, counts top-level declarations (skipping imports, re-exports, directives, and Next.js reserved exports). Reports when count > 1.
- **`no-inline-types`**: Similar to `atomic-file` but also counts `TSTypeAliasDeclaration`, `TSInterfaceDeclaration`, and `TSEnumDeclaration`. Reports additional declarations after the first.
- **`public-api-imports`**: Checks `ImportDeclaration` source values. If non-relative and contains a banned subpath (default: `/src/`), reports.
- **`no-cross-module-deep-imports`**: Checks relative `ImportDeclaration` paths. Counts `../` segments, then checks if descendant segments include an internal directory name.
- **`view-logic-separation`**: Only runs on `.tsx` files. Uses compound selector `FunctionDeclaration, ArrowFunctionExpression, FunctionExpression` to detect inline handlers. Uses `CallExpression` visitor to detect React hook calls inside component bodies.

---

## Config Inheritance

```
recommended (base)
  ├── strict    (spreads recommended, adds stricter overrides)
  ├── react     (spreads recommended, adds React-specific adjustments)
  └── next      (spreads recommended, adds Next.js App Router support)
```

All four configs enable the same five rules as `'error'`. The `strict`, `react`, and `next` configs spread `recommended` and add framework-specific adjustments (currently reserved for future overrides).

Each config uses a lazy getter for the plugin reference to avoid circular dependency issues:

```ts
plugins: {
  get 'code-policy'() {
    return require('../index.js').default
  },
},
```

---

## Build Pipeline

1. **tsup** (`tsup.config.ts`) bundles the entry points into CJS + ESM:
   - `src/index.ts` (main plugin)
   - `src/configs/recommended.ts`, `strict.ts`, `react.ts`, `next.ts`
   - Output: `dist/` with `.js` (ESM), `.cjs` (CommonJS), sourcemaps
   - DTS is disabled in tsup (emitted by tsc instead)

2. **tsc** (`tsconfig.build.json`) emits `.d.ts` declaration files separately to avoid tsup's `baseUrl` injection issues under TypeScript 6.

3. **Combined build command**: `tsup && tsc -p tsconfig.build.json`

---

## Testing Strategy

- **Test runner**: vitest
- **Rule testing**: ESLint's `RuleTester` API wrapped in vitest `describe`/`it`
- Each rule has a dedicated test file at `tests/rules/<rule-name>.test.ts`
- Tests include both `valid` (no error expected) and `invalid` (error expected) cases
- Filenames can be simulated via `RuleTester` options for rules that check file extensions (e.g., `view-logic-separation` only runs on `.tsx`)

### Running tests

```bash
pnpm test          # Run all tests once
pnpm test:watch    # Watch mode
pnpm type-check    # TypeScript type checking only
pnpm check:all     # lint + format + type-check
```

---

## Package Exports

The package exposes multiple entry points via `package.json` `exports`:

```json
{
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
  "./configs/recommended": { ... },
  "./configs/strict": { ... },
  "./configs/react": { ... },
  "./configs/next": { ... }
}
```

This allows both default import (`import codePolicy from 'eslint-plugin-code-policy'`) and direct config imports (`import recommended from 'eslint-plugin-code-policy/configs/recommended'`).

---

## Versioning and Releases

- **Changesets** (`@changesets/cli`) manages versioning and changelogs
- Release workflow: `pnpm release` (builds, then publishes via changeset)
- Provenance is enabled in `publishConfig` for npm supply chain security

---

## Key Design Decisions

1. **ESLint v9 flat config only** -- no legacy `.eslintrc` support. This simplifies the plugin API and config structure.
2. **No runtime dependencies** -- the plugin has zero production dependencies, only `eslint` and `typescript` as peer deps.
3. **Atomic file rule applied to itself** -- the repository dogfoods its own plugin via the root `eslint.config.mjs`.
4. **Next.js awareness is built-in** -- rather than requiring separate config for Next.js, the rules themselves detect Next.js file patterns and exempt reserved exports.
