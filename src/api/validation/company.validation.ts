import { z } from 'zod';

export const addReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    text: z.string().optional(),
  }),
});

