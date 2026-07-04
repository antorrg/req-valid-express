# Introduction

`req-valid-express` is a schema-based validation library for Node.js applications, designed to validate incoming data in a consistent, type-safe, and predictable way at runtime.

Although it was originally conceived as a set of middlewares for Express, the library has evolved into a more flexible architecture built around two layers:

1. A framework-agnostic validation engine (`ValidationEngine`).
2. Two integrations that consume this engine:
   - One specific integration for Express (`Validator`).
   - One agnostic integration for Node.js environments (`NodeValidator`).


This design allows the same validation logic to be reused across different environments, such as traditional APIs, backends built with Next.js, or desktop applications using Electron, maintaining a single source of truth for validation.

The library consists of a set of static methods exposed by the `Validator` and `NodeValidator` classes. It is stateless, ensuring predictable behavior and minimal system overhead.

It is important to note that `req-valid-express` does not rely on external libraries for runtime validation. This design decision aims to keep the library as simple as possible, reduce technical debt, and avoid unnecessary runtime dependencies.

The validation algorithm provides the following capabilities:

- Validate the presence and type of input data
- Apply sanitization when needed
- Assign default values defined in the schema
- Build a fully typed and safe output object

All of this is implemented following best practices recommended by Node.js and Express for handling data and errors.

The main goal of `req-valid-express` is to remain minimal while freeing handlers and controllers from the burden of manually validating incoming data (body, params, and query). To achieve this, it provides runtime validation and typing (independent of TypeScript’s static typing) through a recursive algorithm that traverses a validation schema and compares it against client-provided data.

With the release of Express 5, certain aspects of request handling changed significantly. In particular, `req.query` became read-only, preventing direct mutation within middleware. To adapt to this model, the library introduces its own handling mechanism, storing validated data in a separate object while maintaining compatibility with Express 5 across CommonJS, ECMAScript Modules, and TypeScript, offering a fully typed experience in the latter.

In non-Express environments, `NodeValidator` receives the object to validate directly and returns a new validated instance based on the provided schema. It offers the same capabilities as the Express integration, with the difference that it operates on plain data instead of extracting values from the request object.

## Motivation

In Node.js applications, input validation is often scattered across different layers of the system—middlewares, controllers, services, or even directly within data access logic. This fragmentation leads to code that is harder to maintain, inconsistent typing, and a higher risk of runtime errors.

While there are many validation tools available in the ecosystem, many introduce additional complexity, heavy dependencies, or require framework-specific adaptations.

Initially, `req-valid-express` emerged as a response to changes introduced in Express 5—particularly the immutability of `req.query`—with the goal of providing a simple, predictable middleware aligned with Express’s natural request lifecycle.

However, as the problem was analyzed more deeply, it became clear that consistent validation is not exclusive to Express, but rather a cross-cutting concern in Node.js applications.

For this reason, the library evolved toward a more general approach, separating validation logic into a framework-agnostic engine and providing specific integrations for different environments.

This approach enables:

- Centralizing validation in a single schema
- Reusing logic across different layers or applications
- Reducing code duplication
- Ensuring consistency in processed data

In this context, `req-valid-express` aims to provide a minimal yet robust solution that combines simplicity, runtime validation, and seamless integration with the application flow, without introducing unnecessary dependencies or complex abstraction layers.

## API Consistency vs. Semantics in Non-HTTP Environments

If you're coming from the **Express** ecosystem, you'll notice that `NodeValidator` exposes the exact same method names as its counterpart `Validator` (such as `validateBody`, `validateQuery`, or `paramId`).

This design decision was made *deliberately* to offer a **zero learning curve**. The mental model transfers directly:

- `validateBody`: Used to validate payloads or complex, deep objects.

- `validateQuery`: Used to validate flat option objects (with support for strict allowed value rules).

- `paramId`: Used to validate a specific identifier within an object.

However, we are aware that in non-strictly HTTP environments (such as Electron IPC, WebSockets, message queues, or generic function calls in Next.js), using terminology like "Body" or "Query" is semantically inconsistent.

To resolve this friction without breaking the overall consistency of the library, `NodeValidator` exposes semantic aliases that point to the exact same internal logic. You can choose the names that best suit your project's context:

| Original Method (Express/HTTP) | Semantic Alias (Agnostic) | Recommended Use |
| :--- | :--- | :--- |
| `NodeValidator.validateBody` | `NodeValidator.validatePayload` | For validating deep objects (e.g., WebSocket payloads or IPC messages). |
| `NodeValidator.validateQuery` | `NodeValidator.validateOptions` | For validating flat objects (e.g., configuration options). |
| `NodeValidator.paramId` | `NodeValidator.validateId` | For extracting and validating identifiers. |

Both sets of methods are identical under the hood. You are free to use whichever makes the most sense for your team's architecture.