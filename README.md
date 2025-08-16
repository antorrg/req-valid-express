
# req-valid-express

Middleware to validate **body**, **query**, and **headers** in [Express](https://expressjs.com/) applications.  
Includes support for **TypeScript**, **CommonJS**, and **ESM**.

[![npm version](https://img.shields.io/npm/v/req-valid-express.svg)](https://www.npmjs.com/package/req-valid-express)
[![npm downloads](https://img.shields.io/npm/dm/req-valid-express.svg)](https://www.npmjs.com/package/req-valid-express)

---
[**You can read this in Spanish**](./LEEME.md)


## 📦 Installation

```bash
npm install req-valid-express
````

or with yarn:

```bash
yarn add req-valid-express
```

---

## 🚀 Basic Usage

### In TypeScript (ESM)

```ts
import express from "express";
import MiddlewareHandler from "req-valid-express";

const app = express();
const validator = new MiddlewareHandler();

// Example schema to validate the body
const userSchema = {
  body: {
    name: { type: "string", required: true, sanitize: ["trim"] },
    age: { type: "number", default: 18 }
  }
};

app.post("/users", validator.validateBody(userSchema.body), (req, res) => {
  // req.context.body contains the validated data
  res.json({ user: req.context.body });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

### In JavaScript (CommonJS)

```js
const express = require("express");
const MiddlewareHandler = require("req-valid-express");

const app = express();
const validator = new MiddlewareHandler();

const querySchema = {
  page: { type: "number", default: 1 },
  limit: { type: "number", default: 10 }
};

app.get("/items", validator.validateQuery(querySchema), (req, res) => {
  res.json({ query: req.context.query });
});

app.listen(3000);
```

---

## 📖 API

The main class is `MiddlewareHandler`.
It provides methods to validate different parts of the request:

* `validateBody(schema)`
* `validateQuery(schema)`
* `validateHeaders(schema)`

Each schema supports:

* `type`: `"string"`, `"number"`, `"boolean"`, etc.
* `required`: `true | false`
* `default`: default value if missing
* `sanitize`: array of sanitizers (`"trim"`, `"escape"`, etc.)
* `regex`: optional regular expression

Example schema with regex and sanitization:

```ts
const schema = {
  email: { type: "string", required: true, sanitize: ["trim"], regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
};
```

---

## 🧩 Express.Request Extension

The library adds a `context` property to the Express `req` object to access validated values.

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

So you can safely use:

```ts
req.context.body
req.context.query
req.context.headers
```

with full TypeScript support.

---

## ⚙️ CLI (optional)

If installed globally or used via `npx`, you can run:

```bash
npx validate-schema
```

This allows you to generate a base validation schema directly from the terminal.

---

## 📄 License

MIT © 2025 - \[Your Name]

```
