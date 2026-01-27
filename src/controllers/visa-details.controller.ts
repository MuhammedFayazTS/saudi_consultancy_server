import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { VisaDetails } from "../models/visa-details.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { visaDetailsZodSchema } from "../utils/validators/visa-details.schema.js";

export const createVisaDetails = asyncHandler(async (req: Request, res: Response) => {
  const payload = visaDetailsZodSchema.parse(req.body);

  const visaDetails = await VisaDetails.create(payload);

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Visa details created successfully", data: visaDetails });
});

export const listVisaDetails = asyncHandler(async (req: Request, res: Response) => {
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
  if (rest.transactionId) query.transactionId = Number(rest.transactionId);
  if (rest.visaType) query.visaType = rest.visaType;
  if (rest.paymentMode) query.paymentMode = rest.paymentMode;
  if (rest.profession) query.profession = rest.profession;
  if (rest.agency) query.agency = rest.agency;

  // search (visaNumber, visaType, profession, agency, remarks)
  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    query.$or = [
      { visaType: regex },
      { profession: regex },
      { agency: regex },
      { paymentMode: regex },
      { remarks: regex },
    ];
  }

  // field projection
  const { fields } = req.query;
  let projection =
    "transactionId visaNumber visaType stampingDate paymentMode profession agency remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "visaNumber",
      "visaType",
      "stampingDate",
      "paymentMode",
      "profession",
      "agency",
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
  const total = await VisaDetails.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  // fetch
  const visaDetailsList = await VisaDetails.find(query)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection)
    .lean();

  res.status(HTTPSTATUS.OK).json({
    data: visaDetailsList,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getOneVisaDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const visaDetails = await VisaDetails.findById(id).where(notDeleted);
  if (!visaDetails) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Visa details not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: visaDetails,
  });
});

export const updateVisaDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = visaDetailsZodSchema.partial().parse(req.body);

  const visaDetails = await VisaDetails.findByIdAndUpdate(id, inputParams, {
    new: true,
    runValidators: true,
  }).where(notDeleted);

  if (!visaDetails) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Visa details not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Visa details updated successfully",
    data: visaDetails,
  });
});

export const deleteVisaDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const visaDetails = await VisaDetails.findByIdAndUpdate(id, softDelete, {
    new: true,
  }).where(notDeleted);

  if (!visaDetails) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Visa details not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Visa details deleted successfully",
  });
});
