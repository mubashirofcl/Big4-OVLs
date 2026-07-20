"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { PromptModal } from "@/components/prompts/PromptModal";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/products", label: "Products", icon: ProductIcon },
    { href: "/admin/categories", label: "Categories", icon: CategoryIcon },
    { href: "/admin/brands", label: "Brands", icon: BrandIcon },
    { href: "/admin/offers", label: "Offers", icon: OfferIcon },
];

interface BottomNavProps {
    userEmail: string;
    userName: string;
}

export function BottomNav({ userEmail, userName }: BottomNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [moreOpen, setMoreOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [promptCategory, setPromptCategory] = useState<string | null>(null);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: { Origin: window.location.origin },
                credentials: "include",
            });
            router.push("/login");
            router.refresh();
        } catch {
            setLoggingOut(false);
        }
    };

    return (
        <>
            <nav
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))",
                    background: "var(--bg-card)",
                    borderTop: "1px solid var(--border-default)",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    paddingBottom: "env(safe-area-inset-bottom)",
                    zIndex: 40,
                }}
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                textDecoration: "none",
                                color: isActive ? "var(--hero-bg)" : "var(--text-secondary)",
                                flex: 1,
                            }}
                        >
                            <item.icon active={isActive} />
                            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500 }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* More Button */}
                <button
                    onClick={() => setMoreOpen(true)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        flex: 1,
                        cursor: "pointer",
                    }}
                >
                    <MoreIcon active={moreOpen} />
                    <span style={{ fontSize: 10, fontWeight: 500 }}>More</span>
                </button>
            </nav>

            {/* "More" Bottom Sheet */}
            {moreOpen && (
                <>
                    <div
                        onClick={() => setMoreOpen(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "var(--overlay)",
                            zIndex: 49,
                            animation: "fade-in 200ms ease",
                        }}
                    />
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "var(--bg-card)",
                            borderTopLeftRadius: "var(--radius-xl)",
                            borderTopRightRadius: "var(--radius-xl)",
                            padding: "24px 20px calc(24px + env(safe-area-inset-bottom))",
                            zIndex: 50,
                            animation: "slide-up-sheet 250ms ease",
                            boxShadow: "var(--shadow-drawer)",
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 4,
                                background: "var(--border-default)",
                                borderRadius: 2,
                                margin: "0 auto 24px",
                            }}
                        />

                        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{userName}</div>
                                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{userEmail}</div>
                            </div>
                            <ThemeSelector />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {/* Prompts Section */}
                            <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.2, padding: "0 8px 8px" }}>
                                    Prompts
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    {[
                                        { id: "bedroom", label: "Bedroom", icon: BedDoubleIcon },
                                        { id: "office", label: "Office", icon: BriefcaseIcon },
                                        { id: "bathroom", label: "Bathroom", icon: BathIcon },
                                        { id: "kitchen", label: "Kitchen", icon: ChefHatIcon }
                                    ].map((btn) => {
                                        const isActive = promptCategory === btn.id;
                                        return (
                                            <button
                                                key={btn.id}
                                                onClick={() => setPromptCategory(btn.id)}
                                                aria-label={`Open ${btn.label} prompt`}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    padding: "10px",
                                                    borderRadius: "var(--radius-md)",
                                                    background: isActive ? "var(--hero-bg)" : "var(--bg-canvas)",
                                                    color: isActive ? "var(--hero-text)" : "var(--text-primary)",
                                                    border: "1px solid var(--border-default)",
                                                    cursor: "pointer",
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    transition: "var(--transition-fast)",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <btn.icon active={isActive} />
                                                {btn.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                style={{
                                    width: "100%",
                                    padding: 16,
                                    borderRadius: "var(--radius-pill)",
                                    border: "none",
                                    background: "var(--danger-soft)",
                                    color: "var(--danger)",
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: loggingOut ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    opacity: loggingOut ? 0.7 : 1,
                                }}
                            >
                                <LogoutIcon />
                                {loggingOut ? "Logging out..." : "Log out"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <PromptModal
                category={promptCategory}
                onClose={() => setPromptCategory(null)}
            />
        </>
    );
}

// ─── Icons ──────────────────────────────────────────────

function DashboardIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function ProductIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function CategoryIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function BrandIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    );
}

function OfferIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
            <path d="M11 11h2v2h-2z" />
        </svg>
    );
}

function MoreIcon({ active }: { active: boolean }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

function BedDoubleIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
            <path d="M12 4v6" />
            <path d="M2 18h20" />
        </svg>
    );
}

function BriefcaseIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function BathIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <line x1="10" y1="5" x2="8" y2="7" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="7" y1="19" x2="7" y2="21" />
            <line x1="17" y1="19" x2="17" y2="21" />
        </svg>
    );
}

function ChefHatIcon({ active }: { active?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--hero-text)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
    );
}
