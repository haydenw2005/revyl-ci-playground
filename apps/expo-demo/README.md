# Revyl Expo Demo App

A simple React Native demo app built with Expo for testing Revyl's build pipeline.

## Features

- 📱 **Counter Demo** - Interactive button with counter and alerts
- 📝 **Text Input** - Multi-line text input with live preview
- 🔄 **Toggle Switch** - On/off switch with state display
- 🎨 **Color Picker** - Select from predefined colors with preview
- 🔄 **Reset Functionality** - Reset all app state

## Tech Stack

- **Expo SDK 50**
- **React Native 0.73**
- **TypeScript**
- **EAS Build**

## Package Information

- **Android Package**: `com.revyl.demo.expo`
- **iOS Bundle ID**: `com.revyl.demo.expo`
- **Version**: 1.0.0

## Building

This app is configured to build with EAS (Expo Application Services):

```bash
# Install dependencies
npm install

# Build for Android (APK)
eas build --platform android --profile ci

# Build for iOS
eas build --platform ios --profile ci
```

## CI/CD Integration

This app is designed to work with Revyl's GitHub Actions workflow for automated building and testing.

The build artifacts are automatically uploaded to Revyl's backend for mobile testing and validation.
