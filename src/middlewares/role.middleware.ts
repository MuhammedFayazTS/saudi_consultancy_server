import type { NextFunction, Request, Response } from "express";

import { HTTPSTATUS } from "../constants/httpstatus.js";

export function allowRoles(...roles: Array<"admin" | "staff">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Access denied" });
    }

    next();
  };
}
