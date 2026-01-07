import type { Document, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface ITicket extends Document {
  transactionId: Types.ObjectId;
  travelType: string;
  bookingDate: Date;
  travellingDate: Date;
  airlineCompany: string;
  paymentMode: string;
  createdAt?: Date;
  isDeleted: boolean;
}

const TicketSchema = new Schema<ITicket>(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    travelType: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    travellingDate: { type: Date, required: true },
    airlineCompany: { type: String, required: true },
    paymentMode: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TicketSchema.virtual("formattedCreatedAt").get(function () {
  if (!this.createdAt) return null;
  const d = new Date(this.createdAt);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours || 12;
  const strTime = `${String(hours).padStart(2, "0")}.${minutes} ${ampm}`;
  return `${month}/${day}/${year} ${strTime}`;
});

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
