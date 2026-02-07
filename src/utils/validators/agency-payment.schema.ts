import { z } from "zod";

import { objectIdSchema } from "../zod.helper.js";

export const agencyPaymentZodSchema = z
  .object({
    transactionId: objectIdSchema,

    date: z.coerce.date(),

    amount: z.number().positive("Amount must be greater than 0"),

    agency: z
      .string()
      .trim()
      .min(1, "Agency is required")
      .max(100, "Agency cannot exceed 100 characters"),

    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
