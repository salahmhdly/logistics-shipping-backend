import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db';
import { UserType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const registerIndividual = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, fullName, avatarUrl } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        userType: UserType.INDIVIDUAL,
        profileIndividual: {
          create: {
            fullName,
            avatarUrl,
          },
        },
      },
      include: { profileIndividual: true },
    });

    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Individual user registered successfully', user, token });
  } catch (error) {
    next(error);
  }
};

export const registerCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password, contactFullName, companyName, truckCount, truckTypes, registrationNumber, description, avatarUrl, coverUrl, fleetImageUrls } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        userType: UserType.COMPANY,
        profileCompany: {
          create: {
            contactFullName,
            companyName,
            truckCount,
            truckTypes,
            registrationNumber,
            description,
            avatarUrl,
            coverUrl,
            fleetImageUrls: fleetImageUrls || [],
          },
        },
      },
      include: { profileCompany: true },
    });

    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Company user registered successfully', user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    next(error);
  }
};

