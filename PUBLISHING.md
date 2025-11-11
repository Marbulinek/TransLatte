# Publishing TransLatté to npm

Follow these steps to publish your package to npm:

## Prerequisites

1. **Create an npm account** at https://www.npmjs.com/signup
2. **Verify your email** address

## Steps to Publish

### 1. Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

### 2. Verify Package Name Availability

```bash
npm search translatte
```

If the name is taken, update `package.json`:
```json
{
  "name": "@your-username/translatte",
  "version": "1.0.0"
}
```

### 3. Build the Package

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 4. Test Locally (Optional)

Test your package locally before publishing:

```bash
# In the TransLatté directory
npm link

# In another project directory
npm link translatte

# Test the CLI
translatte --help
```

### 5. Publish to npm

```bash
npm publish
```

For scoped packages (e.g., `@username/translatte`):
```bash
npm publish --access public
```

### 6. Verify Publication

Visit: `https://www.npmjs.com/package/@marbulinek/translatte`

Or install it:
```bash
npm install -g @marbulinek/translatte
translatte --help
```

## Publishing Updates

### 1. Update Version

Follow [Semantic Versioning](https://semver.org/):

```bash
# Patch release (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - New features, backward compatible
npm version minor

# Major release (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### 2. Publish Update

```bash
npm publish
```

## Package Information

### What Gets Published?

Based on `.npmignore`:
- ✅ `dist/` folder (compiled code)
- ✅ `package.json`
- ✅ `README.md`
- ✅ `LICENSE`
- ❌ `src/` folder (TypeScript source)
- ❌ `node_modules/`
- ❌ `.git/`, `.vscode/`

### Package Entry Points

- **Binary**: `dist/cli.js` - The `translatte` command
- **Library**: `dist/index.js` - For programmatic use

## Best Practices

### 1. Add Keywords

Update `package.json` for better discoverability:
```json
{
  "keywords": [
    "angular",
    "ngx-translate",
    "i18n",
    "translation",
    "lingva",
    "automation",
    "localization",
    "cli"
  ]
}
```

### 2. Set Repository

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/translatte.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/translatte/issues"
  },
  "homepage": "https://github.com/yourusername/translatte#readme"
}
```

### 3. Add Badges to README

```markdown
[![npm version](https://badge.fury.io/js/translatte.svg)](https://www.npmjs.com/package/@marbulinek/translatte)
[![downloads](https://img.shields.io/npm/dm/translatte.svg)](https://www.npmjs.com/package/@marbulinek/translatte)
[![license](https://img.shields.io/npm/l/translatte.svg)](https://github.com/yourusername/translatte/blob/main/LICENSE)
```

### 4. Create GitHub Release

After publishing:
1. Go to GitHub repository
2. Click "Releases" > "Create a new release"
3. Tag version: `v1.0.0`
4. Copy changelog from version updates

## Useful npm Commands

```bash
# Check what will be published
npm pack --dry-run

# View package info
npm view translatte

# Check package files
npm publish --dry-run

# Unpublish (within 72 hours)
npm unpublish translatte@1.0.0

# Deprecate version
npm deprecate translatte@1.0.0 "Use version 1.0.1 instead"

# Update all packages
npm update
```

## Automation with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Security

### Enable 2FA

```bash
npm profile enable-2fa auth-and-writes
```

### Use Automation Tokens

For CI/CD, create an automation token:
1. Go to https://www.npmjs.com/settings/[username]/tokens
2. Click "Generate New Token" > "Automation"
3. Add to GitHub Secrets as `NPM_TOKEN`

## After Publishing

### 1. Test Installation

```bash
npm install -g @marbulinek/translatte
translatte init
translatte generate --help
```

### 2. Share Your Package

- Tweet about it
- Post on Reddit (r/angular, r/javascript)
- Share in Angular communities
- Add to awesome-angular lists

### 3. Monitor

- Check npm stats: https://npm-stat.com/charts.html?package=translatte
- Monitor issues on GitHub
- Respond to questions and bug reports

## Version History Example

Keep a `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2025-11-11
### Added
- Initial release
- CLI tool for translation generation
- Support for 100+ languages via Lingva API
- Configuration file support
- Progress indicators and colored output

## [1.0.1] - 2025-11-12
### Fixed
- Bug fix for nested object translation
### Changed
- Improved error messages
```

---

Your package is now ready to publish! 🚀
