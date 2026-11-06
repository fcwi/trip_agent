// Use the same HttpOnly session flow as Render, with the isolated test server.
export async function authenticate(page) {
  const response = await page.request.post("/api/login", {
    headers: { Origin: "http://127.0.0.1:4173" },
    data: { password: "trip-e2e-password" },
  });
  if (!response.ok()) {
    throw new Error(`Test login failed: ${response.status()}`);
  }
}
