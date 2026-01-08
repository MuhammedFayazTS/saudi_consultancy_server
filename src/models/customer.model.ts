import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  passportNumber: string;
  address: string;
  postOffice: string;
  state: string;
  district: string;
  contactNumber1: string;
  contactNumber2: string;
  isDeleted: boolean;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, unique: true, index: true },
    passportNumber: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true },
    postOffice: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    contactNumber1: { type: String, required: true },
    contactNumber2: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
