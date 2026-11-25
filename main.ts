import { join, dirname } from "node:path";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const TIP = "Your AI merged its own PR. You got the 3am page. Fair trade?";

function writeOutput(outputDir: string): string {
  const outputPath = join(outputDir, "entry.txt");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, TIP, "utf-8");
  return outputPath;
}

function verifyOutput(outputPath: string): { chars: number; sha256: string; matches: boolean } {
  const written = readFileSync(outputPath, "utf-8");
  const chars = written.length;
  const sha256 = createHash("sha256").update(written).digest("hex");
  const matches = written === TIP && chars >= 1 && chars <= 200 && written.trim().length > 0;
  return { chars, sha256, matches };
}

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outputPath = writeOutput(outputDir);
  const { chars, sha256, matches } = verifyOutput(outputPath);

  if (!matches) {
    console.error(`[verify] FAIL: chars=${chars}, sha256=${sha256}`);
    process.exit(1);
  }
  console.error(`[verify] OK: ${chars} chars, SHA256: ${sha256}`);
}

main();