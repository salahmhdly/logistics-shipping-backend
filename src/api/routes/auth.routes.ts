import { Router } from 'express';
import { registerIndividual, registerCompany, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerIndividualSchema, registerCompanySchema, loginSchema } from '../validation/auth.validation';

const router = Router();

router.post('/register/individual', validate(registerIndividualSchema), registerIndividual);
router.post('/register/company', validate(registerCompanySchema), registerCompany);
router.post('/login', validate(loginSchema), login);

export default router;

