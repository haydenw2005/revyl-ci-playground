#!/usr/bin/env node
import { readFileSync } from "fs";
import { basename } from "path";
import { jsonFetch, parseArgs, requiredEnv, uploadFile } from "./util.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Required arguments
  const filePath = args.file as string;
  const version = args.version as string;
  const buildVar =
    (args["build-var"] as string) || requiredEnv("REVYL_BUILD_VAR_ANDROID");

  if (!filePath || !version) {
    console.error(
      "Usage: publishPresigned.ts --file <path> --version <version> [--build-var <uuid>] [--filename <override>] [--metadata <json>]"
    );
    process.exit(1);
  }

  const baseUrl = requiredEnv("REVYL_BASE_URL");
  const apiKey = requiredEnv("REVYL_API_KEY");

  // Determine filename
  const filename = (args.filename as string) || basename(filePath);

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

  try {
    console.log(`Publishing file: ${filePath}`);
    console.log(`Version: ${version}`);
    console.log(`Build Variable: ${buildVar}`);
    console.log(`Filename: ${filename}`);
    console.log(`Metadata: ${JSON.stringify(metadata, null, 2)}`);

    // Step A: Get upload URL
    const uploadUrlEndpoint = `${baseUrl}/vars/${buildVar}/versions/upload-url?version=${encodeURIComponent(
      version
    )}&file_name=${encodeURIComponent(filename)}`;
    const uploadResponse = await jsonFetch(uploadUrlEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log("✅ Got upload URL");

    const { upload_url, version_id } = uploadResponse;
    if (!upload_url || !version_id) {
      throw new Error("Invalid response from upload-url endpoint");
    }

    // Step B: Upload file to presigned URL
    console.log("📤 Uploading file...");
    const fileBuffer = readFileSync(filePath);
    const contentType = filename.endsWith(".apk")
      ? "application/vnd.android.package-archive"
      : "application/octet-stream";

    await uploadFile(upload_url, fileBuffer, contentType);
    console.log("✅ File uploaded successfully");

    // Step C: Complete upload
    console.log("🔄 Completing upload...");
    const completeUrl = `${baseUrl}/versions/${version_id}/complete-upload`;
    const completeResponse = await jsonFetch(completeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ 
        version_id: version_id,
        metadata 
      }),
    });

    console.log("✅ Successfully published via presigned upload");
    console.log("Response:", JSON.stringify(completeResponse, null, 2));
  } catch (error) {
    console.error("❌ Failed to publish via presigned upload:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
