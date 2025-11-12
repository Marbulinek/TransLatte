# TransLatté

[![npm version](https://img.shields.io/npm/v/@marbulinek/translatte.svg)](https://www.npmjs.com/package/@marbulinek/translatte)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-22.x-brightgreen)](https://nodejs.org)
[![Coverage Status](https://img.shields.io/badge/coverage-90%25-brightgreen)](./coverage/lcov-report/index.html)

**Automatic translation file generator for JavaScript/TypeScript projects.**

## Install

```bash
npm install --save-dev @marbulinek/translatte
```

Or globally:

```bash
npm install -g @marbulinek/translatte
```

## Usage

1. Run `npx translatte init` and edit the generated config file.
2. Add your source translation file (e.g., `src/i18n/en.json`).
3. Run `npx translatte generate` to create translations.

**Command-line:**

```bash
translatte generate --source en --targets es,fr,de --input ./src/i18n/en.json --output ./src/i18n
```

**As npm script:**

Add to your `package.json`:

```json
{
  "scripts": {
    "translate": "translatte generate"
  }
}
```

Then run:

```bash
npm run translate
```

## More guides & advanced usage

See the [docs/](./docs/) folder for:

- Multi-module configuration
- Placeholder/interpolation details
- Examples and quickstart
- Publishing and versioning

## License

MIT
TransLatté supports multiple translation sources - perfect for modular applications (Angular feature modules, React code-splitting, etc.)!
