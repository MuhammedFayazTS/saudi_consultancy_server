import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Ticket } from "../models/ticket.model";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { TicketZodSchema } from "../utils/validators/ticket.schema.js";

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const inputParams = TicketZodSchema.parse(req.body);
  const { transactionId, ...rest } = inputParams;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  const ticket = await Ticket.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res.status(HTTPSTATUS.CREATED).json({ message: "Ticket registered successfully", ticket });
});

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "_id",
    sortOrder = "desc",
    search,
    ...rest
  } = req.query as Record<string, any>;

  // pagination
  const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 10));

  // base query (soft delete safe)
  const query: any = {
    ...notDeleted,
  };

  // filters
  if (rest.travelType) query.travelType = rest.travelType;
  if (rest.airlineCompany) query.airlineCompany = rest.airlineCompany;
  if (rest.paymentMode) query.paymentMode = rest.paymentMode;

  // field projection
  const { fields } = req.query;
  let projection =
    "transactionId travelType bookingDate travellingDate airlineCompany paymentMode createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "travelType",
      "bookingDate",
      "travellingDate",
      "airlineCompany",
      "paymentMode",
      "createdAt",
      "updatedAt",
      "formattedCreatedAt",
      "formattedBookingDate",
      "formattedTravellingDate",
    ];

    const selected = String(fields)
      .split(",")
      .map((f) => f.trim())
      .filter((f) => allowedFields.includes(f));

    if (selected.length) projection = selected.join(" ");
  }

  // sorting
  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "desc" ? 1 : -1;

  // counts
  const total = await Ticket.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));
  // fetch
  const tickets = await Ticket.find(query)
    .populate({
      path: "transactionId",
      select: "customerId",
      populate: {
        path: "customerId",
        select: "name",
      },
    })
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection);

  const data = tickets.map((ticket) => ({
    ...ticket.toObject(),
    customerName: (ticket.transactionId as any)?.customerId?.name || "",
  }));

  res.status(HTTPSTATUS.OK).json({
    data,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getOneTicket = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: ticket,
  });
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findByIdAndUpdate(id, req.body, {
    new: true, // return updated document
    runValidators: true,
  });

  if (!ticket) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Ticket updated successfully",
    data: ticket,
  });
});

export const listForSelectTicket = asyncHandler(async (req: Request, res: Response) => {
  const tickets = await Ticket.find(notDeleted, { _id: 1, transactionId: 1 })
    .populate("transactionId", "name")
    .sort({ _id: 1 });

  const options = tickets.map((ticket) => ({
    label: (ticket.transactionId as any).name,
    value: ticket._id,
  }));

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: options,
  });
});

export const destroyTicket = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findByIdAndDelete(id, softDelete);

  if (!ticket) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Ticket not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Ticket deleted successfully",
  });
});
