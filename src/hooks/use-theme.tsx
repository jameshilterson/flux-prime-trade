import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
  theme: "dark", toggle: () => {}, setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Dark by default everywhere. Dashboard pages may opt into "light" via toggle.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const path = window.location.pathname;
    const inDashboard = path.startsWith("/dashboard");
    if (inDashboard) {
      return (localStorage.getItem("dashboard-theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    if (window.location.pathname.startsWith("/dashboard")) {
      localStorage.setItem("dashboard-theme", theme);
    }
  }, [theme]);

  // Force dark whenever route leaves the dashboard.
  useEffect(() => {
    const onChange = () => {
      const inDashboard = window.location.pathname.startsWith("/dashboard");
      if (!inDashboard) setTheme("dark");
      else setTheme((localStorage.getItem("dashboard-theme") as Theme) || "dark");
    };
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark"), setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
