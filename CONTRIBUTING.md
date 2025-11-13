# 🤝 Contributing to Aurora Generator

Thank you for considering contributing to Aurora Generator! This document will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/aurora-module-generator.git
cd aurora-module-generator

# Add upstream remote
git remote add upstream https://github.com/florianogomez/aurora-module-generator.git
```

## 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Link the package locally
npm link

# Test the CLI
generate --help
generate vue module --help

# Run tests
npm test

# Test with dry-run
generate vue module --dry-run example.yaml
```

## 💡 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/florianogomez/aurora-module-generator/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version)
   - Code samples or screenshots if relevant

### Suggesting Features

1. Check existing [Issues](https://github.com/florianogomez/aurora-module-generator/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
   - Examples if applicable

### Adding a New Framework

Want to add React, Angular, or another framework?

1. Create the framework directory:
   ```
   frameworks/your-framework/
   ├── README.md
   ├── generator.js
   ├── delete-module.js
   ├── config.js
   ├── helpers.js
   ├── templates/
   └── generators/
   ```

2. Implement the required interfaces:
   - `generator.js` - Main generation logic
   - `delete-module.js` - Module deletion logic
   - `config.js` - Framework-specific configuration
   - Templates in `templates/` directory

3. Add documentation in `frameworks/your-framework/README.md`

4. Submit a Pull Request

### Improving Documentation

Documentation improvements are always welcome:
- Fix typos
- Clarify explanations
- Add examples
- Improve formatting
- Translate to other languages

## 📁 Project Structure

```
aurora-module-generator/
├── bin/                    # CLI entry points
│   ├── generate.js        # Generation CLI
│   └── delete.js          # Deletion CLI
├── frameworks/            # Framework-specific generators
│   └── vue/              # Vue 3 generator
│       ├── generator.js
│       ├── templates/    # Handlebars templates
│       └── generators/   # Specialized generators
├── example.yaml          # Example configuration
├── README.md             # Main documentation
├── CONTRIBUTING.md       # This file
└── package.json          # Package configuration
```

## 📝 Coding Standards

### JavaScript/Node.js

- Use ES6+ features
- Use ESM imports (`import`/`export`)
- Follow existing code style
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

### Handlebars Templates

- Use proper indentation (2 spaces)
- Add comments for complex logic
- Use helpers for reusable transformations
- Keep templates DRY

### YAML Configuration

- Use 2 spaces for indentation
- Add comments for clarity
- Follow existing examples

## 🎯 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

```bash
feat(vue): add support for custom validators

Add support for custom field validators in Vue generator.
Validators can be specified in YAML configuration.

Closes #123

---

fix(cli): handle missing YAML file gracefully

Previously, the CLI would crash when YAML file was missing.
Now it shows a helpful error message.

---

docs(readme): update installation instructions

Clarify npm installation process and add troubleshooting section.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

2. **Make your changes** following coding standards

3. **Test your changes**:
   ```bash
   npm test
   generate vue module --dry-run test-module.yaml
   ```

4. **Update documentation** if needed

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/my-feature
   ```

### Submitting the PR

1. Go to the [repository](https://github.com/florianogomez/aurora-module-generator)
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What, why, and how
   - **Related Issues**: Link to issues
   - **Screenshots**: If UI changes
   - **Checklist**: Mark completed items

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
- [ ] Tests added/updated
- [ ] Tests pass locally
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 🧪 Testing

### Manual Testing

```bash
# Test generation
generate vue module example.yaml

# Test with dry-run
generate vue module --dry-run example.yaml

# Test deletion
delete-module vue TestModule

# Test action management
npx add-action Product customAction --path src/modules/products
npx remove-action Product customAction --path src/modules/products
```

### Automated Tests

```bash
# Run all tests
npm test

# Add new tests in frameworks/vue/tests/ (if directory exists)
```

## 📚 Resources

- [Handlebars Documentation](https://handlebarsjs.com/)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [js-yaml Documentation](https://github.com/nodeca/js-yaml)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🎓 Learning Path

New to the project? Start here:

1. Read the [README.md](./README.md)
2. Explore [example.yaml](./example.yaml)
3. Run `generate vue module --dry-run example.yaml`
4. Read `frameworks/vue/README.md`
5. Examine templates in `frameworks/vue/templates/`
6. Try modifying a template
7. Make your first contribution!

## 💬 Communication

- **Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and ideas

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in the README

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Aurora Generator! 🚀

Questions? Open an issue or reach out to the maintainers.
