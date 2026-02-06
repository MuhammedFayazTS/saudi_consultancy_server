import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Customer } from "../models/customer.model.js";
import { TradeCertificate } from "../models/trade-certificate.model.js";
import { Transaction } from "../models/transaction.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { tradeCertificateZodSchema } from "../utils/validators/trade-certificate.js";

export const createTradeCertificate = asyncHandler(async (req: Request, res: Response) => {
  const payload = tradeCertificateZodSchema.parse(req.body);
  const { transactionId, ...rest } = payload;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  const tradeCertificate = await TradeCertificate.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Trade certificate created successfully", data: tradeCertificate });
});

export const listTradeCertificates = asyncHandler(async (req: Request, res: Response) => {
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

  const query: any = {
    ...notDeleted,
  };

  // filters
  if (rest.transactionId) query.transactionId = rest.transactionId;
  if (rest.center) query.center = rest.center;
  if (rest.issuedAgency) query.issuedAgency = rest.issuedAgency;
  if (rest.tcStatus) query.tcStatus = rest.tcStatus;

  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    // Search in customer names and transaction names
    const matchingCustomers = await Customer.find({
      $or: [{ name: regex }],
      ...notDeleted,
    }).select("_id");

    const customerIds = matchingCustomers.map((c) => c._id);

    const matchingTransactions = await Transaction.find({
      $or: [{ name: regex }, { customerId: { $in: customerIds } }],
      ...notDeleted,
    }).select("_id");

    const transactionIds = matchingTransactions.map((t) => t._id);

    query.$or = [
      { center: regex },
      { issuedAgency: regex },
      { tcStatus: regex },
      { paymentMethod: regex },
      { remarks: regex },
      { transactionId: { $in: transactionIds } },
    ];
  }

  // field projection
  const { fields } = req.query;
  let projection =
    "transactionId issuedAgency appointmentDate appointMentPayment paymentMethod center tcStatus remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "issuedAgency",
      "appointmentDate",
      "appointMentPayment",
      "paymentMethod",
      "center",
      "tcStatus",
      "remarks",
      "createdAt",
      "updatedAt",
    ];

    const selected = String(fields)
      .split(",")
      .map((f) => f.trim())
      .filter((f) => allowedFields.includes(f));

    if (selected.length) projection = selected.join(" ");
  }

  // sorting
  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  // counts
  const total = await TradeCertificate.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  // fetch
  const tradeCertificates = await TradeCertificate.find(query)
    .populate({
      path: "transactionId",
      select: "customerId name",
      populate: {
        path: "customerId",
        select: "name",
      },
    })
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection);

  const data = tradeCertificates.map((tc) => ({
    ...tc?.toObject(),
    customerName: (tc?.transactionId as any)?.customerId?.name || "",
    transactionName: (tc?.transactionId as any)?.name || "",
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

export const getOneTradeCertificate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const tradeCertificate = await TradeCertificate.findById(id).where(notDeleted);
  if (!tradeCertificate) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Trade certificate not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: tradeCertificate,
  });
});

export const updateTradeCertificate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = tradeCertificateZodSchema.partial().parse(req.body);

  const tradeCertificate = await TradeCertificate.findByIdAndUpdate(id, inputParams, {
    new: true,
    runValidators: true,
  })
    .populate("transactionId")
    .where(notDeleted);

  if (!tradeCertificate) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Trade certificate not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Trade certificate updated successfully",
    data: tradeCertificate,
  });
});

export const deleteTradeCertificate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const tradeCertificate = await TradeCertificate.findByIdAndUpdate(id, softDelete, {
    new: true,
  }).where(notDeleted);

  if (!tradeCertificate) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Trade certificate not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Trade certificate deleted successfully",
  });
});
