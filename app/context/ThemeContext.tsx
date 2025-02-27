import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

// Define theme colors
export const lightTheme = {
  background: "#FFFFFF",
  card: "#F5F5F5",
  text: "#333333",
  primary: "#4A6FFF",
  secondary: "#FF6B6B",
  border: "#E0E0E0",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
  info: "#2196F3",
};

export const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  primary: "#6C8FFF",
  secondary: "#FF8A8A",
  border: "#333333",
  success: "#66BB6A",
  error: "#EF5350",
  warning: "#FFCA28",
  info: "#42A5F5",
};

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceColorScheme === "dark");

  // Update theme when device theme changes
  useEffect(() => {
    setIsDark(deviceColorScheme === "dark");
  }, [deviceColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
