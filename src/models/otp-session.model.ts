import type { Document, Model } from "mongoose";

import mongoose, { Schema } from "mongoose";

export type OtpStatus = "PENDING" | "VERIFIED" | "EXPIRED" | "FAILED";

export interface IOtpSession extends Document {
  identifier: string; // email/phone/userId
  module?: string; // optional: "BOOKING", "LOGIN", etc.
  purpose: string; // required: "LOGIN", "RESET_PASSWORD", ...
  otpHash: string;

  status: OtpStatus;

  attempts: number;
  maxAttempts: number;

  createdAt: Date;
  expiresAt: Date;
  consumedAt?: Date;

  meta?: Record<string, any>;
}

const OtpSessionSchema = new Schema<IOtpSession>(
  {
    identifier: { type: String, required: true, index: true },
    module: { type: String, required: false, index: true },
    purpose: { type: String, required: true, index: true },

    otpHash: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "EXPIRED", "FAILED"],
      default: "PENDING",
      index: true,
    },

    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },

    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date },

    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Auto-expire documents after expiresAt
OtpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent having too many active OTPs for same identifier+purpose
OtpSessionSchema.index(
  { identifier: 1, purpose: 1, status: 1 },
  { partialFilterExpression: { status: "PENDING" } }
);

export const OtpSession: Model<IOtpSession> =
  mongoose.models.OtpSession || mongoose.model("OtpSession", OtpSessionSchema);
