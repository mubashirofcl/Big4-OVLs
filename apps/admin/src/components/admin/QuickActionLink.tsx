"use client";

import Link from "next/link";

export function QuickActionLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-canvas)",
                textDecoration: "none",
                color: "var(--text-primary)",
                fontWeight: 500,
                fontSize: 14,
                border: "1px solid transparent",
                transition: "all 150ms ease"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--bg-card)";
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.boxShadow = "var(--shadow-soft)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = "var(--bg-canvas)";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <span style={{ fontSize: 18 }}>{icon}</span>
            {label}
        </Link>
    );
}
