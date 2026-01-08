import { z } from "zod";

export const customerZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),

    passportNumber: z
      .string()
      .trim()
      .min(6, 'Passport number must be at least 6 characters')
      .max(20, 'Passport number cannot exceed 20 characters'),

    address: z
      .string()
      .trim()
      .min(10, 'Address must be at least 10 characters')
      .max(300, 'Address cannot exceed 300 characters'),

    postOffice: z
      .string()
      .trim()
      .min(2, 'Post office must be at least 2 characters')
      .max(100),

    state: z
      .string()
      .trim()
      .min(2, 'State is required')
      .max(100),

    district: z
      .string()
      .trim()
      .min(2, 'District is required')
      .max(100),

    contactNumber1: z
      .string()
      .regex(/^\d{10}$/, 'Contact number must be exactly 10 digits'),

    contactNumber2: z
      .string()
      .regex(/^\d{10}$/, 'Contact number must be exactly 10 digits')
      .optional()
      .nullable(),
  })
  .strict();
