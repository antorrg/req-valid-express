import { AuxValid, SanitizeOptions } from "./auxValid.js";

interface SchemaTypeMap {
  string: string;
  int: number;
  float: number;
  boolean: boolean;
  array: any[];
}

export type FieldSchema = {
  type?: keyof SchemaTypeMap;
  optional?: boolean;
  default?: any;
  sanitize?: SanitizeOptions;
};
type ArraySchema = [FieldSchema | Schema | string];

export type Schema = {
  [key: string]: FieldSchema | Schema | ArraySchema | string;
};

export type QueryRule = Record<string, (string | number | boolean)[]>

function isFieldSchema(s: unknown): s is FieldSchema {
  return typeof s === "object" && s !== null && "type" in s;
}

function isSchema(s: unknown): s is Schema {
  return typeof s === "object" && s !== null && !("type" in (s as any));
}

export class ValidationEngine {

  static validateStructure(
    data: any,
    schema: Schema | FieldSchema | string,
    path?: string,
    maxDepth: number = 20,
    depth: number = 0
  ): any {
    if (depth > maxDepth) {
    throw new Error(`Schema validation exceeded maximum depth at ${path || "root"}`);
  }
    if (Array.isArray(schema)) {
      if (!Array.isArray(data)) {
        throw new Error(`Expected array at ${path || "root"}`);
      }
      return data.map((item, i) =>
        ValidationEngine.validateStructure(item, schema[0] as any, `${path}[${i}]`, maxDepth,depth + 1)
      );
    }

    if (isFieldSchema(schema)) {
      return ValidationEngine.#validateField(data, schema, path);
    }

    if (isSchema(schema)) {
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(`Expected object at ${path || "root"}`);
      }

      const result: Record<string, any> = {};
      for (const key in schema) {
        const fieldSchema = schema[key];
        const fullPath = path ? `${path}.${key}` : key;
        const value = (data as any)[key];

        if (!(key in data)) {
         if (
            typeof fieldSchema === "object" &&
            "default" in fieldSchema
          ) {
            result[key] = fieldSchema.default;
            continue;
          } else {
            throw new Error(`Missing field: ${key} at ${fullPath}`);
          }
        }

        result[key] = ValidationEngine.validateStructure(
          value,
          fieldSchema as any,
          fullPath,
          maxDepth,
          depth + 1
        );
      }
      return result;
    }

    if (typeof schema === "string") {
      if (!["string", "int", "float", "boolean", "array"].includes(schema)) {
        throw new Error(`Invalid type '${schema}' at ${path || "root"}`);
      }
      return ValidationEngine.#validateField(
        data,
        { type: schema as FieldSchema["type"] },
        path
      );
    }

    throw new Error(`Invalid schema at ${path || "root"}`);
  }

  static #validateField(
    value: any,
    fieldSchema: FieldSchema | string,
    path?: string
  ): any {
    const type: FieldSchema["type"] =
      typeof fieldSchema === "string"
        ? (fieldSchema as FieldSchema["type"])
        : fieldSchema.type ?? "string";

    const sanitize =
      typeof fieldSchema === "object" ? fieldSchema.sanitize : undefined;

    if (value === undefined || value === null) {
      if (typeof fieldSchema === "object" && "default" in fieldSchema) {
        return fieldSchema.default;
      }
      throw new Error(`Missing required field at ${path}`);
    }

    return AuxValid.validateValue(value, type!, path!, null, sanitize);
  }

 static allowedValuesByRules(validated: any, rules: QueryRule) {
  for (const field of Object.keys(rules)) {
    if (!(field in validated)) {
      throw new Error(`Rule defined for unknown field '${field}'`);
    }

    const allowed = rules[field];
    const value = validated[field];

    if (value === undefined || value === null) {
      throw new Error(
        `Invalid value for '${field}': value is required and cannot be null or undefined`
      );
    }

    if (Array.isArray(value)) {
      throw new Error(
        `Invalid value for '${field}': arrays are not supported by rules`
      );
    }

    const valueType = typeof value;
    if (!["string", "number", "boolean"].includes(valueType)) {
      throw new Error(
        `Invalid value for '${field}': unsupported type '${valueType}' for rules`
      );
    }

    const isAllowed = allowed.some((candidate) => {
      return typeof candidate === valueType && candidate === value;
    });

    if (!isAllowed) {
      throw new Error(
        `Invalid value for '${field}'. Received: '${String(value)}'. Allowed: ${allowed.join(", ")}`
      );
    }
  }

  return validated;
}
}
