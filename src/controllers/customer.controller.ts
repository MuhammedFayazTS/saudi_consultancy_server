import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { Customer } from "../models/customer.model";
import { notDeleted, } from "../utils/db-queries.js";
import { customerZodSchema } from "../utils/validators/customer.schema.js";

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const payload = customerZodSchema.parse(req.body);
  const { name } = payload;

  const exists = await Customer.findOne({ name });
  if (exists) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Customer already exists" });
    return;
  }

  const customer = await Customer.create(req.body);

  res.status(HTTPSTATUS.CREATED).json({ message: "Customer registered successfully", customer });
});

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
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
  if (rest.state) 
    query.state = rest.state;
  if (rest.district) 
    query.district = rest.district;

  // search (name, passport, contact)
  if (search) {
    const s = String(search).trim();
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(esc, "i");

    query.$or = [
      { name: regex },
      { passportNumber: regex },
      { contactNumber1: regex },
      { contactNumber2: regex },
    ];
  }

  // field projection
  const { fields } = req.query;
  let projection = "name passportNumber contactNumber1 contactNumber2 state district createdAt";

  if (fields) {
    const allowedFields = [
      "_id",
      "name",
      "passportNumber",
      "contactNumber1",
      "contactNumber2",
      "state",
      "district",
      "createdAt",
      "updatedAt",
    ];

    const selected = String(fields)
      .split(",")
      .map((f) => f.trim())
      .filter((f) => allowedFields.includes(f));

    if (selected.length) 
      projection = selected.join(" ");
  }

  // sorting
  const sort: Record<string, 1 | -1> = {};
  sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

  // counts
  const total = await Customer.countDocuments(query);
  const pages = Math.max(1, Math.ceil(total / limitNum));

  // fetch
  const customers = await Customer.find(query)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select(projection)
    .lean();

  res.status(HTTPSTATUS.OK).json({
    data: customers,
    meta: {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
    },
  });
});

export const getOneCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);
  if (!customer) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Customer not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: customer,
  });
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inputParams = customerZodSchema.partial().parse(req.body);

  const customer = await Customer.findByIdAndUpdate(id, inputParams, {
    new: true, // return updated document
    runValidators: true,
  });

  if (!customer) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Customer not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Customer updated successfully",
    data: customer,
  });
});

export const listForSelectCustomers = asyncHandler(async (req: Request, res: Response) => {
  const customers = await Customer.find(notDeleted, { _id: 1, name: 1 }).sort({ id: 1 });

  const options = customers.map((customer) => ({
    label: customer.name,
    value: customer._id,
  }));

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: options,
  });
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!customer) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Customer not found" });
    return
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Customer deleted successfully",
  });
});
