#!/bin/bash

echo "🔍 Checking current dependency versions..."
echo "Current Next.js version: $(npm list next --depth=0 2>/dev/null | grep next | cut -d'@' -f2)"
echo "Current React version: $(npm list react --depth=0 2>/dev/null | grep react | cut -d'@' -f2)"

echo ""
echo "📦 Updating dependencies to latest versions..."

# Update Next.js to latest
echo "Updating Next.js..."
npm install next@latest

# Update React and React DOM
echo "Updating React..."
npm install react@latest react-dom@latest

# Update NextAuth to stable version (if available)
echo "Checking NextAuth stable version..."
npm install next-auth@latest

# Update AWS SDK
echo "Updating AWS SDK..."
npm install @aws-sdk/client-dynamodb@latest @aws-sdk/lib-dynamodb@latest

# Update dev dependencies
echo "Updating dev dependencies..."
npm install --save-dev @types/node@latest @types/react@latest eslint@latest eslint-config-next@latest

echo ""
echo "✅ Dependencies updated! Running security audit..."
npm audit

echo ""
echo "🧪 Testing build..."
npm run build

echo ""
echo "✅ Update complete! Please test your application thoroughly."
