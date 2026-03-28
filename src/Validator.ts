import {Request, Response, NextFunction} from 'express'
import { AuxValid } from './helpers/auxValid.js'
import {ValidateSchema, Schema, QueryRule } from './helpers/ValidateSchema.js'
import { ErrorHandlers } from './helpers/ErrorHandlers.js';


export class Validator {

    static validateBody(schema: Schema, maxDepth:number=10) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.validateStructure(req.body, schema,undefined, maxDepth);
        req.body = validated;
        next();
      } catch (err: any) {
        return next(ErrorHandlers.expressError(err.message, 400));
      }
    };
  }

  static validateQuery(schema: Schema, rules: QueryRule = {}, maxDepth:number = 5) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.validateStructure(req.query, schema, undefined, maxDepth);
   
            ValidateSchema.allowedValuesByRules(validated, rules);
        req.context = req.context || {};
        req.context.query = validated;
        next();
      } catch (err: any) {
        return next(ErrorHandlers.expressError(err.message, 400));
      }
    };
  }

  static validateHeaders(schema: Schema, maxDepth:number=3) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const headers = req.headers || {};
        const contentType = headers["content-type"];
        if (!contentType) throw new Error("Missing required header: content-type");

        const lowerContentType = contentType.toLowerCase();
        if (
          lowerContentType !== "application/json" &&
          !lowerContentType.startsWith("multipart/form-data")
        ) {
          throw new Error("Invalid Content-Type header");
        }

        const validated = schema
          ? ValidateSchema.validateStructure(headers, schema, "headers", maxDepth)
          : { "content-type": contentType };

        req.context = req.context || {};
        req.context.headers = validated;

        next();
      } catch (err: any) {
        return next(ErrorHandlers.expressError(err.message, 400));
      }
    };
  }

  static validateRegex (validRegex:RegExp, nameOfField: string, message:string|null) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!validRegex || !nameOfField || nameOfField.trim() === '') {
        return next(ErrorHandlers.expressError('Missing parameters in function!', 400))
      }
      const field = req.body[nameOfField]
      const personalizedMessage = message ? ' ' + message : ''
      if (!field || typeof field !== 'string' || field.trim() === '') {
        return next(ErrorHandlers.expressError(`Missing ${nameOfField}`, 400))
      }
      if (!validRegex.test(field)) {
        return next(ErrorHandlers.expressError(`Invalid ${nameOfField} format!${personalizedMessage}`, 400))
      }
      next()
    }
  }

  static paramId (fieldName:string, validator:any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const id = req.params[fieldName]
      if (!id) {
        next(ErrorHandlers.expressError(`Missing ${fieldName}`, 400)); return
      }
      const isValid = typeof validator === 'function' ? validator(id) : validator.test(id)
      if (!isValid) {
        next(ErrorHandlers.expressError('Invalid parameters', 400)); return
      }
      next()
    }
  }

  static ValidReg = AuxValid.ValidReg
}
