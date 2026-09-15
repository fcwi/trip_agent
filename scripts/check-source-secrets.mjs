import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve("src");
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const secretPatterns = [
  {
    name: "Google API key",
    pattern: /AIza[0-9A-Za-z_-]{30,}/g,
  },
  {
    name: "Google Apps Script deployment URL",
    pattern: /https:\/\/script\.google\.com\/macros\/s\/[0-9A-Za-z_-]{20,}/g,
  },
];

const sourceFiles = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(entryPath);
    else if (sourceExtensions.has(path.extname(entry.name))) {
      sourceFiles.push(entryPath);
    }
  }
};

visit(sourceRoot);

const findings = [];
try {
  const trackedEnvFiles = execFileSync(
    "git",
    ["ls-files", "--", ".env", ".env.*"],
    { encoding: "utf8" },
  )
    .split("\n")
    .map((fileName) => fileName.trim())
    .filter(Boolean)
    .filter((fileName) => fileName !== ".env.example");

  for (const fileName of trackedEnvFiles) {
    findings.push(`${fileName}: tracked env file`);
  }
} catch {
  // 非 git 工作目錄時略過追蹤檢查，仍掃描原始碼。
}

for (const filePath of sourceFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const { name, pattern } of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      findings.push(`${path.relative(process.cwd(), filePath)}: ${name}`);
    }
  }
}

if (findings.length > 0) {
  console.error(`Source secret check failed:\n- ${findings.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Source secret check passed (${sourceFiles.length} files scanned).`,
  );
}
