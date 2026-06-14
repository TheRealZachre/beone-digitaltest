import { createWriteStream } from "fs";
import { mkdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function saveUploadToDisk(file: File): Promise<{
  filePath: string;
  workDir: string;
}> {
  const workDir = join(
    tmpdir(),
    `yt-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  await mkdir(workDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload.mp4";
  const filePath = join(workDir, safeName);

  const nodeStream = Readable.fromWeb(
    file.stream() as Parameters<typeof Readable.fromWeb>[0]
  );
  await pipeline(nodeStream, createWriteStream(filePath));

  return { filePath, workDir };
}

export async function cleanupWorkDir(workDir: string): Promise<void> {
  await rm(workDir, { recursive: true, force: true });
}
