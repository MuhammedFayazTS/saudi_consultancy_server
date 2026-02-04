import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const ksaStatusZodSchema = z
  .object({
    transactionId: objectIdSchema,
    saudiArrivedDate: z.coerce.date().optional(),
    iqamaIssuedDate: z.coerce.date().optional(),
    iqamaValidity: z.string().optional(),
    visaTransferStatus: z.string().trim(),
    customerPayment: z.number(),
    customerPaymentDate: z.coerce.date(),
    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
