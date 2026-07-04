import { AuxValid } from './core/auxValid.js'
import {ValidationEngine, Schema, QueryRule } from './core/ValidationEngine.js'
import { ErrorHandlers } from './core/ErrorHandlers.js'


export class NodeValidator {

  static validateBody = (data: any, schema: Schema, maxDepth:number=10) => {
      try {
        const validated = ValidationEngine.validateStructure(data, schema,undefined, maxDepth);
        return validated;
      } catch (err: any) {
        throw ErrorHandlers.nodeError(err.message, 'VALIDATION_ERROR');
      }
  
  }
    static validateQuery = (data: any, schema: Schema, rules: QueryRule = {}, maxDepth:number = 5) => {
      try {
        const validated = ValidationEngine.validateStructure(data, schema, undefined, maxDepth)
            ValidationEngine.allowedValuesByRules(validated, rules);
  
        return validated;
      
      } catch (err: any) {
        throw ErrorHandlers.nodeError(err.message, 'VALIDATION_ERROR');
      }
  }

  static validateRegex (data: any, validRegex:RegExp, nameOfField: string, message:string|null) {
      if (!data || typeof data !== 'object') {
        throw ErrorHandlers.nodeError('Data must be a valid object', 'INVALID_INPUT')
      }
      if (!validRegex || !nameOfField || nameOfField.trim() === '') {
        throw ErrorHandlers.nodeError('Missing parameters in function!', 'REQUIRED_FIELD_MISSING')
      }
      const field = data[nameOfField]
      const personalizedMessage = message ? ' ' + message : ''
      if (!field || typeof field !== 'string' || field.trim() === '') {
        throw ErrorHandlers.nodeError(`Missing ${nameOfField}`, 'REQUIRED_FIELD_MISSING')
      }
      if (!validRegex.test(field)) {
        throw ErrorHandlers.nodeError(`Invalid ${nameOfField} format!${personalizedMessage}`, 'INVALID_FORMAT')
      }
      return data
  
  }

  static paramId (data:any, fieldName:string, validator:any) {
      if (!data || typeof data !== 'object') {
        throw ErrorHandlers.nodeError('Data must be a valid object', 'INVALID_INPUT')
      }
      const id = data[fieldName]
      if (!id) {
        throw ErrorHandlers.nodeError(`Missing ${fieldName}`, 'REQUIRED_FIELD_MISSING')
      }
      const isValid = typeof validator === 'function' ? validator(id) : validator.test(id)
      if (!isValid) {
        throw ErrorHandlers.nodeError('Invalid parameters', 'INVALID_INPUT')
      }
    return id
    
  }

  static ValidReg = AuxValid.ValidReg
  static splitObjectProps = (obj:any, propsToExtract:any[]) => AuxValid.splitObjectProps(obj, propsToExtract)

  // Alias semánticos para entornos no HTTP (Electron, Next.js, WebSockets, etc.)
  static validatePayload = NodeValidator.validateBody;
  static validateOptions = NodeValidator.validateQuery;
  static validateId = NodeValidator.paramId;
}
