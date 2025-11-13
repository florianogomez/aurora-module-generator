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

## [1.2.5] - 2025-11-13

### 🐛 Bug Fixes
- **Fixed Action Templates JSDoc**: Removed duplicated JSDoc blocks with escaping errors in all action templates
  - Fixed `{{ "{" }}` syntax errors causing malformed documentation
  - Corrected formatting and indentation in action-add, action-remove, action-update, action-find
  - Fixed inconsistent variable naming (`resourcePascalCase` → `pascalCase resource`)
- **Fixed Missing Action Generation**: Added `set{{pascalCase (pluralize resource)}}` action to generation workflow
  - Template existed but was not being generated
  - Action is used in store-index.hbs but was missing from actions.js generator
- **Fixed Unused Import in Composables**: Changed `use{{pascalCase resource}}Store` to `useInitialized{{pascalCase resource}}Store`
  - Removed unused import that was never called in composable-use-actions.hbs
- **Fixed Component Selector Store Import**: Changed from `../store/{{resourceSnakeCase}}_store` to `../store`
  - Aligns with correct import pattern used throughout the codebase

## [1.2.4] - 2025-11-13

### 🐛 Bug Fix
- **Fixed HTML Escaping in component-form.hbs**: Changed `{{json default}}` and `{{description}}` to `{{{json default}}}` and `{{{description}}}` (triple braces)
  - Prevents HTML entity escaping (`&quot;` → `"`, `&#x27;` → `'`)
  - Affects default values and field descriptions in form components
  - Generates valid JavaScript/TypeScript code

## [1.2.3] - 2025-11-13

### 🐛 Bug Fix
- **Fixed Route Base Import Path**: Added missing underscore in route base file import
  - Changed from `./{{snakeCase resource}}_route` to `./_{{snakeCase resource}}_route`
  - The base route file is named `_payment_provider_route.ts` with leading underscore
  - Affected all 5 route templates

## [1.2.2] - 2025-11-13

### 🐛 Critical Fix
- **Fixed Handlebars Parse Error in Routes**: Replaced invalid template literal syntax `\`/\${{{pascalCase resource}}Route.name}\`` with string concatenation `"/" + {{pascalCase resource}}Route.name`
  - Handlebars cannot parse `${ }` inside template literals
  - Affected all 5 route templates (create, list, find, update, delete)
  - This was causing "Parse error: Expecting 'CLOSE_UNESCAPED'" during generation

### 📦 Affected Templates
- `route-create.hbs`
- `route-list.hbs`
- `route-find.hbs`
- `route-update.hbs`
- `route-delete.hbs`

## [1.2.1] - 2025-11-13

### 🐛 Critical Bug Fixes

#### Models & Composables
- **Fixed HTML Escaping in Models**: Changed `{{json default}}` to `{{{json default}}}` (triple braces) in `model.hbs` to prevent HTML entity escaping of quotes (`&quot;` → `"`)
- **Fixed Import Paths in Composables**: Corrected store import from `../stores/{{camelCase resource}}_store` to `../store`

#### Actions JSDoc
- **Fixed JSDoc Formatting**: Added missing `{{` in JSDoc `@param` tags in 7 action templates
- **Standardized JSDoc**: Consistent formatting and return types across all actions

#### Routes (Critical)
- **Fixed Route Templates Naming**: Replaced all `{{resourceKebabCase}}`, `{{resourcePascalCase}}`, `{{resourceCamelCase}}`, `{{resourceLowerCase}}` with proper helpers (`{{snakeCase resource}}`, `{{pascalCase resource}}`, etc.)
- **Fixed Route Imports**: All route templates now correctly import from `{{snakeCase resource}}_interface` instead of `{{kebabCase resource}}_interface`
- **Fixed Template String Bug**: Corrected `super(\`/${{{pascalCase resource}}Route.name}\`)` interpolation
- **Fixed Code Formatting**: Removed broken line breaks in all 5 route templates
- **Fixed route-create.hbs**: Corrected `return; model;` to `return model;`

### 📦 Affected Templates
- Models: `model.hbs`
- Composables: `composable-use-actions.hbs`
- Actions: 7 templates (getAll, create, update, delete, findOne, set, custom)
- Routes: 5 templates (create, list, find, update, delete)

### ⚠️ Impact
These fixes resolve compilation errors in generated code. Previous versions (1.2.0) would generate invalid TypeScript.

## [1.2.0] - 2025-11-13

### ✨ Features
- **Complete Store Migration to Handlebars**: Migrated entire Pinia store generation to Handlebars templates
  - New templates: `store-definition.hbs`, `store-getters.hbs`, `store-index.hbs`
  - Added `action-set.hbs` template for setElements action
  - Updated `action-index.hbs` with proper imports and structure
- **Organized Template Structure**: Reorganized all templates into folders matching module structure
  - `templates/actions/`, `templates/interfaces/`, `templates/models/`, etc.
  - Easier to navigate and maintain
  - Config updated to reflect new paths

### 🐛 Critical Fixes
- **Fixed Import Paths**: Replaced all `kebabCase` with `snakeCase` for file imports
  - Fixes issue where `payment-provider` generated imports like `payment-provider_interface.ts`
  - Now correctly generates `payment_provider_interface.ts`
  - Affects all templates: actions, interfaces, composables, views
- **Route Name**: Fixed route base template to use `kebabCase(pluralize(resource))` for API route names

### 🔧 Improvements
- Removed dependency on external `generate-store-full.js` script
- All store generation now uses consistent Handlebars template system
- Better alignment with actual generated module structure

## [1.1.4] - 2025-11-13

### 🐛 Critical Fix
- **Fixed generator execution context**: Changed `cwd` from `frameworkPath` to `process.cwd()` when spawning generator process
- This was preventing the configuration file from being loaded when using `npx generate vue module`
- Configuration now properly loads from user's project root instead of package directory

## [1.1.3] - 2025-11-13

### 🐛 Fixes
- Fixed configuration loading to properly detect and display user config files
- Fixed path display in dry-run mode to show correct generation paths
- Updated `delete-module` command to use user configuration for module paths
- Improved configuration display messages across all commands

### 🔧 Improvements
- Configuration loader now returns config file name for better user feedback
- Generator shows config source (file or defaults) and generation path before module creation
- `generate config` command displays whether config was loaded from file or using defaults

## [1.1.2] - 2025-11-13

### ✨ Features
- Added `generate config` command to display current configuration and resolved paths
- Shows working directory, generation paths, custom paths, and options
- Helps debug configuration issues

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
