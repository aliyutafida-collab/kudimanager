#!/bin/bash

# Quick EAS Build Script for KudiManager Android APK
# Prerequisites: EXPO_TOKEN must be set in Replit Secrets

set -e  # Exit on error

echo "=================================================="
echo "KudiManager - Quick Android APK Build"
echo "=================================================="
echo ""

# Check if EXPO_TOKEN is set
if [ -z "$EXPO_TOKEN" ]; then
    echo "❌ ERROR: EXPO_TOKEN not found!"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Create an Expo account at: https://expo.dev/signup"
    echo "2. Generate a token at: https://expo.dev/accounts/[username]/settings/access-tokens"
    echo "3. Add EXPO_TOKEN to Replit Secrets (Tools → Secrets)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✓ EXPO_TOKEN found"
echo ""

# Navigate to mobile directory if not already there
if [ ! -f "package.json" ]; then
    if [ -d "../mobile" ]; then
        cd ../mobile
    else
        echo "❌ ERROR: Cannot find mobile directory"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Please create mobile/.env with your Firebase credentials"
    exit 1
fi

echo "✓ Configuration files found"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install EAS CLI if not already installed
if [ ! -f "node_modules/.bin/eas" ]; then
    echo "Installing EAS CLI..."
    npm install -D eas-cli
fi

echo "✓ Dependencies installed"
echo ""

# Check authentication
echo "Checking Expo authentication..."
npx eas whoami

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Authentication failed!"
    echo "Please verify your EXPO_TOKEN is correct"
    exit 1
fi

echo ""
echo "✓ Authenticated successfully"
echo ""

# Configure EAS if needed (first time only)
if [ ! -f "eas.json" ]; then
    echo "Configuring EAS Build..."
    npx eas build:configure --platform android
fi

echo ""
echo "=================================================="
echo "Starting Android APK Build"
echo "=================================================="
echo ""
echo "This will:"
echo "  • Upload your app to Expo's build servers"
echo "  • Build a production-ready Android APK"
echo "  • Take approximately 10-20 minutes"
echo ""
echo "Build configuration:"
echo "  Platform: Android"
echo "  Profile: production"
echo "  Output: APK file"
echo ""

# Start the build
npx eas build -p android --profile production --non-interactive

BUILD_STATUS=$?

echo ""
echo "=================================================="

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build submitted successfully!"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Monitor your build at: https://expo.dev"
    echo "2. The build will take 10-20 minutes to complete"
    echo "3. Download the APK when ready from your Expo dashboard"
    echo ""
    echo "Commands:"
    echo "  • Check build status: npx eas build:list"
    echo "  • View specific build: npx eas build:view --id [build-id]"
    echo ""
else
    echo "❌ Build submission failed"
    echo "=================================================="
    echo ""
    echo "Check the error messages above."
    echo "Common issues:"
    echo "  • Version conflict: Update version in app.json"
    echo "  • Invalid token: Re-check EXPO_TOKEN in Secrets"
    echo "  • Network issue: Try again"
    echo ""
fi

echo ""
