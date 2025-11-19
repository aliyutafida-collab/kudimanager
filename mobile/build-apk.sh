#!/bin/bash

# KudiManager Mobile - EAS Build Script
# This script sets up and builds the Android APK using Expo's EAS Build service

echo "=================================================="
echo "KudiManager Mobile - Android APK Build"
echo "=================================================="
echo ""

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the mobile/ directory"
    echo "Usage: cd mobile && bash build-apk.sh"
    exit 1
fi

# Step 1: Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Step 1/5: Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
else
    echo "Step 1/5: Dependencies already installed ✓"
    echo ""
fi

# Step 2: Check .env file
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your configuration"
    exit 1
fi
echo "Step 2/5: Environment variables configured ✓"
echo ""

# Step 3: Install EAS CLI locally if not already installed
if [ ! -f "node_modules/.bin/eas" ]; then
    echo "Step 3/5: Installing EAS CLI..."
    npm install -D eas-cli
    echo "✓ EAS CLI installed"
    echo ""
else
    echo "Step 3/5: EAS CLI already installed ✓"
    echo ""
fi

# Step 4: Check if user is logged in to Expo
echo "Step 4/5: Checking Expo authentication..."
echo ""
echo "You need to login to your Expo account to build."
echo "If you don't have an account, create one for free at: https://expo.dev"
echo ""
echo "Running: npx eas whoami"
npx eas whoami

if [ $? -ne 0 ]; then
    echo ""
    echo "You're not logged in. Please login now:"
    echo "Running: npx eas login"
    npx eas login
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "Error: Login failed. Please try again."
        exit 1
    fi
fi

echo ""
echo "✓ Authenticated with Expo"
echo ""

# Step 5: Configure and build
echo "Step 5/5: Building Android APK..."
echo ""
echo "This will:"
echo "  1. Configure your project for EAS Build (if needed)"
echo "  2. Upload your code to Expo's build servers"
echo "  3. Build the APK (takes 10-20 minutes)"
echo "  4. Provide a download link when complete"
echo ""
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

# Configure EAS if not already configured
if [ ! -f "eas.json" ]; then
    echo "Configuring EAS Build..."
    npx eas build:configure
fi

# Start the build
echo ""
echo "Starting Android APK build..."
echo "This will take approximately 10-20 minutes."
echo ""
npx eas build -p android --profile production --non-interactive

echo ""
echo "=================================================="
echo "Build submitted successfully!"
echo "=================================================="
echo ""
echo "You can:"
echo "  1. Check build status at: https://expo.dev"
echo "  2. Download APK when ready from your Expo dashboard"
echo "  3. Run 'npx eas build:list' to see all builds"
echo ""
echo "The APK will be available for download once the build completes."
echo ""
