# Publishing m-seo to npm - Complete Guide

## ✅ Pre-Publishing Checklist

### 1. Required Files

- ✅ **package.json** - Already configured
- ✅ **README.md** - Already written
- ⚠️ **LICENSE** - Need to add
- ✅ **tsconfig.json** - Already configured
- ⚠️ **.npmignore** - Need to add
- ⚠️ **.gitignore** - Need to add

### 2. Package.json Configuration

Your package.json is already well-configured! But let's review:

```json
{
  "name": "m-seo",                    // ✅ Package name
  "version": "1.0.0",                 // ✅ Semantic versioning
  "description": "...",               // ✅ Clear description
  "type": "module",                   // ✅ ES modules
  "main": "./dist/index.js",          // ✅ Main entry point
  "types": "./dist/index.d.ts",       // ✅ TypeScript types
  "exports": {...},                   // ✅ Modern exports
  "files": ["dist", "README.md"],     // ✅ Published files
  "keywords": [...],                  // ✅ SEO keywords
  "license": "MIT",                   // ✅ License
  "scripts": {
    "prepublishOnly": "..."           // ✅ Auto-build before publish
  }
}
```

### 3. Things to Update Before Publishing

**a) Package.json Updates:**

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/m-seo.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/m-seo/issues"
  },
  "homepage": "https://github.com/yourusername/m-seo#readme"
}
```

**b) Move Dependencies:**
All current dependencies should be devDependencies (not needed by users):

```json
{
  "dependencies": {}, // Empty - no runtime dependencies!
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/react": "^19.2.3",
    "axios": "^1.11.0",
    "express": "^5.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}
```

## 📋 Step-by-Step Publishing Guide

### Step 1: Create Required Files

#### a) Create LICENSE file

```bash
# MIT License (recommended)
```

#### b) Create .npmignore

```
# Don't publish these to npm
src/
tests/
examples/
docs/
.git/
.gitignore
tsconfig.json
*.log
node_modules/
.DS_Store
*.tsbuildinfo
```

#### c) Create .gitignore

```
node_modules/
dist/
*.log
.DS_Store
*.tsbuildinfo
```

### Step 2: Update package.json

Run these commands or edit manually:

```bash
# Update author
npm pkg set author="Your Name <your.email@example.com>"

# Add repository
npm pkg set repository.type=git
npm pkg set repository.url="https://github.com/yourusername/m-seo.git"

# Add homepage
npm pkg set homepage="https://github.com/yourusername/m-seo#readme"

# Add bugs URL
npm pkg set bugs.url="https://github.com/yourusername/m-seo/issues"
```

### Step 3: Clean Up Dependencies

Move all deps to devDependencies:

```bash
npm install --save-dev @types/express axios express ts-node typescript
npm uninstall @types/express axios express ts-node typescript
```

The library should have ZERO runtime dependencies (it's framework-agnostic!).

### Step 4: Test the Package Locally

Before publishing, test it works:

```bash
# Build the package
npm run build

# Test the built package works
node examples/test-vanilla.js

# Pack the package (creates a .tgz file)
npm pack

# This creates: m-seo-1.0.0.tgz
# You can test installing it locally:
cd /tmp/test-project
npm install /path/to/m-seo-1.0.0.tgz
```

### Step 5: Publish to npm

#### First Time Setup

```bash
# Create npm account (if you don't have one)
# Visit: https://www.npmjs.com/signup

# Login to npm
npm login
# Enter: username, password, email

# Verify you're logged in
npm whoami
```

#### Publishing

```bash
# Make sure everything is built
npm run build

# Check what will be published
npm publish --dry-run

# Publish to npm!
npm publish

# For first publish of a scoped package
npm publish --access public
```

### Step 6: Verify Publication

```bash
# Check on npm
npm view m-seo

# Install from npm in a test project
mkdir /tmp/test-install
cd /tmp/test-install
npm init -y
npm install m-seo

# Test it works
node -e "const { SeoEngine } = require('m-seo'); console.log('Works!');"
```

## 📦 What Gets Published

When you run `npm publish`, these files are included:

```
m-seo-1.0.0.tgz
├── dist/              # Compiled JavaScript + TypeScript definitions
│   ├── core/
│   ├── adapters/
│   ├── analytics/
│   ├── automation/
│   ├── integrations/
│   ├── middleware/
│   ├── service/
│   ├── utils/
│   └── index.js
├── README.md          # Documentation
├── LICENSE            # License file
└── package.json       # Package metadata
```

**NOT included** (filtered by `files` field and `.npmignore`):

- `src/` - Source TypeScript (users get compiled JS)
- `examples/` - Example code
- `docs/` - Documentation
- `tests/` - Test files
- `node_modules/` - Dependencies

## 🔄 Updating the Package

After initial publish:

```bash
# Update version (choose one)
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)

# Publish the update
npm publish
```

## 🏷️ Version Tags

```bash
# Publish as beta
npm publish --tag beta

# Publish as next
npm publish --tag next

# Users install with:
npm install m-seo@beta
npm install m-seo@next
```

## 🚀 Quick Publish Commands

```bash
# One-liner to publish (after setup)
npm run clean && npm run build && npm publish

# Or use the prepublishOnly script (already configured)
npm publish  # Automatically runs clean + build
```

## 📊 Package Statistics

After publishing, track your package:

- **npm**: https://www.npmjs.com/package/m-seo
- **Downloads**: https://npm-stat.com/charts.html?package=m-seo
- **Bundle Size**: https://bundlephobia.com/package/m-seo

## ⚠️ Important Notes

1. **Package Name** - `m-seo` must be available on npm (check: npm view m-seo)

   - If taken, use scoped package: `@yourusername/m-seo`

2. **Semver** - Follow semantic versioning:

   - MAJOR: Breaking changes (2.0.0)
   - MINOR: New features, backward compatible (1.1.0)
   - PATCH: Bug fixes (1.0.1)

3. **Testing** - Always test with `npm pack` before publishing

4. **No Unpublishing** - Can't unpublish after 24 hours

   - Use `npm deprecate` instead

5. **Security** - Never commit:
   - API keys
   - Passwords
   - .npmrc with auth tokens

## 🎯 Post-Publication Checklist

After publishing:

- [ ] Verify package appears on npm
- [ ] Test installation in fresh project
- [ ] Update GitHub repository (if public)
- [ ] Add package badges to README
- [ ] Tweet/share announcement
- [ ] Monitor for issues/feedback

## 🔗 Useful Commands

```bash
# View package info
npm view m-seo

# Check package size
npm pack --dry-run

# List files that will be published
npm publish --dry-run

# Unpublish (only within 72 hours)
npm unpublish m-seo@1.0.0

# Deprecate a version
npm deprecate m-seo@1.0.0 "Please upgrade to 1.0.1"

# Check who has access
npm owner ls m-seo

# Add collaborator
npm owner add username m-seo
```

## 🎓 Resources

- npm Documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- Package Name Rules: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#name
