import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IMedicalStatus extends Document {
  transactionId: ObjectId;
  center: string;
  subCenter?: string;
  status: string;
  slipDate?: Date;
  medicalDate: Date;
  statusUpdateDate: Date;
  revisitDate?: Date;
  paymentDate?: Date;
  mofaUpdateDate?: Date;
  paymentAmount?: number;
  paymentMode?: string;
  remarks: string;
  isDeleted: boolean;
}

const MedicalStatusSchema = new Schema<IMedicalStatus>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    center: { type: String, required: true },
    subCenter: { type: String },
    status: { type: String, required: true },
    slipDate: { type: Date },
    medicalDate: { type: Date, required: true },
    statusUpdateDate: { type: Date, required: true },
    revisitDate: { type: Date },
    paymentDate: { type: Date },
    mofaUpdateDate: { type: Date },
    paymentAmount: { type: Number, min: 0 },
    paymentMode: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const MedicalStatus = mongoose.model<IMedicalStatus>("MedicalStatus", MedicalStatusSchema);
