"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Placeholder to prevent layout shift before hydration
        return <div style={{ height: 36, width: 108, background: "var(--bg-input)", borderRadius: "var(--radius-pill)" }} />;
    }

    const options = [
        { value: "light", label: "Light", icon: SunIcon },
        { value: "dark", label: "Dark", icon: MoonIcon },
        { value: "system", label: "System", icon: MonitorIcon }
    ] as const;

    return (
        <div
            role="radiogroup"
            aria-label="Theme selection: Light, Dark, or Match System"
            style={{
                display: "inline-flex",
                background: "var(--bg-input)",
                padding: 4,
                borderRadius: "var(--radius-pill)",
                gap: 4
            }}
        >
            {options.map((opt) => {
                const isActive = theme === opt.value;
                return (
                    <button
                        key={opt.value}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={opt.label}
                        onClick={() => setTheme(opt.value)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-pill)",
                            border: "none",
                            background: isActive ? "var(--hero-bg)" : "transparent",
                            color: isActive ? "var(--hero-text)" : "var(--text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all var(--transition-fast)",
                            outline: "none"
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.boxShadow = "0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--text-primary)";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <opt.icon />
                    </button>
                );
            })}
        </div>
    );
}

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function MonitorIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    );
}
