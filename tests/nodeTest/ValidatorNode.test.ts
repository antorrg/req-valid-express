import { describe, it, expect } from 'vitest';
import { NodeValidator } from '../../src/NodeValidator.js';
import { Schema } from '../../src/helpers/ValidateSchema.js';
import { ErrorCode } from '../../src/helpers/ErrorHandlers.js';

describe('ValidatorNode', () => {
  describe('validateBody', () => {
    it('should validate and return the sanitized data', () => {
      const schema: Schema = { name: 'string', age: 'int' };
      const data = { name: '  Alice  ', age: '25' };
      
      const result = NodeValidator.validateBody(data, schema);
      
      expect(result).not.toBeInstanceOf(Error);
      expect(result).toEqual({ name: '  Alice  ', age: 25 }); // Standard schema typing
    });

    it('should return a nodeError with VALIDATION_ERROR on missing data', () => {
      const schema: Schema = { name: 'string', age: 'int' };
      const data = { name: 'Alice' }; // missing age
      
      const result = NodeValidator.validateBody(data, schema);
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      } else {
        throw new Error('Expected nodeError');
      }
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

    it('should return nodeError with VALIDATION_ERROR if rule is violated', () => {
      const schema: Schema = { status: 'string', limit: 'int' };
      const rules = { status: ['active', 'inactive'] };
      const data = { status: 'pending', limit: '10' }; // pending not allowed
      
      const result = NodeValidator.validateQuery(data, schema, rules);
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      } else {
        throw new Error('Expected nodeError');
      }
    });
  });

  describe('validateRegex', () => {
    it('should return the original data if regex passes', () => {
      const data = { email: 'test@example.com' };
      const result = NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', null);
      
      expect(result).toBe(data);
    });

    it('should return REQUIRED_FIELD_MISSING error if field is missing', () => {
      const data = {};
      const result = NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', null);
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.REQUIRED_FIELD_MISSING);
      } else {
        throw new Error('Expected nodeError');
      }
    });

    it('should return INVALID_FORMAT error if regex fails', () => {
      const data = { email: 'invalid-email' };
      const result = NodeValidator.validateRegex(data, NodeValidator.ValidReg.EMAIL, 'email', 'Must be valid email');
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.INVALID_FORMAT);
        expect(result.message).toContain('Must be valid email');
      } else {
        throw new Error('Expected nodeError');
      }
    });
  });

  describe('paramId', () => {
    it('should return the field value if validator passes', () => {
      const data = { userId: '123' };
      const result = NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT);
      
      expect(result).toBe('123');
    });

    it('should return REQUIRED_FIELD_MISSING error if field is missing', () => {
      const data = {};
      const result = NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT);
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.REQUIRED_FIELD_MISSING);
      } else {
        throw new Error('Expected nodeError');
      }
    });

    it('should return INVALID_INPUT error if validator fails', () => {
      const data = { userId: 'abc' };
      const result = NodeValidator.paramId(data, 'userId', NodeValidator.ValidReg.INT);
      
      expect(result).toBeInstanceOf(Error);
      if (result instanceof Error && 'code' in result) {
        expect(result.code).toBe(ErrorCode.INVALID_INPUT);
      } else {
        throw new Error('Expected nodeError');
      }
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
