"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/ToastProvider";
import { changePasswordSchema } from "@/validations/auth.validation";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password criteria checklist
    const criteria = [
        { label: "At least 8 characters", met: newPassword.length >= 8 },
        { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(newPassword) },
        { label: "One lowercase letter (a-z)", met: /[a-z]/.test(newPassword) },
        { label: "One number (0-9)", met: /[0-9]/.test(newPassword) },
        { label: "One special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(newPassword) },
    ];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setErrors({});

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from your current password.");
            return;
        }

        const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Origin: window.location.origin,
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: parsed.data.currentPassword,
                    newPassword: parsed.data.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Failed to change password");
                setLoading(false);
                return;
            }

            setSuccess(true);
            toast("Password changed successfully. Please log in again with your new password.", "success");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setLoading(false);

            // Wait 2 seconds then redirect to login since refresh tokens were revoked
            setTimeout(() => {
                router.push("/login");
                router.refresh();
            }, 2000);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "12px 0 40px" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Change Password
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Update your admin account password. Setting a new password will revoke sessions on all other devices.
                </p>
            </div>

            {/* Form Card */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-xl)",
                    padding: 28,
                    boxShadow: "var(--shadow-card, 0 2px 8px rgba(0,0,0,0.05))",
                }}
            >
                {/* Success Banner */}
                {success && (
                    <div
                        style={{
                            padding: "14px 16px",
                            background: "rgba(16, 185, 129, 0.1)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "var(--radius-md)",
                            color: "#10b981",
                            fontSize: 14,
                            marginBottom: 24,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <div>
                            <strong>Password updated!</strong> Redirecting to login page...
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div
                        style={{
                            padding: "10px 14px",
                            background: "var(--danger-soft)",
                            border: "1px solid var(--danger)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--danger)",
                            fontSize: 13,
                            marginBottom: 20,
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Toggle Show Passwords */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                        <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                fontSize: 13,
                                color: "var(--accent)",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            {showPasswords ? "Hide Passwords" : "Show Passwords"}
                        </button>
                    </div>

                    {/* Current Password */}
                    <div style={{ marginBottom: 20 }}>
                        <label
                            htmlFor="currentPassword"
                            style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: 6,
                            }}
                        >
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                border: `1px solid ${errors.currentPassword ? "var(--danger)" : "var(--border-default)"}`,
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                background: "var(--bg-input)",
                                color: "var(--text-primary)",
                            }}
                        />
                        {errors.currentPassword && (
                            <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>
                                {errors.currentPassword[0]}
                            </span>
                        )}
                    </div>

                    {/* New Password */}
                    <div style={{ marginBottom: 20 }}>
                        <label
                            htmlFor="newPassword"
                            style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: 6,
                            }}
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                border: `1px solid ${errors.newPassword ? "var(--danger)" : "var(--border-default)"}`,
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                background: "var(--bg-input)",
                                color: "var(--text-primary)",
                            }}
                        />
                        {errors.newPassword && (
                            <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>
                                {errors.newPassword[0]}
                            </span>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div style={{ marginBottom: 24 }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{
                                display: "block",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: 6,
                            }}
                        >
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                border: `1px solid ${newPassword && confirmPassword && newPassword !== confirmPassword ? "var(--danger)" : "var(--border-default)"}`,
                                borderRadius: "var(--radius-md)",
                                fontSize: 14,
                                outline: "none",
                                background: "var(--bg-input)",
                                color: "var(--text-primary)",
                            }}
                        />
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--danger)" }}>
                                Passwords do not match
                            </span>
                        )}
                    </div>

                    {/* Criteria Checklist */}
                    <div
                        style={{
                            padding: "14px",
                            background: "var(--bg-canvas)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-default)",
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                            New Password Requirements:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {criteria.map((c, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 13,
                                        color: c.met ? "#10b981" : "var(--text-muted)",
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        {c.met ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="10" />}
                                    </svg>
                                    {c.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            style={{ padding: "10px 24px" }}
                        >
                            Update Password
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
