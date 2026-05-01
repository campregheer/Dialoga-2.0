import { Router } from 'express';
import { createReport } from '../controllers/report.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { createReportSchema } from '../validators/report.validator';

const router = Router();

// Qualquer usuário logado pode denunciar (jovem ou profissional)
router.use(protect);

router.post('/', validate(createReportSchema), createReport);

export default router;
