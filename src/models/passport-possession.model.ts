import type { ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IPassportPossession extends Document {
  transactionId: ObjectId;
  agency: string;
  agencyDeliveryMethod: string;
  agencyDeliveryDate: Date;
  workAgreementStatus: string;
  workAgreementOnProcessingInRiyadhDate: Date;
  workAgreementRecievedInManjeriDate: Date;
  stampingStatus: string;
  stampingDate: Date;
  stampingRemarks: string;
  receivedInOfficeDate: Date;
  receivedInOfficeDeliveryMethod: string;
  receivedToClientDate: Date;
  receivedToClientDeliveryMethod: string;
  remarks: string;
  isDeleted: boolean;
}

const PassportPossessionSchema = new Schema<IPassportPossession>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    agency: {
      type: String,
      trim: true,
    },
    agencyDeliveryMethod: {
      type: String,
      trim: true,
    },
    agencyDeliveryDate: {
      type: Date,
    },
    workAgreementStatus: {
      type: String,
      trim: true,
    },
    workAgreementOnProcessingInRiyadhDate: {
      type: Date,
    },
    workAgreementRecievedInManjeriDate: {
      type: Date,
    },
    stampingStatus: {
      type: String,
      trim: true,
    },
    stampingDate: {
      type: Date,
    },
    stampingRemarks: {
      type: String,
      trim: true,
    },

    receivedInOfficeDate: {
      type: Date,
    },
    receivedInOfficeDeliveryMethod: {
      type: String,
      trim: true,
    },

    receivedToClientDate: {
      type: Date,
    },
    receivedToClientDeliveryMethod: {
      type: String,
      trim: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const PassportPossession = mongoose.model<IPassportPossession>(
  "PassportPossession",
  PassportPossessionSchema
);
