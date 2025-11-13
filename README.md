# Aurora Module Generator

<p align="center">
  <img src="https://img.shields.io/npm/v/@florianogomez/aurora-generators?style=flat-square&logo=npm&color=CB3837" alt="npm version">
  <img src="https://img.shields.io/npm/dm/@florianogomez/aurora-generators?style=flat-square&logo=npm&color=CB3837" alt="npm downloads">
  <img src="https://img.shields.io/github/license/florianogomez/aurora-module-generator?style=flat-square&color=blue" alt="license">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js" alt="node version">
</p>

<p align="center">
  ⚡ <strong>Production-ready code generator for modern CRUD applications</strong> ⚡
</p>

<p align="center">
  Generate complete modules with TypeScript, Vue 3, Pinia, and more in seconds.<br>
  Say goodbye to repetitive boilerplate and focus on building features!
</p>

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g @florianogomez/aurora-generators

# Generate a Vue 3 module interactively
generate vue module --interactive

# Or from a YAML file
generate vue module resources/product.yaml
```

## ✨ Features

- 🎯 **Complete CRUD Generation** - Generate 28+ files in seconds
- 📝 **TypeScript First** - Full type safety with 6 interfaces per module
- 🎨 **Vue 3 + Pinia** - Modern state management out of the box
- 🧩 **Composable-based** - Reusable logic with Vue composables
- 🎭 **Vuetify Support** - Beautiful UI components (optional)
- 🔧 **Highly Customizable** - 35+ Handlebars templates
- 🧪 **Dry Run Mode** - Preview changes before writing files
- 🗑️ **Smart Deletion** - Remove modules with automatic cleanup
- 📦 **Zero Configuration** - Works out of the box
- 🌐 **Framework Ready** - React & Angular support coming soon

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @florianogomez/aurora-generators
```

### Local Installation

```bash
npm install --save-dev @florianogomez/aurora-generators
```

Then use with npx:

```bash
npx generate vue module --interactive
```

## 📖 Usage

### Interactive Mode (Easiest)

```bash
generate vue module --interactive
```

The CLI will guide you through:
- Resource name (e.g., "Product", "User")
- Attributes with types
- Filter configurations
- Action selection
- Output directory

### YAML Configuration (Recommended for Complex Modules)

Create a YAML file (e.g., `product.yaml`):

```yaml
resource: Product
description: Module de gestion des produits
version: 1.0.0

attributes:
  - name: name
    type: string
    required: true
    description: Product name

  - name: price
    type: number
    required: true
    description: Product price

  - name: category
    type: string
    required: true
    description: Product category

  - name: is_active
    type: boolean
    required: true
    description: Active status

create_attributes:
  - name
  - price
  - category

update_attributes:
  - name
  - price
  - is_active

filterAttributes:
  - name: is_active
    type: boolean
    label: "Status"
    icon: "ri-checkbox-circle-line"
    trueLabel: "Active"
    falseLabel: "Inactive"

  - name: category
    type: string
    label: "Category"
    icon: "ri-folder-line"

actions:
  - name: getAll
    description: Get all products
    route: list
    method: GET

  - name: create
    description: Create a product
    route: create
    method: POST

  - name: updateOne
    description: Update a product
    route: update
    method: PUT

  - name: delete
    description: Delete a product
    route: delete
    method: DELETE
```

Generate the module:

```bash
generate vue module product.yaml
```

### Available Commands

```bash
# Generate module
generate vue module [options] [file]

# Delete module
delete-module vue Product

# Options
--interactive     Interactive mode
--dry-run        Preview without writing files
--overwrite      Overwrite existing files
--help           Show help
```

## ⚙️ Configuration

Create a configuration file at the root of your project to customize the output directory:

### Option 1: JavaScript Configuration

Create `aurora.config.js`:

```javascript
export default {
  // Output directory (relative to project root)
  outputDir: './src',
  
  // Modules directory name
  modulesDir: 'modules',
  
  // Or use full path override
  // modulesPath: './src/modules',
  
  // Generation options
  options: {
    overwrite: false,
    verbose: true,
  },
};
```

### Option 2: JSON Configuration

Create `.aurorarc` or `aurora.config.json`:

```json
{
  "outputDir": "./src",
  "modulesDir": "modules",
  "options": {
    "overwrite": false,
    "verbose": true
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | `string` | `"./src"` | Output directory for modules |
| `modulesDir` | `string` | `"modules"` | Modules directory name |
| `modulesPath` | `string` | `null` | Full path override (if set, overrides outputDir and modulesDir) |
| `options.overwrite` | `boolean` | `false` | Overwrite existing files |
| `options.verbose` | `boolean` | `true` | Verbose output |

**Example:** If you set `outputDir: './app'` and `modulesDir: 'features'`, modules will be generated in `./app/features/your-module/`.

Without configuration, modules are generated in `./src/modules/` by default.

## 📂 What Gets Generated

For a resource called "Product", the generator creates:

```
src/modules/product/
├── 📁 interfaces/
│   ├── Product.ts              # Main interface
│   ├── ProductCreate.ts        # Creation DTO
│   ├── ProductUpdate.ts        # Update DTO
│   ├── ProductListFilter.ts    # List filters
│   ├── ProductStore.ts         # Store state interface
│   └── index.ts                # Barrel export
│
├── 📁 models/
│   └── Product.model.ts        # Model class with constructor
│
├── 📁 routes/
│   ├── product.routes.base.ts  # Base route configuration
│   ├── product.routes.list.ts  # List route
│   ├── product.routes.create.ts
│   ├── product.routes.update.ts
│   ├── product.routes.delete.ts
│   ├── product.routes.find.ts
│   └── product.routes.navigation.ts
│
├── 📁 store/
│   ├── product.actions.ts      # Pinia actions
│   └── product.store.ts        # Pinia store
│
├── 📁 composables/
│   ├── use_product_actions.ts  # CRUD composable
│   └── use_product_filters.ts  # Filters composable
│
├── 📁 views/
│   ├── ProductList.vue         # List view with filters
│   ├── ProductAdd.vue          # Create view
│   └── ProductEdit.vue         # Edit view
│
└── 📁 components/
    ├── ProductForm.vue          # Reusable form
    ├── ProductFormDialog.vue    # Dialog wrapper
    ├── ProductDetailDialog.vue  # Details dialog
    ├── ProductFiltersForm.vue   # Filters form
    └── ProductSelector.vue      # Selector component (8+ variants)
```

**Total: 28+ files with ~3000+ lines of production-ready code!**

## 🎯 Real-World Example

```bash
# 1. Create a YAML spec
cat > customer.yaml << EOF
resource: Customer
description: Customer management module

attributes:
  - name: firstName
    type: string
    required: true
  - name: lastName
    type: string
    required: true
  - name: email
    type: string
    required: true
  - name: phone
    type: string
    required: false
  - name: is_active
    type: boolean
    required: true

actions:
  - name: getAll
    route: list
    method: GET
  - name: create
    route: create
    method: POST
  - name: updateOne
    route: update
    method: PUT
  - name: delete
    route: delete
    method: DELETE
EOF

# 2. Generate the module
generate vue module customer.yaml

# 3. Module ready to use! 🎉
```

## 🔧 Advanced Features

### Custom Actions

Add custom actions to existing modules:

```bash
# Add a custom "approve" action
generate vue module --add-action Product approve
```

### Dry Run Mode

Preview what will be generated without writing files:

```bash
generate vue module --dry-run product.yaml
```

### Module Deletion

Remove a module and clean up imports:

```bash
delete-module vue Product
```

## 📚 Documentation

- **[Vue Framework Guide](./frameworks/vue/README.md)** - Complete Vue 3 documentation
- **[Architecture Guide](./frameworks/vue/ARCHITECTURE.md)** - Internal architecture
- **[Generators API](./frameworks/vue/generators/README.md)** - Extend the generator
- **[Templates Guide](./frameworks/vue/templates/README.md)** - Customize templates
- **[YAML Reference](./example.yaml)** - Full YAML specification
- **[CHANGELOG](./CHANGELOG.md)** - Version history
- **[Publishing Guide](./PUBLISHING.md)** - How to publish (for contributors)

## 🛠️ Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## 🎨 Supported Frameworks

| Framework | Status | Version |
|-----------|--------|---------|
| Vue 3 + Pinia | ✅ Available | 1.0.0 |
| React + Redux | 🚧 Coming Soon | - |
| Angular + NgRx | 🚧 Coming Soon | - |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Clone the repository
git clone https://github.com/florianogomez/aurora-module-generator.git
cd aurora-module-generator

# Install dependencies
npm install

# Run tests
npm test

# Test locally
npm link
generate vue module --interactive
```

## 📄 License

MIT © [Adébayo Floriano Davidio Sergio Gomez](https://github.com/florianogomez)

See [LICENSE](./LICENSE) for more information.

## 🙏 Acknowledgments

Built with:
- [Handlebars](https://handlebarsjs.com/) - Template engine
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parser

## 📧 Support

- 🐛 [Report a Bug](https://github.com/florianogomez/aurora-module-generator/issues)
- 💡 [Request a Feature](https://github.com/florianogomez/aurora-module-generator/issues)
- 📧 Email: contact@florianogomez.dev

## ⭐ Show Your Support

If this project helped you, please give it a ⭐️!

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/florianogomez">Floriano Gomez</a>
</p>
