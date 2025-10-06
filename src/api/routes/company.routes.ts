import { Router } from 'express';
import { getCompanyReviews, addCompanyReview } from '../controllers/company.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { addReviewSchema } from '../validation/company.validation';

const router = Router();

router.get('/:id/reviews', getCompanyReviews);
router.post('/:id/reviews', authenticate, validate(addReviewSchema), addCompanyReview);

export default router;

