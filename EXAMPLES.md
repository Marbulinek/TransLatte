# TransLatté - Usage Examples

## Example 1: Basic Single-Source Setup

### 1. Initialize your project
```bash
mkdir my-angular-app
cd my-angular-app
npm init -y
npm install --save-dev @marbulinek/translatte
```

### 2. Create configuration
```bash
npx translatte init
```

### 3. Edit `translatte.config.json`
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "inputFile": "./i18n/en.json",
  "outputDir": "./i18n"
}
```

### 4. Create source file `i18n/en.json`
```json
{
  "HELLO": "Hello",
  "WORLD": "World"
}
```

### 5. Generate translations
```bash
npx translatte generate
```

---

## Example 2: Angular Integration

### 1. Install TransLatté and ngx-translate
```bash
npm install --save-dev @marbulinek/translatte
npm install @ngx-translate/core @ngx-translate/http-loader
```

### 2. Create `translatte.config.json` in project root

**translatte.config.json:**
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

### 3. Add to `package.json` scripts
```json
{
  "scripts": {
    "translate": "translatte generate",
    "prebuild": "npm run translate",
    "build": "ng build",
    "start": "npm run translate && ng serve"
  }
}
```

### 4. Configure Angular (`app.config.ts` or `app.module.ts`)

**For standalone components (Angular 14+):**
```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

**For NgModule (Angular 13 and below):**
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

### 5. Use in Standalone Component

```typescript
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="app-container">
      <h1>{{ 'WELCOME.TITLE' | translate }}</h1>
      <p>{{ 'WELCOME.DESCRIPTION' | translate }}</p>
      <p>{{ 'WELCOME.USER' | translate: {username: 'John'} }}</p>
      
      <div class="language-selector">
        <button (click)="switchLanguage('en')" 
                [class.active]="currentLang === 'en'">
          English
        </button>
        <button (click)="switchLanguage('es')" 
                [class.active]="currentLang === 'es'">
          Español
        </button>
        <button (click)="switchLanguage('fr')" 
                [class.active]="currentLang === 'fr'">
          Français
        </button>
        <button (click)="switchLanguage('de')" 
                [class.active]="currentLang === 'de'">
          Deutsch
        </button>
      </div>
    </div>
  `
})
export class AppComponent {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
```

**Or use in Module-based component:**

```typescript
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ 'WELCOME.TITLE' | translate }}</h1>
    <p>{{ 'WELCOME.DESCRIPTION' | translate }}</p>
    
    <select (change)="switchLanguage($event)">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  `
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  switchLanguage(event: any) {
    this.translate.use(event.target.value);
  }
}
```

---

## Example 3: Multi-Module Angular Application

Perfect for large Angular apps with feature modules!

### 1. Initialize multi-module configuration
```bash
npx translatte init --multiple
```

### 2. Project Structure
```
src/
├── assets/
│   └── i18n/
│       └── en.json                    # Core translations
├── app/
    ├── auth/
    │   ├── i18n/
    │   │   └── en.json                # Auth module
    │   └── auth.module.ts
    ├── dashboard/
    │   ├── i18n/
    │   │   └── en.json                # Dashboard module
    │   └── dashboard.module.ts
    └── products/
        ├── i18n/
        │   └── en.json                # Products module
        └── products.module.ts
```

### 3. Configuration `translatte.config.json`
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "sources": [
    {
      "name": "Core",
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
    },
    {
      "name": "Products Module",
      "inputFile": "./src/app/products/i18n/en.json",
      "outputDir": "./src/app/products/i18n"
    }
  ]
}
```

### 4. Create Translation Files

**src/assets/i18n/en.json** (Core):
```json
{
  "APP": {
    "TITLE": "My Application",
    "MENU": {
      "HOME": "Home",
      "DASHBOARD": "Dashboard",
      "PRODUCTS": "Products"
    }
  },
  "COMMON": {
    "SAVE": "Save",
    "CANCEL": "Cancel",
    "DELETE": "Delete"
  }
}
```

**src/app/auth/i18n/en.json**:
```json
{
  "AUTH": {
    "LOGIN": {
      "TITLE": "Login",
      "EMAIL": "Email",
      "PASSWORD": "Password",
      "BUTTON": "Sign In"
    },
    "REGISTER": {
      "TITLE": "Create Account",
      "BUTTON": "Register"
    }
  }
}
```

**src/app/dashboard/i18n/en.json**:
```json
{
  "DASHBOARD": {
    "WELCOME": "Welcome back!",
    "STATS": {
      "USERS": "Total Users",
      "REVENUE": "Revenue",
      "ORDERS": "Orders"
    }
  }
}
```

**src/app/products/i18n/en.json**:
```json
{
  "PRODUCTS": {
    "LIST_TITLE": "Products",
    "ADD_BUTTON": "Add Product",
    "EDIT_BUTTON": "Edit Product",
    "DELETE_CONFIRM": "Are you sure you want to delete this product?"
  }
}
```

### 5. Generate All Translations
```bash
npm run translate
```

Output:
```
📋 Configuration:
   Source Language: en
   Target Languages: es, fr, de
   Translation Sources: 4
     1. Core
        Input: ./src/assets/i18n/en.json
        Output: ./src/assets/i18n
     2. Auth Module
        Input: ./src/app/auth/i18n/en.json
        Output: ./src/app/auth/i18n
     3. Dashboard Module
        Input: ./src/app/dashboard/i18n/en.json
        Output: ./src/app/dashboard/i18n
     4. Products Module
        Input: ./src/app/products/i18n/en.json
        Output: ./src/app/products/i18n

📦 Core:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated
   ✓ de.json - Successfully translated

📦 Auth Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated
   ✓ de.json - Successfully translated

📦 Dashboard Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated
   ✓ de.json - Successfully translated

📦 Products Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated
   ✓ de.json - Successfully translated

✔ Translation completed! 12/12 file(s) generated
```

### 6. Configure Feature Modules

**auth.module.ts**:
```typescript
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createAuthTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './app/auth/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createAuthTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})
export class AuthModule { }
```

**dashboard.module.ts**:
```typescript
export function createDashboardTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './app/dashboard/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createDashboardTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})
export class DashboardModule { }
```

---

## Example 4: Complex Translation Structure

### `src/assets/i18n/en.json`
```json
{
  "APP": {
    "TITLE": "My Application",
    "TAGLINE": "Building amazing things"
  },
  "AUTH": {
    "LOGIN": {
      "TITLE": "Login",
      "USERNAME": "Username",
      "PASSWORD": "Password",
      "BUTTON": "Sign In",
      "FORGOT_PASSWORD": "Forgot password?"
    },
    "REGISTER": {
      "TITLE": "Create Account",
      "EMAIL": "Email address",
      "CONFIRM_PASSWORD": "Confirm password",
      "BUTTON": "Register"
    }
  },
  "DASHBOARD": {
    "WELCOME": "Welcome back, {{name}}!",
    "STATS": {
      "USERS": "Total Users",
      "REVENUE": "Revenue",
      "ORDERS": "Orders"
    }
  },
  "ERRORS": {
    "REQUIRED": "This field is required",
    "INVALID_EMAIL": "Please enter a valid email",
    "MIN_LENGTH": "Minimum {{count}} characters required",
    "SERVER_ERROR": "An error occurred. Please try again."
  }
}
```

Run translation:
```bash
npm run translate
```

---

## Example 4: Command-Line Only (No Config File)

```bash
translatte generate \
  --source en \
  --targets es,fr,de,it,pt,ja,zh \
  --input ./src/assets/i18n/en.json \
  --output ./src/assets/i18n
```

---

## Example 5: CI/CD Integration

### GitHub Actions (`.github/workflows/translate.yml`)
```yaml
name: Generate Translations

on:
  push:
    paths:
      - 'src/assets/i18n/en.json'

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate translations
        run: npm run translate
      
      - name: Commit translations
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/assets/i18n/*.json
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update translations"
          git push
```

---

## Example 6: Custom Lingva Instance

If you're self-hosting Lingva:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n",
  "lingvaInstance": "https://my-lingva-instance.com/api/v1"
}
```

---

## Example 7: Programmatic Usage (Node.js)

```typescript
import { Translator, TranslatteConfig } from 'translatte';

async function generateTranslations() {
  const config: TranslatteConfig = {
    sourceLanguage: 'en',
    targetLanguages: ['es', 'fr', 'de'],
    inputFile: './i18n/en.json',
    outputDir: './i18n',
  };

  const translator = new Translator(config);
  const results = await translator.translateAll();

  results.forEach(result => {
    if (result.success) {
      console.log(`✓ ${result.language} translation completed`);
    } else {
      console.error(`✗ ${result.language} failed: ${result.error}`);
    }
  });
}

generateTranslations();
```

---

## Tips & Best Practices

### 1. Incremental Translation
Only translate new keys by maintaining a "master" translated file and comparing changes.

### 2. Review Translations
Always review automatically generated translations before deploying to production.

### 3. Use Placeholders Carefully
```json
{
  "GREETING": "Hello, {{name}}!"
}
```
Placeholders like `{{name}}` are preserved in translations.

### 4. Organize by Feature
```json
{
  "USERS": {
    "LIST_TITLE": "User List",
    "ADD_BUTTON": "Add User"
  },
  "PRODUCTS": {
    "LIST_TITLE": "Product List",
    "ADD_BUTTON": "Add Product"
  }
}
```

### 5. Use in Build Pipeline
```json
{
  "scripts": {
    "prebuild:prod": "translatte generate",
    "build:prod": "ng build --configuration production"
  }
}
```

---

## Troubleshooting

### Translation taking too long?
```json
{
}
```

### Rate limited?

### Partial translations?
Check the error output and retry failed languages:
```bash
translatte generate --targets fr,de
```
