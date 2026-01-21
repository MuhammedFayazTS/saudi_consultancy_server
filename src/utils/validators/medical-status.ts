import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const medicalStatusZodSchema = z
  .object({
    transactionId: objectIdSchema,
    status: z
      .string()
      .trim()
      .min(1, "Status mode is required")
      .max(50, "Status mode cannot exceed 50 characters"),
    center: z.string().trim(),
    slipDate: z.coerce.date().optional(),
    medicalDate: z.coerce.date(),
    statusUpdateDate: z.coerce.date(),
    revisitDate: z.coerce.date().optional(),
    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
