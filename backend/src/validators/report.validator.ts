import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    type: z.string().min(2, 'O tipo de denúncia é obrigatório'),
    description: z.string().min(3, 'A descrição não pode estar vazia'),
    // Aceita boolean direto OU string "true"/"false" (segurança extra)
    isAnonymous: z
      .union([z.boolean(), z.literal('true').transform(() => true), z.literal('false').transform(() => false)])
      .optional()
      .default(true),
  }),
});
