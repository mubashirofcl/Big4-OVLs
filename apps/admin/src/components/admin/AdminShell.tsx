"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { BottomNav } from "@/components/admin/BottomNav";

interface AdminShellProps {
    children: React.ReactNode;
    userEmail: string;
    userName: string;
}

/**
 * Client-side admin shell — manages mobile sidebar toggle state.
 * Uses window resize to toggle between desktop sidebar and mobile drawer.
 */
export function AdminShell({ children, userEmail, userName }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <Header
                userEmail={userEmail}
                userName={userName}
                showMenuButton={false}
            />

            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                {!isMobile && (
                    <Sidebar
                        open={true}
                        onClose={() => {}}
                        isMobile={false}
                    />
                )}

                <div className="admin-main-content">
                    <main
                        style={{
                            flex: 1,
                            padding: isMobile ? "16px 16px calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 16px)" : 24,
                            maxWidth: 1400,
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        {children}
                    </main>

                    {isMobile && <BottomNav userEmail={userEmail} userName={userName} />}
                </div>
            </div>
        </div>
    );
}
