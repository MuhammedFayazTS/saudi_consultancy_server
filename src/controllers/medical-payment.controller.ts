import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { MedicalPayment } from "../models/medical-payment.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { medicalPaymentZodSchema } from "../utils/validators/medical-payment.schema.js";

export const createMedicalPayment = asyncHandler(async (req: Request, res: Response) => {
  const payload = medicalPaymentZodSchema.parse(req.body);

  const medicalPayment = await MedicalPayment.create(payload);

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Medical payment created successfully", data: medicalPayment });
});

export const listMedicalPayments = asyncHandler(async (req: Request, res: Response) => {
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
  if (rest.paymentMode) query.paymentMode = rest.paymentMode;

  // search (amount, remarks)
  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    query.$or = [{ remarks: regex }, { paymentMode: regex }];
  }

  // field projection
  const { fields } = req.query;
  let projection = "transactionId amount paymentMode date remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "amount",
      "paymentMode",
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
  const total = await MedicalPayment.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  const include = {
    path: "transactionId",
    select: "customerId, name",
    populate: {
      path: "customerId",
      select: "name",
    },
  };

  // fetch
  const medicalPayments = await MedicalPayment.find(query)
    .populate(include)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection)
    .lean();

  console.log("medicalPayments list data", medicalPayments);

  res.status(HTTPSTATUS.OK).json({
    data: medicalPayments,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getOneMedicalPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const medicalPayment = await MedicalPayment.findById(id).where(notDeleted);
  if (!medicalPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Medical payment not found" });
    return;
  }
  console.log("medicalPayment12345", medicalPayment);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: medicalPayment,
  });
});

export const updateMedicalPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = medicalPaymentZodSchema.partial().parse(req.body);

  const medicalPayment = await MedicalPayment.findByIdAndUpdate(id, inputParams, {
    new: true,
    runValidators: true,
  })
    .populate("transactionId")
    .where(notDeleted);

  if (!medicalPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Medical payment not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Medical payment updated successfully",
    data: medicalPayment,
  });
});

export const deleteMedicalPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const medicalPayment = await MedicalPayment.findByIdAndUpdate(id, softDelete, {
    new: true,
  }).where(notDeleted);

  if (!medicalPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Medical payment not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Medical payment deleted successfully",
  });
});
