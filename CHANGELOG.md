# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]
### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 
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
