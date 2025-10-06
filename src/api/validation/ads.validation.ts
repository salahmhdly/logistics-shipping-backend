import { z } from 'zod';
import { AdType } from '@prisma/client';

export const createAdSchema = z.object({
  body: z.object({
    adType: z.nativeEnum(AdType),
    fromLocation: z.string().min(1, 'From location is required'),
    toLocation: z.string().optional(),
    truckType: z.string().min(1, 'Truck type is required'),
    availableDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    description: z.string().optional(),
  }),
});

