
# req-valid-express

Middleware para validar **body**, **query** y **headers** en aplicaciones [Express](https://expressjs.com/).  
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

```ts
import express from "express";
import {Validator} from "req-valid-express";

const app = express();

// Schema de ejemplo para validar el body
const userSchema = {
  body: {
    name: { type: "string", required: true, sanitize: ["trim"] },
    age: { type: "number", default: 18 }
  }
};

app.post("/users", Validator.validateBody(userSchema.body), (req, res) => {
  // Ahora req.context.body contiene los datos validados
  res.json({ user: req.context.body });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
```

### En JavaScript (CommonJS)

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

---

## 📖 API

La clase principal es `Validator`.
Provee métodos para validar diferentes partes de la request:

* `validateBody(schema)`
* `validateQuery(schema)`
* `validateHeaders(schema)`

Cada esquema soporta:

* `type`: `"string"`, `"number"`, `"boolean"`, etc.
* `required`: `true | false`
* `default`: valor por defecto si falta
* `sanitize`: array de sanitizadores (`"trim"`, `"escape"`, etc.)
* `regex`: expresión regular opcional

Ejemplo de schema con regex y sanitización:

```ts
const schema = {
  email: { type: "string", required: true, sanitize: ["trim"], regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
};
```

---

## 🧩 Extensión de `Express.Request`

La librería añade la propiedad `context` al objeto `req` de Express para acceder a los valores validados.

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

Esto te permite usar:

```ts
req.context.body
req.context.query
req.context.headers
```

sin problemas de tipado en TypeScript.

---

## ⚙️ CLI (opcional)

Si instalas globalmente o lo usas vía `npx`, puedes correr:

```bash
npx validate-schema
```

Esto le permitirá generar un esquema base de validación desde consola en esm con opcion de guardado.

---

## 📄 Licencia

MIT © 2025 - \[antorrg]

