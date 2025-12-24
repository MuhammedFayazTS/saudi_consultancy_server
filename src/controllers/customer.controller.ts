import type { Request, Response } from "express";
import { Customer } from "../models/customer.model";
import { HTTPSTATUS } from "../constants/httpstatus";
import asyncHandler from "express-async-handler";
import { notDeleted, softDelete } from "../utils/dbQueries";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const exists = await Customer.findOne({ name });
  if (exists) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "User already exists" });
    return;
  }

  const user = await Customer.create(req.body);

  res.status(HTTPSTATUS.CREATED).json({ message: "User registered successfully", user });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const customers = await Customer.find(notDeleted, {
    name: 1,
    passportNumber: 1,
    contactNumber1: 1,
    contactNumber2: 1,
    state: 1,
    district: 1,
    createdAt: 1,
  }).sort({ createdAt: -1 });

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: customers,
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
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

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndUpdate(id, req.body, {
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

export const listForSelect = asyncHandler(async (req: Request, res: Response) => {
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

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndDelete(id, softDelete);

  if (!customer) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Customer not found" });
    return;
  }

  res.status(HTTPSTATUS.OK).json({
    message: "Customer deleted successfully",
  });
});
