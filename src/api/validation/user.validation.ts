import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, 'Full name is required').optional(),
    avatarUrl: z.string().url('Invalid URL format').optional(),
    contactFullName: z.string().min(3, 'Contact full name is required').optional(),
    companyName: z.string().min(3, 'Company name is required').optional(),
    truckCount: z.string().regex(/^\d+$/, 'Truck count must be a number').transform(Number).optional(),
    truckTypes: z.string().min(1, 'Truck types are required').optional(),
    registrationNumber: z.string().min(1, 'Registration number is required').optional(),
    description: z.string().optional(),
    coverUrl: z.string().url('Invalid URL format').optional(),
    fleetImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
  }),
});

