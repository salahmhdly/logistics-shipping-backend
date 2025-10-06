import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes';
import userRoutes from './api/routes/user.routes';
import adsRoutes from './api/routes/ads.routes';
import companyRoutes from './api/routes/company.routes';
import notificationRoutes from './api/routes/notification.routes';
import { errorHandler } from './utils/errorHandler';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

export default app;

