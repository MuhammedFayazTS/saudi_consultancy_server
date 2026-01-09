import type { Document, ObjectId } from "mongoose";

import mongoose, { Schema } from "mongoose";

import { setVirtualDateFormats } from "./helper.js";

export interface ITicket extends Document {
  transactionId: ObjectId;
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
  return setVirtualDateFormats(this.createdAt);
});

TicketSchema.virtual("formattedBookingDate").get(function () {
  return setVirtualDateFormats(this.bookingDate);
});

TicketSchema.virtual("formattedTravellingDate").get(function () {
  return setVirtualDateFormats(this.travellingDate);
});

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
