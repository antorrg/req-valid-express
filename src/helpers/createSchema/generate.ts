import inquirer from "inquirer";
import type { FieldSchema ,Schema } from "../ValidateSchema.js";


// 🔽 Devolvemos un Schema parcial (ej: { campo: { type: "string" } })
export default async function promptForField(): Promise<Schema> {
  const field: Schema = {};

  const { name } = await inquirer.prompt<{ name: string }>({
    type: "input",
    name: "name",
    message: "Nombre del campo:",
  });

  const { kind } = await inquirer.prompt<{ kind: string }>({
    type: "list",
    name: "kind",
    message: `Tipo de campo "${name}":`,
    choices: ["string", "int", "float", "boolean", "object", "array"],
  });

  if (["string", "int", "float", "boolean"].includes(kind)) {
    const fieldConfig: FieldSchema = { type: kind as FieldSchema["type"] };

    const { isOptional } = await inquirer.prompt<{ isOptional: boolean }>({
      type: "confirm",
      name: "isOptional",
      message: "¿Es opcional?",
      default: false,
    });

    const { hasDefault } = await inquirer.prompt<{ hasDefault: boolean }>({
      type: "confirm",
      name: "hasDefault",
      message: "¿Querés establecer un valor por defecto?",
      default: false,
    });

    if (hasDefault) {
      const { defaultValue } = await inquirer.prompt<{ defaultValue: string }>({
        type: "input",
        name: "defaultValue",
        message: "Valor por defecto:",
        validate: (input) => input.length > 0,
      });

      fieldConfig.default =
        kind === "int"
          ? parseInt(defaultValue)
          : kind === "float"
          ? parseFloat(defaultValue)
          : kind === "boolean"
          ? defaultValue === "true"
          : defaultValue;
    }

    if (isOptional) {
      fieldConfig.optional = true;
    }

    if (kind === "string") {
      const { sanitizers } = await inquirer.prompt<{ sanitizers: string[] }>({
        type: "checkbox",
        name: "sanitizers",
        message: "¿Qué sanitizadores querés aplicar?",
        choices: [
          { name: "trim", value: "trim" },
          { name: "escape", value: "escape" },
          { name: "toLowerCase", value: "lowercase" },
          { name: "toUpperCase", value: "uppercase" },
        ],
      });

      if (sanitizers.length > 0) {
        fieldConfig.sanitize = {};
        for (const s of sanitizers) {
          (fieldConfig.sanitize as any)[s] = true;
        }
      }
    }

    field[name] = fieldConfig;
    return field;
  }

  if (kind === "object") {
    const subfields: Schema = {};
    let addMore = true;
    while (addMore) {
      const child = await promptForField();
      Object.assign(subfields, child);
      const { cont } = await inquirer.prompt<{ cont: boolean }>({
        type: "confirm",
        name: "cont",
        message: "¿Agregar otro campo dentro del objeto?",
        default: true,
      });
      addMore = cont;
    }
    field[name] = subfields;
    return field;
  }

  if (kind === "array") {
    const { itemType } = await inquirer.prompt<{ itemType: string }>({
      type: "list",
      name: "itemType",
      message: "¿Tipo de elementos del array?",
      choices: ["string", "int", "float", "boolean", "object"],
    });

    if (itemType === "object") {
      const subfields: Schema = {};
      let addMore = true;
      while (addMore) {
        const child = await promptForField();
        Object.assign(subfields, child);
        const { cont } = await inquirer.prompt<{ cont: boolean }>({
          type: "confirm",
          name: "cont",
          message: "¿Agregar otro campo al objeto dentro del array?",
          default: true,
        });
        addMore = cont;
      }
      field[name] = [subfields];
    } else {
      const itemSchema: FieldSchema = { type: itemType as FieldSchema["type"] };

      if (itemType === "string") {
        const { sanitizers } = await inquirer.prompt<{ sanitizers: string[] }>({
          type: "checkbox",
          name: "sanitizers",
          message: "¿Qué sanitizadores querés aplicar a los elementos del array?",
          choices: [
            { name: "trim", value: "trim" },
            { name: "escape", value: "escape" },
            { name: "toLowerCase", value: "lowercase" },
            { name: "toUpperCase", value: "uppercase" },
          ],
        });

        if (sanitizers.length > 0) {
          itemSchema.sanitize = {};
          for (const s of sanitizers) {
            (itemSchema.sanitize as any)[s] = true;
          }
        }
      }

      field[name] = [itemSchema];
    }

    return field;
  }

  throw new Error(`Tipo desconocido: ${kind}`);
}

// export default async function promptForField():Promise<Schema> {
//   const field:Schema = {}

//   const { name } = await inquirer.prompt<{name:string}>({
//     type: 'input',
//     name: 'name',
//     message: 'Nombre del campo:'
//   })

//   const { kind } = await inquirer.prompt<{ kind: string }>({
//     type: 'list',
//     name: 'kind',
//     message: `Tipo de campo "${name}":`,
//     choices: ['string', 'int', 'float', 'boolean', 'object', 'array']
//   })

//   if (['string', 'int', 'float', 'boolean'].includes(kind)) {
//     const fieldConfig = { type: kind }

//     const { isOptional } = await inquirer.prompt<{ isOptional: boolean }>({
//       type: 'confirm',
//       name: 'isOptional',
//       message: '¿Es opcional?',
//       default: false
//     })

//     const { hasDefault } = await inquirer.prompt<{ hasDefault: boolean }>({
//       type: 'confirm',
//       name: 'hasDefault',
//       message: '¿Querés establecer un valor por defecto?',
//       default: false
//     })

//     if (hasDefault) {
//       const { defaultValue } = await inquirer.prompt<{ defaultValue: string }>({
//         type: 'input',
//         name: 'defaultValue',
//         message: 'Valor por defecto:',
//         validate: input => input.length > 0
//       })

//       fieldConfig.default =
//         kind === 'int' ? parseInt(defaultValue) :
//         kind === 'float' ? parseFloat(defaultValue) :
//         kind === 'boolean' ? defaultValue === 'true' :
//         defaultValue
//     }

//     if (isOptional) {
//       fieldConfig.optional = true
//     }

//     🔽 Si es tipo string, preguntamos por sanitizers
//     if (kind === 'string') {
//       const { sanitizers } = await inquirer.prompt({
//         type: 'checkbox',
//         name: 'sanitizers',
//         message: '¿Qué sanitizadores querés aplicar?',
//         choices: [
//           { name: 'trim', value: 'trim' },
//           { name: 'escape', value: 'escape' },
//           { name: 'toLowerCase', value: 'lowercase' },
//           { name: 'toUpperCase', value: 'uppercase' }
//         ]
//       })

//       if (sanitizers.length > 0) {
//         fieldConfig.sanitize = {}
//         for (const s of sanitizers) {
//           fieldConfig.sanitize[s] = true
//         }
//       }
//     }

//     field[name] = fieldConfig
//     return field
//   }

//   if (kind === 'object') {
//     const subfields = {}
//     let addMore = true
//     while (addMore) {
//       const child = await promptForField()
//       Object.assign(subfields, child)
//       const { cont } = await inquirer.prompt({
//         type: 'confirm',
//         name: 'cont',
//         message: '¿Agregar otro campo dentro del objeto?',
//         default: true
//       })
//       addMore = cont
//     }
//     field[name] = subfields
//     return field
//   }

//   if (kind === 'array') {
//     const { itemType } = await inquirer.prompt({
//       type: 'list',
//       name: 'itemType',
//       message: '¿Tipo de elementos del array?',
//       choices: ['string', 'int', 'float', 'boolean', 'object']
//     })

//     if (itemType === 'object') {
//       const subfields = {}
//       let addMore = true
//       while (addMore) {
//         const child = await promptForField()
//         Object.assign(subfields, child)
//         const { cont } = await inquirer.prompt({
//           type: 'confirm',
//           name: 'cont',
//           message: '¿Agregar otro campo al objeto dentro del array?',
//           default: true
//         })
//         addMore = cont
//       }
//       field[name] = [subfields]
//     } else {
//       const itemSchema = { type: itemType }

//       🔽 Si los elementos son strings, preguntar por sanitizadores
//       if (itemType === 'string') {
//         const { sanitizers } = await inquirer.prompt({
//           type: 'checkbox',
//           name: 'sanitizers',
//           message: '¿Qué sanitizadores querés aplicar a los elementos del array?',
//           choices: [
//             { name: 'trim', value: 'trim' },
//             { name: 'escape', value: 'escape' },
//             { name: 'toLowerCase', value: 'lowercase' },
//             { name: 'toUpperCase', value: 'uppercase' }
//           ]
//         })

//         if (sanitizers.length > 0) {
//           itemSchema.sanitize = {}
//           for (const s of sanitizers) {
//             itemSchema.sanitize[s] = true
//           }
//         }
//       }

//       field[name] = [itemSchema]
//     }

//     return field
//   }
// }
