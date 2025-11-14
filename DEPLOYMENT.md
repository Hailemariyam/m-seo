# Documentation Deployment Guide

This guide shows you how to deploy your m-seo documentation website.

## Quick Links

Once deployed, your documentation will be available at:
- **GitHub Pages:** https://hailemariyam.github.io/m-seo/
- **Local Dev:** http://localhost:5174 (run `npm run docs:dev`)

---

## Option 1: GitHub Pages (Recommended) ✅

**Automatic deployment via GitHub Actions**

### Setup Steps:

1. **Enable GitHub Pages:**
   - Go to your GitHub repo: https://github.com/Hailemariyam/m-seo
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - Click **Save**

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add documentation website"
   git push origin haile  # or main
   ```

3. **Wait for deployment:**
   - Go to **Actions** tab in GitHub
   - Watch the "Deploy Documentation" workflow
   - Once complete (✅), your docs are live!

4. **Access your docs:**
   - URL: **https://hailemariyam.github.io/m-seo/**

### GitHub Actions Workflow

The workflow is already set up in `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main, haile]
  workflow_dispatch:

# Builds and deploys docs on every push
```

**What it does:**
- Installs dependencies
- Builds the documentation (`npm run docs:build`)
- Deploys to GitHub Pages automatically

---

## Option 2: Vercel (Alternative)

**One-click deployment**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Build Command:** `npm run docs:build`
   - **Output Directory:** `docs-site/.vitepress/dist`
4. Click **Deploy**

Your docs will be live at: `https://your-project.vercel.app`

**Benefits:**
- Instant preview deployments for PRs
- Custom domain support
- Edge network (fast globally)

---

## Option 3: Netlify (Alternative)

**Drag-and-drop or Git-based**

### Method 1: Drag and Drop
```bash
npm run docs:build
```
Then drag `docs-site/.vitepress/dist` to [Netlify Drop](https://app.netlify.com/drop)

### Method 2: Git Integration
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Configure:
   - **Build command:** `npm run docs:build`
   - **Publish directory:** `docs-site/.vitepress/dist`
4. Deploy

Add `netlify.toml` for configuration:
```toml
[build]
  command = "npm run docs:build"
  publish = "docs-site/.vitepress/dist"
```

---

## Option 4: Local Development

**Run docs locally:**

```bash
# Install dependencies (if not already)
npm install

# Start dev server
npm run docs:dev

# Visit http://localhost:5174
```

**Build locally:**
```bash
npm run docs:build

# Preview the build
npm run docs:preview
```

---

## Updating the Documentation

### After making changes to docs:

1. **Test locally:**
   ```bash
   npm run docs:dev
   ```

2. **Commit and push:**
   ```bash
   git add docs-site/
   git commit -m "Update documentation"
   git push
   ```

3. **Automatic deployment:**
   - GitHub Actions will automatically rebuild and deploy
   - Check the Actions tab for progress

---

## Links in README

Your README.md now includes these links:

```markdown
## 🔗 Links

- [GitHub](https://github.com/Hailemariyam/m-seo)
- [NPM](https://npmjs.com/package/m-seo)
- [Documentation](https://hailemariyam.github.io/m-seo/) - Full documentation website
- [Getting Started Guide](./docs-site/getting-started.md)
- [API Reference](./docs-site/api.md)
- [Examples](./docs-site/examples.md)
- [FAQ](./docs-site/faq.md)
```

**Documentation URL:** https://hailemariyam.github.io/m-seo/

---

## Custom Domain (Optional)

### GitHub Pages Custom Domain:

1. Go to **Settings** → **Pages**
2. Add your custom domain (e.g., `docs.yourdomain.com`)
3. Update DNS:
   ```
   CNAME record: docs → hailemariyam.github.io
   ```

### Update VitePress config:

```typescript
// docs-site/.vitepress/config.ts
export default defineConfig({
  base: '/', // Change from '/m-seo/' to '/'
  // ... rest of config
});
```

---

## Troubleshooting

### Docs not showing after deployment?

1. Check **Actions** tab for build errors
2. Verify GitHub Pages is enabled:
   - Settings → Pages → Source: GitHub Actions
3. Check the workflow file exists:
   - `.github/workflows/deploy-docs.yml`

### 404 errors on deployed site?

Check the `base` setting in `docs-site/.vitepress/config.ts`:
```typescript
base: '/m-seo/', // Must match your GitHub repo name
```

### Build fails?

```bash
# Test build locally first
npm run docs:build

# Check for errors
# Fix any issues
# Push again
```

---

## Summary

✅ **GitHub Actions workflow created** - Auto-deploys on push  
✅ **VitePress configured** - Base URL set for GitHub Pages  
✅ **README updated** - Links to documentation  
✅ **Multiple deployment options** - GitHub Pages, Vercel, Netlify  

**Next steps:**
1. Enable GitHub Pages in repository settings
2. Push code to trigger deployment
3. Visit https://hailemariyam.github.io/m-seo/

**Your documentation is ready to go live! 🚀**
