# Multi-Module Translation Guide

## Overview

TransLatté v1.1.0+ supports multiple translation sources, perfect for Angular modular applications where each feature module has its own translation files.

## Why Multiple Sources?

In large Angular applications, you might have:
- **Core Module** - Shared translations
- **Auth Module** - Authentication-related translations
- **Dashboard Module** - Dashboard-specific translations
- **Products Module** - Product catalog translations
- **Admin Module** - Admin panel translations

Instead of maintaining one large translation file, you can organize translations by module and TransLatté will handle them all at once.

## Configuration

### Single Source (Legacy)
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

### Multiple Sources (New)
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

## Quick Start

### 1. Initialize Multi-Module Config

```bash
translatte init --multiple
```

This creates a configuration file with multiple source examples.

### 2. Organize Your Translation Files

```
src/
├── assets/
│   └── i18n/
│       └── en.json                    # Core translations
├── app/
    ├── auth/
    │   └── i18n/
    │       └── en.json                # Auth module translations
    ├── dashboard/
    │   └── i18n/
    │       └── en.json                # Dashboard translations
    └── products/
        └── i18n/
            └── en.json                # Products translations
```

### 3. Create Source Translation Files

**src/assets/i18n/en.json** (Core):
```json
{
  "APP": {
    "TITLE": "My App",
    "MENU": {
      "HOME": "Home",
      "ABOUT": "About"
    }
  }
}
```

**src/app/auth/i18n/en.json** (Auth):
```json
{
  "AUTH": {
    "LOGIN": "Login",
    "REGISTER": "Register",
    "LOGOUT": "Logout"
  }
}
```

**src/app/dashboard/i18n/en.json** (Dashboard):
```json
{
  "DASHBOARD": {
    "WELCOME": "Welcome",
    "STATS": "Statistics"
  }
}
```

### 4. Generate Translations

```bash
translatte generate
```

Output:
```
📋 Configuration:
   Source Language: en
   Target Languages: es, fr, de
   Translation Sources: 3
     1. Core Module
        Input: ./src/assets/i18n/en.json
        Output: ./src/assets/i18n
     2. Auth Module
        Input: ./src/app/auth/i18n/en.json
        Output: ./src/app/auth/i18n
     3. Dashboard Module
        Input: ./src/app/dashboard/i18n/en.json
        Output: ./src/app/dashboard/i18n

📦 Core Module:
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

✔ Translation completed! 9/9 file(s) generated
```

## Angular Integration

### Module Structure

```typescript
// auth.module.ts
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
      isolate: true // Important for module isolation
    })
  ]
})
export class AuthModule { }
```

### Root Module

```typescript
// app.module.ts or app.config.ts
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createRootTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createRootTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class AppModule { }
```

## Advanced Examples

### Example 1: Large Application

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de", "it", "pt"],
  "sources": [
    {
      "name": "Core",
      "inputFile": "./src/assets/i18n/en.json",
      "outputDir": "./src/assets/i18n"
    },
    {
      "name": "Auth",
      "inputFile": "./src/app/auth/i18n/en.json",
      "outputDir": "./src/app/auth/i18n"
    },
    {
      "name": "Dashboard",
      "inputFile": "./src/app/dashboard/i18n/en.json",
      "outputDir": "./src/app/dashboard/i18n"
    },
    {
      "name": "Products",
      "inputFile": "./src/app/products/i18n/en.json",
      "outputDir": "./src/app/products/i18n"
    },
    {
      "name": "Orders",
      "inputFile": "./src/app/orders/i18n/en.json",
      "outputDir": "./src/app/orders/i18n"
    },
    {
      "name": "Admin",
      "inputFile": "./src/app/admin/i18n/en.json",
      "outputDir": "./src/app/admin/i18n"
    }
  ]
}
```

### Example 2: Monorepo with Multiple Apps

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr"],
  "sources": [
    {
      "name": "Admin App",
      "inputFile": "./apps/admin/src/assets/i18n/en.json",
      "outputDir": "./apps/admin/src/assets/i18n"
    },
    {
      "name": "Customer App",
      "inputFile": "./apps/customer/src/assets/i18n/en.json",
      "outputDir": "./apps/customer/src/assets/i18n"
    },
    {
      "name": "Shared Library",
      "inputFile": "./libs/shared/i18n/en.json",
      "outputDir": "./libs/shared/i18n"
    }
  ]
}
```

### Example 3: Different Output Locations

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "sources": [
    {
      "name": "Main App",
      "inputFile": "./src/i18n/source/en.json",
      "outputDir": "./dist/i18n"
    },
    {
      "name": "Marketing Pages",
      "inputFile": "./src/marketing/i18n/en.json",
      "outputDir": "./dist/marketing/i18n"
    }
  ]
}
```

## Benefits

### 1. **Better Organization**
- Keep translations close to their feature modules
- Easier to maintain and find translations
- Clear separation of concerns

### 2. **Lazy Loading Support**
- Load only translations needed for each module
- Reduces initial bundle size
- Improves performance

### 3. **Team Collaboration**
- Different teams can work on different modules
- Reduces merge conflicts
- Clear ownership of translations

### 4. **Scalability**
- Easy to add new modules
- No need for giant translation files
- Each module can have different translation needs

## npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "translate": "translatte generate",
    "translate:watch": "nodemon --watch 'src/**/i18n/en.json' --exec npm run translate",
    "prebuild": "npm run translate"
  }
}
```

## Best Practices

### 1. Consistent File Structure
```
module-name/
├── i18n/
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   └── de.json
├── components/
└── services/
```

### 2. Naming Convention
Use clear, descriptive names for sources:
```json
{
  "sources": [
    {
      "name": "Core Module",           // Good
      "inputFile": "...",
      "outputDir": "..."
    },
    {
      "name": "Module 1",              // Not descriptive
      "inputFile": "...",
      "outputDir": "..."
    }
  ]
}
```

### 3. Key Prefixes
Use module-specific prefixes to avoid conflicts:
```json
// auth/i18n/en.json
{
  "AUTH.LOGIN": "Login",
  "AUTH.REGISTER": "Register"
}

// dashboard/i18n/en.json
{
  "DASHBOARD.TITLE": "Dashboard",
  "DASHBOARD.WELCOME": "Welcome"
}
```

### 4. Shared Translations
Keep common translations in the core module:
```json
// core/i18n/en.json
{
  "COMMON": {
    "SAVE": "Save",
    "CANCEL": "Cancel",
    "DELETE": "Delete"
  }
}
```

## Troubleshooting

### Problem: Some modules not translating
**Solution**: Check that all input files exist and paths are correct.

### Problem: Translations overwriting each other
**Solution**: Use unique translation keys or separate output directories.

### Problem: Slow translation process
**Solution**: TransLatté uses parallel execution with automatic rate limiting. For very large projects, consider processing modules in batches or reducing target languages per run.

## Migration from Single Source

If you're currently using a single translation file:

### Before:
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

### After:
1. Split your large `en.json` into module-specific files
2. Update configuration:
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr"],
  "sources": [
    {
      "name": "Core",
      "inputFile": "./src/assets/i18n/en.json",
      "outputDir": "./src/assets/i18n"
    },
    {
      "name": "Auth",
      "inputFile": "./src/app/auth/i18n/en.json",
      "outputDir": "./src/app/auth/i18n"
    }
    // Add more modules...
  ]
}
```

## Backward Compatibility

Don't worry! The old single-source configuration still works:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

TransLatté automatically detects which configuration format you're using.

---

Happy translating with multiple modules! ☕
