import {Request, Response, NextFunction} from 'express'
import { AuxValid } from './helpers/auxValid.js'
import {ValidateSchema, Schema} from './helpers/ValidateSchema.js'


export class Validator {

  static validateFields = (schema:Schema) => ValidateSchema.validateBody(schema)
  static validateQuery = (schema:Schema)=> ValidateSchema.validateQuery(schema)
  static validateHeaders= (schema:Schema) => ValidateSchema.validateHeaders(schema)

  static validateRegex (validRegex:RegExp, nameOfField: string, message:string|null = null) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!validRegex || !nameOfField || nameOfField.trim() === '') {
        return next(AuxValid.middError('Missing parameters in function!', 400))
      }
      const field = req.body[nameOfField]
      const personalizedMessage = message ? ' ' + message : ''
      if (!field || typeof field !== 'string' || field.trim() === '') {
        return next(AuxValid.middError(`Missing ${nameOfField}`, 400))
      }
      if (!validRegex.test(field)) {
        return next(AuxValid.middError(`Invalid ${nameOfField} format!${personalizedMessage}`, 400))
      }
      next()
    }
  }

  static paramId (fieldName:string, validator:any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const id = req.params[fieldName]
      if (!id) {
        next(AuxValid.middError(`Missing ${fieldName}`, 400)); return
      }
      const isValid = typeof validator === 'function' ? validator(id) : validator.test(id)
      if (!isValid) {
        next(AuxValid.middError('Invalid parameters', 400)); return
      }
      next()
    }
  }

  static ValidReg = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Z]).{8,}$/,
    UUIDv4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    INT: /^\d+$/, // Solo enteros positivos
    OBJECT_ID: /^[0-9a-fA-F]{24}$/, // ObjectId de MongoDB
    FIREBASE_ID: /^[A-Za-z0-9_-]{20}$/, // Firebase push ID
  }
}
