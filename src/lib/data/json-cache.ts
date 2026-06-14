import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { isCloudflareWorkersRuntime } from "@/lib/cloudflare-build";

const TMP_DATA_DIR = path.join("/tmp", "digital-dashboard-data");

const bundledJsonLoaders: Record<string, () => Promise<unknown>> = {
  "beone-digitaltest-users.json": () =>
    import("../../../data/beone-digitaltest-users.json").then((m) => m.default),
  "users.json": () => import("../../../data/users.json").then((m) => m.default),
  "social-posts.json": () =>
    import("../../../data/social-posts.json").then((m) => m.default),
  "linkedin-posts.json": () =>
    import("../../../data/linkedin-posts.json").then((m) => m.default),
  "password-reset-tokens.json": () =>
    Promise.resolve({ tokens: [] }),
};

function getBundledDataDir(): string {
  const candidates = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "..", "..", "data"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(process.cwd(), "data");
}

function usesEphemeralCache(): boolean {
  const cwd = process.cwd();

  return (
    isCloudflareWorkersRuntime() ||
    process.env.VERCEL === "1" ||
    process.env.VERCEL_ENV !== undefined ||
    process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
    process.env.LAMBDA_TASK_ROOT !== undefined ||
    process.env.CF_PAGES === "1" ||
    process.env.WORKERS_CI === "1" ||
    cwd.startsWith("/var/task")
  );
}

function hasWritableFilesystem(): boolean {
  return !isCloudflareWorkersRuntime();
}

function getWritableDataDir(): string {
  if (usesEphemeralCache()) {
    return TMP_DATA_DIR;
  }

  return getBundledDataDir();
}

export function getBundledDataPath(filename: string): string {
  return path.join(getBundledDataDir(), filename);
}

export function getRuntimeDataPath(filename: string): string {
  return path.join(getWritableDataDir(), filename);
}

async function readBundledJson<T>(filename: string): Promise<T | null> {
  const loader = bundledJsonLoaders[filename];
  if (!loader) return null;

  try {
    return (await loader()) as T;
  } catch {
    return null;
  }
}

export async function readJsonCache<T>(filename: string): Promise<T | null> {
  if (isCloudflareWorkersRuntime()) {
    return readBundledJson<T>(filename);
  }

  const readPaths = usesEphemeralCache()
    ? [path.join(TMP_DATA_DIR, filename), getBundledDataPath(filename)]
    : [getBundledDataPath(filename)];

  for (const cachePath of readPaths) {
    try {
      const raw = await readFile(cachePath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      // Try the next location.
    }
  }

  return readBundledJson<T>(filename);
}

function isReadOnlyFilesystemError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  return (
    code === "EROFS" ||
    code === "EPERM" ||
    error.message.includes("[unenv]")
  );
}

export async function writeJsonCache<T>(
  filename: string,
  data: T
): Promise<void> {
  if (!hasWritableFilesystem()) {
    return;
  }

  const content = JSON.stringify(data, null, 2);
  const primaryPath = path.join(getWritableDataDir(), filename);

  try {
    await mkdir(path.dirname(primaryPath), { recursive: true });
    await writeFile(primaryPath, content, "utf8");
    return;
  } catch (error) {
    if (!isReadOnlyFilesystemError(error)) {
      throw error;
    }
  }

  const fallbackPath = path.join(TMP_DATA_DIR, filename);
  try {
    await mkdir(path.dirname(fallbackPath), { recursive: true });
    await writeFile(fallbackPath, content, "utf8");
  } catch (error) {
    if (!isReadOnlyFilesystemError(error)) {
      throw error;
    }
  }
}
