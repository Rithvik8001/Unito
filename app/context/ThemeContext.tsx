import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

// Define theme colors with more elegant palette
export const lightTheme = {
  background: "#FFFFFF",
  card: "#F8F9FA",
  text: "#212529",
  primary: "#4361EE",
  secondary: "#F72585",
  border: "#E9ECEF",
  success: "#38B000",
  error: "#E63946",
  warning: "#FB8500",
  info: "#4CC9F0",
  subtle: "#F8F9FA",
  accent: "#7209B7",
};

export const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#F8F9FA",
  primary: "#4CC9F0",
  secondary: "#F72585",
  border: "#2A2A2A",
  success: "#57CC99",
  error: "#E63946",
  warning: "#FB8500",
  info: "#4361EE",
  subtle: "#2A2A2A",
  accent: "#7209B7",
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
