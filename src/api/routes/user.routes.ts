import { Router } from 'express';
import { getMyProfile, updateMyProfile, getCompanyProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../../utils/multerConfig';
import { validate } from '../middleware/validation.middleware';
import { updateProfileSchema } from '../validation/user.validation';

const router = Router();

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }, { name: 'fleetImages', maxCount: 5 }]), validate(updateProfileSchema), updateMyProfile);
router.get('/companies/:id', getCompanyProfile);

export default router;

