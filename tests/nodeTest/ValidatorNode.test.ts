import { describe, it, expect } from 'vitest';
import { NodeValidator } from '../../src/NodeValidator.js';
import { Schema } from '../../src/core/ValidationEngine.js';
import { ErrorCode } from '../../src/core/ErrorHandlers.js';

describe('ValidatorNode', () => {
  describe('validateBody', () => {
    it('should validate and return the sanitized data', () => {
      const schema: Schema = { name: 'string', age: 'int' };
      const data = { name: '  Alice  ', age: '25' };
      
      const result = NodeValidator.validateBody(data, schema);
      
      expect(result).not.toBeInstanceOf(Error);
      expect(result).toEqual({ name: '  Alice  ', age: 25 }); // Standard schema typing
    });

    it('should throw a nodeError with VALIDATION_ERROR on missing data', () => {
      const schema: Schema = { name: 'string', age: 'int' };
      const data = { name: 'Alice' }; // missing age
      
      expect(() => NodeValidator.validateBody(data, schema)).toThrowError(
        expect.objectContaining({ code: ErrorCode.VALIDATION_ERROR })
      );
    });
  });

  describe('validateQuery', () => {
    it('should validate structure and rules successfully', () => {
      const schema: Schema = { status: 'string', limit: 'int' };
      const rules = { status: ['active', 'inactive'] };
      const data = { status: 'active', limit: '10' };
      
      const result = NodeValidator.validateQuery(data, schema, rules);
      
      expect(result).not.toBeInstanceOf(Error);
      expect(result).toEqual({ status: 'active', limit: 10 });
    });

    it('should throw a nodeError with VALIDATION_ERROR if rule is violated', () => {
      const schema: Schema = { status: 'string', limit: 'int' };
      const rules = { status: ['active', 'inactive'] };
      const data = { status: 'pending', limit: '10' }; // pending not allowed
      
      expect(() => NodeValidator.validateQuery(data, schema, rules)).toThrowError(
        expect.objectContaining({ code: ErrorCode.VALIDATION_ERROR })
      );
    });
  });

  describe('validateRegex', () => {
    it('should return the original data if regex passes', () => {
      const data = { email: 'test@example.com' };
      const result = NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', null);
      
      expect(result).toBe(data);
    });

    it('should throw REQUIRED_FIELD_MISSING error if field is missing', () => {
      const data = {};
      
      expect(() => NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', null)).toThrowError(
        expect.objectContaining({ code: ErrorCode.REQUIRED_FIELD_MISSING })
      );
    });

    it('should throw INVALID_FORMAT error if regex fails', () => {
      const data = { email: 'invalid-email' };
      
      expect(() => NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', 'Must be valid email')).toThrowError(
        expect.objectContaining({ code: ErrorCode.INVALID_FORMAT, message: expect.stringContaining('Must be valid email') })
      );
    });
  });

  describe('paramId', () => {
    it('should return the field value if validator passes', () => {
      const data = { userId: '123' };
      const result = NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT);
      
      expect(result).toBe('123');
    });

    it('should throw REQUIRED_FIELD_MISSING error if field is missing', () => {
      const data = {};
      
      expect(() => NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT)).toThrowError(
        expect.objectContaining({ code: ErrorCode.REQUIRED_FIELD_MISSING })
      );
    });

    it('should throw INVALID_INPUT error if validator fails', () => {
      const data = { userId: 'abc' };
      
      expect(() => NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT)).toThrowError(
        expect.objectContaining({ code: ErrorCode.INVALID_INPUT })
      );
    });
  });

  describe('splitObjectProps', () => {
    it('should split specified properties into the parent and put remaining into rest', () => {
      const source = { a: 1, b: 2, c: 3, d: 4 };
      const result = NodeValidator.splitObjectProps(source, ['a', 'c']);
      
      expect(result).toHaveProperty('a', 1);
      expect(result).toHaveProperty('c', 3);
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('d');
      expect(result).toHaveProperty('rest');
      expect(result.rest).toEqual({ b: 2, d: 4 });
    });

    it('should handle extracting properties that do not exist safely', () => {
      const source = { y: 2 };
      // By typescript typing constraints, we might need to cast or just check runtime behaviour.
      const result = NodeValidator.splitObjectProps(source, ['x'] as any);
      
      expect(result.rest).toEqual({ y: 2 });
      expect(result).not.toHaveProperty('x'); // undefined normally
    });
  });
});
