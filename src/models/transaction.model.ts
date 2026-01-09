import type { Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

import { setVirtualDateFormats } from "./helper.js";

export interface ITransaction {
  name: string;
  customerId: Types.ObjectId;
  remarks?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TransactionSchema.virtual("formattedCreatedAt").get(function () {
  return setVirtualDateFormats(this.createdAt);
});

export const Transaction =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
