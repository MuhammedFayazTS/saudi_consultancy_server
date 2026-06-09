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

    paymentMode: z
      .string()
      .trim()
      .min(1, "Payment mode is required")
      .max(50, "Payment mode cannot exceed 50 characters"),

    accountHolder: z.string().trim().max(200, "Account holder cannot exceed 200 characters"),

    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
