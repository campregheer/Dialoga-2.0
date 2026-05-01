import { Router } from 'express';
import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getComments,
} from '../controllers/community.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { createPostSchema, createCommentSchema } from '../validators/community.validator';

const router = Router();

// Todas as rotas exigem autenticação; jovens e profissionais têm acesso
router.use(protect);
router.use(authorize('jovem', 'profissional', 'admin'));

router.get('/', getPosts);
router.post('/', validate(createPostSchema), createPost);

router.post('/:id/like', toggleLike);
router.get('/:id/comments', getComments);
router.post('/:id/comment', validate(createCommentSchema), addComment);

export default router;
