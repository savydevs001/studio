import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Use `any()` for server-side compatibility, and refine on the client.
const requiredImageSchema = z
  .any()
  .refine((files) => files?.length === 1, 'Image is required.')
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    'Only .jpg, .jpeg, .png and .webp formats are supported.'
  )
  .transform((files) => files as FileList);


export const appraisalSchema = z.object({
  // Step 1: Vehicle Info
  vin: z.string().min(11, 'VIN must be 11-17 characters').max(17, 'VIN must be 11-17 characters'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit year'),
  odometer: z.string().min(1, 'Odometer reading is required'),

  // Step 2: Photos
  photoOdometer: requiredImageSchema,
  photoVin: requiredImageSchema,
  photoFront: requiredImageSchema,
  photoBack: requiredImageSchema,
  photoDriverSide: requiredImageSchema,
  photoPassengerSide: requiredImageSchema,
  photoTires: requiredImageSchema,
  photoFrontSeats: requiredImageSchema,
  photoDashboard: requiredImageSchema,

  // Step 3: Condition
  hasWarningLights: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  keys: z.string().min(1, 'Number of keys is required'),
  acBlowsCold: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  hasDrivetrainIssues: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  hasSmokingOdor: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  hasPetOdor: z.enum(['yes', 'no'], { required_error: 'This field is required' }),

  // Step 4: Contact Info
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

export type AppraisalFormValues = z.infer<typeof appraisalSchema>;
