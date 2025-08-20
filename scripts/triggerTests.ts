#!/usr/bin/env node
import { getGitContext, jsonFetch, parseArgs, requiredEnv } from "./util.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Required arguments
  const buildVar =
    (args["build-var"] as string) || requiredEnv("REVYL_BUILD_VAR_ANDROID");
  const version = args.version as string;
  const suite = (args.suite as string) || "smoke";

  if (!version) {
    console.error(
      "Usage: triggerTests.ts --version <version> [--build-var <uuid>] [--suite <name>]"
    );
    process.exit(1);
  }

  const baseUrl = requiredEnv("REVYL_BASE_URL");
  const apiKey = requiredEnv("REVYL_API_KEY");

  // Get Git context for the test run
  const gitContext = getGitContext();

  const requestBody = {
    selection: {
      type: "suite",
      name: suite,
    },
    targets: [
      {
        build_var_id: buildVar,
        pinned_version: version,
      },
    ],
    context: gitContext,
  };

  try {
    console.log(`Triggering test run for version: ${version}`);
    console.log(`Build Variable: ${buildVar}`);
    console.log(`Suite: ${suite}`);
    console.log(`Context: ${JSON.stringify(gitContext, null, 2)}`);

    // Note: Using the base URL but switching to v1 endpoint
    const apiBaseUrl = baseUrl.replace("/builds", "");
    const url = `${apiBaseUrl}/v1/test-runs`;

    const response = await jsonFetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("✅ Test run triggered successfully");

    if (response.run_id) {
      console.log(`Run ID: ${response.run_id}`);
    }

    if (response.url) {
      console.log(`Run URL: ${response.url}`);
    }

    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ Failed to trigger test run:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
