import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { AuthenticatedRequest } from '../../types/express';
import { AdType } from '@prisma/client';

export const createAd = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { adType, fromLocation, toLocation, truckType, availableDate, description } = req.body;
    const mediaFile = req.file;

    const mediaUrl = mediaFile ? `/uploads/${mediaFile.filename}` : undefined;

    const ad = await prisma.ad.create({
      data: {
        authorId: userId,
        adType: adType as AdType,
        fromLocation,
        toLocation,
        truckType,
        availableDate: new Date(availableDate),
        description,
        mediaUrl,
      },
    });

    res.status(201).json({ message: 'Ad created successfully', ad });
  } catch (error) {
    next(error);
  }
};

export const getAllAds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, from, to } = req.query;

    const ads = await prisma.ad.findMany({
      where: {
        ...(type && { adType: type as AdType }),
        ...(from && { fromLocation: { contains: from as string, mode: 'insensitive' } }),
        ...(to && { toLocation: { contains: to as string, mode: 'insensitive' } }),
      },
      include: { author: { select: { email: true, phone: true, userType: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ ads });
  } catch (error) {
    next(error);
  }
};

export const getAdById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { author: { select: { email: true, phone: true, userType: true } } },
    });

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json({ ad });
  } catch (error) {
    next(error);
  }
};

export const deleteAd = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const ad = await prisma.ad.findUnique({ where: { id } });

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.authorId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this ad' });
    }

    await prisma.ad.delete({ where: { id } });

    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    next(error);
  }
};

