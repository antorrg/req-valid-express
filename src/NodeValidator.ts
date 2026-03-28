import { AuxValid } from './helpers/auxValid.js'
import {ValidateSchema, Schema, QueryRule } from './helpers/ValidateSchema.js'
import { ErrorHandlers } from './helpers/ErrorHandlers.js'


export class NodeValidator {

  static validateBody = (data: any, schema: Schema, maxDepth:number=10) => {
      try {
        const validated = ValidateSchema.validateStructure(data, schema,undefined, maxDepth);
        return validated;
      } catch (err: any) {
        return ErrorHandlers.nodeError(err.message, 'VALIDATION_ERROR');
      }
  
  }
    static validateQuery = (data: any, schema: Schema, rules: QueryRule = {}, maxDepth:number = 5) => {
      try {
        const validated = ValidateSchema.validateStructure(data, schema, undefined, maxDepth)
            ValidateSchema.allowedValuesByRules(validated, rules);
  
        return validated;
      
      } catch (err: any) {
        return ErrorHandlers.nodeError(err.message, 'VALIDATION_ERROR');
      }
  }

  static validateRegex (data: any, validRegex:RegExp, nameOfField: string, message:string|null) {
      if (!validRegex || !nameOfField || nameOfField.trim() === '') {
        return ErrorHandlers.nodeError('Missing parameters in function!', 'REQUIRED_FIELD_MISSING')
      }
      const field = data[nameOfField]
      const personalizedMessage = message ? ' ' + message : ''
      if (!field || typeof field !== 'string' || field.trim() === '') {
        return ErrorHandlers.nodeError(`Missing ${nameOfField}`, 'REQUIRED_FIELD_MISSING')
      }
      if (!validRegex.test(field)) {
        return ErrorHandlers.nodeError(`Invalid ${nameOfField} format!${personalizedMessage}`, 'INVALID_FORMAT')
      }
      return data
  
  }

  static paramId (data:any, fieldName:string, validator:any) {
    
      const id = data[fieldName]
      if (!id) {
        return ErrorHandlers.nodeError(`Missing ${fieldName}`, 'REQUIRED_FIELD_MISSING')
      }
      const isValid = typeof validator === 'function' ? validator(id) : validator.test(id)
      if (!isValid) {
        return ErrorHandlers.nodeError('Invalid parameters', 'INVALID_INPUT')
      }
    return id
    
  }

  static ValidReg = AuxValid.ValidReg
  static splitObjectProps = (obj:any, propsToExtract:any[]) => AuxValid.splitObjectProps(obj, propsToExtract)
}
