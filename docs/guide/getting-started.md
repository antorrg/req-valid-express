# Getting-started

`req-valid-express` does not support implicit optional fields. Every expected field must be explicitly defined in the validation schema. If an optional field is required, it must have a `default` value.

The library writes an object based on the declared schema, without modifying the input data. The data stored in these objects corresponds exactly, in name and type, to what is defined in the schema.

If a required field is not present, an error will be thrown. The library allows you to define default values: if a field arrives empty or is not present and has a default value declared in the schema, that value will be assigned automatically.

This can be used in projects that use `CommonJS`, `ESM` (ECMAScript Modules), or `TypeScript`.

## Installation

::: Tip
To install the library, run the following command:

```bash
npm install req-valid-express
```

or:

```bash
pnpm install req-valid-express
```

Once installed, it is strongly recommended not to manually create validation schemas to avoid syntax errors.

The library includes an interactive command-line tool that will guide you through the schema creation process (see the `CLI` section, [Command Line Interface]).

## Usage

The library can be used in Express:

```javascript
import { Validator } from 'req-valid-express'
```

or:

```javascript
const { Validator } = require('req-valid-express')
```

And in Node.js applications such as Electron, etc.

```javascript
import { NodeValidator } from 'req-valid-express'
```

or:

```javascript
const { NodeValidator } = require('req-valid-express')
```

The methods and their respective uses can be found in the sections for Express or Node.js.
