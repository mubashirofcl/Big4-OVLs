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
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const cleanPass = smtpPass.replace(/\s+/g, "");
        const isGmail = smtpHost.toLowerCase().includes("gmail");

        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: "gmail",
                auth: {
                  user: smtpUser,
                  pass: cleanPass,
                },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: cleanPass,
                },
                tls: {
                  rejectUnauthorized: false,
                },
              }
        );

        const mailOptions = {
          from: `"Big4 Website" <${smtpUser}>`,
          to: process.env.SMTP_TO || "big4tiles@gmail.com",
          replyTo: data.email,
          subject: `New Website Lead: ${data.interest || "Contact Form"} - ${data.name}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Interest:</strong> ${data.interest || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
              ${data.message.replace(/\n/g, "<br>")}
            </blockquote>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Nodemailer email sent successfully! MessageId:", info.messageId);
      } catch (emailError) {
        console.error("Failed to send email via nodemailer:", emailError);
      }
    } else {
      console.warn("SMTP credentials missing! Missing:", {
        SMTP_HOST: !!smtpHost,
        SMTP_USER: !!smtpUser,
        SMTP_PASS: !!smtpPass
      });
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
