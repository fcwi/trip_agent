const TEST_PASSWORD = "trip-e2e-password";
const TEST_ENCRYPTED_KEY =
  "11111111111111111111111111111111:222222222222222222222222:e086bfd82e91bc888c7eb25c4cd31ae81e57f437474f4723be1f9bf4786a5cc7dcea7462ddc61d";

process.env.VITE_TRIP_ID = process.env.E2E_TRIP_ID || "2026_busan";
process.env.VITE_BASE_PATH = "/";
process.env.VITE_PUBLIC_SITE_URL = "http://127.0.0.1:4173";
process.env.VITE_ENCODED_KEY = TEST_ENCRYPTED_KEY;
process.env.VITE_ENCODED_MAPS_KEY = "";
process.env.VITE_ENCODED_MAPTILER_KEY = "";
process.env.VITE_ENCODED_GAS_URL = "";
process.env.VITE_ENCODED_GAS_TOKEN = "";
process.env.E2E_TEST_PASSWORD = TEST_PASSWORD;

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
