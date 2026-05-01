import { z } from 'zod';

const emailSchema = z.string().email('E-mail inválido');

const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  }),
  params: z.object({
    token: z.string(),
  }),
});

export { forgotPasswordSchema, resetPasswordSchema };
