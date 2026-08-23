import {z} from 'zod';
export const SchoolSchema =z.object({
    name:z
    .string()
    .trim()
    .min(2,"School Name must be atleast 2 characters")
    .max(100,"School Name cannot be exceed 100 characters"),

    email:z
    .string()
    .trim()
    .email("Please enter a valid email address "),
    phone:z
    .string()
    .trim()
   .regex(
      /^[6-9]\d{9}$/,
      'Please enter a valid 10-digit phone number',
    ),

  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(250, 'Address cannot exceed 250 characters'),

  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(100, 'City name is too long'),

  state: z
    .string()
    .trim()
    .min(2, 'State is required')
    .max(100, 'State name is too long'),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Pincode must contain 6 digits'),

  board: z
    .string()
    .trim()
    .max(100, 'Board name is too long')
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .trim()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal('')),

})
export type SchoolFormValues = z.infer<typeof SchoolSchema>;