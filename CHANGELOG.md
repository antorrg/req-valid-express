# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]
### Added
- 

---

## [1.1.2] - 2026-07-06

### Added
- Created semantic aliases for `NodeValidator` methods (`validatePayload`, `validateOptions`, `validateId`) to provide better context outside of Express environments.

### Changed
- **Zero-Dependency CLI**: Refactored the `validate-schema` interactive CLI to use native Node.js `readline` instead of `inquirer`, completely removing external runtime dependencies.

---

## [1.1.1] - 2026-06-16

### Changed
- Updated `moduleResolution` to `"bundler"` in `tsconfig.json` to resolve TypeScript deprecation warnings while maintaining compatibility with both CJS and ESM builds.

### Fixed
- Fixed `NodeValidator` error handling by throwing validation errors instead of returning `Error` instances, ensuring proper exception propagation.

### Removed
- 
---
## [1.1.0] - 2026-03-28

### Added
- **Agnostic Node.js Support**: The library can now be used in any Node.js environment (e.g., Next.js, Electron, NestJS, or raw scripts) independently of Express.
- Introduced [NodeValidator](cci:2://file:///home/antonio/Documentos/Librerias/req-valid-express/src/NodeValidator.ts:5:0-60:1) class to provide validation methods (`validateBody`, `validateQuery`, [validateRegex](cci:1://file:///home/antonio/Documentos/Librerias/req-valid-express/src/NodeValidator.ts:28:2-42:3), [paramId](cci:1://file:///home/antonio/Documentos/Librerias/req-valid-express/src/NodeValidator.ts:44:2-56:3)) outside the Express request/response cycle.
- Added [ErrorHandlers](cci:2://file:///home/antonio/Documentos/Librerias/req-valid-express/src/helpers/ErrorHandlers.ts:17:0-29:1) class to standardize and centralize error creation, separating Express HTTP errors from generic Node.js errors with specific error codes.
- Added [splitObjectProps](cci:1://file:///home/antonio/Documentos/Librerias/req-valid-express/src/helpers/auxValid.ts:18:2-38:3) utility to easily separate flat property objects into structured ID/Data payloads, facilitating integration with different backend payload styles.

### Changed
- Decoupled `ValidateSchema` core methods (`validateStructure` and `allowedValuesByRules`) by removing their private modifiers, allowing them to be shared seamlessly between Express and Node validators.
- Relocated and exposed common Regex patterns via the `ValidReg` object for better modularity and public reusability.
- Removed internal error handling from `auxValid` methods, delegating error management to the parent validators ([Validator](cci:2://file:///home/antonio/Documentos/Librerias/req-valid-express/src/NodeValidator.ts:5:0-60:1) and [NodeValidator](cci:2://file:///home/antonio/Documentos/Librerias/req-valid-express/src/NodeValidator.ts:5:0-60:1)) for a more consistent and predictable error flow.
- Major refactor of the test suite: Separated tests into three distinct domains (`core`, [node](cci:1://file:///home/antonio/Documentos/Librerias/req-valid-express/src/helpers/ErrorHandlers.ts:24:2-28:3), and [express](cci:1://file:///home/antonio/Documentos/Librerias/req-valid-express/src/helpers/ErrorHandlers.ts:18:2-22:3)) to improve maintainability and strictly isolate testing environments.
---
## [1.0.9] - 2025-11-22
### Added
- Enhanced `validateQuery` method with optional value verification rules. This allows developers to restrict query parameters to a specific set of allowed values (e.g., enums for sorting or status).
- Introduced `QueryRule` type to support the new validation logic.
- Added a dedicated `assets` folder within tests to centralize test data and schemas.

### Changed
- Refactored the test suite by splitting the monolithic test file into modular, method-specific test files (`ValidateBody.test.ts`, `ValidateQuery.test.ts`, etc.) for better maintainability and readability.
- Expanded test coverage to include scenarios for the new query validation rules.
---
## [1.0.8] - 2025-10-20
### Changed
- Replaced the `validator` library with internal sanitization and trimming methods due to a security vulnerability in the `isURL` method.
- Added tests to verify sanitization and trimming behavior.

## [1.0.7] - 2025-09-22
### Changed
- Removed the `exports` field from `package.json` to improve compatibility across different module systems (CommonJS and ESM).  
- Simplified TypeScript type imports by removing explicit `.ts` extensions in `index.ts`.
- Updated `README.md` with the new way of implementation.

## [1.0.6] - 2025-09-16
### Changed
- Removed support for optional fields in `#validateStructure`.
- Updated `README.md` to clearly explain how and why to use the `validate-schema` CLI, with step-by-step guidance for users.

### Added
- Enabled **GitHub Issues** to receive feedback, bug reports, and feature requests.
- Added `bugs` and `repository` fields in `package.json` to reference the GitHub repository (initial setup, still in progress).


## [1.0.5] - 2025-09-04
### Fixed
- Fixed the type exports in `package.json` by adding the `types` property to the `exports` field, allowing proper TypeScript type usage when importing the library.

## [1.0.4] - 2025-08-24
### Changed
- Removed support for optional fields in the `validate-schema` CLI.  
  Now all object attributes must be explicitly validated.
- Added preventive depth validation in `#validateStructure` to avoid infinite recursion or overly deep objects.  
  Default `maxDepth` values: Body = 10, Query = 5, Headers = 3.

## [1.0.3] - 2025-08-17
### Fixed
- Renamed method `validateFields` to `validateBody` to correct an inconsistency.
- Updated README to reflect the new method name.

## [1.0.2] - 2025-08-16
### Added
- Middleware for request validation in Express (`validateBody`, `validateQuery`, `validateHeaders`).
- CLI tool `validate-schema`.
- Support for type-safe schemas with defaults and sanitization.

## [1.0.1] - 2025-08-15
### Added
- Initial release with type-safe schemas supporting defaults and sanitization.
