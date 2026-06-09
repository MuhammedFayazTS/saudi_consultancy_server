import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const tradeCertificateZodSchema = z
  .object({
    transactionId: objectIdSchema,

    issuedAgency: z.string().trim().min(1),
    center: z.string().trim().min(1),
    tcStatus: z.string().trim().min(1),

    appointmentDate: z.coerce.date(),
    appointMentPayment: z.number().optional(),
    paymentMethod: z.string().optional(),

    // tcSettingAmount: z.number().optional(),
    // tcSettingAmountCenter: z.string().optional(),
    // tcSettingAgency: z.string().optional(),
    // tcSettingDate: z.coerce.date().optional(),

    tcAppointmentAmount: z.number().optional(),
    tcAppointmentAmountCenter: z.string().optional(),
    tcAppointmentAgency: z.string().optional(),
    tcAppointmentDate: z.coerce.date().optional(),

    remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
  })
  .strict();
