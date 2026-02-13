import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((e) => {
          const path = e.path.join(".");
          if (!errors[path]) errors[path] = [];
          errors[path].push(e.message);
        });
        res.status(400).json({
          message: "Validation failed",
          statusCode: 400,
          errors,
        });
        return;
      }
      next(error);
    }
  };
}
