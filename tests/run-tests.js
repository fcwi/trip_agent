import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const testsDirectory = path.resolve("tests");
const testFiles = fs
  .readdirSync(testsDirectory)
  .filter((fileName) => fileName.endsWith(".test.js"))
  .sort();

if (testFiles.length === 0) {
  throw new Error("找不到任何 tests/*.test.js 測試檔");
}

for (const fileName of testFiles) {
  await import(pathToFileURL(path.join(testsDirectory, fileName)).href);
}
