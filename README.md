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
    "translate": "npm run translatte generate"
  }
}
```

Then run:

```bash
npm run translate
```

## Configuration

TransLatté uses a `translatte.config.json` file for configuration. Run `npx translatte init` to create one.

### Basic Configuration

For a single translation source:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de", "it", "pt", "ja", "zh"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

**Configuration Options:**

- `sourceLanguage`: The language code of your source translations (e.g., "en")
- `targetLanguages`: Array of language codes to translate to
- `inputFile`: Path to your source translation file
- `outputDir`: Directory where translated files will be created
- `lingvaInstance`: (Optional) Custom Lingva instance URL
- `preserveInterpolation`: (Optional) Keep interpolation placeholders untranslated (default: true)
- `interpolationPattern`: (Optional) Regex pattern to match placeholders
- `enableCache`: (Optional) Enable translation caching for faster re-runs (default: true)

### Multi-Module Configuration

For modular applications (Angular feature modules, React code-splitting, etc.):

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de", "it"],
  "sources": [
    {
      "name": "Core Module",
      "inputFile": "./src/assets/i18n/en.json",
      "outputDir": "./src/assets/i18n"
    },
    {
      "name": "Auth Module",
      "inputFile": "./src/app/auth/i18n/en.json",
      "outputDir": "./src/app/auth/i18n"
    },
    {
      "name": "Dashboard Module",
      "inputFile": "./src/app/dashboard/i18n/en.json",
      "outputDir": "./src/app/dashboard/i18n"
    }
  ]
}
```

**Multi-Module Options:**

- `sources`: Array of translation sources, each with:
  - `name`: Descriptive name for the module
  - `inputFile`: Path to the module's source translation file
  - `outputDir`: Directory for the module's translated files

### Placeholder/Interpolation Support

TransLatté preserves common interpolation patterns used by popular i18n libraries:

- Angular/ngx-translate: `{{ variable }}`
- React-i18next: `{{variable}}`
- Vue-i18n: `{variable}`
- Custom patterns: `%variable%`, `${variable}`, `$variable$`

**Example translation file with placeholders:**

```json
{
  "GREETINGS": {
    "HELLO": "Hello {{name}}!",
    "WELCOME": "Welcome back, {username}",
    "GOOD_MORNING": "Good morning, ${user}!"
  },
  "MESSAGES": {
    "ITEMS_COUNT": "You have {count} items in your cart",
    "PRICE": "Total price: {{currency}}{{amount}}"
  }
}
```

See the [examples/](./examples/) folder for more configuration examples and sample translation files.

## License

MIT
TransLatté supports multiple translation sources - perfect for modular applications (Angular feature modules, React code-splitting, etc.)!
