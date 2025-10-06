import { Request } from 'express';
import { UserType } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userType: UserType;
    }
  }
}

// This interface is still useful for explicitly typing requests that have gone through authentication middleware
export interface AuthenticatedRequest extends Request {
  userId: string;
  userType: UserType;
}

