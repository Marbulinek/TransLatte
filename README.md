# ☕ TransLatté

> **Automatic translation file generator for JavaScript/TypeScript projects**

[![npm version](https://img.shields.io/npm/v/@marbulinek/translatte.svg)](https://www.npmjs.com/package/@marbulinek/translatte)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-22.x-brightgreen)](https://nodejs.org)

TransLatté is a powerful CLI tool that automatically generates translation JSON files for web applications using the free Lingva translation API. Works with **Angular** (`@ngx-translate`), **React** (`react-i18next`), **Vue** (`vue-i18n`), and any JavaScript/TypeScript project using JSON-based translations.

**Why TransLatté?**
- 🆓 **Free** - No API keys or subscriptions needed
- ⚡ **Fast** - Generate translations in seconds
- 🎯 **Framework Agnostic** - Angular, React, Vue, Next.js, and more
- 🌍 **100+ Languages** - Comprehensive language support
- 🔧 **Easy Integration** - Works as npm script in your build process

## ✨ Features

- 🚀 **Automatic Translation**: Generate translation files in multiple languages from a single source file
- 📦 **Multi-Module Support**: Handle multiple translation sources for modular Angular apps
- 🔤 **Placeholder Preservation**: Automatically preserves `{{variables}}`, `{placeholders}`, and other interpolation formats (NEW!)
- 🌍 **Multiple Languages**: Support for 100+ languages via Lingva API
- 🔄 **Nested Objects**: Handles deeply nested translation structures
- ⚡ **Smart Rate Limiting**: Automatic delays and staggered parallel execution to avoid API rate limits
- 🎨 **Beautiful CLI**: Colorful output with progress indicators
- 🔧 **Flexible Configuration**: Use config file or command-line options
- 📦 **Easy Integration**: Works as an npm script in your build process

## 🔧 Installation

### Global Installation
```bash
npm install -g @marbulinek/translatte
```

### Local Installation (Recommended for projects)
```bash
npm install --save-dev @marbulinek/translatte
```

## 🚀 Quick Start

### 1. Initialize Configuration

Create a configuration file in your project root:

```bash
translatte init
```

This creates a `translatte.config.json` file:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de", "it"],
  "inputFile": "./src/i18n/en.json",
  "outputDir": "./src/i18n"
}
```

**Framework-specific paths:**
- **Angular**: `./src/assets/i18n/`
- **React**: `./public/locales/` or `./src/locales/`
- **Vue**: `./src/locales/`
- **Next.js**: `./public/locales/`

### 2. Create Your Source Translation File

Create your source translation file (e.g., `src/i18n/en.json`):

```json
{
  "WELCOME": {
    "TITLE": "Welcome to our application",
    "DESCRIPTION": "This is a sample translation file"
  },
  "MENU": {
    "HOME": "Home",
    "ABOUT": "About",
    "CONTACT": "Contact"
  }
}
```

### 3. Generate Translations

```bash
translatte generate
```

This will create translated files:
- `src/i18n/es.json` (Spanish)
- `src/i18n/fr.json` (French)
- `src/i18n/de.json` (German)
- `src/i18n/it.json` (Italian)

## 🎯 Multi-Module Support

TransLatté supports multiple translation sources - perfect for modular applications (Angular feature modules, React code-splitting, etc.)!

```bash
# Initialize multi-module configuration
translatte init --multiple
```

**Example configuration for modular apps:**
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
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

📖 **[Read the Multi-Module Guide](./MULTI_MODULE_GUIDE.md)** for detailed examples and Angular integration.

## � Placeholder Support

TransLatté automatically preserves interpolation variables and placeholders in your translations!

**Supported formats:**
- Angular: `{{variable}}`
- ICU MessageFormat: `{variable}`
- Custom: `%variable%`, `$variable$`, `${variable}`

**Example:**
```json
{
  "WELCOME": "Hello {{name}}, you have {count} new messages"
}
```

After translation to Spanish:
```json
{
  "WELCOME": "Hola {{name}}, tienes {count} mensajes nuevos"
}
```

✅ Placeholders are preserved automatically - no configuration needed!

📖 **[Read the Placeholder Guide](./PLACEHOLDER_GUIDE.md)** for advanced usage and custom patterns.

## �📖 Usage

### Using Configuration File

```bash
translatte generate
```

### Using Command-Line Options

```bash
translatte generate \
  --source en \
  --targets es,fr,de \
  --input ./src/assets/i18n/en.json \
  --output ./src/assets/i18n
```

### As npm Script

Add to your `package.json`:

```json
{
  "scripts": {
    "translate": "translatte generate",
    "build:i18n": "translatte generate && ng build"
  }
}
```

Then run:

```bash
npm run translate
```

## ⚙️ Configuration Options

### Configuration File (`translatte.config.json`)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sourceLanguage` | string | Yes | Source language code (e.g., "en") |
| `targetLanguages` | string[] | Yes | Array of target language codes |
| `inputFile` | string | Yes* | Path to source translation file |
| `outputDir` | string | Yes* | Output directory for translations |
| `sources` | TranslationSource[] | Yes* | Multiple input/output pairs for modular apps |
| `lingvaInstance` | string | No | Custom Lingva API instance URL |
| `preserveInterpolation` | boolean | No | Preserve placeholders like {{var}} (default: true) |
| `interpolationPattern` | string | No | Custom regex pattern for placeholders |

\* Either `inputFile`/`outputDir` OR `sources` is required

### Command-Line Options

```bash
translatte generate [options]

Options:
  -c, --config <path>      Path to configuration file (default: "translatte.config.json")
  -s, --source <language>  Source language code (e.g., en)
  -t, --targets <languages> Target language codes, comma-separated (e.g., es,fr,de)
  -i, --input <path>       Input source file path
  -o, --output <path>      Output directory path
  -h, --help               Display help for command
```

## 🌍 Supported Languages

TransLatté supports 100+ languages through the Lingva API, including:

- **European**: en, es, fr, de, it, pt, nl, pl, ru, uk, cs, sk, sv, no, da, fi
- **Asian**: zh, ja, ko, th, vi, hi, ar, he, fa, ur
- **Others**: af, sq, am, az, eu, be, bn, bs, bg, ca, ceb, ny, co, hr, el, eo, et, tl, fy, gl, ka, gu, ht, ha, haw, hmn, hu, is, ig, id, ga, jw, kn, kk, km, rw, ku, ky, lo, la, lv, lt, lb, mk, mg, ms, ml, mt, mi, mr, mn, my, ne, ps, pa, ro, sm, gd, sr, st, sn, sd, si, sl, so, su, sw, tg, ta, tt, te, tr, tk, ug, uz, cy, xh, yi, yo, zu

[See full list of language codes](https://cloud.google.com/translate/docs/languages)

## 🏗️ Framework Integration

### Angular with @ngx-translate

**1. Install ngx-translate:**

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

**2a. Configure Angular Standalone Components (Recommended for Angular 14+):**

```typescript
// main.ts or app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
```

**Standalone Component Usage:**

```typescript
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'WELCOME.TITLE' | translate }}</h1>
    <p>{{ 'WELCOME.DESCRIPTION' | translate }}</p>
    <button (click)="switchLanguage('es')">Español</button>
    <button (click)="switchLanguage('fr')">Français</button>
  `
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
```

**2b. Configure Angular Module (Classic approach):**

```typescript
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class AppModule { }
```

### React with react-i18next

**1. Install react-i18next:**

```bash
npm install react-i18next i18next i18next-http-backend
```

**2. Configure i18next:**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  });
```

**3. Use in component:**

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('WELCOME.TITLE')}</h1>;
}
```

### Vue with vue-i18n

**1. Install vue-i18n:**

```bash
npm install vue-i18n
```

**2. Configure:**

```typescript
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en, es }
});

app.use(i18n);
```

**3. Use in template:**

```vue
<template>
  <h1>{{ $t('WELCOME.TITLE') }}</h1>
</template>

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
```

## 📦 Build Process Integration

Add TransLatté to your build pipeline (works with any framework):

**Angular:**
```json
{
  "scripts": {
    "prebuild": "translatte generate",
    "build": "ng build"
  }
}
```

**React/Vite:**
```json
{
  "scripts": {
    "prebuild": "translatte generate",
    "build": "vite build"
  }
}
```

**Next.js:**
```json
{
  "scripts": {
    "prebuild": "translatte generate",
    "build": "next build"
  }
}
```

## 🔒 About Lingva API

[Lingva](https://lingva.ml) is a free, open-source translation service that provides an alternative frontend for Google Translate without tracking. TransLatté uses the Lingva API to translate your content.

**Default API endpoint**: `https://lingva.ml/api/v1`

### Custom Lingva Instance

You can use a custom Lingva instance:

```json
{
  "lingvaInstance": "https://your-lingva-instance.com/api/v1"
}
```

### Rate Limiting

To avoid overwhelming the API:
- Built-in automatic delay: 500ms between requests (internal, not configurable)
- Parallel translations use staggered start to prevent rate limiting
- Consider self-hosting Lingva for high-volume production use

## 📝 Example Project Structure

```
my-angular-app/
├── src/
│   ├── assets/
│   │   └── i18n/
│   │       ├── en.json          # Source file (created by you)
│   │       ├── es.json          # Generated by TransLatté
│   │       ├── fr.json          # Generated by TransLatté
│   │       └── de.json          # Generated by TransLatté
│   └── app/
├── translatte.config.json       # TransLatté configuration
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this in your projects!

## 🐛 Troubleshooting

### API Rate Limiting
If you encounter rate limiting issues:
- TransLatté uses automatic 500ms delays to prevent rate limiting
- Consider using a self-hosted Lingva instance for high-volume usage
- Reduce the number of target languages per run if issues persist

### Translation Quality
For production applications:
- Review generated translations
- Use professional translation services for critical content
- TransLatté is best for:
  - Development and testing
  - Internal tools
  - Quick prototypes
  - Non-critical UI text

### Network Issues
If translations fail:
- Check your internet connection
- Verify the Lingva instance is accessible
- Try a different Lingva instance

## 📚 Resources

- [ngx-translate Documentation](https://github.com/ngx-translate/core)
- [Lingva Translate](https://github.com/thedaviddelta/lingva-translate)
- [Angular i18n Guide](https://angular.io/guide/i18n)

## 🎯 Roadmap

- [ ] Support for multiple translation providers
- [ ] Caching mechanism to avoid re-translating unchanged strings
- [ ] Translation memory support
- [ ] Parallel translation processing
- [ ] Interactive mode for reviewing translations
- [ ] Integration with other i18n libraries

## 🔗 Links

- **GitHub**: [https://github.com/Marbulinek/TransLatte](https://github.com/Marbulinek/TransLatte)
- **npm**: [https://www.npmjs.com/package/@marbulinek/translatte](https://www.npmjs.com/package/@marbulinek/translatte)
- **Issues**: [https://github.com/Marbulinek/TransLatte/issues](https://github.com/Marbulinek/TransLatte/issues)

---

Made with ☕ and ❤️ by Lukas
