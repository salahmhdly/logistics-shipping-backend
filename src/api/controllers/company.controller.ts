import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { AuthenticatedRequest } from '../../types/express';
import { UserType } from '@prisma/client';

export const getCompanyReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const reviews = await prisma.review.findMany({
      where: { companyId: id },
      include: { author: { select: { email: true, userType: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const addCompanyReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // companyId
    const userId = req.userId;
    const { rating, text } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.userType !== UserType.INDIVIDUAL) {
      return res.status(403).json({ message: 'Only individual users can add reviews' });
    }

    const companyProfile = await prisma.profileCompany.findUnique({ where: { id: id } });
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        text,
        authorId: userId,
        companyId: id,
      },
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    next(error);
  }
};

