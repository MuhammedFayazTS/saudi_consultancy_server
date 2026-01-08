import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const PassportPossessionZodSchema = z.object({
  transactionId: objectIdSchema,

  agency: z.string().trim().optional(),
  agencyDeliveryMethod: z.string().trim().optional(),
  agencyDeliveryDate: z.coerce.date().optional(),

  workAgreementStatus: z.string().trim().optional(),
  workAgreementDate: z.coerce.date().optional(),

  stampingStatus: z.string().trim().optional(),
  stampingDate: z.coerce.date().optional(),
  stampingRemarks: z.string().trim().optional(),

  receivedInOfficeDate: z.coerce.date().optional(),
  receivedInOfficeDeliveryMethod: z.string().trim().optional(),

  receivedToClientDate: z.coerce.date().optional(),
  receivedToClientDeliveryMethod: z.string().trim().optional(),

  remarks: z.string().trim().optional(),
});
