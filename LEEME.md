
# req-valid-express

Middleware para validar **body**, **query**, **headers** y **params** en aplicaciones [Express](https://expressjs.com/). 


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
  body: {
    name: { type: "string", required: true, sanitize:{
      trim: true,
      escape: true,
      lowercase: true
    }},
    age: { type: "number", default: 18 }
  }
};

app.post("/users", Validator.validateBody(userSchema.body), (req, res) => {
 
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
  page: { type: "number", default: 1 },
  limit: { type: "number", default: 10 }
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

La clase principal es `Validator`.
Provee métodos para validar diferentes partes de la request:
- **validateBody(schema)** 
- **validateQuery(schema)** 
- **validateHeaders(schema)**
- **validateRegex(regex, 'field', message?):** validación de campo específico del body por medio de REGEX
- **paramId('param', method):** validación de parámetros (req.params)
- **validReg:** provee los regex para paramId (opcional)

> Cualquier campo no declarado en el esquema será eliminado.
> Solo pasarán los que cumplan la validación o tengan un valor por defecto.


Cada esquema soporta:

* `type`: `"string"`, `"int"`, `"float"`,`"boolean"`.
* `required`: `true | false`
* `default`: valor por defecto si falta
* `sanitize`: objeto de sanitizadores (`trim`, `escape`, etc.)

Ejemplo de schema con regex y sanitización:

```ts
const schema = {
  email: { type: "string", required: true, sanitize: {trim: true} }
};
```

---

## 🧩 Extensión de `Express.Request`

La librería añade la propiedad `context` al objeto `req` de Express para acceder a los valores validados.

> La propiedad `context` se añade al objeto `req` de Express.  
> Es opcional en body y headers, pero obligatoria para queries si se usa Express 5

```ts
declare global {
  namespace Express {
    interface Request {
      context: {
        body?: any;
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

## ⚙️ CLI (opcional)

Si instala globalmente o lo usa vía `npx`, puede correr:

```bash
npx validate-schema
```

Esto le permitirá generar un esquema base de validación desde consola en esm con opcion de guardado.

---

## 📄 Licencia

MIT © 2025 - antorrg

## 📜 Changelog

Vea [CHANGELOG.md](./CHANGELOG.md) para una lista completa de cambios.
