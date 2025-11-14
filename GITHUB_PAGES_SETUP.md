# GitHub Pages Setup Guide

Your documentation deployment is configured correctly using the **official GitHub Actions** for Pages deployment.

## ✅ Current Setup (Recommended)

Your `.github/workflows/deploy-docs.yml` uses:

- `actions/upload-pages-artifact@v3` - Official GitHub action
- `actions/deploy-pages@v4` - Official GitHub action

This is the **recommended approach** for VitePress and modern GitHub Pages deployments.

## 🚀 Enable GitHub Pages

To make your documentation live, follow these steps:

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/Hailemariyam/m-seo
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Build and deployment**:
   - **Source:** Select **GitHub Actions** (not "Deploy from a branch")
   - Click **Save**

**Screenshot reference:**

```
Build and deployment
├─ Source: [GitHub Actions ▼]  ← Select this!
└─ (Don't use "Deploy from a branch")
```

### Step 2: Verify Workflow Permissions

1. In repository settings, go to **Actions** → **General** (left sidebar)
2. Scroll to **Workflow permissions**
3. Ensure **Read and write permissions** is selected
4. Check ✅ **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Step 3: Trigger Deployment

Your workflow automatically runs when you push to `main` or `haile` branches.

Since you just pushed, check the deployment:

```bash
# View workflow status
# Go to: https://github.com/Hailemariyam/m-seo/actions
```

Or trigger manually:

1. Go to **Actions** tab
2. Click **Deploy Documentation** workflow
3. Click **Run workflow** → Select branch → **Run workflow**

### Step 4: Access Your Documentation

Once deployed (usually takes 2-3 minutes), your docs will be at:

**📚 https://hailemariyam.github.io/m-seo/**

---

## 🔍 Troubleshooting

### Workflow fails with "pages" permission error?

**Fix:** Enable GitHub Pages in Settings → Pages → Source: GitHub Actions

### Workflow succeeds but docs don't appear?

**Check:**

1. Wait 2-3 minutes for DNS propagation
2. Clear browser cache
3. Verify URL: https://hailemariyam.github.io/m-seo/ (note the `/m-seo/` base path)

### 404 errors on deployed site?

**Verify** `docs-site/.vitepress/config.ts` has:

```typescript
export default defineConfig({
  base: "/m-seo/", // Must match repo name
  // ...
});
```

### Want to deploy from main branch only?

Edit `.github/workflows/deploy-docs.yml`:

```yaml
on:
  push:
    branches:
      - main # Remove 'haile' if you only want main
```

---

## 📊 Workflow Comparison

### ❌ DON'T USE (Old Method)

```yaml
# peaceiris/actions-gh-pages is a third-party action
# Not recommended for new projects
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

### ✅ USE (Official Method - What You Have)

```yaml
# Official GitHub Actions (recommended)
- uses: actions/upload-pages-artifact@v3
  with:
    path: docs-site/.vitepress/dist

- uses: actions/deploy-pages@v4
```

**Why the official method is better:**

- ✅ Maintained by GitHub
- ✅ Better security
- ✅ Automatic artifact management
- ✅ Native Pages integration
- ✅ Supports concurrent deployments
- ✅ Better error handling

---

## 🎯 Current Workflow Explained

Your workflow has 2 jobs:

### Job 1: Build

```yaml
jobs:
  build:
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies (npm ci)
      - Build docs (npm run docs:build)
      - Upload artifact to GitHub Pages
```

### Job 2: Deploy

```yaml
deploy:
  needs: build # Waits for build to finish
  steps:
    - Deploy artifact to GitHub Pages
```

**Workflow triggers:**

- ✅ Push to `main` branch
- ✅ Push to `haile` branch
- ✅ Manual trigger (workflow_dispatch)

**Permissions:**

- `contents: read` - Read repository files
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - OIDC authentication

---

## 🔒 Security Note

Your workflow uses:

```yaml
permissions:
  contents: read # Read-only access to code
  pages: write # Write access to Pages only
  id-token: write # For secure authentication
```

This follows the **principle of least privilege** - only the minimum permissions needed.

---

## 📝 Next Steps

1. **Enable GitHub Pages** in repository settings (Source: GitHub Actions)
2. **Check Actions tab** to see if workflow succeeded
3. **Visit your docs** at https://hailemariyam.github.io/m-seo/
4. **Update README** with the live link (already done ✅)

---

## 🌐 Custom Domain (Optional)

Want to use a custom domain like `docs.yoursite.com`?

1. Go to Settings → Pages
2. Enter your custom domain
3. Add DNS records:
   ```
   Type: CNAME
   Name: docs
   Value: hailemariyam.github.io
   ```
4. Update `docs-site/.vitepress/config.ts`:
   ```typescript
   export default defineConfig({
     base: "/", // Change from '/m-seo/'
     // ...
   });
   ```

---

## ✅ Summary

**Your current setup is perfect!** ✨

- ✅ Using official GitHub Actions (recommended)
- ✅ Workflow file is correct
- ✅ Dead links fixed
- ✅ Build succeeds locally
- ✅ Code pushed to GitHub

**Only thing left:** Enable GitHub Pages in repository settings!

**Your documentation will be live at:**

### 📚 https://hailemariyam.github.io/m-seo/

---

**Need help?** Check:

- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [VitePress deployment guide](https://vitepress.dev/guide/deploy#github-pages)
- [Your workflow runs](https://github.com/Hailemariyam/m-seo/actions)
