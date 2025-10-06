import { Router } from 'express';
import { createAd, getAllAds, getAdById, deleteAd } from '../controllers/ads.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../../utils/multerConfig';
import { validate } from '../middleware/validation.middleware';
import { createAdSchema } from '../validation/ads.validation';

const router = Router();

router.post('/', authenticate, upload.single('media'), validate(createAdSchema), createAd);
router.get('/', getAllAds);
router.get('/:id', getAdById);
router.delete('/:id', authenticate, deleteAd);

export default router;

