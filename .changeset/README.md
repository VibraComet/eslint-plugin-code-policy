# 🦋 Changeset Placeholder

This directory is managed by [@changesets/cli](https://github.com/changesets/changesets).

## How to add a changeset

When you make a change that should trigger a version bump, run:

```bash
pnpm changeset
```

The CLI will ask you:
1. Which package(s) are affected
2. Whether it's a `patch` (bug fix), `minor` (new feature), or `major` (breaking change)
3. A summary of the change

This creates a `.md` file in this directory. Commit it alongside your code changes.

## Release flow

1. Open a PR with your code changes + a changeset file
2. On merge to `main`, the Release workflow automatically opens a "Version Packages" PR
3. Merging that PR triggers publishing to npm

See `.github/workflows/release.yml` for the full pipeline.
