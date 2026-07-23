import nodemailer from "nodemailer";
import { env } from "@/config/env";

/**
 * Nodemailer transporter — configured from environment variables.
 *
 * For Gmail: use an App Password (not your regular password).
 * Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local
 */
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

/**
 * Send a password reset email with the reset link.
 */
export async function sendPasswordResetEmail(
    to: string,
    resetToken: string
): Promise<void> {
    const smtpHost = process.env.SMTP_HOST || env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER || env.SMTP_USER || "";
    const smtpPass = (process.env.SMTP_PASS || env.SMTP_PASS || "").replace(/\s+/g, "");
    const appUrl = process.env.APP_URL || env.APP_URL || "http://localhost:3000";

    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    // Always log to console in development so developers can test easily
    console.log("\n=======================================================");
    console.log(`🔐 ADMIN PASSWORD RESET LINK FOR ${to}:`);
    console.log(`🔗 ${resetUrl}`);
    console.log("=======================================================\n");

    if (!smtpUser || !smtpPass) {
        console.warn("⚠️ [Nodemailer] SMTP_USER or SMTP_PASS is missing in apps/admin/.env.local!");
        console.warn("⚠️ Network email sending skipped. Please add SMTP_USER and SMTP_PASS (App Password) to send real emails.");
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for 587/25
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const info = await transporter.sendMail({
            from: `"Big4 Admin" <${smtpUser}>`,
            to,
            subject: "Reset Your Admin Password — Big4",
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">Big4 Admin Panel</h2>
                        <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Password Reset Request</p>
                    </div>
                    
                    <div style="background: #1e293b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                            We received a request to reset the password for your administrator account (<strong>${to}</strong>).
                        </p>
                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
                            Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
                        </p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}"
                               style="display: inline-block; padding: 14px 32px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                                Reset Password
                            </a>
                        </div>
                    </div>

                    <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0; text-align: center;">
                        If you did not request a password reset, you can safely ignore this message. Your account remains secure.
                    </p>
                    <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />
                    <p style="color: #64748b; font-size: 12px; word-break: break-all; margin: 0; text-align: center;">
                        Direct URL: <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
                    </p>
                </div>
            `,
        });

        console.log(`✅ [Nodemailer] Password reset email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (err) {
        console.error("❌ [Nodemailer] Failed to deliver password reset email:", err);
    }
}
