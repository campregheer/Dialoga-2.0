import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    role: z.enum(['jovem', 'profissional']).optional().default('jovem'),
    profile: z.string().min(2, 'O perfil/apelido deve ter pelo menos 2 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
  }),
});
