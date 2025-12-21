import type { NextFunction, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { User } from "../models/user.model";
import { env } from "../utils/env.js";

interface JwtPayload {
  id: string;
  role: "admin" | "staff";
}

export const authGuard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // From Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // From cookies (optional)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Not authorized, token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "User not found" });
      return;
    }

    // attach user to request
    req.user = user;
    next();
  } catch (error: unknown) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Invalid or expired token", error });
  }
});
