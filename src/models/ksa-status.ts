import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IKsaStatus extends Document {
  transactionId: ObjectId;
  saudiArrivedDate: Date;
  iqamaIssuedDate: Date;
  iqamaValidity: string;
  visaTransferStatus: string;
  customerPayment: number;
  customerPaymentDate: Date;
  remarks: string;
  isDeleted: boolean;
}

const KsaStatusSchema = new Schema<IKsaStatus>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    saudiArrivedDate: { type: Date },
    iqamaIssuedDate: { type: Date },
    iqamaValidity: { type: String },
    visaTransferStatus: { type: String, required: true },
    customerPayment: { type: Number, required: true },
    customerPaymentDate: { type: Date, required: true },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const KsaStatus = mongoose.model<IKsaStatus>("KsaStatus", KsaStatusSchema);
