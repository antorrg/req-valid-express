import inquirer from "inquirer";
import type { FieldSchema ,Schema } from "../ValidateSchema.js";


// 🔽 Devolvemos un Schema parcial (ej: { campo: { type: "string" } })
export default async function promptForField(): Promise<Schema> {
  const field: Schema = {};

  const { name } = await inquirer.prompt<{ name: string }>({
    type: "input",
    name: "name",
    message: "Field name:",
  });

  const { kind } = await inquirer.prompt<{ kind: string }>({
    type: "list",
    name: "kind",
    message: `Select type of field "${name}":`,
    choices: ["string", "int", "float", "boolean", "object", "array"],
  });

  if (["string", "int", "float", "boolean"].includes(kind)) {
    const fieldConfig: FieldSchema = { type: kind as FieldSchema["type"] };

    const { isOptional } = await inquirer.prompt<{ isOptional: boolean }>({
      type: "confirm",
      name: "isOptional",
      message: "Is this field optional?",
      default: false,
    });

    const { hasDefault } = await inquirer.prompt<{ hasDefault: boolean }>({
      type: "confirm",
      name: "hasDefault",
      message: "Do you want to set a default value?",
      default: false,
    });

    if (hasDefault) {
      const { defaultValue } = await inquirer.prompt<{ defaultValue: string }>({
        type: "input",
        name: "defaultValue",
        message: "Enter default value:",
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
        message: "Select sanitizers to apply:",
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
        message: "Add another field to the object?",
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
      message: "Select type for array items:",
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
          message: "Add another field in the array?",
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
          message: "Select sanitizers for array items:",
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

  throw new Error(`Unknown type: ${kind}`);
}
