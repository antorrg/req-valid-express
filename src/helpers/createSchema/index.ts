import promptForField from "./generate.js";
import fs from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import type { Schema } from "../ValidateSchema.js";

export const buildSchema = async () => {
  const { pathName } = await inquirer.prompt<{ pathName: string }>({
    type: "input",
    name: "pathName",
    message: "¿Dónde quiere guardar el archivo? (ej: src/Schemas)",
  });

  const { componentName } = await inquirer.prompt<{ componentName: string }>({
    type: "input",
    name: "componentName",
    message: "Nombre del archivo:",
  });

  const schema: Schema = {};
  let more = true;

  while (more) {
    const field = await promptForField();
    Object.assign(schema, field);
    const { cont } = await inquirer.prompt<{ cont: boolean }>({
      type: "confirm",
      name: "cont",
      message: "¿Agregar otro campo al esquema?",
      default: true,
    });
    more = cont;
  }

  console.log("🧪 Esquema generado:");
  const outDirJs = path.resolve(process.cwd(), pathName);
  const filePath = path.join(outDirJs, `${componentName.toLowerCase()}.js`);
  const jsContent = `export default ${toJsObjectString(schema)};\n`;

  await fs.writeFile(filePath, jsContent);
  console.log(`\n📁 Archivo validador guardado en: ${filePath}`);
  console.dir(schema, { depth: null, colors: true });
};



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

// import promptForField from './generate.js'
// import fs from 'fs/promises'
// import inquirer from 'inquirer'
// import path from 'path'


// const buildSchema = async () => {
//   const { pathName } = await inquirer.prompt({
//     type: 'input',
//     name: 'pathName',
//     message: 'Donde quiere guardar el archivo?: (ej: src/Schemas)'
//   })

//   const { componentName } = await inquirer.prompt({
//     type: 'input',
//     name: 'componentName',
//     message: 'Nombre del archivo:'
//   })
//   const schema = {}
//   let more = true

//   while (more) {
//     const field = await promptForField()
//     Object.assign(schema, field)
//     const { cont } = await inquirer.prompt({
//       type: 'confirm',
//       name: 'cont',
//       message: '¿Agregar otro campo al esquema?',
//       default: true
//     })
//     more = cont
//   }

//   console.log('🧪 Esquema generado:')
//   const outDirJs = path.resolve(process.cwd(), pathName)//'server/Schemas'
//     const filePath = path.join(outDirJs, `${componentName.toLowerCase()}.js`)
//   const jsContent = `export default ${toJsObjectString(schema)};\n`
//    await fs.writeFile(filePath, jsContent)
//    console.log(`\n📁 Archivo validador guardado en: ${filePath}`)
//   console.dir(schema, { depth: null, colors:true })
// }

// buildSchema()


// function toJsObjectString(obj, indent = 2) {
//   const space = ' '.repeat(indent)

//   if (Array.isArray(obj)) {
//     const items = obj.map(item => toJsObjectString(item, indent + 2)).join(',\n')
//     return `[\n${items}\n${' '.repeat(indent - 2)}]`
//   }

//   if (typeof obj === 'object' && obj !== null) {
//     const entries = Object.entries(obj).map(([key, value]) => {
//       const keyStr = /^[a-zA-Z_]\w*$/.test(key) ? key : `"${key}"`
//       return `${space}${keyStr}: ${toJsObjectString(value, indent + 2)}`
//     }).join(',\n')

//     return `{\n${entries}\n${' '.repeat(indent - 2)}}`
//   }

//   return JSON.stringify(obj)
// }
