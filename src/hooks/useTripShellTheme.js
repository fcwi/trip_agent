import React, { useCallback, useEffect, useState } from "react";
import { useThemeConfig } from "../config/ThemeConfig.jsx";
import { applyDocumentTheme, getSavedAppearance } from "../utils/documentTheme.js";

const initialDarkMode = () => {
  const preference = getSavedAppearance();
  if (preference) return preference === "dark";
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
    applyDocumentTheme(isDarkMode);
  }, [isDarkMode]);

  const setDarkModeStable = useCallback((value) => {
    setIsDarkMode(value);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    try {
      localStorage.setItem("trip_agent:appearance", next ? "dark" : "light");
    } catch {
      /* The current page can still change appearance. */
    }
    setIsDarkMode(next);
  };

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
