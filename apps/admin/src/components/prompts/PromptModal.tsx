"use client";

import { useRef, useEffect, useState } from "react";
import { usePromptFile } from "@/hooks/usePromptFile";

interface PromptModalProps {
    category: string | null;
    onClose: () => void;
}

export function PromptModal({ category, onClose }: PromptModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { status, data, error } = usePromptFile(category);
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (category && !dialog.open) {
            dialog.showModal();
        } else if (!category && dialog.open) {
            dialog.close();
        }
    }, [category]);

    // Reset copy state when modal changes
    useEffect(() => {
        setCopied(false);
        setCopyError(false);
    }, [category]);

    const handleCopy = async () => {
        if (!data?.prompt) return;
        
        try {
            await navigator.clipboard.writeText(data.prompt);
            setCopied(true);
            setCopyError(false);
            
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            setCopyError(true);
        }
    };

    if (!category) return null;

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            style={{
                position: "fixed",
                inset: 0,
                border: "none",
                background: "transparent",
                padding: 0,
                maxWidth: "none",
                maxHeight: "none",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
            onClick={(e) => {
                if (e.target === dialogRef.current) onClose();
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "var(--overlay)",
                    animation: "fade-in 200ms ease",
                }}
            />

            {/* Dialog Box */}
            <div
                className="responsive-modal"
                style={{
                    position: "relative",
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-xl)",
                    padding: 24,
                    width: "100%",
                    maxWidth: 520,
                    boxShadow: "var(--shadow-drawer)",
                    animation: "slide-up 250ms ease",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                        }}
                    >
                        {status === "success" && data ? data.title : "Loading Prompt..."}
                        {status === "error" && "Error"}
                    </h3>
                    
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 150ms ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Body */}
                <div
                    style={{
                        background: "var(--bg-input)",
                        borderRadius: "var(--radius-lg)",
                        padding: 16,
                        maxHeight: "60vh",
                        overflowY: "auto",
                        marginBottom: 20,
                    }}
                >
                    {status === "loading" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ height: 16, background: "var(--border-default)", borderRadius: 4, width: "100%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                            <div style={{ height: 16, background: "var(--border-default)", borderRadius: 4, width: "80%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                            <div style={{ height: 16, background: "var(--border-default)", borderRadius: 4, width: "90%", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                        </div>
                    )}
                    
                    {status === "error" && (
                        <p style={{ color: "var(--text-primary)", margin: 0 }}>
                            {error || "Couldn't load this prompt."}
                        </p>
                    )}
                    
                    {status === "success" && data && (
                        <pre
                            style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                fontFamily: "inherit",
                                fontSize: 14,
                                lineHeight: 1.6,
                                color: "var(--text-primary)",
                            }}
                        >
                            {data.prompt}
                        </pre>
                    )}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
                    {copyError && (
                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            Failed to copy to clipboard
                        </span>
                    )}
                    
                    <button
                        onClick={handleCopy}
                        disabled={status !== "success"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            borderRadius: "var(--radius-pill)",
                            border: "none",
                            background: "var(--hero-bg)",
                            color: "var(--hero-text)",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: status === "success" ? "pointer" : "not-allowed",
                            opacity: status === "success" ? 1 : 0.5,
                            transition: "opacity 150ms ease",
                        }}
                    >
                        {copied ? (
                            <>
                                <CheckIcon />
                                Copied
                            </>
                        ) : (
                            <>
                                <CopyIcon />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </dialog>
    );
}

// ─── Icons ──────────────────────────────────────────────

function XIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
