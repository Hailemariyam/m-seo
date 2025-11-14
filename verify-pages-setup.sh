#!/bin/bash

# GitHub Pages Deployment Verification Script
# This script helps verify your setup before deployment

echo "=================================================="
echo "🔍 GitHub Pages Deployment Verification"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: Verify we're in the right directory
echo -e "${BLUE}1. Checking repository...${NC}"
if [ -f "package.json" ] && grep -q "m-seo" package.json; then
    echo -e "   ${GREEN}✓${NC} In m-seo repository"
else
    echo -e "   ${RED}✗${NC} Not in m-seo repository"
    exit 1
fi
echo ""

# Check 2: Verify documentation files exist
echo -e "${BLUE}2. Checking documentation files...${NC}"
if [ -d "docs-site" ]; then
    echo -e "   ${GREEN}✓${NC} docs-site directory exists"
else
    echo -e "   ${RED}✗${NC} docs-site directory missing"
    exit 1
fi

if [ -f "docs-site/.vitepress/config.ts" ]; then
    echo -e "   ${GREEN}✓${NC} VitePress config exists"
else
    echo -e "   ${RED}✗${NC} VitePress config missing"
    exit 1
fi
echo ""

# Check 3: Verify VitePress config has correct base URL
echo -e "${BLUE}3. Checking VitePress configuration...${NC}"
if grep -q "base: '/m-seo/'" docs-site/.vitepress/config.ts; then
    echo -e "   ${GREEN}✓${NC} Base URL configured: /m-seo/"
else
    echo -e "   ${YELLOW}⚠${NC}  Base URL might not be configured correctly"
    echo "      Expected: base: '/m-seo/'"
fi
echo ""

# Check 4: Verify workflow file exists
echo -e "${BLUE}4. Checking GitHub Actions workflow...${NC}"
if [ -f ".github/workflows/deploy-docs.yml" ]; then
    echo -e "   ${GREEN}✓${NC} Workflow file exists"
else
    echo -e "   ${RED}✗${NC} Workflow file missing"
    exit 1
fi
echo ""

# Check 5: Verify no dead links (build test)
echo -e "${BLUE}5. Testing documentation build...${NC}"
if npm run docs:build > /tmp/vitepress-build.log 2>&1; then
    echo -e "   ${GREEN}✓${NC} Documentation builds successfully"
    if [ -d "docs-site/.vitepress/dist" ]; then
        echo -e "   ${GREEN}✓${NC} Build output created"
        FILE_COUNT=$(find docs-site/.vitepress/dist -type f | wc -l)
        echo -e "   ${GREEN}✓${NC} Generated $FILE_COUNT files"
    fi
else
    echo -e "   ${RED}✗${NC} Build failed"
    echo "      Check /tmp/vitepress-build.log for details"
    exit 1
fi
echo ""

# Check 6: Verify git status
echo -e "${BLUE}6. Checking git status...${NC}"
BRANCH=$(git branch --show-current)
echo -e "   ${GREEN}✓${NC} Current branch: $BRANCH"

if git diff-index --quiet HEAD --; then
    echo -e "   ${GREEN}✓${NC} No uncommitted changes"
else
    echo -e "   ${YELLOW}⚠${NC}  You have uncommitted changes"
fi

REMOTE_URL=$(git config --get remote.origin.url)
if [[ "$REMOTE_URL" == *"Hailemariyam/m-seo"* ]]; then
    echo -e "   ${GREEN}✓${NC} Remote: $REMOTE_URL"
else
    echo -e "   ${YELLOW}⚠${NC}  Remote: $REMOTE_URL"
fi
echo ""

# Check 7: Display next steps
echo "=================================================="
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Enable GitHub Pages:"
echo -e "   ${BLUE}https://github.com/Hailemariyam/m-seo/settings/pages${NC}"
echo "   → Set Source to: ${GREEN}GitHub Actions${NC}"
echo ""
echo "2. Push your changes (if needed):"
echo -e "   ${BLUE}git push origin $BRANCH${NC}"
echo ""
echo "3. Check deployment:"
echo -e "   ${BLUE}https://github.com/Hailemariyam/m-seo/actions${NC}"
echo ""
echo "4. View your docs (after deployment):"
echo -e "   ${BLUE}https://hailemariyam.github.io/m-seo/${NC}"
echo ""
echo "=================================================="
echo ""

# Optional: Offer to open URLs
echo "Would you like to open the GitHub Pages settings? (y/n)"
read -r RESPONSE
if [[ "$RESPONSE" =~ ^[Yy]$ ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "https://github.com/Hailemariyam/m-seo/settings/pages"
    elif command -v open > /dev/null; then
        open "https://github.com/Hailemariyam/m-seo/settings/pages"
    else
        echo "Please open manually: https://github.com/Hailemariyam/m-seo/settings/pages"
    fi
fi
