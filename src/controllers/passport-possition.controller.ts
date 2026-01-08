import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { PassportPossition } from "../models/passport-possition.model.js";
import { PassportPossitionZodSchema } from "../utils/validators/passport-possition.schema.js";

export const createPassportPossition = asyncHandler(async (req: Request, res: Response) => {
  const inputParams = PassportPossitionZodSchema.parse(req.body);

  const { transactionId, ...rest } = inputParams;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  const passportPossition = await PassportPossition.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Passport Possition registered successfully", passportPossition });
});

export const updatePassportPossition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inputParams = PassportPossitionZodSchema.partial().parse(req.body);

  delete (inputParams as any).transactionId;

  const passportPossition = await PassportPossition.findByIdAndUpdate(
    id,
    { $set: inputParams },
    { new: true, runValidators: true }
  );

  if (!passportPossition) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possition not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possition updated successfully",
    passportPossition,
  });
});

export const listPassportPossitions = asyncHandler(async (req: Request, res: Response) => {
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

  const total = await PassportPossition.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  const passportPossitions = await PassportPossition.find(filter).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum).lean();

  res.status(HTTPSTATUS.OK).json({
    data: passportPossitions,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const deletePassportPossition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const passportPossition = await PassportPossition.findByIdAndDelete(id);

  if (!passportPossition) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Passport Possition not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Passport Possition deleted successfully",
  });
});
