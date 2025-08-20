#!/usr/bin/env node
import {
  jsonFetch,
  parseArgs,
  parseHeadersFromArgs,
  requiredEnv,
} from "./util.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Required arguments
  const fromUrl = args["from-url"] as string;
  const version = args.version as string;
  const buildVar =
    (args["build-var"] as string) || requiredEnv("REVYL_BUILD_VAR_ANDROID");

  if (!fromUrl || !version) {
    console.error(
      'Usage: publishFromUrl.ts --from-url <url> --version <version> [--build-var <uuid>] [--header "Key: Value"] [--metadata <json>]'
    );
    process.exit(1);
  }

  const baseUrl = requiredEnv("REVYL_BASE_URL");
  const apiKey = requiredEnv("REVYL_API_KEY");

  // Parse headers from command line
  const customHeaders = parseHeadersFromArgs(process.argv.slice(2));

  // Parse metadata if provided
  let metadata = {};
  if (args.metadata) {
    try {
      metadata = JSON.parse(args.metadata as string);
    } catch (e) {
      console.error("Error: Invalid JSON in --metadata argument");
      process.exit(1);
    }
  }

  const requestBody = {
    from_url: fromUrl,
    version,
    metadata,
    headers: customHeaders,
  };

  try {
    console.log(`Publishing from URL: ${fromUrl}`);
    console.log(`Version: ${version}`);
    console.log(`Build Variable: ${buildVar}`);
    console.log(`Custom Headers: ${JSON.stringify(customHeaders, null, 2)}`);
    console.log(`Metadata: ${JSON.stringify(metadata, null, 2)}`);

    const url = `${baseUrl}/vars/${buildVar}/versions/from-url`;
    const response = await jsonFetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("✅ Successfully published from URL");
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ Failed to publish from URL:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
