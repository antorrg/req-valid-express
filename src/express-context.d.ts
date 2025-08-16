import "express";

declare module "express-serve-static-core" {
  interface Request {
    context?: {
      query?: Record<string, any>;
      body?: Record<string, any>;
      headers?: Record<string, any>;
    };
  }
}
