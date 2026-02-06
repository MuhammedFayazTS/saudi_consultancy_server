import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Customer } from "../models/customer.model.js";
import { PassportPossession } from "../models/passport-possession.model.js";
import { Transaction } from "../models/transaction.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { PassportPossessionZodSchema } from "../utils/validators/passport-possession.schema.js";

export const createPassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const inputParams = PassportPossessionZodSchema.parse(req.body);

  const { transactionId, ...rest } = inputParams;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  // Check if already another passport possession for existing transaction exist
  const existingPossession = await PassportPossession.findOne({
    transactionId: parsedTransactionId,
    ...notDeleted,
  });

  if (existingPossession) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "transaction already has an active Passport Possession record.",
    });
    return;
  }

  const passportPossession = await PassportPossession.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Passport Possession registered successfully", passportPossession });
});

export const updatePassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = PassportPossessionZodSchema.partial().parse(req.body);

  // delete (inputParams as any).transactionId;

  const passportPossession = await PassportPossession.findByIdAndUpdate(
    id,
    { $set: inputParams },
    { new: true, runValidators: true }
  );

  if (!passportPossession) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possession not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possession updated successfully",
    passportPossession,
  });
});

export const listPassportPossessions = asyncHandler(async (req: Request, res: Response) => {
  const { transactionId, search, sortBy, sortOrder, page, limit } = req.query;

  const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 10));

  const filter: Record<string, any> = {
    ...notDeleted,
  };

  if (transactionId) {
    filter.transactionId = transactionId;
  }

  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    const matchingCustomers = await Customer.find({
      $or: [
        { name: regex },
        { passportNumber: regex },
        { contactNumber1: regex },
        { contactNumber2: regex },
      ],
      ...notDeleted,
    }).select("_id");

    const customerIds = matchingCustomers.map((c) => c._id);

    const matchingTransactions = await Transaction.find({
      $or: [{ name: regex }, { customerId: { $in: customerIds } }],
      ...notDeleted,
    }).select("_id");

    const transactionIds = matchingTransactions.map((c) => c._id);

    filter.$or = [{ agency: regex }, { transactionId: { $in: transactionIds } }];
  }

  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const total = await PassportPossession.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  const passportPossessions = await PassportPossession.find(filter)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate({
      path: "transactionId",
      select: "customerId name",
      populate: {
        path: "customerId",
        select: "name",
      },
    });

  const dataWithTransaction = passportPossessions.map((item: any) => {
    const transaction = item.transactionId;
    if (transaction && transaction.customerId) {
      transaction.customer = transaction.customerId;
    }
    return {
      ...item,
      transaction,
      transactionId: transaction?._id,
      customerName: transaction?.customerId?.name || "",
      transactionName: transaction?.name || "",
    };
  });

  res.status(HTTPSTATUS.OK).json({
    data: dataWithTransaction,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getPassportPossessionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const passportPossession = await PassportPossession.findById(id)
    .populate({
      path: "transactionId",
      populate: {
        path: "customerId",
      },
    })
    .lean();

  if (!passportPossession) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possession not found" });
    return;
  }

  const transaction = (passportPossession as any).transactionId;
  if (transaction && transaction.customerId) {
    transaction.customer = transaction.customerId;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possession fetched successfully",
    data: {
      ...passportPossession,
      transaction,
      transactionId: transaction?._id,
    },
  });
});

export const deletePassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const passportPossession = await PassportPossession.findByIdAndDelete(id, softDelete);

  if (!passportPossession) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possession not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possession deleted successfully",
  });
});
