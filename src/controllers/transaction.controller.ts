import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Transaction } from "../models/transaction.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const exists = await Transaction.findOne({ name });
  if (exists) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Transaction already exists" });
    return;
  }

  const transaction = await Transaction.create(req.body);

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Transaction registered successfully", transaction });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "_id",
    sortOrder = "desc",
    search,
    ...rest
  } = req.query as Record<string, any>;

  const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 10));

  const query: any = {
    ...notDeleted,
  };

  if (rest.name) query.name = rest.name;

  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    query.$or = [{ name: regex }];
  }

  const { fields } = req.query;
  let projection = "name remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "name",
      "remarks",
      "createdAt",
      "updatedAt",
      "formattedCreatedAt",
    ];

    const selected = String(fields)
      .split(",")
      .map((f) => f.trim())
      .filter((f) => allowedFields.includes(f));

    if (selected.length) projection = selected.join(" ");
  }

  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const total = await Transaction.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));
  const transactions = await Transaction.find(query)
    .populate({
      path: "customerId",
      select: "name",
    })
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection);

  const data = transactions.map((transaction) => ({
    ...transaction.toObject(),
    customerName: transaction.customerId?.name || "",
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

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Transaction not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: transaction,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!transaction) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Transaction not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Transaction updated successfully",
    data: transaction,
  });
});

export const listForSelect = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.find(notDeleted, { _id: 1, name: 1 })
    .populate("customerId", "name passportNumber")
    .sort({ id: 1 });

  const options = transactions.map((transaction) => ({
    label: `${transaction.name} - ${transaction.customerId?.name} (${
      transaction.customerId?.passportNumber
    })`,
    value: transaction._id,
  }));

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: options,
  });
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const transaction = await Transaction.findByIdAndDelete(id, softDelete);

  if (!transaction) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Transaction not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Transaction deleted successfully",
  });
});
