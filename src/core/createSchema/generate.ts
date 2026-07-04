import { promptInput, promptConfirm, promptList, promptCheckbox } from "./cliNative.js";
import type { FieldSchema, Schema } from "../ValidationEngine.js";

// 🔽 Devolvemos un Schema parcial (ej: { campo: { type: "string" } })
export default async function promptForField(context?: string): Promise<Schema> {
  const field: Schema = {};

  const fieldPrompt = context ? `Field name (for ${context}):` : "Field name:";
  const name = await promptInput(fieldPrompt);

  const kind = await promptList<string>(`Select type of field "${name}":`, [
    "string", "int", "float", "boolean", "object", "array"
  ]);

  if (["string", "int", "float", "boolean"].includes(kind)) {
    const fieldConfig: FieldSchema = { type: kind as FieldSchema["type"] };

    const hasDefault = await promptConfirm("Do you want to set a default value?", { default: false });

    if (hasDefault) {
      const defaultValue = await promptInput("Enter default value:", {
        validate: (input) => input.length > 0 || "Value is required",
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

    if (kind === "string") {
      const sanitizers = await promptCheckbox<string>("Select sanitizers to apply:", [
        { name: "trim", value: "trim" },
        { name: "escape", value: "escape" },
        { name: "toLowerCase", value: "lowercase" },
        { name: "toUpperCase", value: "uppercase" },
      ]);

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
      const child = await promptForField(`object "${name}"`);
      Object.assign(subfields, child);
      addMore = await promptConfirm("Add another field to the object?", { default: true });
    }
    field[name] = subfields;
    return field;
  }

  if (kind === "array") {
    const itemType = await promptList<string>("Select type for array items:", [
      "string", "int", "float", "boolean", "object"
    ]);

    if (itemType === "object") {
      const subfields: Schema = {};
      let addMore = true;
      while (addMore) {
        const child = await promptForField(`items of array "${name}"`);
        Object.assign(subfields, child);
        addMore = await promptConfirm("Add another field in the array?", { default: true });
      }
      field[name] = [subfields];
    } else {
      const itemSchema: FieldSchema = { type: itemType as FieldSchema["type"] };

      if (itemType === "string") {
        const sanitizers = await promptCheckbox<string>("Select sanitizers for array items:", [
          { name: "trim", value: "trim" },
          { name: "escape", value: "escape" },
          { name: "toLowerCase", value: "lowercase" },
          { name: "toUpperCase", value: "uppercase" },
        ]);

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
