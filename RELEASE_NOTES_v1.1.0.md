# TransLatté v1.1.0 - Multi-Module Support Added! 🎉
## What's New
TransLatté now supports **multiple translation sources** in a single configuration! Perfect for modular Angular applications where each feature module has its own translation files.

## New Features

### 1. Multiple Source Configuration

Configure multiple input/output pairs for different modules:

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

### 2. New CLI Flag

```bash
# Create multi-module configuration
translatte init --multiple
```

### 3. Enhanced Output

The CLI now groups results by source module:

```
📦 Core Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated

📦 Auth Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated

📦 Dashboard Module:
   ✓ es.json - Successfully translated
   ✓ fr.json - Successfully translated

✔ Translation completed! 6/6 file(s) generated
```

## Benefits

### ✨ Better Organization

- Keep translations close to their feature modules
- Clear separation of concerns
- Easier to maintain

### 📦 Modular Architecture

- Perfect for lazy-loaded modules
- Each module can have its own translations
- Reduces bundle size

### 👥 Team Collaboration

- Different teams can work on different modules
- Reduces merge conflicts
- Clear ownership

### 🚀 Scalability

- Easy to add new modules
- No giant translation files
- Flexible structure

## Backward Compatibility

✅ **Don't worry!** The old single-source configuration still works perfectly:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr"],
  "inputFile": "./src/assets/i18n/en.json",
  "outputDir": "./src/assets/i18n"
}
```

TransLatté automatically detects which format you're using.

## Quick Start

### For New Projects

```bash
# Install
npm install --save-dev @marbulinek/translatte

# Initialize with multi-module support
npx translatte init --multiple

# Edit the config file, then generate
npx translatte generate
```

### For Existing Projects

Simply update your `translatte.config.json`:

```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["es", "fr", "de"],
  "sources": [
    {
      "name": "Main",
      "inputFile": "./src/assets/i18n/en.json",
      "outputDir": "./src/assets/i18n"
    }
    // Add more sources as needed
  ]
}
```

## Example Use Cases

### 1. Feature Modules

```
Core + Auth + Dashboard + Products + Admin
```

### 2. Monorepo Applications

```
Admin App + Customer App + Shared Library
```

### 3. Micro-Frontends

```
Shell + Feature1 + Feature2 + Feature3
```

### 4. White-Label Applications

```
Core + Theme1 + Theme2 + Theme3
```

## Documentation

📖 **[Multi-Module Guide](./MULTI_MODULE_GUIDE.md)** - Complete guide with examples
📖 **[Examples](./EXAMPLES.md)** - Updated with multi-module examples
📖 **[Changelog](./CHANGELOG.md)** - Full version history

## Testing

The feature has been tested with:

- ✅ Single source (backward compatibility)
- ✅ Multiple sources (new feature)
- ✅ 3 modules × 2 languages = 6 files generated
- ✅ All translations successful
- ✅ Proper grouping in CLI output

## What's Next

Future enhancements planned:

- Translation caching system
- Incremental translations (only changed keys)
- Parallel processing for faster translations
- Watch mode for development

## Upgrade Guide

### From v1.0.0 to v1.1.0

No breaking changes! Simply update:

```bash
npm install @marbulinek/translatte@latest
```

Your existing configuration will continue to work. To use multi-module features:

1. Update your config to use `sources` array
2. Or run `translatte init --multiple` to see the new format
3. Enjoy organized, modular translations!

## Files Changed

### Source Code

- ✅ `src/types.ts` - Added TranslationSource, TranslationSummary types
- ✅ `src/translator.ts` - Added multi-source support
- ✅ `src/cli.ts` - Enhanced output and init command

### Documentation

- ✅ `README.md` - Added multi-module section
- ✅ `MULTI_MODULE_GUIDE.md` - New comprehensive guide
- ✅ `EXAMPLES.md` - Added multi-module example
- ✅ `CHANGELOG.md` - Updated with v1.1.0 changes

### Examples

- ✅ `examples/modules/` - Created example module structure
- ✅ `translatte.multi-module.config.json` - Example configuration

## Thank You!

This feature was created based on user feedback for better support of modular Angular applications.

If you find TransLatté useful, please:

- ⭐ Star the project on GitHub
- 📢 Share with your team
- 🐛 Report issues
- 💡 Suggest features

---

Happy translating! ☕
