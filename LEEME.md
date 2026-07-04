
# req-valid-express

Motor de validación de esquemas tipados para Node.js. Incluye un middleware dedicado para **Express** (body, query, headers) y un validador agnóstico para **Next.js, Electron, WebSockets**, y más.  
Incluye soporte para **TypeScript**, **CommonJS** y **ESM**.

[![npm version](https://img.shields.io/npm/v/req-valid-express.svg)](https://www.npmjs.com/package/req-valid-express)
[![npm downloads](https://img.shields.io/npm/dm/req-valid-express.svg)](https://www.npmjs.com/package/req-valid-express)

---
[**Puede leer esto en Ingles**](./README.md)

## 📦 Instalación

```bash
npm install req-valid-express
```

o con yarn:

```bash
yarn add req-valid-express
```

---
## ⚠️ Importante!

### ¿Por qué usar esquemas generados?

Para asegurar la **compatibilidad** y prevenir errores inesperados, todos los esquemas de validación deberían ser creados usando el *generador de esquemas*  y no escribiéndolos manualmente.

El generador es interactivo y le guiará paso a paso:

1. Elija la ubicación adonde se guardará el archivo.
2. Seleccione el tipo de archivo (ESM, CommonJS, o TypeScript).
3. Elija un nombre para el archivo (sin extensión)
4. Configure las opciones de validación para body, query, y headers.


Puede generar los esquemas de dos maneras:  

1. **Usando npx (recomendado, no requiere instalación global):**
```bash

   npx validate-schema

```

2. **Añadiendo un script a su package.json:**

```json
   "scripts": {
     "gen:schema": "validate-schema"
   }
```

Entonces ejecute:

```bash
   npm run gen:schema
```



Generando esquemas con la librería:

* ✅ Garantiza un total soporte para sanitización, validación, valores por defecto y tipado.
* ✅ Las futuras actualizaciones seguirán siendo compatibles con versiones anteriores.
* ✅ Evita errores sutiles en las definiciones escritas a mano.

👉 **Siempre genere esquemas en lugar de crearlos manualmente.**

---

## 🚀 Uso básico

### En TypeScript (ESM)

**Método** validateBody:

```ts
import express from "express";
import {Validator} from "req-valid-express";
import type { Schema } from "req-valid-express";

const app = express();

// Schema de ejemplo para validar el body
const userSchema: Schema = {
    name: { 
      type: "string", 
      // todos los campos son estrictamente requeridos. Si un campo puede faltar, asígnale un 'default'.
      sanitize:{
        trim: true,
        escape: true,
        lowercase: true
      }
    },
    age: { type: "int", default: 18 }
};

app.post("/users", Validator.validateBody(userSchema), (req, res) => {
  res.json({ user: req.body });
});
// Uso básico: default maxDepth
app.post("/users", Validator.validateBody(userSchema), (req, res) => {
  res.json({ user: req.body });
});

// Uso avanzado: configuer el maxDepth para validar objetos profundamente anidados (ej: documentos de MongoDB)

app.post("/deep-users", Validator.validateBody(userSchema, 15), (req, res) => {
  res.json({ user: req.body });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
```

### En JavaScript (CommonJS)
Método validateQuery

```js
const express = require("express");
const {Validator }= require("req-valid-express");

const app = express();


const querySchema = {
  page: { type: "int", default: 1 },
  limit: { type: "int", default: 10 }
};

app.get("/items", Validator.validateQuery(querySchema), (req, res) => {
  res.json({ query: req.context.query });
});

app.listen(3000);

```
### En Javascript (ESM) 
**Método** validateRegex:

```ts
import express from "express";
import {Validator} from "req-valid-express";

const app = express();

// Schema de ejemplo para validar el body
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post("/users", Validator.validateRegex(emailRegex,
    'email', //Nombre del parametro a analizar
    'Introduzca un mail valido' //Mensaje complementario (opcional)
    ), (req, res) => {
 
  res.json({ user: req.body });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
```

### En Javascript (ESM) 
**Método** paramId:
> Nota: puede usar tanto el método propio validReg (que provee regex para casos comunes) como cualquier función externa de validación.

```ts
import express from "express";
import {Validator} from "req-valid-express";
import { validate as uuidValidate } from 'uuid'

const app = express();

// Schema de ejemplo para validar el body
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.get("/users/:id", Validator.paramId(
  'id', //Indica el ombre del parametro a probar
  Validator.ValidReg.UUID // metodo propio de validacion por REGEX
  ), (req, res) => {
 
  res.json({ user: req.body });
});

app.put("/users/:userId", Validator.paramId(
  'userId',   //Indica el ombre del parametro a probar
  uuidValidate // Método de validación externo
  ), (req, res) => {
 
  res.json({ user: req.body });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
```

---

## 📖 API

### 1. `Validator` (Para Express)
La clase principal para integraciones con Express.
Provee métodos tipo middleware para validar diferentes partes de la petición HTTP:

- **validateBody(schema)** 
- **validateQuery(schema)** 
- **validateHeaders(schema)**
- **validateRegex(regex, 'field', message?):** validación de campo específico del body por medio de REGEX
- **paramId('param', method):** validación de parámetros (req.params)
- **validReg:** provee los regex para paramId (opcional)

### 2. `NodeValidator` (Para Node.js agnóstico)
Usa esta clase para entornos fuera de Express (ej. Next.js, Electron, WebSockets). Recibe los datos directamente en lugar de extraerlos de la request de Express.

- **validateBody(data, schema)** (Alias: **validatePayload**)
- **validateQuery(data, schema)** (Alias: **validateOptions**)
- **paramId(data, 'param', method)** (Alias: **validateId**)
- **validateRegex(data, regex, 'field', message(optional))**

> **Nota:** Cualquier campo no declarado en el esquema será eliminado.
> Solo pasarán los que cumplan la validación o tengan un valor por defecto.


Cada esquema soporta:

* `type`: `"string"`, `"int"`, `"float"`,`"boolean"`.
* `default`: valor por defecto si falta (hace que el campo sea efectivamente opcional)
* `sanitize`: objeto de sanitizadores (`trim`, `escape`, etc.)

Ejemplo de schema con sanitización:

```ts
const schema = {
  email: { type: "string", sanitize: {trim: true} }
};
```

---

## 🧩 Extensión de `Express.Request`

La librería añade la propiedad `context` al objeto `req` de Express para acceder a los valores validados.

> La librería sobreescribe `req.body` con los datos validados automáticamente.
> La propiedad `context` se añade para almacenar `query` y `headers` validados sin mutar las propiedades de solo lectura en Express 5.

```ts
declare global {
  namespace Express {
    interface Request {
      context: {
        query?: any;
        headers?: any;
      };
    }
  }
}
```

Esto le permite usar:

```ts
req.context.query
req.context.headers
```

sin problemas de tipado en TypeScript.

---

## 📄 Licencia

MIT © 2025 - antorrg

## 📜 Changelog

Vea [CHANGELOG.md](./CHANGELOG.md) para una lista completa de cambios.
