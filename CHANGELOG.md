# Changelog

All notable changes to Aurora Module Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- React generator with Redux Toolkit
- Angular generator with NgRx
- Automated test generation
- E2E test templates
- GraphQL support
- REST API backend generator

## [1.1.2] - 2025-11-13

### 🐛 Fixes
- **BREAKING FIX**: Fixed default paths to use project's working directory instead of package directory
- Modules now generate in user's `./src/modules` by default instead of `node_modules/@florianogomez/src/modules`
- Configuration paths are now correctly resolved from user's project root

## [1.1.1] - 2025-11-13

### 🐛 Fixes
- Fixed ESM module cache issue in config loader
- Added cache-busting parameter to dynamic imports for reliable config loading

## [1.1.0] - 2025-11-13

### ✨ Features

**Configuration System**
- Added support for project-level configuration files
- Configurable output directory via `aurora.config.js`, `.aurorarc`, or `aurora.config.json`
- Custom paths for modules, interfaces, stores, and plugins
- Automatic configuration loading from project root
- Backward compatible with default paths

**Configuration Files Supported:**
- `aurora.config.js` (ESM JavaScript)
- `aurora.config.mjs` (ESM JavaScript)
- `aurora.config.json` (JSON)
- `.aurorarc` (JSON)
- `.aurorarc.json` (JSON)

**New Files:**
- `aurora.config.example.js` - Example configuration file
- `frameworks/vue/config-loader.js` - Configuration loader module

### 🐛 Fixes
- Fixed module generation path to respect user project structure
- Fixed issue where modules were generated in wrong directory

### 📚 Documentation
- Added configuration guide in README.md
- Added configuration example file
- Updated usage examples with configuration options

## [1.0.1] - 2025-11-13

### 🐛 Fixes
- Added 'json' alias for jsonStringify Handlebars helper

## [1.0.0] - 2025-11-13 - Initial Release 🎉

### ✨ Features

**Vue 3 Generator**
- Complete CRUD module generation from YAML configuration
- TypeScript interfaces (6 per module)
- API routes with mock support
- Pinia store with actions and getters
- Vue 3 composables (`use_resource_actions`, `use_resource_filters`)
- Reusable UI components (form dialogs, selectors, filters)
- CRUD views (list, add, edit)

**CLI Tools**
- Interactive mode for easy configuration
- Dry-run mode to preview changes
- Module deletion with automatic cleanup
- Custom action management (add/remove)
- Verbose and quiet output modes

**Template System**
- 22 Handlebars templates
- Customizable and extensible
- Case transformation helpers (PascalCase, camelCase, kebab-case, etc.)
- Pluralization support

**Modern Patterns**
- Constructor parameter properties
- Centralized mock management
- Explicit error handling with custom error types
- Smart store updates with conditional logic
- Advanced filtering with metadata support

### 📚 Documentation

- Comprehensive README with examples
- Framework-specific guides
- YAML configuration reference
- Contributing guidelines
- Security policy
- Publishing guide

### 🎯 What's Included

- 28 generated files per module
- Full TypeScript support
- Pinia state management
- Vuetify UI components (optional)
- Production-ready architecture

---

**First stable release ready for production use!**

[1.0.0]: https://github.com/florianogomez/aurora-module-generator/releases/tag/v1.0.0
