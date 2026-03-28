

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  FIELD_TOO_LONG: 'FIELD_TOO_LONG',
  FIELD_TOO_SHORT: 'FIELD_TOO_SHORT',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_TYPE: 'INVALID_TYPE',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  VALUE_NOT_ALLOWED: 'VALUE_NOT_ALLOWED',
  ERR_INTERNAL: 'ERR_INTERNAL',
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;

export class ErrorHandlers {
  static expressError(message: string, status?: number): Error & { status: number } {
    const error = new Error(message) as Error & { status: number };
    error.status = status || 500;
    return error;
  }

  static nodeError(message: string, code?: ErrorCodeType): Error & { code: string } {
    const error = new Error(message) as Error & { code: string };
    error.code = ErrorCode[code ?? 'ERR_INTERNAL'];
    return error;
  }
}