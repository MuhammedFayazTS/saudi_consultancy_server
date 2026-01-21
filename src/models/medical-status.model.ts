import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IMedicalStatus extends Document {
  transactionId: ObjectId;
  center: string;
  status: string;
  slipDate?: Date;
  medicalDate: Date;
  statusUpdateDate: Date;
  revisitDate?: Date;
  remarks: string;
  isDeleted: boolean;
}

const MedicalStatusSchema = new Schema<IMedicalStatus>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    center: { type: String, required: true },
    status: { type: String, required: true },
    slipDate: { type: Date },
    medicalDate: { type: Date, required: true },
    statusUpdateDate: { type: Date, required: true },
    revisitDate: { type: Date },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const MedicalStatus = mongoose.model<IMedicalStatus>("MedicalStatus", MedicalStatusSchema);
