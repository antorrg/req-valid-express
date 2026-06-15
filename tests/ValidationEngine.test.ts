import { describe, it, expect } from 'vitest';
import { ValidationEngine, Schema } from '../src/core/ValidationEngine.js';

describe('ValidationEngine', () => {
  describe('validateStructure', () => {
    it('should validate simple structure correctly', () => {
      const schema: Schema = {
        name: 'string',
        age: 'int',
        active: 'boolean',
        score: 'float',
      };
      
      const data = {
        name: 'Test Name',
        age: '30',
        active: 'true',
        score: '15.5',
      };
      
      const result = ValidationEngine.validateStructure(data, schema);
      
      expect(result).toEqual({
        name: 'Test Name',
        age: 30,
        active: true,
        score: 15.5,
      });
    });

    it('should strip undeclared properties', () => {
      const schema: Schema = { name: 'string' };
      const data = { name: 'Test', extra: 'removeme' };
      const result = ValidationEngine.validateStructure(data, schema);
      expect(result).toEqual({ name: 'Test' });
      expect(result).not.toHaveProperty('extra');
    });

    it('should throw an error if missing required fields', () => {
      const schema: Schema = { name: 'string', email: 'string' };
      const data = { name: 'Test' };
      expect(() => ValidationEngine.validateStructure(data, schema)).toThrow(/Missing field: email/);
    });

    it('should use default values if provided and field is missing', () => {
      const schema: Schema = { 
        name: 'string', 
        role: { type: 'string', default: 'user' } 
      };
      const data = { name: 'Test' };
      const result = ValidationEngine.validateStructure(data, schema);
      expect(result).toEqual({ name: 'Test', role: 'user' });
    });

    it('should validate arrays', () => {
      const schema: Schema = { 
        tags: ['string'] 
      };
      const data = { tags: ['a', 'b', 'c'] };
      const result = ValidationEngine.validateStructure(data, schema);
      expect(result).toEqual({ tags: ['a', 'b', 'c'] });
    });

    it('should throw errors if array elements do not match schema', () => {
      const schema: Schema = { tags: ['int'] };
      const data = { tags: ['1', '2', 'notanumber'] };
      expect(() => ValidationEngine.validateStructure(data, schema)).toThrow(/Invalid integer value/);
    });

    it('should trim and escape strings based on sanitize options', () => {
      const schema: Schema = {
        comment: { type: 'string', sanitize: { trim: true, escape: true } }
      };
      const data = { comment: '  <script>alert("XSS")</script>  ' };
      const result = ValidationEngine.validateStructure(data, schema);
      expect(result.comment).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should throw when maximum depth is exceeded', () => {
       const schema: Schema = {
         level1: {
           level2: {
             level3: 'string'
           }
         }
       };
       const data = { level1: { level2: { level3: 'test' } } };
       expect(() => ValidationEngine.validateStructure(data, schema, undefined, 1)).toThrow(/Schema validation exceeded maximum depth/);
    });
  });

  describe('allowedValuesByRules', () => {
    it('should strictly allow values specified in the rule', () => {
      const rules = { role: ['admin', 'user'], status: [1, 2] };
      const data = { role: 'user', status: 1 };
      const result = ValidationEngine.allowedValuesByRules(data, rules);
      expect(result).toEqual(data);
    });

    it('should throw an error if a value does not match allowed rules', () => {
      const rules = { role: ['admin', 'user'] };
      const data = { role: 'guest' };
      expect(() => ValidationEngine.allowedValuesByRules(data, rules)).toThrow(/Invalid value for 'role'. Received: 'guest'. Allowed: admin, user/);
    });

    it('should throw if target value is missing in rules validation', () => {
      const rules = { state: [1, 2] };
      const data = { role: 'user' };
      expect(() =>ValidationEngine.allowedValuesByRules(data, rules))
      .toThrow(/Rule defined for unknown field 'state'/);
    });
  });
  it('should throw if target value is null or undefined in rules validation', () => {
  const rules = { state: [1, 2] };
  const data = { state: undefined };

  expect(() => ValidationEngine.allowedValuesByRules(data, rules))
    .toThrow(/Invalid value for 'state': value is required and cannot be null or undefined/);
  });
});
