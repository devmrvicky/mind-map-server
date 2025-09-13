import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, z } from "zod";
import { errorHandler } from "../handlers/handleErrorResponse";
import { logger } from "../config/logger.config";

export const validateSchema =
  <T extends ZodSchema<any>>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const toValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
        user: (req as any).user,
        headers: req.headers,
      };

      const parsed = await schema.parseAsync(toValidate);

      // ✅ assign validated data with proper type
      req.validated = parsed;

      next();
    } catch (err) {
      logger.error("Validation error:", err);
      if (err instanceof ZodError) {
        const details = err.flatten();
        res.status(400).json(
          errorHandler.validationError("Request validation failed", {
            fieldErrors: details.fieldErrors,
            formErrors: details.formErrors,
          })
        );
        return;
      }

      res.status(400).json(errorHandler.badRequest("Invalid request payload"));
    }
  };
