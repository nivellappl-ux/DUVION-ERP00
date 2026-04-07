import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setDark: () => void;
  setLight: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  isDark: true,
  isLight: false,
  toggleTheme: () => {},
  setDark: () => {},
  setLight: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("duvion-theme") as ThemeMode) || "dark";
  });

  useEffect(() => {
    localStorage.setItem("duvion-theme", mode);
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.remove("light-mode");
      root.classList.add("dark-mode");
    }
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    isDark: mode === "dark",
    isLight: mode === "light",
    toggleTheme: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    setDark: () => setMode("dark"),
    setLight: () => setMode("light"),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
