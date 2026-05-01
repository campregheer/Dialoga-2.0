import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'A postagem não pode estar vazia').max(1000, 'Texto muito longo (máx 1000 caracteres)'),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'O comentário não pode estar vazio').max(500, 'Texto muito longo (máx 500 caracteres)'),
  }),
});
