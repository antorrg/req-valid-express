import { Request, Response, NextFunction } from "express";
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

export class ValidateSchema {
  static validatorBody(schema: Schema, maxDepth:number=10) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.#validateStructure(req.body, schema,undefined, maxDepth);
        req.body = validated;
        next();
      } catch (err: any) {
        return next(AuxValid.middError(err.message, 400));
      }
    };
  }

  static validateQuery(schema: Schema, rules: QueryRule = {}, maxDepth:number = 5) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.#validateStructure(req.query, schema, undefined, maxDepth);

            /*
            Bloque antiguo comentado — se conserva para comparación.
            for (const field of Object.keys(rules)) {
              const allowed = rules[field];
              const value = validated[field];
              if (value === undefined) continue;
              // Si el valor existe y NO está en la lista permitida → error
              if (value !== undefined && !allowed.map(String).includes(String(value))) {
                return next(
                  AuxValid.middError(
                    `Invalid value for '${field}'. Allowed: ${allowed.join(", ")}`,
                    400
                  )
                );
              }
            }
            */

            // Usar la implementación centralizada y robusta.
            ValidateSchema.#allowedValuesByRules(validated, rules);
        req.context = req.context || {};
        req.context.query = validated;
        next();
      } catch (err: any) {
        return next(AuxValid.middError(err.message, 400));
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
          ? ValidateSchema.#validateStructure(headers, schema, "headers", maxDepth)
          : { "content-type": contentType };

        req.context = req.context || {};
        req.context.headers = validated;

        next();
      } catch (err: any) {
        return next(AuxValid.middError(err.message, 400));
      }
    };
  }

  static #validateStructure(
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
        ValidateSchema.#validateStructure(item, schema[0] as any, `${path}[${i}]`, maxDepth,depth + 1)
      );
    }

    if (isFieldSchema(schema)) {
      return ValidateSchema.#validateField(data, schema, path);
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

        result[key] = ValidateSchema.#validateStructure(
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
      return ValidateSchema.#validateField(
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
  static #allowedValuesByRules = (validated: any, rules: QueryRule) => {
    const containsAllowed = (value: any, allowed: (string | number | boolean)[]) => {
      const t = typeof value;
      if (t === "number") {
        return allowed.some((a) => (typeof a === "number" ? a === value : Number(a) === value && !Number.isNaN(Number(a))));
      }
      if (t === "boolean") {
        return allowed.some((a) => (typeof a === "boolean" ? a === value : String(a).toLowerCase() === String(value).toLowerCase()));
      }
      if (t === "string") {
        return allowed.map(String).includes(String(value));
      }
      // For other types (object/function/etc.) we don't support comparison here
      return false;
    };

    for (const field of Object.keys(rules)) {
      const allowed = rules[field];
      const value = validated[field];

      // Do not allow missing/null values when using rules.
      // Documentación: si vas a usar `rules` asegúrate de proporcionar un `default` en el schema
      // o de validar la presencia antes de llamar a esta función.
      if (value === undefined || value === null) {
        throw new Error(`Invalid value for '${field}': value is required and cannot be null or undefined`);
      }

      // Arrays are not supported by these rules (debe manejarse explícitamente si fuera necesario)
      if (Array.isArray(value)) {
        throw new Error(`Invalid value for '${field}': arrays are not supported by rules`);
      }

      // If value has an unsupported type, throw clear error
      const vType = typeof value;
      if (!(vType === "string" || vType === "number" || vType === "boolean")) {
        throw new Error(`Invalid value for '${field}': unsupported type '${vType}' for rules`);
      }

      // Compare according to the runtime type of the validated value
      if (!containsAllowed(value, allowed)) {
        throw new Error(`Invalid value for '${field}'. Received: '${String(value)}'. Allowed: ${allowed.join(", ")}`);
      }
    }

    return validated;
  };
}