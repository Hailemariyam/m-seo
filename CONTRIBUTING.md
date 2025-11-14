# Contributing to m-seo

Thank you for your interest in contributing to **m-seo**! We welcome contributions from the community.

## 🎯 Ways to Contribute

- **Report bugs** - Found a bug? [Open an issue](https://github.com/Hailemariyam/m-seo/issues/new)
- **Suggest features** - Have an idea? [Start a discussion](https://github.com/Hailemariyam/m-seo/discussions)
- **Improve documentation** - Help make our docs better
- **Submit code** - Fix bugs or implement features

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/m-seo.git
cd m-seo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Changes

- Write clean, readable code
- Follow existing code style
- Add TypeScript types
- Update documentation if needed

### 5. Test Your Changes

```bash
# Build the project
npm run build

# Test React adapter
npm run test:react

# Test in a real project
npm link
cd ../your-test-project
npm link m-seo
```

### 6. Commit & Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 7. Create Pull Request

- Go to GitHub and create a pull request
- Describe your changes clearly
- Reference any related issues

---

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
feat(react): add useSeo hook
fix(sitemap): handle empty URLs correctly
docs(api): update SeoEngine examples
refactor(core): simplify SeoEngine logic
```

---

## 🏗️ Project Structure

```
m-seo/
├── src/                    # Source code
│   ├── core/              # Framework-agnostic core
│   ├── adapters/          # Framework adapters
│   ├── utils/             # Utilities
│   └── index.ts           # Main entry point
├── dist/                  # Compiled output (generated)
├── docs-site/             # Documentation website
├── examples/              # Usage examples
├── test-app/              # React test app
└── tests/                 # Test files
```

See [Project Structure](docs-site/project-structure.md) for details.

---

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Add types for all function parameters and return values
- Use interfaces for object shapes
- Export types that users might need

**Example:**

```typescript
export interface SeoConfig {
  title: string;
  description: string;
  canonical?: string;
  // ... other fields
}

export class SeoEngine {
  constructor(config: SeoConfig) {
    // ...
  }

  generateMetaTags(): MetaTag[] {
    // ...
  }
}
```

### Formatting

- **Indentation:** 2 spaces
- **Quotes:** Double quotes `"`
- **Semicolons:** Use them
- **Naming:**
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Interfaces: `PascalCase`

### Comments

```typescript
/**
 * Generate SEO meta tags
 * @param config - SEO configuration
 * @returns Array of meta tag objects
 */
generateMetaTags(config: SeoConfig): MetaTag[] {
  // Implementation
}
```

---

## 🧪 Testing

### Manual Testing

Test your changes in multiple scenarios:

1. **React SPA:**

   ```bash
   npm run test:react
   ```

2. **Vanilla JS:**

   ```bash
   node examples/test-vanilla.js
   ```

3. **Real Project:**
   ```bash
   npm link
   cd ../your-project
   npm link m-seo
   ```

### Test Coverage

When adding new features:

- Add examples to `examples/` directory
- Test in `test-app/` React app
- Document in `docs-site/`

---

## 📚 Documentation

### Update Documentation

When making changes, update relevant docs:

- **API changes** → `docs-site/api.md`
- **New features** → `docs-site/examples.md`
- **Setup/config** → `docs-site/getting-started.md`
- **Common questions** → `docs-site/faq.md`

### Documentation Style

- **Clear headings** - Use descriptive section titles
- **Code examples** - Show practical usage
- **Links** - Cross-reference related sections
- **Formatting** - Use Markdown formatting

**Example:**

```markdown
## useSeo Hook

React hook for setting SEO metadata.

### Syntax

\`\`\`typescript
useSeo(config: SeoConfig): void
\`\`\`

### Parameters

- `config` - SEO configuration object

### Example

\`\`\`jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
useSeo({
title: "Home",
description: "Welcome to my site"
});

return <h1>Home</h1>;
}
\`\`\`

### See Also

- [SeoConfig Interface](api.md#seoconfig)
- [More Examples](examples.md#react-examples)
```

---

## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors (`npm run build`)
- [ ] Changes tested manually
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No unnecessary files committed

### PR Description

Include:

- **What:** What does this PR do?
- **Why:** Why is this change needed?
- **How:** How does it work?
- **Testing:** How did you test it?
- **Screenshots:** If UI changes

**Example:**

```markdown
## Add useSeo React hook

### What

Adds a new `useSeo` hook for React SPAs that automatically manages meta tags.

### Why

Makes it easier to use m-seo in React applications without manual DOM manipulation.

### How

- Created `ReactSPAAdapter.ts` with `useSeo` hook
- Hook uses `useEffect` to update meta tags
- Cleans up tags on unmount

### Testing

- Tested in test-app React application
- Verified tags update correctly on route changes
- Confirmed cleanup on unmount

### Breaking Changes

None - this is a new feature.
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing [issues](https://github.com/Hailemariyam/m-seo/issues)
2. Try the latest version
3. Create a minimal reproduction

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:

1. Install m-seo
2. Create SeoEngine with...
3. Call method...
4. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Code sample**
\`\`\`typescript
// Minimal code to reproduce
\`\`\`

**Environment**

- m-seo version: 1.0.1
- Framework: React 18.2.0
- Node version: 18.0.0
- Browser: Chrome 120

**Additional context**
Any other relevant information.
```

---

## 💡 Feature Requests

### Suggesting Features

1. Check [existing discussions](https://github.com/Hailemariyam/m-seo/discussions)
2. Explain the use case
3. Provide examples

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Example usage**
\`\`\`typescript
// How you'd like to use the feature
\`\`\`

**Additional context**
Screenshots, links, etc.
```

---

## 🎁 Recognition

Contributors will be:

- Listed in release notes
- Added to CONTRIBUTORS.md (if applicable)
- Credited in relevant documentation

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

- **GitHub Discussions:** [Ask a question](https://github.com/Hailemariyam/m-seo/discussions)
- **Issues:** [Report a bug](https://github.com/Hailemariyam/m-seo/issues)
- **Documentation:** [Read the docs](https://hailemariyam.github.io/m-seo/)

---

**Thank you for contributing to m-seo! 🚀**
