import { z } from "zod";

import { objectIdSchema } from "../zod.helper.js";

export const medicalStatusZodSchema = z
  .object({
    transactionId: objectIdSchema,
    status: z
      .string()
      .trim()
      .min(1, "Status mode is required")
      .max(50, "Status mode cannot exceed 50 characters"),
    center: z.string().trim(),
    subCenter: z.string().trim().optional(),
    slipDate: z.coerce.date().optional(),
    medicalDate: z.coerce.date(),
    statusUpdateDate: z.coerce.date(),
    revisitDate: z.coerce.date().optional(),
    mofaUpdateDate: z.coerce.date().optional(),
    paymentDate: z.coerce.date().optional(),
    paymentAmount: z.coerce.number().optional(),
    paymentMode: z.coerce.string().optional(),
    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
