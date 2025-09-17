
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

## ⚠️ Important!

### Why use generated schemas?

To ensure **compatibility** and prevent unexpected bugs, all validation schemas should be created using the built-in generator — not written manually.

The generator is interactive and guides you step by step:

1. Choose the path where the schema file will be saved.
2. Select the file type (ESM, CommonJS, or TypeScript).
3. Choose the file name (without extension)
4. Configure the validation options for body, query, and headers.

You can generate schemas in two ways:  

1. **Using npx (recommended, no install needed):**
```bash

   npx validate-schema

```

2. **Adding a script to your package.json:**

```json
   "scripts": {
     "gen:schema": "validate-schema"
   }
```

Then run:

```bash
   npm run gen:schema
```

By generating schemas with the library:

* ✅ You guarantee full support for sanitization, defaults, and types.
* ✅ Future updates will remain backward-compatible.
* ✅ You avoid subtle bugs from hand-written definitions.

👉 **Always generate schemas instead of crafting them manually.**

---

## 🚀 Basic Usage

### In TypeScript (ESM)

Technical note: To maintain compatibility with both CommonJS and ESM, the library in TypeScript is imported as shown below. This approach ensures that Validator is accessible in both CommonJS and ESM environments, preventing interoperability issues:

Using `validateBody`:

```ts
import express from "express";
import pkg from "req-valid-express";
const { Validator } = pkg;
import type { Schema } from "req-valid-express";

const app = express();

// Example schema to validate the body
// ⚠️ Best practice: always use the schema generator, not manual objects
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

// ⚠️ Best practice: always use the schema generator, not manual objects
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

### In JavaScript (ESM) -validateRegex

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

### In JavaScript (ESM) -paramId

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

## 📄 License

MIT © 2025 - antorrg

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a complete list of changes.


## 💬 Feedback and Support

Do you have comments, ideas, or found a bug?  
Your feedback is very important! You can:

- 📌 [Open an Issue](https://github.com/antorrg/req-valid-express/issues) to report bugs or request new features.

Thank you for helping improve **req-valid-express** 🙌
