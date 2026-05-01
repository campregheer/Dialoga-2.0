import { Router } from 'express';
import { createEntry, getMyEntries } from '../controllers/diary.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { createDiarySchema } from '../validators/diary.validator';

const router = Router();

// Todas as rotas do diário exigem autenticação e que o usuário seja 'jovem'
router.use(protect);
router.use(authorize('jovem'));

router.post('/', validate(createDiarySchema), createEntry);
router.get('/', getMyEntries);

export default router;
