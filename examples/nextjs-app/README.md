# Next.js App Router Example

This example demonstrates `eslint-plugin-code-policy` with a Next.js App Router project using the `next` config preset.

## Setup

```bash
cd examples/nextjs-app
pnpm install
```

## Run lint

```bash
pnpm lint
```

## File structure

```
src/
├── app/
│   ├── layout.tsx          # Next.js layout (exempt from atomic-file)
│   └── page.tsx            # Next.js page (exempt from atomic-file)
├── components/
│   ├── UserCard.tsx         # Correct: pure view component
│   └── UserCard.bad.tsx     # Incorrect: logic inside view (eslint-disable)
├── hooks/
│   └── useUserCard.ts       # Correct: logic extracted to hook
├── types/
│   └── User.ts              # Correct: type in its own file
└── utils/
    ├── formatUserName.ts    # Correct: one function per file
    └── userUtils.bad.ts     # Incorrect: multiple functions (eslint-disable)
```

## What to expect

Running `pnpm lint` should show **zero errors** because the `*.bad.*` files have `eslint-disable` comments. Remove those comments to see the rules in action.
