import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  message: z.string().trim().min(5, "Message is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Save lead to Database
    try {
      await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          interest: data.interest,
          message: data.message,
        }
      });
    } catch (dbError) {
      console.error("Failed to save lead to database:", dbError);
      // We can continue to try to send the email even if DB fails
    }

    // 2. Send email via Nodemailer
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpUser = process.env.SMTP_USER || "big4tiles@gmail.com";
    const smtpPass = (process.env.SMTP_PASS || "hxtvybmyhmnlqsqu").replace(/\s+/g, "");
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpTo = process.env.SMTP_TO || "big4tiles@gmail.com";

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const isGmail = smtpHost.toLowerCase().includes("gmail");

        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: "gmail",
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
                tls: {
                  rejectUnauthorized: false,
                },
              }
        );

        const mailOptions = {
          from: `"Big4 Website Inquiry" <${smtpUser}>`,
          to: smtpTo,
          replyTo: data.email,
          subject: `📩 Website Inquiry: ${data.interest || "General Inquiry"} — ${data.name}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #0b0f19; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #ffffff; font-size: 22px; margin: 0;">Big4 Tiles & Sanitary</h2>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">New Contact Form Lead</p>
              </div>

              <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #38bdf8;">Name:</strong> ${data.name}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #38bdf8;">Email:</strong> <a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></p>
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #38bdf8;">Phone:</strong> ${data.phone ? `<a href="tel:${data.phone}" style="color: #60a5fa;">${data.phone}</a>` : "Not provided"}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #38bdf8;">Interested In:</strong> ${data.interest || "General Inquiry"}</p>
              </div>

              <div style="background: #0f172a; padding: 18px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;"><strong>Message:</strong></p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e2e8f0;">${data.message.replace(/\n/g, "<br>")}</p>
              </div>

              <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">
                Sent directly from the Big4 Website contact form. You can reply directly to this email to respond to ${data.name}.
              </p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ [Nodemailer] Contact form email sent successfully! MessageId:", info.messageId);
      } catch (emailError) {
        console.error("❌ [Nodemailer] Failed to send email via nodemailer:", emailError);
      }
    } else {
      console.warn("⚠️ SMTP credentials missing!");
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit message. Please try again." },
      { status: 500 }
    );
  }
}
