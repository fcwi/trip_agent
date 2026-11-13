export function getSavedAppearance() {
  try {
    const preference = localStorage.getItem("trip_agent:appearance");
    return preference === "dark" || preference === "light" ? preference : null;
  } catch {
    return null;
  }
}

export function applyDocumentTheme(isDarkMode) {
  const color = isDarkMode ? "#1a1614" : "#faf6e9";
  document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  document.documentElement.classList.toggle("dark", isDarkMode);
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}
