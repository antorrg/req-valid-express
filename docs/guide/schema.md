# Schema

A **schema** is an object that describes the expected structure and validation rules for the input data.

## Data Types

Data typing and conversion are performed at runtime, independently of TypeScript's static typing, although fully compatible with it.

The types supported by the schema are:

- **`string`**: Text.
- **`int`**: Integers.
- **`float`**: Decimal numbers.
- **`boolean`**: Boolean values.
- **`object`**: Nested objects.
- **`array`**: List of elements or objects.

Both `int` and `float` correspond to the TypeScript `number` type, but they differ in their runtime validation.

## Complete example

Validation schema for creation or editing:

```ts

const userCreate = {
    name: { type: "string", sanitize: { trim: true } },
    email: { type: "string", sanitize: { toLowerCase: true } },
    password: { type: "string" },
    picture: {
      type: "string",
      default: "https://image.com"
    }
};
// Example with nestled fields: 
const productCreate = {
    name: { type: "string", sanitize: { trim: true } },
    description: { type: "string", sanitize: { escape: true } },
    enabled: { type: "boolean", default: true },
    items: [
      {
        name: { type: "string" },
        quantity: { type: "int" }
      }
    ]
};
```

To create the schemas, it is recommended that you use the provided tool (CLI).
