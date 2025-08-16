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


function isFieldSchema(s: unknown): s is FieldSchema {
  return typeof s === "object" && s !== null && "type" in s;
}

function isSchema(s: unknown): s is Schema {
  return typeof s === "object" && s !== null && !("type" in (s as any));
}

export class ValidateSchema {
  static validateBody(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.#validateStructure(req.body, schema);
        req.body = validated;
        next();
      } catch (err: any) {
        return next(AuxValid.middError(err.message, 400));
      }
    };
  }

  static validateQuery(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = ValidateSchema.#validateStructure(req.query, schema);
        req.context = req.context || {};
        req.context.query = validated;
        next();
      } catch (err: any) {
        return next(AuxValid.middError(err.message, 400));
      }
    };
  }

  static validateHeaders(schema: Schema) {
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
          ? ValidateSchema.#validateStructure(headers, schema, "headers")
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
    path?: string
  ): any {
    if (Array.isArray(schema)) {
      if (!Array.isArray(data)) {
        throw new Error(`Expected array at ${path || "root"}`);
      }
      return data.map((item, i) =>
        ValidateSchema.#validateStructure(item, schema[0] as any, `${path}[${i}]`)
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
            "optional" in fieldSchema &&
            fieldSchema.optional
          ) {
            continue;
          } else if (
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
          fullPath
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
}

// import { Request, Response, NextFunction } from "express";
// import { AuxValid, SanitizeOptions } from './auxValid.js'

// interface SchemaTypeMap {
//   string: string;
//   int: number;
//   float: number;
//   boolean: boolean;
//   array: any[];
// }
// type FieldSchema = {
//   type?: keyof SchemaTypeMap;
//   optional?: boolean;
//   default?: any;
//   sanitize?: SanitizeOptions;
// };

// type Schema = {
//   [key: string]: FieldSchema | Schema | string;
// };
// function isFieldSchema(s: unknown): s is FieldSchema {
//   return typeof s === "object" && s !== null && "type" in s;
// }

// function isSchema(s: unknown): s is Schema {
//   return typeof s === "object" && s !== null && !("type" in (s as any));
// }


// export class ValidateSchema {
//   static validateBody(schema:Schema) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const validated = ValidateSchema.#validateStructure(req.body, schema)
//         req.body = validated
//         next()
//       } catch (err : any) {
//         return next(AuxValid.middError(err.message, 400))
//       }
//     }
//   }
//     static validateQuery(schema:Schema) {
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const validated = ValidateSchema.#validateStructure(req.query, schema)
//         req.context = req.context || {}
//         req.context.query = validated
//         next()
//       } catch (err: any) {
//         return next(AuxValid.middError(err.message, 400))
//       }
//     }
//   }
// static validateHeaders(schema:Schema) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const headers = req.headers || {}
//       // 1. Validar existencia y valor de content-type
//       const contentType = headers['content-type']
//       if (!contentType) {
//         throw new Error('Missing required header: content-type')
//       }
//       const lowerContentType = contentType.toLowerCase()
//       if (
//         lowerContentType !== 'application/json' &&
//         !lowerContentType.startsWith('multipart/form-data')
//       ) {
//         throw new Error('Invalid Content-Type header')
//       }

//       // 2. Validar resto del esquema si existe
//       if (schema) {
//         const validated = ValidateSchema.#validateStructure(headers, schema, 'headers')
//         req.context = req.context || {}
//         req.context.headers = validated
//       } else {
//         // Si no hay esquema, solo guardamos el header validado
//         req.context = req.context || {}
//         req.context.headers = { 'content-type': contentType }
//       }
      
//       next()
//     } catch (err:any) {
//       return next(AuxValid.middError(err.message, 400))
//     }
//   }
// }
// static #validateStructure(
//   data: any,
//   schema: Schema | FieldSchema | string,
//   path?: string
// ): any {
//   if (Array.isArray(schema)) {
//     if (!Array.isArray(data)) {
//       throw new Error(`Expected array at ${path || "root"}`);
//     }
//     return data.map((item, i) =>
//       ValidateSchema.#validateStructure(item, schema[0] as any, `${path}[${i}]`)
//     );
//   }

//   if (isFieldSchema(schema)) {
//     return ValidateSchema.#validateField(data, schema, path);
//   }

//   if (isSchema(schema)) {
//     if (typeof data !== "object" || data === null || Array.isArray(data)) {
//       throw new Error(`Expected object at ${path || "root"}`);
//     }

//     const result: Record<string, any> = {};
//     for (const key in schema) {
//       const fieldSchema = schema[key];
//       const fullPath = path ? `${path}.${key}` : key;
//       const value = (data as any)[key];

//       if (!(key in data)) {
//         if (typeof fieldSchema === "object" && "optional" in fieldSchema && fieldSchema.optional) {
//           continue;
//         } else if (typeof fieldSchema === "object" && "default" in fieldSchema) {
//           result[key] = fieldSchema.default;
//           continue;
//         } else {
//           throw new Error(`Missing field: ${key} at ${fullPath}`);
//         }
//       }

//       result[key] = ValidateSchema.#validateStructure(value, fieldSchema as any, fullPath);
//     }
//     return result;
//   }

//   // if (typeof schema === "string") {
//   //   return ValidateSchema.#validateField(data, { type: schema }, path);
//   // }
//   if (typeof schema === "string") {
//   if (!['string', 'int', 'float', 'boolean', 'array'].includes(schema)) {
//     throw new Error(`Invalid type '${schema}' at ${path || "root"}`);
//   }
//   return ValidateSchema.#validateField(
//     data,
//     { type: schema as FieldSchema["type"] },
//     path
//   );
// }

//   throw new Error(`Invalid schema at ${path || "root"}`);
// }

// static #validateField(
//   value: any,
//   fieldSchema: FieldSchema | string,
//   path?: string
// ): any {
//   const type: FieldSchema["type"] =
//     typeof fieldSchema === "string" ? fieldSchema : fieldSchema.type ?? "string";

//   const sanitize =
//     typeof fieldSchema === "object" ? fieldSchema.sanitize : false;

//   if (value === undefined || value === null) {
//     if (typeof fieldSchema === "object" && "default" in fieldSchema) {
//       return fieldSchema.default;
//     }
//     throw new Error(`Missing required field at ${path}`);
//   }

//   return AuxValid.validateValue(value, type, path, null, sanitize);
// }
// }
// static #validateStructure(data:any, schema:  Schema | FieldSchema | string, path?:string):any {
//   if (Array.isArray(schema)) {
//     if (!Array.isArray(data)) {
//       throw new Error(`Expected array at ${path || 'root'}`)
//     }
//     return data.map((item, i) =>
//       ValidateSchema.#validateStructure(item, schema[0], `${path}[${i}]`)
//     )
//   }

//   if (typeof schema === 'object' && schema !== null) {
//     // Si es un esquema de campo escalar con opciones
//     if ('type' in schema) {
//       return ValidateSchema.#validateField(data, schema, path)
//     }

//     // Si es un objeto complejo con múltiples claves
//     if (typeof data !== 'object' || data === null || Array.isArray(data)) {
//       throw new Error(`Expected object at ${path || 'root'}`)
//     }

//     const result = {}
//     for (const key in schema) {
//       const fieldSchema = schema[key]
//       const fullPath = path ? `${path}.${key}` : key
//       const value = data[key]

//       if (!(key in data)) {
//         if (fieldSchema.optional) {
//           continue
//         } else if ('default' in fieldSchema) {
//           result[key] = fieldSchema.default
//           continue
//         } else {
//           throw new Error(`Missing field: ${key} at ${fullPath}`)
//         }
//       }

//       result[key] = ValidateSchema.#validateStructure(value, fieldSchema, fullPath)
//     }
//     return result
//   }

//   // Si es un tipo simple, como string directamente
//   if (typeof schema === 'string') {
//     return ValidateSchema.#validateField(data, { type: schema }, path)
//   }

//   throw new Error(`Invalid schema at ${path || 'root'}`)
// }

  // static #validateField(value: any, fieldSchema: FieldSchema | string, path?: string): any {
  //   const type = typeof fieldSchema === 'string' ? fieldSchema : fieldSchema.type
  //   const sanitize = typeof fieldSchema === 'object' ? fieldSchema.sanitize : false

  //   if (value === undefined || value === null) {
  //     if (typeof fieldSchema === 'object' && 'default' in fieldSchema) {
  //       return fieldSchema.default
  //     }
  //     throw new Error(`Missing required field at ${path}`)
  //   }

  //   return AuxValid.validateValue(value, type, path, null, sanitize)
  // }

