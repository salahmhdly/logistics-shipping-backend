import { z } from 'zod';

export const registerIndividualSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    fullName: z.string().min(3, 'Full name is required'),
    avatarUrl: z.string().url('Invalid URL format').optional(),
  }),
});

export const registerCompanySchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    contactFullName: z.string().min(3, 'Contact full name is required'),
    companyName: z.string().min(3, 'Company name is required'),
    truckCount: z.number().int().positive('Truck count must be a positive integer'),
    truckTypes: z.string().min(1, 'Truck types are required'),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    description: z.string().optional(),
    avatarUrl: z.string().url('Invalid URL format').optional(),
    coverUrl: z.string().url('Invalid URL format').optional(),
    fleetImageUrls: z.array(z.string().url('Invalid URL format')).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

