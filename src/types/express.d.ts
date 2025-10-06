import { Request } from 'express';
import { UserType } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType?: UserType;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  userId: string;
  userType: UserType;
}

