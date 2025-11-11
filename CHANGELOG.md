# Changelog

All notable changes to TransLatté will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-11

### Added
- **Multi-Module Support**: Handle multiple translation sources in a single configuration
- **Placeholder Preservation**: Automatically preserves interpolation variables (`{{var}}`, `{var}`, etc.)
- New `sources` array in configuration for defining multiple input/output pairs
- New `preserveInterpolation` option (default: true) to enable/disable placeholder preservation
- New `interpolationPattern` option for custom placeholder regex patterns
- Source names for better organization and output clarity
- `--multiple` flag for `init` command to create multi-module configuration
- Grouped output display showing results per source module
- Translation summary with total sources, languages, and success/fail counts
- Comprehensive Multi-Module Guide documentation
- Comprehensive Placeholder Guide documentation
- Example configurations for modular Angular applications
- Example files demonstrating placeholder preservation

### Changed
- Configuration now supports both single source (legacy) and multiple sources
- CLI output now shows module-specific results when using multiple sources
- Enhanced configuration validation to support both formats
- Improved error messages for better debugging
- Placeholders are now automatically extracted and restored during translation

### Backward Compatibility
- Single source configuration (inputFile/outputDir) still fully supported
- Existing configurations continue to work without changes
- Automatic detection of configuration format
- Placeholder preservation is enabled by default but can be disabled

## [1.0.0] - 2025-11-11

### Added
- Initial release of TransLatté
- CLI tool with `generate` and `init` commands
- Lingva API integration for free translations
- Support for 100+ languages
- Recursive nested object translation
- Configuration file support (`translatte.config.json`)
- Command-line options for all settings
- Rate limiting with configurable delay
- Beautiful colored terminal output with Chalk
- Progress indicators with Ora
- TypeScript implementation with full type definitions
- Comprehensive documentation (README, QUICKSTART, EXAMPLES)
- MIT License
- Example translation files
- Error handling and detailed error messages
- Support for custom Lingva instances

### Features
- **Translation Engine**: Automatic translation of JSON files
- **Angular Integration**: Perfect for ngx-translate projects
- **Build Integration**: Works as npm script
- **Zero Configuration**: Works out of the box with sensible defaults
- **Flexible Configuration**: Support for config file and CLI options
- **Developer Experience**: TypeScript types, clear error messages, progress feedback

### Supported Commands
- `translatte generate` - Generate translation files from source
- `translatte init` - Create sample configuration file
- `translatte --version` - Display version information
- `translatte --help` - Display help information

### Configuration Options
- `sourceLanguage` - Source language code (required)
- `targetLanguages` - Array of target language codes (required)
- `inputFile` - Path to source translation file (required)
- `outputDir` - Output directory for translations (required)
- `delay` - Delay between API calls in ms (optional, default: 500)
- `lingvaInstance` - Custom Lingva API URL (optional)

### Dependencies
- `axios` ^1.6.0 - HTTP client for API calls
- `chalk` ^4.1.2 - Terminal string styling
- `commander` ^11.1.0 - CLI framework
- `ora` ^5.4.1 - Terminal spinners

### Development Dependencies
- `@types/node` ^20.10.0 - Node.js type definitions
- `typescript` ^5.3.0 - TypeScript compiler

### Requirements
- Node.js >= 14.0.0
- Internet connection for translation API

### Known Limitations
- Requires internet connection
- Translation quality depends on Lingva API
- Rate limiting may affect large translation files
- Not recommended for legal or medical content

---

## [Unreleased]

### Planned for v1.1.0
- [ ] Translation caching system
- [ ] Incremental translation (only new keys)
- [ ] Better error recovery
- [ ] Retry mechanism for failed translations

### Planned for v1.2.0
- [ ] Multiple translation provider support
- [ ] Google Translate API integration
- [ ] DeepL API integration
- [ ] OpenAI GPT translation support

### Planned for v1.3.0
- [ ] Interactive review mode
- [ ] Translation memory support
- [ ] Diff view for changed translations

### Planned for v2.0.0
- [ ] Parallel translation processing
- [ ] Watch mode for development
- [ ] Web UI for translation management
- [ ] Cloud synchronization

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.1.0 | 2025-11-11 | Multi-module support added |
| 1.0.0 | 2025-11-11 | Initial release |

---

## How to Update

### For End Users
```bash
npm update translatte
# or
npm install -g @marbulinek/translatte@latest
```

### For Contributors
1. Update version in `package.json`
2. Update this CHANGELOG
3. Commit changes
4. Create git tag
5. Push to GitHub
6. Publish to npm

### Version Bump Commands
```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - New features
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

---

## Support

- 📖 [Documentation](README.md)
- 🚀 [Quick Start](QUICKSTART.md)
- 📝 [Examples](EXAMPLES.md)
- 🐛 [Issues](https://github.com/Marbulinek/TransLatte/issues)
- 💬 [Discussions](https://github.com/Marbulinek/TransLatte/discussions)

---

[1.1.0]: https://github.com/Marbulinek/TransLatte/releases/tag/v1.1.0
[1.0.0]: https://github.com/Marbulinek/TransLatte/releases/tag/v1.0.0
