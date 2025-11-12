#!/bin/bash

# M-SEO Package Preparation Script
# This script prepares the package for npm publishing

set -e  # Exit on error

echo "🚀 M-SEO Package Preparation"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check required files
echo "📋 Step 1: Checking required files..."
required_files=("package.json" "README.md" "LICENSE" "tsconfig.json" ".npmignore" ".gitignore")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing!"
        exit 1
    fi
done
echo ""

# Step 2: Clean build
echo "🧹 Step 2: Cleaning old build..."
npm run clean
echo -e "${GREEN}✓${NC} Build cleaned"
echo ""

# Step 3: Build package
echo "🔨 Step 3: Building package..."
npm run build
echo -e "${GREEN}✓${NC} Package built"
echo ""

# Step 4: Run tests
echo "🧪 Step 4: Running tests..."
npm test
echo -e "${GREEN}✓${NC} Tests passed"
echo ""

# Step 5: Check package contents
echo "📦 Step 5: Checking package contents..."
echo ""
npm pack --dry-run
echo ""

# Step 6: Verify package.json
echo "📄 Step 6: Verifying package.json..."
echo ""
echo "Package name: $(node -p "require('./package.json').name")"
echo "Version: $(node -p "require('./package.json').version")"
echo "Description: $(node -p "require('./package.json').description")"
echo "Author: $(node -p "require('./package.json').author")"
echo "License: $(node -p "require('./package.json').license")"
echo ""

# Step 7: Pre-flight checklist
echo "✅ Pre-flight Checklist:"
echo "========================"
echo ""
echo "Before publishing, make sure:"
echo ""
echo "1. [ ] Updated package.json author field"
echo "2. [ ] Updated package.json repository URL"
echo "3. [ ] Updated package.json homepage URL"
echo "4. [ ] Reviewed README.md"
echo "5. [ ] All tests passing"
echo "6. [ ] Version number is correct"
echo "7. [ ] You're logged into npm (npm whoami)"
echo "8. [ ] Package name is available on npm"
echo ""

echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo ""
echo "To publish to npm:"
echo "  1. Login: npm login"
echo "  2. Check: npm whoami"
echo "  3. Publish: npm publish"
echo ""
echo "To test locally first:"
echo "  npm pack"
echo "  cd /tmp/test && npm install /path/to/m-seo-1.0.0.tgz"
echo ""

echo -e "${GREEN}✨ Package is ready for publishing!${NC}"
