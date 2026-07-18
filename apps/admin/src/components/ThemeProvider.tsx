"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setThemeState(stored);
        }

        // Add transition class after hydration to prevent FOUC transitions
        setTimeout(() => {
            document.documentElement.classList.add("theme-transition");
        }, 50);

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "theme") {
                setThemeState((e.newValue as Theme) || "system");
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        
        const applyTheme = (t: Theme) => {
            let resolved: "light" | "dark" = "light";
            if (t === "system") {
                resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                localStorage.removeItem("theme");
            } else {
                resolved = t;
                localStorage.setItem("theme", t);
            }
            
            root.setAttribute("data-theme", resolved);
            setResolvedTheme(resolved);
        };

        applyTheme(theme);

        // Listen for system theme changes
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme, mounted]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeState, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}
