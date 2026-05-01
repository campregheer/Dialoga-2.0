import { Router } from 'express';
import { getReports, getStats } from '../controllers/professional.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Apenas profissionais e admins podem acessar
router.use(protect);
router.use(authorize('profissional', 'admin'));

router.get('/reports', getReports);
router.get('/stats', getStats);

export default router;
