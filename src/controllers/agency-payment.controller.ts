import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { AgencyPayment } from "../models/agency-payment.model.js";
import { Customer } from "../models/customer.model.js";
import { Transaction } from "../models/transaction.model.js";
import { notDeleted, softDelete } from "../utils/db-queries.js";
import { agencyPaymentZodSchema } from "../utils/validators/agency-payment.schema.js";

export const createAgencyPayment = asyncHandler(async (req: Request, res: Response) => {
  const payload = agencyPaymentZodSchema.parse(req.body);

  const agencyPayment = await AgencyPayment.create(payload);

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Agency payment created successfully", data: agencyPayment });
});

export const listAgencyPayment = asyncHandler(async (req: Request, res: Response) => {
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
  if (rest.agency) query.agency = rest.agency;

  // search (agency, remarks, customer name)
  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    const matchingCustomerIds = await Customer.find({
      name: regex,
      ...notDeleted,
    }).distinct("_id");

    const matchingTransactionIds = await Transaction.find({
      customerId: { $in: matchingCustomerIds },
      ...notDeleted,
    }).distinct("_id");

    query.$or = [
      { agency: regex },
      { remarks: regex },
      { transactionId: { $in: matchingTransactionIds } },
    ];
  }

  // field projection
  const { fields } = req.query;
  let projection = "transactionId date agency amount paymentMode remarks createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "transactionId",
      "date",
      "agency",
      "amount",
      "paymentMode",
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
  const total = await AgencyPayment.countDocuments(query);
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
  const agencyPaymentList = await AgencyPayment.find(query)
    .populate(include)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection)
    .lean();

  res.status(HTTPSTATUS.OK).json({
    data: agencyPaymentList,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getOneAgencyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agencyPayment = await AgencyPayment.findById(id).where(notDeleted);
  if (!agencyPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Agency payment not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: agencyPayment,
  });
});

export const updateAgencyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = agencyPaymentZodSchema.partial().parse(req.body);

  const agencyPayment = await AgencyPayment.findByIdAndUpdate(id, inputParams, {
    new: true,
    runValidators: true,
  }).where(notDeleted);

  if (!agencyPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Agency payment not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Agency payment updated successfully",
    data: agencyPayment,
  });
});

export const deleteAgencyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const agencyPayment = await AgencyPayment.findByIdAndUpdate(id, softDelete, {
    new: true,
  }).where(notDeleted);

  if (!agencyPayment) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Agency payment not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Agency payment deleted successfully",
  });
});
