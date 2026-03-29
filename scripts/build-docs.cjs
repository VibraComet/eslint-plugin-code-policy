/**
 * Converts README.md into a styled index.html for GitHub Pages.
 *
 * Usage: npx marked --gfm < README.md | node scripts/build-docs.cjs
 * Or:    node scripts/build-docs.cjs (reads README.md, requires 'marked' installed)
 */
const fs = require('node:fs')

const body = fs.readFileSync('/dev/stdin', 'utf8')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>eslint-plugin-code-policy</title>
  <meta name="description" content="Architectural ESLint rules that enforce file discipline, module boundaries, and component patterns at the code level.">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-dark.min.css">
  <style>
    body { max-width: 980px; margin: 0 auto; padding: 2rem; background: #0d1117; }
    .markdown-body { font-size: 16px; }
  </style>
</head>
<body class="markdown-body">${body}</body>
</html>`

fs.writeFileSync('_site/index.html', html)
