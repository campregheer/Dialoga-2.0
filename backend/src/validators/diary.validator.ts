import { z } from 'zod';

export const createDiarySchema = z.object({
  body: z.object({
    content: z.string().min(1, 'O conteúdo do diário não pode estar vazio').max(5000, 'Texto muito longo'),
    emotion: z.string().optional(),
  }),
});
