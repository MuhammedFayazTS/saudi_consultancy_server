import type { Document, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IAgencyPayment extends Document {
  transactionId: Types.ObjectId;
  date: Date;
  agency: string;
  amount: number;
  accountHolder: string;
  paymentMode: string;
  remarks: string;
  isDeleted: boolean;
}

const AgencyPaymentSchema = new Schema<IAgencyPayment>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    date: { type: Date, required: true },
    agency: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    accountHolder: { type: String, required: true },
    paymentMode: { type: String, required: true },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const AgencyPayment = mongoose.model<IAgencyPayment>("AgencyPayment", AgencyPaymentSchema);
