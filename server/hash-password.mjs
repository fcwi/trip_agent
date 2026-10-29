import { randomBytes, scryptSync } from "node:crypto";
// Read from stdin, so passwords are not included in shell arguments/history.
let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, "");
if (password.length < 12) throw new Error("Use at least 12 characters");
const salt = randomBytes(16).toString("hex");
console.log(`${salt}:${scryptSync(password, salt, 64).toString("hex")}`);
