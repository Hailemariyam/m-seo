# ⚠️ GitHub Pages Not Enabled - Quick Fix

## The Error

```
HttpError: Not Found
Get Pages site failed. Please verify that the repository has Pages enabled
and configured to build using GitHub Actions
```

## ✅ Solution: Enable GitHub Pages

You need to **enable GitHub Pages in your repository settings** before the workflow can deploy.

### Step-by-Step Instructions:

#### 1. Go to Repository Settings

- Open: https://github.com/Hailemariyam/m-seo/settings/pages
- OR navigate: Repository → Settings → Pages (left sidebar)

#### 2. Configure Build and Deployment

Under **"Build and deployment"** section:

- **Source:** Click the dropdown and select **"GitHub Actions"**

  - ⚠️ Do NOT select "Deploy from a branch"
  - ✅ SELECT "GitHub Actions"

- Click **Save**

#### 3. Re-run the Workflow

After enabling Pages:

- Go to: https://github.com/Hailemariyam/m-seo/actions
- Click on the failed workflow run
- Click **"Re-run all jobs"** button

OR just push a new commit:

```bash
git commit --allow-empty -m "trigger deployment"
git push origin haile
```

#### 4. Verify Deployment

Once the workflow succeeds:

- Your docs will be live at: **https://hailemariyam.github.io/m-seo/**
- Check the Actions tab to see the green checkmark ✅

---

## 🎯 Quick Visual Guide

```
GitHub Repository Settings
├── Settings (top menu)
│   └── Pages (left sidebar)
│       └── Build and deployment
│           ├── Source: [GitHub Actions ▼]  ← SELECT THIS!
│           │   ├── GitHub Actions  ← ✅ Choose this
│           │   └── Deploy from a branch  ← ❌ Don't use this
│           └── [Save] button
```

---

## 🔍 Why This Happens

The workflow tries to deploy to GitHub Pages, but Pages isn't enabled yet. GitHub doesn't know where to deploy the files.

**Enabling GitHub Pages tells GitHub:**

- "I want to use GitHub Actions to build and deploy"
- Creates the Pages environment
- Allows the workflow to deploy

---

## ⚡ Alternative: Use `enablement` Parameter

If you want the workflow to **automatically enable Pages**, you can modify the workflow file:

### Option A: Keep Current Official Actions (Recommended)

Your current workflow is correct. Just enable Pages in settings as described above.

### Option B: Use peaceiris/actions-gh-pages (Alternative)

If you prefer to have the action auto-enable Pages:

```yaml
# Replace the deploy job in .github/workflows/deploy-docs.yml

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: npm run docs:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs-site/.vitepress/dist
          enable_jekyll: false
          cname: false # or your custom domain
```

**However**, I recommend **Option A** (keeping your current workflow and enabling Pages in settings) because:

- ✅ Uses official GitHub actions
- ✅ More secure
- ✅ Better maintained
- ✅ Recommended by VitePress

---

## 📋 Checklist

- [ ] Go to https://github.com/Hailemariyam/m-seo/settings/pages
- [ ] Set Source to "GitHub Actions"
- [ ] Click Save
- [ ] Re-run the failed workflow OR push a new commit
- [ ] Wait 2-3 minutes for deployment
- [ ] Visit https://hailemariyam.github.io/m-seo/

---

## 🆘 Still Having Issues?

### Check Workflow Permissions

1. Go to: https://github.com/Hailemariyam/m-seo/settings/actions
2. Scroll to **"Workflow permissions"**
3. Select: **"Read and write permissions"**
4. Check: ✅ **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### Verify Repository Visibility

- Pages works with both public and private repos
- For private repos, you may need GitHub Pro/Team/Enterprise
- Check: https://github.com/Hailemariyam/m-seo/settings (General tab)

---

## ✅ Next Steps

**After enabling GitHub Pages:**

1. Your workflow will deploy successfully ✅
2. Docs will be live at: https://hailemariyam.github.io/m-seo/
3. Every push to `main` or `haile` auto-deploys
4. You can merge your pull request! 🎉

**Enable Pages now:** https://github.com/Hailemariyam/m-seo/settings/pages

---

**TL;DR:** Go to Settings → Pages → Source: "GitHub Actions" → Save. That's it! 🚀
