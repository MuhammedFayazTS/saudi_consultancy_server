import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { PassportPossession } from "../models/passport-possession.model.js";
import { PassportPossessionZodSchema } from "../utils/validators/passport-possession.schema.js";

export const createPassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const inputParams = PassportPossessionZodSchema.parse(req.body);

  const { transactionId, ...rest } = inputParams;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  const passportPossession = await PassportPossession.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Passport Possition registered successfully", passportPossession });
});

export const updatePassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inputParams = PassportPossessionZodSchema.partial().parse(req.body);

  delete (inputParams as any).transactionId;

  const passportPossession = await PassportPossession.findByIdAndUpdate(
    id,
    { $set: inputParams },
    { new: true, runValidators: true }
  );

  if (!passportPossession) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possition not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possition updated successfully",
    passportPossession,
  });
});

export const listPassportPossessions = asyncHandler(async (req: Request, res: Response) => {
  const { transactionId, search, sortBy, sortOrder, page, limit } = req.query;

  const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 10));

  const filter: Record<string, any> = {};

  if (transactionId) {
    filter.transactionId = transactionId;
  }

  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");
    filter.$or = [{ agency: regex }];
  }

  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const total = await PassportPossession.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  const passportPossessions = await PassportPossession.find(filter).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum).lean();

  res.status(HTTPSTATUS.OK).json({
    data: passportPossessions,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const deletePassportPossession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const passportPossession = await PassportPossession.findByIdAndDelete(id);

  if (!passportPossession) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possition not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possition deleted successfully",
  });
});
