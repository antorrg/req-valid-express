# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
