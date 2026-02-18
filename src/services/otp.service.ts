import crypto from "crypto";
import { createOtpRequestZod, verifyOtpRequestZod } from "../utils/validators/otp.zod";
import { OtpSession } from "../models/otp-session.model";
import { env } from "../utils/env";

const DEFAULT_TTL_SECONDS = 5 * 60; // 5 minutes

function generate4DigitOtp(): string {
  // crypto-secure, 0000 to 9999
  return crypto.randomInt(0, 10000).toString().padStart(4, "0");
}

function hashOtp(otp: string): string {
  // HMAC is better than plain hash (prevents rainbow attacks)
  const secret = env.OTP_SECRET || "dev-secret-change-me";
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
}

export async function createOtpSession(input: unknown) {
  const data = createOtpRequestZod.parse(input);

  const ttlSeconds = data.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const otp = generate4DigitOtp();
  const otpHash = hashOtp(otp);

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  // Optional: invalidate old pending OTPs for same identifier + purpose (+module)
  await OtpSession.updateMany(
    {
      identifier: data.identifier,
      purpose: data.purpose,
      module: data.module,
      status: "PENDING",
    },
    { $set: { status: "FAILED" } }
  );

  const session = await OtpSession.create({
    identifier: data.identifier,
    purpose: data.purpose,
    module: data.module,
    otpHash,
    expiresAt,
    status: "PENDING",
  });

  return {
    sessionId: session._id.toString(),
    otp, // return so you can send it via SMS/email
    expiresAt: session.expiresAt,
  };
}

export async function verifyOtp(input: unknown) {
  const data = verifyOtpRequestZod.parse(input);

  const otpHash = hashOtp(data.otp);

  // Find latest pending OTP
  const session = await OtpSession.findOne({
    identifier: data.identifier,
    purpose: data.purpose,
    module: data.module,
    status: "PENDING",
  }).sort({ createdAt: -1 });

  if (!session) {
    return { ok: false, reason: "NO_PENDING_OTP" as const };
  }

  // Expiry check
  if (session.expiresAt.getTime() < Date.now()) {
    session.status = "EXPIRED";
    await session.save();
    return { ok: false, reason: "EXPIRED" as const };
  }

  // Attempts check
  if (session.attempts >= session.maxAttempts) {
    session.status = "FAILED";
    await session.save();
    return { ok: false, reason: "TOO_MANY_ATTEMPTS" as const };
  }

  // Increase attempts always (prevents brute forcing)
  session.attempts += 1;

  // Match check
  if (session.otpHash !== otpHash) {
    await session.save();
    return { ok: false, reason: "INVALID_OTP" as const };
  }

  // Success
  session.status = "VERIFIED";
  session.consumedAt = new Date();
  await session.save();

  return { ok: true, reason: null };
}
