import { z } from "zod";

import { objectIdSchema } from "../zod.helper";

export const TicketZodSchema = z.object({
  transactionId: objectIdSchema,
  travelType: z.string().trim(),
  bookingDate: z.coerce.date(),
  travellingDate: z.coerce.date(),
  airlineCompany: z.string().trim(),
  paymentMode: z.string().trim(),
});
