import React, { useCallback, useEffect, useState } from "react";
import { useThemeConfig } from "../config/ThemeConfig.jsx";

const initialDarkMode = () => {
  const hour = new Date().getHours();
  return hour >= 17 || hour < 6;
};

/**
 * Dark/light mode, theme-color meta, and semantic color tokens for the trip shell.
 * Behavior-equivalent extraction from AuthenticatedTripApp.
 */
export const useTripShellTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    // 使用 ThemeConfig 中的背景色基調 (#FDFBF7) 而非純白，讓狀態列與背景融合更自然
    const color = isDarkMode ? "#020617" : "#FDFBF7";
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", color);
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
    }
  }, [isDarkMode]);

  const setDarkModeStable = useCallback((value) => {
    setIsDarkMode(value);
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const { currentTheme, componentStyles } = useThemeConfig(isDarkMode);

  const cBase = currentTheme.colorBase;
  const cAccent = currentTheme.colorAccent;

  const containerStyle = React.useMemo(
    () => ({
      "--bg-texture": currentTheme.bgTexture,
    }),
    [currentTheme.bgTexture],
  );

  const colors = React.useMemo(() => {
    const sc = currentTheme.semanticColors;
    return {
      blue: isDarkMode ? sc.blue.dark : sc.blue.light,
      green: isDarkMode ? sc.green.dark : sc.green.light,
      red: isDarkMode ? sc.red.dark : sc.red.light,
      orange: isDarkMode ? sc.orange.dark : sc.orange.light,
      pink: isDarkMode ? sc.pink.dark : sc.pink.light,
    };
  }, [isDarkMode, currentTheme.semanticColors]);

  return {
    isDarkMode,
    setIsDarkMode: setDarkModeStable,
    toggleTheme,
    currentTheme,
    componentStyles,
    cBase,
    cAccent,
    containerStyle,
    colors,
  };
};
