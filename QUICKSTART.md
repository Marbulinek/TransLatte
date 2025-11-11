# TransLatté Quick Start Guide

Get started with TransLatté in your JavaScript/TypeScript project in just 5 minutes!

**Works with**: Angular, React, Vue, Next.js, and any framework using JSON translations.

## Installation

```bash
npm install --save-dev translatte
```

## Step 1: Initialize

```bash
npx translatte init
```

This creates `translatte.config.json`:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de", "it"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

## Step 1: Install TransLatté

In your project directory:

```bash
npm install translatte --save-dev
```

## Step 2: Create Your Source Translation File

**Choose your framework's convention:**

**Angular:** `src/assets/i18n/en.json`
**React:** `public/locales/en.json` or `src/locales/en.json`
**Vue:** `src/locales/en.json`
**Next.js:** `public/locales/en/common.json`

```json
{
  "WELCOME": "Welcome to our application!",
  "LOGIN": "Login",
  "LOGOUT": "Logout",
  "HELLO_USER": "Hello, {{name}}!"
}
```

> **Note**: TransLatté preserves placeholder syntax: `{{var}}`, `{var}`, `%var%`, `${var}`, `$var$`

## Step 3: Generate Translations

```bash
npx translatte generate
```

Output:
```
✔ Configuration loaded

📋 Configuration:
   Source Language: en
   Target Languages: es, fr, de, it
   Input File: ./src/assets/i18n/en.json
   Output Directory: ./src/assets/i18n

✓ es.json - Successfully translated
✓ fr.json - Successfully translated
✓ de.json - Successfully translated
✓ it.json - Successfully translated

✔ Translation completed! 4 file(s) generated
```

## Step 4: Add to package.json

```json
{
  "scripts": {
    "translate": "translatte generate",
    "start": "npm run translate && ng serve",
    "build": "npm run translate && ng build"
  }
}
```

## Step 5: Use in Angular

Install ngx-translate:

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

Configure in `app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
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

Use in component:

```typescript
import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'APP.TITLE' | translate }}</h1>
    <p>{{ 'APP.WELCOME' | translate }}</p>
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

## Done! 🎉

Now whenever you update `en.json`, just run:

```bash
npm run translate
```

And all your translation files will be automatically updated!

## Pro Tips

### 1. Automatic on Build
```json
{
  "scripts": {
    "prebuild": "translatte generate"
  }
}
```

### 2. Watch Mode (with nodemon)
```bash
npm install --save-dev nodemon
```

```json
{
  "scripts": {
    "translate:watch": "nodemon --watch src/assets/i18n/en.json --exec npm run translate"
  }
}
```

### 3. Add More Languages
Edit `translatte.config.json`:

```json
{
  "targetLanguages": ["es", "fr", "de", "it", "pt", "nl", "pl", "ja", "zh"]
}
```

### 4. Rate Limiting

TransLatté automatically handles rate limiting with built-in 500ms delays between API calls. Translations run in parallel with staggered starts to maximize speed while respecting API limits.

No configuration needed - it just works! ⚡

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 📝 Check [EXAMPLES.md](./EXAMPLES.md) for more use cases
- 🐛 Report issues on GitHub
- ⭐ Star the project if you find it useful!

---

Made with ☕ and ❤️
