import nodemailer from "nodemailer";

import { env } from "../utils/env.js";

const GMAIL_USER = env.GMAIL_USER;
const GMAIL_APP_PASSWORD = env.GMAIL_APP_PASSWORD;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.warn("[mail.service] Missing GMAIL_USER or GMAIL_APP_PASSWORD in env");
}

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD, // Use Gmail App Password (not your normal password)
  },
});

export async function sendOtpEmail(params: {
  to: string;
  otp: string;
  purpose: string;
  expiresAt: Date;
}) {
  const { to, otp, purpose, expiresAt } = params;

  const expiryMinutes = Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 60000));

  await mailTransporter.sendMail({
    from: `"Travel Agency App" <${GMAIL_USER}>`,
    to,
    subject: `Your OTP Code (${purpose})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>OTP Verification</h2>
        <p>Your OTP code for <b>${purpose}</b> is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP will expire in <b>${expiryMinutes} minute(s)</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}
