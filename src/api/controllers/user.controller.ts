import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { AuthenticatedRequest } from '../../types/express';
import { UserType } from '@prisma/client';

export const getMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profileIndividual: true,
        profileCompany: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    const { fullName, avatarUrl, contactFullName, companyName, truckCount, truckTypes, registrationNumber, description, coverUrl, fleetImageUrls } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarFile = files?.avatar?.[0];
    const coverFile = files?.cover?.[0];
    const fleetImageFiles = files?.fleetImages;

    let updatedAvatarUrl = avatarUrl;
    if (avatarFile) {
      updatedAvatarUrl = `/uploads/${avatarFile.filename}`;
    }

    let updatedCoverUrl = coverUrl;
    if (coverFile) {
      updatedCoverUrl = `/uploads/${coverFile.filename}`;
    }

    let updatedFleetImageUrls = fleetImageUrls || [];
    if (fleetImageFiles && fleetImageFiles.length > 0) {
      const newFleetImageUrls = fleetImageFiles.map(file => `/uploads/${file.filename}`);
      updatedFleetImageUrls = [...updatedFleetImageUrls, ...newFleetImageUrls];
    }

    if (userType === UserType.INDIVIDUAL) {
      await prisma.profileIndividual.update({
        where: { userId: userId },
        data: {
          fullName,
          avatarUrl: updatedAvatarUrl,
        },
      });
    } else if (userType === UserType.COMPANY) {
      await prisma.profileCompany.update({
        where: { userId: userId },
        data: {
          contactFullName,
          companyName,
          truckCount: parseInt(truckCount),
          truckTypes,
          registrationNumber,
          description,
          avatarUrl: updatedAvatarUrl,
          coverUrl: updatedCoverUrl,
          fleetImageUrls: updatedFleetImageUrls,
        },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profileIndividual: true,
        profileCompany: true,
      },
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const company = await prisma.profileCompany.findUnique({
      where: { id: id },
      include: {
        user: { select: { email: true, phone: true } },
        reviewsReceived: true,
      },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};

