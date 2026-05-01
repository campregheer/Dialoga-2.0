import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues ?? (error as any).errors ?? [];
        res.status(400).json({
          error: 'Validation Error',
          details: issues.map((err: any) => ({
            path: Array.isArray(err.path) ? err.path.join('.') : String(err.path ?? ''),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
