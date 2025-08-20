#!/usr/bin/env node
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData | Buffer;
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Error: Required environment variable ${name} is not set`);
    process.exit(1);
  }
  return value;
}

export async function jsonFetch(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  const fetch = (await import("node-fetch")).default;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  } as any);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function uploadFile(
  url: string,
  file: Buffer,
  contentType: string
): Promise<void> {
  const fetch = (await import("node-fetch")).default;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  } as any);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: HTTP ${response.status}: ${errorText}`);
  }
}

export function parseHeadersFromArgs(args: string[]): Record<string, string> {
  const headers: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--header" && i + 1 < args.length) {
      const headerValue = args[i + 1];
      const colonIndex = headerValue.indexOf(":");
      if (colonIndex > 0) {
        const key = headerValue.substring(0, colonIndex).trim();
        const value = headerValue.substring(colonIndex + 1).trim();
        headers[key] = value;
      }
    }
  }

  return headers;
}

export function parseArgs(args: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        parsed[key] = args[i + 1];
        i++; // Skip next arg since we used it as value
      } else {
        parsed[key] = true; // Boolean flag
      }
    }
  }

  return parsed;
}

export function getGitContext(): {
  repo: string;
  commit_sha: string;
  pr_number?: number;
  branch?: string;
} {
  const repo = process.env.GITHUB_REPOSITORY || "unknown/unknown";
  const commit_sha = process.env.GITHUB_SHA || "unknown";
  const pr_number = process.env.GITHUB_EVENT_NUMBER
    ? parseInt(process.env.GITHUB_EVENT_NUMBER)
    : undefined;
  const branch = process.env.GITHUB_REF_NAME || undefined;

  return { repo, commit_sha, pr_number, branch };
}
