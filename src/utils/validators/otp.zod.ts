import { z } from "zod";

export const otpCodeZod = z.string().regex(/^\d{4}$/, "OTP must be exactly 4 digits");

export const createOtpRequestZod = z.object({
  identifier: z.string().min(3),
  purpose: z.string().min(2),
  module: z.string().optional(),
  ttlSeconds: z
    .number()
    .int()
    .min(30)
    .max(15 * 60)
    .optional(), // 30s to 15min
});

export const verifyOtpRequestZod = z.object({
  identifier: z.string().min(3),
  purpose: z.string().min(2),
  module: z.string().optional(),
  otp: otpCodeZod,
});
