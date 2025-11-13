# Security Policy

## 🔒 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |

> **Note**: This is the initial release. Future versions will be listed here.

## 🚨 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** Open a Public Issue

Please **do not** create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send a detailed report to: **floriano.gomez@example.com**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 3. Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity

### 4. Disclosure Process

1. We'll acknowledge receipt of your report
2. We'll investigate and validate the issue
3. We'll work on a fix
4. We'll release a patch
5. We'll publicly disclose after the fix is released
6. We'll credit you (if desired) in the release notes

## 🛡️ Security Best Practices

### For Users

When using Aurora Generator:

1. **Keep Updated**: Always use the latest version
   ```bash
   npm update -g @aurora/generators
   ```

2. **Validate YAML**: Always validate YAML files before generation
   ```bash
   generate vue module --dry-run your-config.yaml
   ```

3. **Review Generated Code**: Review generated code before using in production

4. **Secure Templates**: If you modify templates, ensure they don't introduce vulnerabilities

### For Contributors

When contributing:

1. **Dependencies**: Keep dependencies updated and audit them
   ```bash
   npm audit
   npm audit fix
   ```

2. **No Secrets**: Never commit secrets, tokens, or credentials

3. **Code Review**: All PRs require review before merging

4. **Testing**: Write tests for security-critical code

## 🔍 Known Security Considerations

### Template Injection

- **Risk**: Handlebars templates could potentially execute malicious code
- **Mitigation**: We use safe Handlebars compilation and sanitize inputs

### File System Access

- **Risk**: CLI has file system write access
- **Mitigation**: 
  - Always validate paths
  - Use dry-run mode for testing
  - Never run with elevated privileges

### YAML Parsing

- **Risk**: Malicious YAML could exploit parser vulnerabilities
- **Mitigation**: We use `js-yaml` with safe loading

### Dependency Vulnerabilities

- **Risk**: Third-party dependencies may have vulnerabilities
- **Mitigation**: 
  - Regular `npm audit` runs
  - Automated dependency updates via Dependabot
  - CI/CD security checks

## 🔐 Security Features

### Input Validation

- All YAML inputs are validated before processing
- Path traversal protection
- Type checking for all configurations

### Safe Defaults

- Dry-run mode available
- No network requests by default
- Explicit overwrite required

### Audit Logging

- All file operations are logged
- Clear output of what's being generated

## 📋 Security Checklist

Before each release, we verify:

- [ ] All dependencies updated
- [ ] `npm audit` passes with no vulnerabilities
- [ ] Security tests pass
- [ ] No hardcoded secrets
- [ ] Input validation working
- [ ] Documentation up to date

## 🏆 Hall of Fame

We recognize security researchers who responsibly disclose vulnerabilities:

<!-- Names will be added here with permission -->

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## 📞 Contact

For security concerns:
- **Email**: floriano.gomez@example.com
- **PGP Key**: [If available]

For general questions:
- **GitHub Issues**: https://github.com/florianogomez/aurora-module-generator/issues
- **Twitter**: [@your_twitter] (if applicable)

---

Thank you for helping keep Aurora Generator secure! 🔒
