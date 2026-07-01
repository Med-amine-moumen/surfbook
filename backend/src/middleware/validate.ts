import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      const validationErrors = error?.errors || error?.issues;
      if (validationErrors) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationErrors.map((e: any) => ({
            field: e.path ? e.path.join('.') : '',
            message: e.message
          }))
        });
      }
      return res.status(400).json({ message: 'Invalid request data' });
    }
  };
