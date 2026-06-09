import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface ITradeCertificate extends Document {
  transactionId: ObjectId;
  issuedAgency: string;
  appointmentDate: Date;
  appointMentPayment: number;
  paymentMethod: string;
  center: string;
  tcStatus: string;

  // tcSettingAmount: number;
  // tcSettingAmountCenter: string;
  // tcSettingAgency: string;
  // tcSettingDate: Date;

  tcAppointmentAmount: number;
  tcAppointmentAmountCenter: string;
  tcAppointmentAgency: string;
  tcAppointmentDate: Date;

  remarks: string;
  isDeleted: boolean;
}

const TradeCertificateSchema = new Schema<ITradeCertificate>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    issuedAgency: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointMentPayment: { type: Number },
    paymentMethod: { type: String },
    center: { type: String, required: true },
    tcStatus: { type: String, required: true },

    // tcSettingAmount: { type: Number },
    // tcSettingAmountCenter: { type: String },
    // tcSettingAgency: { type: String },
    // tcSettingDate: { type: Date },

    tcAppointmentAmount: { type: Number },
    tcAppointmentAmountCenter: { type: String },
    tcAppointmentAgency: { type: String },
    tcAppointmentDate: { type: Date },

    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const TradeCertificate = mongoose.model<ITradeCertificate>(
  "TradeCertificate",
  TradeCertificateSchema
);
