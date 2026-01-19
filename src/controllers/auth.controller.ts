import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, phone, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    username,
    email,
    phone,
    password,
    role,
  });

  res.status(HTTPSTATUS.CREATED).json({ message: "User registered successfully", user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;

  const query: any[] = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  if (query.length === 0) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Email or phone is required" });
    return;
  }

  const user = await User.findOne({ $or: query });
  if (!user || !(await user.matchPassword(password))) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Invalid credentials" });
    return;
  }
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  res.status(HTTPSTATUS.OK).json({ token });
});

export const loggedInUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({ user: req.user });
});
