import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const medicalPaymentZodSchema = z
  .object({
    transactionId: objectIdSchema,

    amount: z.number().positive("Amount must be greater than 0"),

    paymentMode: z
      .string()
      .trim()
      .min(1, "Payment mode is required")
      .max(50, "Payment mode cannot exceed 50 characters"),

    date: z.coerce.date(),

    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
