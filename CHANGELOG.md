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
