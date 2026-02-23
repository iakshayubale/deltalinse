#!/bin/bash

# 🚀 deltalinse GitHub Deployment Script
# This script pushes your code to GitHub and triggers the release workflow

set -e

echo "📦 deltalinse GitHub Deployment"
echo "=================================="
echo ""

# Check git status
echo "✓ Checking git status..."
cd /Users/akshayubale/git/deltalinse
git status --short

echo ""
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/iakshayubale/deltalinse.git 2>/dev/null || echo "   (Remote already exists)"

echo ""
echo "⬆️  Pushing main branch to GitHub..."
echo "   (You may be asked to authenticate - use GitHub PAT or create one at github.com/settings/tokens)"
git push -u origin main

echo ""
echo "🏷️  Pushing v1.0.0 tag (triggers npm publishing)..."
git push origin v1.0.0

echo ""
echo "✅ Push complete!"
echo ""
echo "📊 Next steps:"
echo "   1. Create GitHub repo at: https://github.com/new"
echo "   2. Add npm token to GitHub secrets:"
echo "      https://github.com/iakshayubale/deltalinse/settings/secrets/actions"
echo "      Secret: NPM_TOKEN"
echo "   3. Monitor release workflow:"
echo "      https://github.com/iakshayubale/deltalinse/actions"
echo "   4. Verify npm publication:"
echo "      https://npmjs.com/package/deltalinse"
echo ""
echo "📖 Full guide: See GITHUB_DEPLOYMENT.md"
