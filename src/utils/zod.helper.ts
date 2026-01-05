import type { Response } from "express";
import type { ZodError } from "zod";

import { isValidObjectId } from "mongoose";
import z from "zod";

import { HTTPSTATUS } from "../constants/httpstatus.js";

export const objectIdSchema = z
    .string()
    .refine((val) => isValidObjectId(val), {
        message: "Invalid ObjectId",
    });

export function formatZodError(res: Response, error: ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: formattedErrors,
    });
};