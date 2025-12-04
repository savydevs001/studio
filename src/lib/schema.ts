import { z } from 'zod';

const fileListSchema = typeof window === 'undefined'
  ? z.any()
  : z.custom<FileList>((val) => val instanceof FileList, 'Expected a FileList');

const requiredImageSchema = fileListSchema
  .refine((files) => files && files.length === 1, 'Image is required.')
  .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
  .refine(
    (files) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
    'Only .jpg, .jpeg, .png and .webp formats are supported.'
  );

const optionalImageSchema = fileListSchema
  .optional()
  .nullable()
  .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5 * 1024 * 1024, `Max file size is 5MB.`)
  .refine(
    (files) => !files || files.length === 0 || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
    'Only .jpg, .jpeg, .png and .webp formats are supported.'
  );

export const appraisalSchema = z.object({
  // Step 1: Vehicle Info
  vin: z.string().min(11, 'VIN must be 11-17 characters').max(17, 'VIN must be 11-17 characters'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900, 'Enter a valid year').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  odometer: z.coerce.number().min(1, 'Odometer reading is required'),
  trim: z.string().min(1, 'Trim is required'),

  // Step 2: Vehicle Details
  transmission: z.enum(['Automatic', 'Manual'], { required_error: 'This field is required' }),
  drivetrain: z.enum(['Front-Wheel Drive', 'Rear-Wheel Drive', 'All-Wheel Drive', '4-Wheel Drive'], { required_error: 'This field is required' }),

  // Step 3: Condition
  // History
  accidentHistory: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  accidentDetails: z.string().optional(),
  frameDamage: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  frameDamageDetails: z.string().optional(),
  floodDamage: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  floodDamageDetails: z.string().optional(),
  smokedIn: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  smokedInDetails: z.string().optional(),

  // Mechanical
  mechanicalIssues: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  mechanicalIssuesDetails: z.string().optional(),
  odometerBroken: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  odometerBrokenDetails: z.string().optional(),
  
  // Exterior
  paintBodyWork: z.enum(['no', '1', '2', '3+'], { required_error: 'This field is required' }),
  paintBodyWorkDetails: z.string().optional(),
  rustHailDamage: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  rustHailDamageDetails: z.string().optional(),

  // Interior
  interiorBroken: z.enum(['no', '1', '2', '3+'], { required_error: 'This field is required' }),
  interiorBrokenDetails: z.string().optional(),
  interiorRips: z.enum(['no', '1', '2', '3+'], { required_error: 'This field is required' }),
  interiorRipsDetails: z.string().optional(),

  // Other
  tiresNeedReplacement: z.enum(['no', '1-2', '3-4'], { required_error: 'This field is required' }),
  tiresNeedReplacementDetails: z.string().optional(),
  keys: z.enum(['1', '2+'], { required_error: 'This field is required' }),
  aftermarketModifications: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  aftermarketModificationsDetails: z.string().optional(),
  otherIssues: z.enum(['yes', 'no'], { required_error: 'This field is required' }),
  otherIssuesDetails: z.string().optional(),
  
  // Step 4: Photos (Required)
  photoOdometer: requiredImageSchema,
  photoVin: requiredImageSchema,
  photoFrontSeats: requiredImageSchema,
  photoInteriorRoof: requiredImageSchema,
  photoDriverFrontDoor: requiredImageSchema,
  photoDriverApron: requiredImageSchema,
  photoPassengerApron: requiredImageSchema,
  photoDriverFrontCorner: requiredImageSchema,
  photoRearSeatArea: requiredImageSchema,
  photoDashboard: requiredImageSchema,
  photoPassengerRearCorner: requiredImageSchema,
  photoTrunkArea: requiredImageSchema,
  photoPassengerQuarterPanel: requiredImageSchema,
  photoDriverQuarterPanel: requiredImageSchema,
  photoDriverRearWheel: requiredImageSchema,

  // Step 4: Photos (Optional Damages)
  photoDamage1: optionalImageSchema,
  photoDamage1Description: z.string().optional(),
  photoDamage2: optionalImageSchema,
  photoDamage2Description: z.string().optional(),
  photoDamage3: optionalImageSchema,
  photoDamage3Description: z.string().optional(),

  // Step 4: Photos (Optional Features)
  photoFeature1: optionalImageSchema,
  photoFeature1Description: z.string().optional(),
  photoFeature2: optionalImageSchema,
  photoFeature2Description: z.string().optional(),
  photoFeature3: optionalImageSchema,
  photoFeature3Description: z.string().optional(),

  // Step 5: Contact Info
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
}).superRefine((data, ctx) => {
    if (data.accidentHistory === 'yes' && !data.accidentDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['accidentDetails'] });
    }
    if (data.frameDamage === 'yes' && !data.frameDamageDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['frameDamageDetails'] });
    }
    if (data.floodDamage === 'yes' && !data.floodDamageDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['floodDamageDetails'] });
    }
    if (data.smokedIn === 'yes' && !data.smokedInDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['smokedInDetails'] });
    }
    if (data.mechanicalIssues === 'yes' && !data.mechanicalIssuesDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['mechanicalIssuesDetails'] });
    }
    if (data.odometerBroken === 'yes' && !data.odometerBrokenDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['odometerBrokenDetails'] });
    }
    if (data.paintBodyWork !== 'no' && !data.paintBodyWorkDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['paintBodyWorkDetails'] });
    }
    if (data.rustHailDamage === 'yes' && !data.rustHailDamageDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['rustHailDamageDetails'] });
    }
    if (data.interiorBroken !== 'no' && !data.interiorBrokenDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['interiorBrokenDetails'] });
    }
    if (data.interiorRips !== 'no' && !data.interiorRipsDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['interiorRipsDetails'] });
    }
    if (data.tiresNeedReplacement !== 'no' && !data.tiresNeedReplacementDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['tiresNeedReplacementDetails'] });
    }
    if (data.aftermarketModifications === 'yes' && !data.aftermarketModificationsDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['aftermarketModificationsDetails'] });
    }
    if (data.otherIssues === 'yes' && !data.otherIssuesDetails) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Details are required', path: ['otherIssuesDetails'] });
    }
    if (data.photoDamage1 && !data.photoDamage1Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoDamage1Description'] });
    }
    if (data.photoDamage2 && !data.photoDamage2Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoDamage2Description'] });
    }
    if (data.photoDamage3 && !data.photoDamage3Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoDamage3Description'] });
    }
    if (data.photoFeature1 && !data.photoFeature1Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoFeature1Description'] });
    }
    if (data.photoFeature2 && !data.photoFeature2Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoFeature2Description'] });
    }
    if (data.photoFeature3 && !data.photoFeature3Description) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Description is required', path: ['photoFeature3Description'] });
    }
});


export type AppraisalFormValues = z.infer<typeof appraisalSchema>;
