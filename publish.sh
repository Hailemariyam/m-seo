#!/bin/bash

# M-SEO Package Publishing Script
# Version: 1.1.1
# Date: December 2, 2025

set -e  # Exit on any error

echo "=================================="
echo "M-SEO v1.1.1 Publishing Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Step 1: Check if we're in the right directory
print_info "Checking directory..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the m-seo directory?"
    exit 1
fi
print_success "In correct directory"

# Step 2: Check package version
PACKAGE_VERSION=$(node -p "require('./package.json').version")
print_info "Package version: $PACKAGE_VERSION"

if [ "$PACKAGE_VERSION" != "1.1.1" ]; then
    print_warning "Version is $PACKAGE_VERSION, expected 1.1.1"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 3: Check git status
print_info "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes"
    git status --short
    read -p "Commit changes before publishing? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_info "Committing changes..."
        git add .
        git commit -m "Release v1.1.1: Advanced CMS & AI integrations"
        print_success "Changes committed"
    fi
fi

# Step 4: Clean and build
print_info "Cleaning previous build..."
npm run clean
print_success "Clean complete"

print_info "Building package..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi
print_success "Build successful"

# Step 5: Check TypeScript errors
print_info "Checking for TypeScript errors..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    print_error "TypeScript errors found!"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "No TypeScript errors"

# Step 6: Verify dist/ contents
print_info "Verifying dist/ contents..."
if [ ! -d "dist" ]; then
    print_error "dist/ directory not found!"
    exit 1
fi

DIST_FILES=$(find dist -type f | wc -l)
print_info "Found $DIST_FILES files in dist/"

if [ $DIST_FILES -lt 10 ]; then
    print_warning "Only $DIST_FILES files in dist/, seems low"
    ls -la dist/
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "dist/ verified"

# Step 7: Create tarball for testing
print_info "Creating test tarball..."
npm pack

TARBALL="m-seo-${PACKAGE_VERSION}.tgz"
if [ ! -f "$TARBALL" ]; then
    print_error "Tarball not created!"
    exit 1
fi
print_success "Tarball created: $TARBALL"

# Step 8: Show tarball contents
print_info "Tarball contents (first 30 files):"
tar -tzf "$TARBALL" | head -30

# Step 9: Test local installation
print_info "Testing local installation..."
TEST_DIR="/tmp/m-seo-install-test-$$"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

npm init -y > /dev/null 2>&1
npm install "/home/cyber/m-seo/$TARBALL" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    print_error "Local installation failed!"
    cd -
    rm -rf "$TEST_DIR"
    exit 1
fi

# Test imports
node -e "
  const { CMSPlugins, AIContentAnalysis, SEO } = require('m-seo');
  if (!CMSPlugins || !AIContentAnalysis || !SEO) {
    console.error('Required exports not found!');
    process.exit(1);
  }
  console.log('✓ All imports successful');
" || {
    print_error "Import test failed!"
    cd -
    rm -rf "$TEST_DIR"
    exit 1
}

cd -
rm -rf "$TEST_DIR"
print_success "Local installation test passed"

# Step 10: Dry run publish
print_info "Running npm publish dry-run..."
npm publish --dry-run

if [ $? -ne 0 ]; then
    print_error "Dry run failed!"
    exit 1
fi
print_success "Dry run successful"

# Step 11: Git tagging
print_info "Checking git tags..."
if git rev-parse "v${PACKAGE_VERSION}" >/dev/null 2>&1; then
    print_warning "Tag v${PACKAGE_VERSION} already exists"
else
    read -p "Create git tag v${PACKAGE_VERSION}? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        git tag "v${PACKAGE_VERSION}"
        print_success "Tag created: v${PACKAGE_VERSION}"

        read -p "Push tag to remote? (Y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            git push origin haile --tags
            print_success "Tag pushed to remote"
        fi
    fi
fi

# Step 12: Final confirmation
echo ""
echo "=================================="
echo "📦 Ready to Publish!"
echo "=================================="
echo ""
echo "Package: m-seo"
echo "Version: $PACKAGE_VERSION"
echo "Files: $DIST_FILES in dist/"
echo "Tarball: $TARBALL"
echo ""
print_warning "This will publish to npm registry!"
echo ""
read -p "Proceed with npm publish? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Publish cancelled"
    echo ""
    print_info "To publish manually, run: npm publish"
    exit 0
fi

# Step 13: Actual publish
print_info "Publishing to npm..."
npm publish

if [ $? -ne 0 ]; then
    print_error "Publish failed!"
    exit 1
fi

print_success "Package published successfully!"

# Step 14: Verify publication
print_info "Verifying publication..."
sleep 5  # Wait for npm to propagate

npm view "m-seo@${PACKAGE_VERSION}" version > /dev/null 2>&1

if [ $? -ne 0 ]; then
    print_warning "Could not verify publication (npm may still be propagating)"
else
    print_success "Package verified on npm registry"
fi

# Step 15: Cleanup
print_info "Cleaning up tarball..."
rm -f "$TARBALL"
print_success "Cleanup complete"

# Final success message
echo ""
echo "=================================="
print_success "PUBLISH COMPLETE!"
echo "=================================="
echo ""
echo "✓ Package: m-seo@${PACKAGE_VERSION}"
echo "✓ Published to: https://npmjs.com/package/m-seo"
echo "✓ Install with: npm install m-seo@${PACKAGE_VERSION}"
echo ""
echo "Next steps:"
echo "  1. Create GitHub release: https://github.com/Hailemariyam/m-seo/releases/new"
echo "  2. Update documentation site"
echo "  3. Announce on social media"
echo ""
print_success "Done! 🎉"
