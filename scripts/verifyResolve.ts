#!/usr/bin/env node
import { jsonFetch, parseArgs, requiredEnv } from "./util.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Required arguments
  const buildVar =
    (args["build-var"] as string) || requiredEnv("REVYL_BUILD_VAR_ANDROID");
  const version = args.version as string;

  if (!version) {
    console.error(
      "Usage: verifyResolve.ts --version <version> [--build-var <uuid>]"
    );
    process.exit(1);
  }

  const baseUrl = requiredEnv("REVYL_BASE_URL");
  const apiKey = requiredEnv("REVYL_API_KEY");

  const requestBody = {
    build_var_id: buildVar,
    pinned_version: version,
  };

  try {
    console.log(`Verifying resolve for version: ${version}`);
    console.log(`Build Variable: ${buildVar}`);

    const url = `${baseUrl}/resolve?include_download_url=true`;
    const response = await jsonFetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Verify response structure
    if (!response.version) {
      throw new Error("Response missing version field");
    }

    if (response.version !== version) {
      throw new Error(
        `Version mismatch: expected ${version}, got ${response.version}`
      );
    }

    if (!response.download_url) {
      throw new Error("Response missing download_url field");
    }

    console.log("✅ Verification successful");
    console.log(`Version: ${response.version}`);
    console.log(`Download URL: ${response.download_url}`);
    console.log("OK");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
