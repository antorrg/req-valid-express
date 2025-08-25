
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

Using `validateBody`:

```ts
import express from "express";
import { Validator } from "req-valid-express";
import type { Schema } from "req-valid-express";

const app = express();

// Example schema to validate the body
const userSchema: Schema = {
  body: {
    name: { 
      type: "string", 
      required: true, 
      sanitize: {
        trim: true,
        escape: true,
        lowercase: true
      }
    },
    age: { type: "number", default: 18 }
  }
};

// Basic usage: default maxDepth
app.post("/users", Validator.validateBody(userSchema.body), (req, res) => {
  res.json({ user: req.body });
});

// Advanced usage: configure maxDepth for deeply nested objects (e.g., MongoDB documents)
app.post("/deep-users", Validator.validateBody(userSchema.body, 15), (req, res) => {
  res.json({ user: req.body });
});


app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

---

### In JavaScript (CommonJS)

Using `validateQuery`:

```js
const express = require("express");
const { Validator } = require("req-valid-express");

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

### In JavaScript (ESM)

Using `validateRegex`:

```ts
import express from "express";
import { Validator } from "req-valid-express";

const app = express();

// Example regex to validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/users", Validator.validateRegex(
    emailRegex,
    "email", // Name of the field to validate
    "Please provide a valid email" // Optional custom message
  ), 
  (req, res) => {
    res.json({ user: req.body });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

---

### In JavaScript (ESM)

Using `paramId`:

> Note: You can use either the built-in `validReg` (predefined regex) or an external validation method.

```ts
import express from "express";
import { Validator } from "req-valid-express";
import { validate as uuidValidate } from "uuid";

const app = express();

app.get("/users/:id", Validator.paramId(
  "id", // The parameter name to validate
  Validator.ValidReg.UUID // Built-in regex validation
), (req, res) => {
  res.json({ user: req.body });
});

app.put("/users/:userId", Validator.paramId(
  "userId",   // The parameter name to validate
  uuidValidate // External validation method
), (req, res) => {
  res.json({ user: req.body });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
```

---

## 📖 API

The main class is `Validator`.
It provides methods to validate different parts of the request:

* **validateBody(schema)**
* **validateQuery(schema)**
* **validateHeaders(schema)**
* **validateRegex(regex, 'field', message(optional))**: validates a specific body field against a regex
* **paramId('param', method)**: validates request params (`req.params`)
* **validReg**: provides built-in regex for `paramId` (optional)

> Any field not declared in the schema will be removed.
> Only valid fields or those with default values will pass through the validator.

Each schema supports:

* `type`: `"string"`, `"int"`, `"float"`, `"boolean"`
* `default`: default value if missing
* `sanitize`: sanitizers (`trim`, `escape`, `lowercase`, etc.)

Example schema with regex and sanitization:

```ts
const schema = {
  email: { type: "string",  sanitize: { trim: true } }
};
```

---

## 🧩 Express.Request Extension

The library adds a `context` property to the Express `req` object, where validated values are stored.

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

This allows you to safely use:

```ts
req.context.query
req.context.headers
```

with proper typing in TypeScript.

---

## ⚙️ CLI (optional)

If installed globally or used via `npx`, you can run:

```bash
npx validate-schema
```

This will generate a base validation schema directly from the console (ESM format, with optional save).

---

## 📄 License

MIT © 2025 - antorrg

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a complete list of changes.



