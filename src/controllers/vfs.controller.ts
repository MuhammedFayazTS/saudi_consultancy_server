import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Vfs } from "../models/vfs.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { vfsZodSchema } from "../utils/validators/vfs.js";

export const createVfs = asyncHandler(async (req: Request, res: Response) => {
  const payload = vfsZodSchema.parse(req.body);
  const { transactionId, ...rest } = payload;
  const parsedTransactionId = transactionId as unknown as ObjectId;

  const vfs = await Vfs.create({
    ...rest,
    transactionId: parsedTransactionId,
  });

  res.status(HTTPSTATUS.CREATED).json({ message: "VFS created successfully", data: vfs });
});

export const listVfss = asyncHandler(async (req: Request, res: Response) => {
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

  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    query.$or = [{ center: regex }, { remarks: regex }];
  }

  // field projection
  const { fields } = req.query;
  let projection = "transactionId center date remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "center",
      "date",
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
  const total = await Vfs.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  // fetch
  const vfss = await Vfs.find(query)
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

  const data = vfss.map((vfs) => ({
    ...vfs?.toObject(),
    customerName: (vfs?.transactionId as any)?.customerId?.name || "",
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

export const getOneVfs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vfs = await Vfs.findById(id).where(notDeleted);
  if (!vfs) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "VFS not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: vfs,
  });
});

export const updateVfs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = vfsZodSchema.partial().parse(req.body);

  const vfs = await Vfs.findByIdAndUpdate(id, inputParams, {
    new: true,
    runValidators: true,
  })
    .populate("transactionId")
    .where(notDeleted);

  if (!vfs) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "VFS not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "VFS updated successfully",
    data: vfs,
  });
});

export const deleteVfs = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const vfs = await Vfs.findByIdAndUpdate(id, softDelete, {
    new: true,
  }).where(notDeleted);

  if (!vfs) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "VFS not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "VFS deleted successfully",
  });
});
