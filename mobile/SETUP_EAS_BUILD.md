# EAS Build Setup Guide - Generate Android APK

## Step 1: Create Expo Account & Get Token (One-Time Setup)

1. **Create an Expo account** (if you don't have one):
   - Go to: https://expo.dev/signup
   - Sign up for free

2. **Generate a Personal Access Token:**
   - Go to: https://expo.dev/accounts/[your-username]/settings/access-tokens
   - Click "Create Token"
   - Give it a name: "KudiManager Build"
   - Copy the token (you'll only see it once!)

3. **Add the token to Replit Secrets:**
   - In Replit, open the "Secrets" tab (Tools → Secrets)
   - Add a new secret:
     - Key: `EXPO_TOKEN`
     - Value: [paste your Expo token]
   - Click "Add Secret"

## Step 2: Run the Build

Once you have `EXPO_TOKEN` set in Replit Secrets, run these commands in the Replit Shell:

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies (first time only)
npm install

# Install EAS CLI locally
npm install -D eas-cli

# Configure EAS Build (first time only)
npx eas build:configure

# Build the Android APK
npx eas build -p android --profile production --non-interactive
```

## Step 3: Download Your APK

The build will run for 10-20 minutes. You'll see output like:

```
✔ Build started, it may take a few minutes to complete.
You can monitor the build at https://expo.dev/accounts/[username]/projects/kudimanager/builds/[build-id]
```

**To download your APK:**
1. Visit the build URL shown in the terminal
2. Wait for the build to complete
3. Click "Download" to get your APK file

**Or check all builds:**
```bash
npx eas build:list
```

## Troubleshooting

### Issue: "User not authenticated"
**Solution:** Make sure `EXPO_TOKEN` is set correctly in Replit Secrets

### Issue: "Android keystore not configured"
**Solution:** On first build, EAS will automatically generate a keystore for you. This is one-time only.

### Issue: Build fails with "Version Conflict"
**Solution:** Update `app.json` version number and try again

### Check build status
```bash
npx eas build:list --platform android --limit 5
```

### View build logs
```bash
npx eas build:view --id [build-id]
```

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npx eas whoami` | Check authentication status |
| `npx eas build -p android --profile production` | Build production APK |
| `npx eas build -p android --profile preview` | Build preview APK (faster) |
| `npx eas build:list` | List all builds |
| `npx eas build:view --id [ID]` | View specific build details |
| `npx eas build:cancel --id [ID]` | Cancel a build |

## Build Profiles (eas.json)

- **production**: Release build with optimizations (use for distribution)
- **preview**: Internal testing build (faster, same as production but for testing)
- **development**: Development build with dev client

## After Download

1. **Transfer APK to Android device**
   - Download APK to your computer
   - Transfer via USB, email, or cloud storage

2. **Install on Android**
   - Enable "Install from Unknown Sources" in Settings
   - Tap the APK file to install
   - Launch KudiManager!

## APK Size

Expect APK size around 40-60 MB for production build.
