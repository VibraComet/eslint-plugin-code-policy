# Contributing to eslint-plugin-code-policy

Thank you for considering a contribution! This document explains how the project is structured, how to set up a development environment, and what the contribution workflow looks like.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Running Tests](#running-tests)
- [Writing a New Rule](#writing-a-new-rule)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style](#code-style)

---

## Project Structure

```
eslint-plugin-code-policy/
├── packages/
│   └── eslint-plugin-code-policy/
│       ├── src/
│       │   ├── rules/          # One file per rule
│       │   ├── configs/        # Shareable flat configs
│       │   ├── types/          # Shared TypeScript types
│       │   ├── utils/          # Internal helpers (one per file)
│       │   └── index.ts        # Plugin entry point
│       └── tests/
│           ├── rules/          # Per-rule test suites
│           └── fixtures/       # Shared code fixtures
├── eslint.config.mjs           # Root ESLint config (dogfoods this plugin)
├── package.json                # Monorepo root scripts
└── pnpm-workspace.yaml
```

The plugin follows its own **atomic file rule**: each rule, helper, and type lives in exactly one file named after the thing it exports.

---

## Development Setup

**Prerequisites**

- Node.js `>=20`
- pnpm `>=9`

```bash
# Clone the repo
git clone https://github.com/your-org/eslint-plugin-code-policy.git
cd eslint-plugin-code-policy

# Install all dependencies
pnpm install

# Build the plugin
pnpm build

# Start the build watcher
pnpm dev
```

---

## Running Tests

```bash
# Run the full test suite
pnpm test

# Watch mode (re-runs on file changes)
pnpm test:watch

# Type checking
pnpm type-check

# Lint the repository itself
pnpm lint

# Format all files
pnpm format
```

Run everything at once before opening a PR:

```bash
pnpm check:all
```

---

## Writing a New Rule

1. **Create the rule file** at `packages/eslint-plugin-code-policy/src/rules/<rule-name>.ts`.

   The file must export a single `Rule.RuleModule` as the default export — no helpers defined in the same file.

   ```ts
   // src/rules/my-new-rule.ts
   import type { Rule } from 'eslint'

   export default {
     meta: {
       type: 'problem', // or 'suggestion' | 'layout'
       docs: {
         description: 'A concise description of what this rule enforces.',
         recommended: true,
       },
       fixable: undefined, // or 'code' | 'whitespace'
       schema: [],         // JSON schema for rule options
       messages: {
         myMessageId: 'Error message with {{interpolated}} values.',
       },
     },
     create(context) {
       return {
         // AST visitor methods
         Identifier(node) {
           context.report({ node, messageId: 'myMessageId', data: { interpolated: 'value' } })
         },
       }
     },
   } as Rule.RuleModule
   ```

2. **Register the rule** in `src/index.ts`:

   ```ts
   import myNewRule from './rules/my-new-rule.js'

   const plugin = {
     // ...
     rules: {
       // ...
       'my-new-rule': myNewRule,
     },
   }
   ```

3. **Add it to the `recommended` config** if it should be on by default:

   ```ts
   // src/configs/recommended.ts
   rules: {
     // ...
     'code-policy/my-new-rule': 'error',
   }
   ```

4. **Write tests** at `packages/eslint-plugin-code-policy/tests/rules/<rule-name>.test.ts`.

   Use the [RuleTester](https://eslint.org/docs/developer-guide/nodejs-api#ruletester) pattern. Include both `valid` (no error expected) and `invalid` (error expected) cases.

   ```ts
   import { RuleTester } from 'eslint'
   import rule from '../../src/rules/my-new-rule.js'
   import { describe, it } from 'vitest'

   const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })

   describe('my-new-rule', () => {
     it('passes and fails correctly', () => {
       tester.run('my-new-rule', rule, {
         valid: [
           { code: `// code that should NOT trigger the rule` },
         ],
         invalid: [
           {
             code: `// code that SHOULD trigger the rule`,
             errors: [{ messageId: 'myMessageId' }],
           },
         ],
       })
     })
   })
   ```

5. **Document the rule** by adding a section to `packages/eslint-plugin-code-policy/README.md` following the format used by existing rules (description, ❌ incorrect, ✅ correct, options table).

6. **Update the rules table** in the root `README.md`.

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-new-rule
   ```

2. Make your changes, following the [Code Style](#code-style) guidelines.

3. Ensure `pnpm check:all` passes with no errors.

4. Open a pull request against `main`. Include:
   - A clear description of what the rule does and why it's useful
   - The **rule name** and **category** (architectural, import boundaries, view/logic, types)
   - Example code showing ❌ incorrect and ✅ correct patterns

---

## Code Style

- **Atomic file rule applies to this repository itself.** Every function, type, and helper lives in its own file.
- Formatting is enforced by Prettier (`pnpm format`).
- Linting is enforced by ESLint — including by this very plugin (`pnpm lint`).
- TypeScript `strict` mode is enabled. No `any` without a `// @ts-expect-error` and a comment.
- Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
  ```
  feat(atomic-file): exempt Next.js layout files
  fix(public-api-imports): handle scoped package names
  docs: add view-logic-separation examples
  ```

---

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
