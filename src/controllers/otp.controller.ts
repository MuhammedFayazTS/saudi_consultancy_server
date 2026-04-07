import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { OTP_RESEND_COOLDOWN_SECONDS } from "../constants/otp.js";
import { OtpSession } from "../models/otp-session.model.js";
import { sendOtpEmail } from "../services/mail.service.js";
import { createOtpSession, verifyOtp } from "../services/otp.service.js";

export const generateOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, purpose, module, ttlSeconds } = req.body;

  // You can rename email -> identifier internally
  const { otp, expiresAt, sessionId } = await createOtpSession({
    identifier: email,
    purpose,
    module,
    ttlSeconds,
  });

  // Send OTP via email
  await sendOtpEmail({
    to: email,
    otp,
    purpose,
    expiresAt,
  });

  res.status(HTTPSTATUS.CREATED).json({
    message: "OTP sent successfully",
    data: {
      sessionId,
      expiresAt,
      email,
      purpose,
      module: module || null,
    },
  });
});

export const validateOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, purpose, module, otp } = req.body;

  const result = await verifyOtp({
    identifier: email,
    purpose,
    module,
    otp,
  });

  if (!result.ok) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "OTP validation failed",
      reason: result.reason,
    });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "OTP verified successfully",
    success: true,
  });
});

export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, purpose, module, ttlSeconds } = req.body;

  // Find latest OTP session (any status) for this email+purpose+module
  const lastSession = await OtpSession.findOne({
    identifier: email,
    purpose,
    module,
  }).sort({ createdAt: -1 });

  // Cooldown check
  if (lastSession) {
    const secondsSinceLastOtp = Math.floor((Date.now() - lastSession.createdAt.getTime()) / 1000);

    if (secondsSinceLastOtp < OTP_RESEND_COOLDOWN_SECONDS) {
      res.status(HTTPSTATUS.TOO_MANY_REQUESTS).json({
        message: `Please wait before requesting another OTP`,
        retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastOtp,
      });
      return;
    }
  }

  // Create a fresh OTP session (your service invalidates older pending ones)
  const { otp, expiresAt, sessionId } = await createOtpSession({
    identifier: email,
    purpose,
    module,
    ttlSeconds,
  });

  await sendOtpEmail({
    to: email,
    otp,
    purpose,
    expiresAt,
  });

  res.status(HTTPSTATUS.CREATED).json({
    message: "OTP resent successfully",
    data: {
      sessionId,
      expiresAt,
      email,
      purpose,
      module: module || null,
    },
  });
});
