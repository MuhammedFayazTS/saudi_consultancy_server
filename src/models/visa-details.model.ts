import type { Document, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IVisaDetails extends Document {
  transactionId: Types.ObjectId;
  visaNumber: number;
  visaType: string;
  stampingDate: Date;
  paymentMode: string;
  profession: string;
  agency: string;
  remarks: string;
  isDeleted: boolean;
}

const VisaDetailsSchema = new Schema<IVisaDetails>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    visaNumber: { type: Number, required: true },
    visaType: { type: String, required: true, trim: true },
    stampingDate: { type: Date, required: true },
    paymentMode: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    agency: { type: String, required: true, trim: true },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const VisaDetails = mongoose.model<IVisaDetails>("VisaDetails", VisaDetailsSchema);
