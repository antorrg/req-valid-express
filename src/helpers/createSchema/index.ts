import promptForField from "./generate.js";
import fs from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import type { Schema } from "../ValidateSchema.js";

export const buildSchema = async () => {
  const { pathName } = await inquirer.prompt<{ pathName: string }>({
    type: "input",
    name: "pathName",
    message: "Where do you want to save the file? (e.g. src/schemas)",
  });

  const { format } = await inquirer.prompt<{ format: "esm" | "cjs" | "ts" }>({
    type: "list",
    name: "format",
    message: "Select the output format:",
    choices: [
      { name: "ESM (export default ...)", value: "esm" },
      { name: "CommonJS (module.exports = ...)", value: "cjs" },
      { name: "TypeScript (export default ... with typing)", value: "ts" },
    ],
  });

  const { componentName } = await inquirer.prompt<{ componentName: string }>({
    type: "input",
    name: "componentName",
    message: "File name (without extension):",
    validate: (s) => s.trim().length > 0 || "File name is required",
  });

  const schema: Schema = {};
  let more = true;

  while (more) {
    const field = await promptForField();
    Object.assign(schema, field);
    const { cont } = await inquirer.prompt<{ cont: boolean }>({
      type: "confirm",
      name: "cont",
      message: "Add another field to the schema?",
      default: true,
    });
    more = cont;
  }

  console.log("🧪 Generated schema:");
  const outDir = path.resolve(process.cwd(), pathName);
  await fs.mkdir(outDir, { recursive: true });

  const filePath = path.join(
    outDir,
    `${componentName.toLowerCase()}${formatExt(format)}`
  );

  const fileContent = generateSchemaContent(schema, format, componentName);

  await fs.writeFile(filePath, fileContent);
  console.log(`\n📁 Validator file saved at: ${filePath}`);
  console.dir(schema, { depth: null, colors: true });
};

function formatExt(f: "esm" | "cjs" | "ts"): string {
  // Elegimos extensiones seguras con Node:
  // - .mjs para ESM (no depende de "type": "module")
  // - .cjs para CommonJS (no choca con ESM)
  // - .ts para TypeScript
  if (f === "ts") return ".ts";
  if (f === "cjs") return ".cjs";
  return ".mjs"; // esm
}

function toJsObjectString(obj: any, indent = 2): string {
  const space = " ".repeat(indent);

  if (Array.isArray(obj)) {
    const items = obj.map((item) => toJsObjectString(item, indent + 2)).join(",\n");
    return `[\n${items}\n${" ".repeat(indent - 2)}]`;
  }

  if (typeof obj === "object" && obj !== null) {
    const entries = Object.entries(obj)
      .map(([key, value]) => {
        const keyStr = /^[a-zA-Z_]\w*$/.test(key) ? key : `"${key}"`;
        return `${space}${keyStr}: ${toJsObjectString(value, indent + 2)}`;
      })
      .join(",\n");

    return `{\n${entries}\n${" ".repeat(indent - 2)}}`;
  }

  return JSON.stringify(obj);
}

function generateSchemaContent(schema: any, format: "esm" | "cjs" | "ts", nameVar:string): string {
  const schemaString = toJsObjectString(schema);
  const varName = nameVar.toLowerCase()

  switch (format) {
    case "esm":
      // Archivo .mjs
      return `export default ${schemaString};\n`;

    case "cjs":
      // Archivo .cjs
      return `module.exports = ${schemaString};\n`;

    case "ts":
      // Archivo .ts — importa el tipo desde tu paquete publicado
      return (
        `import type { Schema } from "req-valid-express";\n\n` +
        `const ${varName}: Schema = ${schemaString};\n\n` +
        `export default ${varName};\n`
      );

    default:
      return `export default ${schemaString};\n`;
  }
}
