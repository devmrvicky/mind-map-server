export type ErrorResponse<T = any> = {
  success: false;
  message: string;
  errorType: string;
  statusCode?: number;
  details?: T;
};

export enum ErrorType {
  AUTH = "AUTH_ERROR",
  MISSING_FIELD = "MISSING_FIELD",
  VALIDATION = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
  BAD_REQUEST = "BAD_REQUEST",
  SERVER = "SERVER_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
  EXTERNAL = "EXTERNAL_SERVICE_ERROR",
}

export class GenericErrorHandler extends Error {
  make(
    message: string,
    errorType: ErrorType,
    statusCode?: number,
    details?: any
  ): ErrorResponse {
    return {
      success: false,
      message,
      errorType,
      statusCode,
      details,
    };
  }

  authError(message = "Authentication failed", details?: any) {
    return this.make(message, ErrorType.AUTH, 401, details);
  }

  missingField(fieldName: string, details?: any) {
    return this.make(
      `Missing required field${fieldName ? `: ${fieldName}` : ""}`,
      ErrorType.MISSING_FIELD,
      400,
      details
    );
  }

  validationError(message = "Validation failed", details?: any) {
    return this.make(message, ErrorType.VALIDATION, 422, details);
  }

  notFound(message = "Resource not found", details?: any) {
    return this.make(message, ErrorType.NOT_FOUND, 404, details);
  }

  forbidden(message = "Forbidden", details?: any) {
    return this.make(message, ErrorType.FORBIDDEN, 403, details);
  }

  badRequest(message = "Bad request", details?: any) {
    return this.make(message, ErrorType.BAD_REQUEST, 400, details);
  }

  serverError(message = "Internal server error", details?: any) {
    return this.make(message, ErrorType.SERVER, 500, details);
  }

  rateLimit(message = "Too many requests", details?: any) {
    return this.make(message, ErrorType.RATE_LIMIT, 429, details);
  }

  externalServiceError(message = "External service error", details?: any) {
    return this.make(message, ErrorType.EXTERNAL, 502, details);
  }

  fromException(err: unknown, fallbackMessage = "An error occurred") {
    const message =
      err instanceof Error ? err.message : String(err ?? fallbackMessage);
    const details =
      err instanceof Error && (err as any).stack
        ? { stack: (err as any).stack }
        : undefined;
    return this.make(message, ErrorType.SERVER, 500, details);
  }
}

export const errorHandler = new GenericErrorHandler();
