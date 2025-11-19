# KudiManager Mobile App (React Native)

This is the React Native mobile version of KudiManager, built with Expo for cross-platform support (Android & iOS).

## Features

- ✅ Firebase Authentication (same as web app)
- ✅ Multi-language support (English, Hausa, Yoruba, Igbo)
- ✅ Dashboard with sales/expenses/inventory stats
- ✅ Sales tracking
- ✅ Expenses tracking
- ✅ Inventory management
- ✅ API integration with backend
- ✅ Offline-first authentication with AsyncStorage

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For Android builds: EAS CLI `npm install -g eas-cli`
- Expo account (free): https://expo.dev

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Update with:
- `EXPO_PUBLIC_API_URL`: Your backend API URL (e.g., https://your-replit-app.replit.app)
- Firebase credentials (use same values from your web app)

### 3. Run Development Server

```bash
# Start Expo dev server
npm start

# Or run on specific platform
npm run android  # Android emulator/device
npm run ios      # iOS simulator (macOS only)
```

## Building for Production

### Option 1: EAS Build (Cloud Build - Recommended)

This is the easiest way to build APKs and iOS apps without local SDK setup.

#### Android APK

```bash
# Login to Expo
eas login

# Configure project
eas build:configure

# Build Android APK
eas build -p android --profile preview

# Download APK when ready
# The build will appear in your Expo dashboard
```

#### iOS Build

```bash
# Build for iOS (requires Apple Developer account)
eas build -p ios --profile production
```

### Option 2: Local Build (Requires Android SDK)

If you have Android Studio and SDK installed locally:

```bash
# Generate Android project
expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK will be in: android/app/build/outputs/apk/release/app-release.apk
```

### Option 3: Expo Go App (Testing Only)

For quick testing without building:

1. Install Expo Go app on your phone (iOS/Android)
2. Run `npm start` in the mobile directory
3. Scan the QR code with Expo Go app
4. Note: This won't work for production as it requires Expo Go installed

## Environment-Specific Builds

### Development Build
```bash
eas build --profile development --platform android
```

### Preview Build (APK for testing)
```bash
eas build --profile preview --platform android
```

### Production Build
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

## Troubleshooting

### EAS Build Issues

1. **Account Setup**: Make sure you're logged in with `eas login`
2. **Project Configuration**: Run `eas build:configure` first
3. **Environment Variables**: Check that all EXPO_PUBLIC_* variables are set
4. **Build Status**: Check build progress at https://expo.dev/accounts/[your-account]/projects/kudimanager/builds

### Firebase Connection Issues

1. Verify Firebase credentials in `.env` match your web app
2. Ensure Firebase project allows mobile platforms
3. Check that `@react-native-async-storage/async-storage` is installed

### API Connection Issues

1. Make sure `EXPO_PUBLIC_API_URL` points to your deployed backend
2. Backend must be accessible from mobile (not localhost in production)
3. Check CORS settings in backend allow mobile app origin

## Project Structure

```
mobile/
├── src/
│   ├── config/          # Firebase, API, i18n configuration
│   ├── contexts/        # React contexts (Auth)
│   ├── navigation/      # Navigation setup
│   ├── screens/         # App screens
│   └── services/        # API services
├── App.tsx              # Main app entry
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
└── package.json         # Dependencies
```

## API Integration

The mobile app connects to the same backend as the web app using:
- Base URL from `EXPO_PUBLIC_API_URL`
- JWT tokens stored in AsyncStorage
- Automatic token refresh on auth state changes

## Multi-Language Support

Supported languages:
- English (en)
- Hausa (ha)
- Yoruba (yo)
- Igbo (ig)

Language can be switched in the Dashboard screen.

## Support

For issues with:
- **Expo/EAS Build**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Firebase**: https://firebase.google.com/docs

## License

Copyright © 2025 KudiManager. All rights reserved.
