import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IVfs extends Document {
  transactionId: ObjectId;
  center: string;
  date: Date;
  remarks: string;
  isDeleted: boolean;
}

const VfsSchema = new Schema<IVfs>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    center: { type: String, required: true },
    date: { type: Date, required: true },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Vfs = mongoose.model<IVfs>("Vfs", VfsSchema);
