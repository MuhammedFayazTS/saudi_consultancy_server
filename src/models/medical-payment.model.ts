import type { Document, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IMedicalPayment extends Document {
  transactionId: Types.ObjectId;
  amount: number;
  paymentMode: string;
  date: Date;
  remarks: string;
  isDeleted: boolean;
}

const MedicalPaymentSchema = new Schema<IMedicalPayment>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const MedicalPayment = mongoose.model<IMedicalPayment>(
  "MedicalPayment",
  MedicalPaymentSchema
);
