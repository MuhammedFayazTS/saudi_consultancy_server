import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const vfsZodSchema = z
  .object({
    transactionId: objectIdSchema,
    center: z
      .string()
      .trim()
      .min(1, "Center is required")
      .max(100, "Center cannot exceed 100 characters"),
    date: z.coerce.date(),
    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
