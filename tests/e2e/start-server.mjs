import { webcrypto } from "node:crypto";

const TEST_PASSWORD = "trip-e2e-password";
const TEST_ENCRYPTED_KEY =
  "11111111111111111111111111111111:222222222222222222222222:e086bfd82e91bc888c7eb25c4cd31ae81e57f437474f4723be1f9bf4786a5cc7dcea7462ddc61d";
const E2E_GAS_URL = "http://127.0.0.1:4173/__e2e_gas__";

const toHex = (bytes) =>
  [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const encryptPacked = async (text, password) => {
  const encoder = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  const key = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text),
  );
  return `${toHex(salt)}:${toHex(iv)}:${toHex(encrypted)}`;
};

process.env.VITE_TRIP_ID = process.env.E2E_TRIP_ID || "2026_busan";
process.env.VITE_BASE_PATH = "/";
process.env.VITE_PUBLIC_SITE_URL = "http://127.0.0.1:4173";
process.env.VITE_ENCODED_KEY = TEST_ENCRYPTED_KEY;
process.env.VITE_ENCODED_MAPS_KEY = "";
process.env.VITE_ENCODED_MAPTILER_KEY = "";
process.env.VITE_ENCODED_GAS_URL = await encryptPacked(
  E2E_GAS_URL,
  TEST_PASSWORD,
);
process.env.VITE_ENCODED_GAS_TOKEN = await encryptPacked(
  "e2e-gas-token",
  TEST_PASSWORD,
);
process.env.E2E_TEST_PASSWORD = TEST_PASSWORD;
process.env.E2E_GAS_URL = E2E_GAS_URL;

const { createServer } = await import("vite");
const server = await createServer({
  mode: "e2e",
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();
