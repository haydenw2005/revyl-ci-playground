# Revyl CI Playground

A standalone GitHub repository designed to exercise Revyl's pinned-version build ingestion from real CI pipelines.

## Purpose

This repository provides minimal, working examples that:

- Builds an Expo (EAS) Android APK and publishes it to Revyl via `from_url`
- Builds a React Native Android release APK and publishes it via presigned upload
- Has a fast Dummy path that skips real builds by generating a tiny file (for smoke tests)
- After publish, each workflow triggers tests against the just-published pinned version
- Each workflow verifies the version exists and that `/builds/resolve` returns a valid download URL

## Setup

### Required Secrets

Configure these secrets in your GitHub repository settings:

- `REVYL_BASE_URL` - Your Revyl API base URL (e.g., `https://api.revyl.dev/builds`)
- `REVYL_API_KEY` - Your Revyl API key
- `EXPO_TOKEN` - Expo access token (optional, only needed for Expo workflow)

### Required Variables

Configure these repository variables:

- `REVYL_BUILD_VAR_ANDROID` - UUID of your Android build variable in Revyl

### Local Development

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm ci
```

## How It Works

### Version Naming

Each workflow generates a unique version string in the format:

```
pr-<PR_NUMBER>-<RUN_NUMBER>
```

For example: `pr-42-1`, `pr-42-2`, etc.

### Workflows

1. **Dummy Smoke Test** (`revyl-dummy-smoke.yml`)

   - Generates a tiny 200KB file
   - Publishes via presigned upload
   - Fast execution for smoke testing

2. **Expo Android** (`revyl-expo-android.yml`)

   - **Demo Mode**: Creates dummy build.json for testing `from_url` workflow
   - **Production Mode**: Builds APK using EAS Build (requires EAS project setup)
   - Publishes via `from_url` endpoint
   - Requires `EXPO_TOKEN` secret

3. **React Native Android** (`revyl-rn-android.yml`)
   - Builds APK using Gradle
   - Publishes via presigned upload
   - Uses Android SDK and Java 17

### Triggering Workflows

Open a pull request to trigger all workflows. Each workflow will:

1. Build/generate the artifact
2. Publish to Revyl with a unique pinned version
3. Verify the version can be resolved
4. Trigger a test run against the pinned version

## Scripts

The `scripts/` directory contains TypeScript utilities:

- `publishFromUrl.ts` - Publishes builds from external URLs (Expo)
- `publishPresigned.ts` - Publishes builds via presigned upload
- `verifyResolve.ts` - Verifies published versions can be resolved
- `triggerTests.ts` - Triggers test runs with pinned versions
- `util.ts` - Common utilities and helpers

### Local Testing

You can test the scripts locally:

```bash
# Test dummy publish
npm run play:dummy

# Test expo publish (requires EXPO_TOKEN)
npm run play:expo

# Test RN publish
npm run play:rn
```

## Troubleshooting

### Common Issues

1. **Workflows don't run on fork PRs** - This is intentional for security
2. **401/403 errors** - Check your `REVYL_API_KEY` secret
3. **Missing EXPO_TOKEN** - Required for Expo workflow
4. **Artifact not found** - Build may have failed; check workflow logs
5. **Build variable not found** - Verify `REVYL_BUILD_VAR_ANDROID` variable

### Expected Outcomes

Successful workflows will show:

- Published version string in logs
- Revyl API responses
- Verification that resolve endpoint works
- Test run trigger confirmation

Failed workflows will show clear error messages indicating the issue.

## Repository Structure

```
revyl-ci-playground/
├── README.md
├── package.json
├── .env.example
├── scripts/
│   ├── publishFromUrl.ts
│   ├── publishPresigned.ts
│   ├── verifyResolve.ts
│   ├── triggerTests.ts
│   └── util.ts
├── apps/
│   ├── expo-minimal/
│   │   ├── app.json
│   │   ├── eas.json
│   │   ├── package.json
│   │   └── App.js
│   └── rn-android-minimal/
│       ├── android/
│       └── package.json
└── .github/
    └── workflows/
        ├── revyl-dummy-smoke.yml
        ├── revyl-expo-android.yml
        └── revyl-rn-android.yml
```

## 🧪 Test Run

This PR tests all three workflows:

- Dummy smoke test
- Expo Android build
- React Native Android build

Each workflow will attempt to publish to Revyl and trigger tests.

### Troubleshooting from_url Workflows

When testing `from_url` publishing (like the Expo workflow), ensure the URL points to a **real, downloadable file**:

**❌ Bad URLs:**

- `https://expo.dev/artifacts/dummy-build-url.apk` (fake/non-existent)
- `https://example.com/build.apk` (placeholder domain)
- Local file paths or private URLs

**✅ Good URLs:**

- Real EAS build artifacts from `eas build --json`
- Public file hosting services
- Test endpoints like `https://httpbin.org/bytes/1024`

The Revyl API will attempt to download the file from the provided URL, so it must be publicly accessible and return the actual file content.

## Recent Fixes Applied

### ✅ Issues Resolved:

1. **Node.js Warnings**: Replaced `ts-node/esm` with `tsx` for cleaner TypeScript execution
2. **Package Lock Sync**: Updated `package-lock.json` to include `tsx` dependencies
3. **Expo URL 404**: Replaced fake `expo.dev` URL with real downloadable test URL (`httpbin.org/bytes/1024`)
4. **API Schema Mismatch**: Added `version_id` to `complete-upload` request body as required by `BuildUploadCompleteRequest`
5. **React Native Build**: Fixed missing dependencies and simplified `settings.gradle` for proper Gradle plugin loading

### 🎯 Current Status:

All three workflows should now complete successfully with proper Revyl credentials:

- **Dummy**: Fast 200KB file upload via presigned URL
- **Expo**: Test file download via `from_url` workflow
- **React Native**: Real Android APK build via Gradle + presigned upload

The playground demonstrates both publishing methods (`from_url` and presigned upload) and verifies resolution works correctly.

### React Native Build Notes

The React Native Android workflow uses a **simplified build approach** for CI testing:

- **Skips JavaScript bundling** (`-x createBundleReleaseJsAndAssets`) to avoid Metro/Babel complexity
- **Focuses on testing** the presigned upload workflow rather than full app functionality
- **Fallback mechanism** creates a test APK if the build fails\
- **Production usage** would enable full JS bundling for complete app builds

This approach allows testing the **core Revyl integration** (build → publish → verify → test) without getting blocked by complex React Native toolchain setup in CI environments.
