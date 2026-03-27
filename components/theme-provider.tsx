"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeContextType = {
  lowStimulus: boolean;
  toggleLowStimulus: () => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [lowStimulus, setLowStimulus] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const savedLowStimulus = localStorage.getItem("neurosync-low-stimulus");
    const savedAnimations = localStorage.getItem("neurosync-animations");

    if (savedLowStimulus === "true") {
      setLowStimulus(true);
      document.documentElement.classList.add("low-stimulus");
    }
    if (savedAnimations === "false") {
      setAnimationsEnabled(false);
    }
  }, []);

  const toggleLowStimulus = () => {
    const newValue = !lowStimulus;
    setLowStimulus(newValue);
    localStorage.setItem("neurosync-low-stimulus", String(newValue));

    if (newValue) {
      document.documentElement.classList.add("low-stimulus");
      setAnimationsEnabled(false);
      localStorage.setItem("neurosync-animations", "false");
    } else {
      document.documentElement.classList.remove("low-stimulus");
    }
  };

  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem("neurosync-animations", String(newValue));
  };

  return (
    <ThemeContext.Provider
      value={{
        lowStimulus,
        toggleLowStimulus,
        animationsEnabled,
        toggleAnimations,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
