import { z } from "zod";

import { objectIdSchema } from "../zod.helper.js";

export const visaDetailsZodSchema = z
  .object({
    transactionId: objectIdSchema,

    visaNumber: z.number().int().positive("Visa number must be a positive integer"),

    visaType: z
      .string()
      .trim()
      .min(1, "Visa type is required")
      .max(100, "Visa type cannot exceed 100 characters"),

    stampingDate: z.coerce.date(),

    paymentMode: z
      .string()
      .trim()
      .min(1, "Payment mode is required")
      .max(50, "Payment mode cannot exceed 50 characters"),

    profession: z
      .string()
      .trim()
      .min(1, "Profession is required")
      .max(100, "Profession cannot exceed 100 characters"),

    agency: z
      .string()
      .trim()
      .min(1, "Agency is required")
      .max(100, "Agency cannot exceed 100 characters"),

    wakalaAgency: z.string().trim().optional(),

    agencyCharge: z.number().optional(),

    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
