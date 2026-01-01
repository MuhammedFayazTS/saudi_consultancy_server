import type { Document, Types } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface ITicket extends Document {
  transactionId: Types.ObjectId;
  travelType: string;
  bookingDate: Date;
  travellingDate: Date;
  airlineCompany: string;
  paymentMode: string;
  isDeleted: Boolean;
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
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
