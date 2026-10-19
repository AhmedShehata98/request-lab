# AGENTS.md — RequestLab

## 1. Purpose

This file defines the working rules for AI coding agents contributing to RequestLab. Follow it before making code changes. The product requirements document (PRD) is the source of truth for product scope and acceptance criteria.

## 2. Product Context

RequestLab is a lightweight, Chrome-first browser extension for testing HTTP API endpoints. It is intentionally simpler than a full API client.

### Core workflow
1. Compose an HTTP request.
2. Configure its method, URL, headers, and body.
3. Send the request and inspect the response.
4. Save useful requests in a collection.
5. Reuse global variables.
6. Keep data locally available and optionally export/import it.

### v1 decisions
- **Browser:** Chrome first.
- **Surfaces:** Popup for quick access; Side Panel for the primary workspace.
- **Request body:** JSON and raw text only.
- **Organization:** `Project → Collection → Request`.
- **Variables:** One global key/value scope shared across requests.
- **Persistence:** IndexedDB is the preferred source of truth for application data.
- **Portability:** Local import/export is in v1.
- **Cloud sync:** Out of scope for v1; planned for a future release.
- **Backend:** No RequestLab backend is required in v1.

Do not expand the product into a Postman replacement. Keep implementation focused on the documented MVP.

## 3. Source of Truth and Decision Rules

1. Read the current PRD before implementing or changing a feature.
2. If this file and the PRD conflict, follow the PRD for product behavior and update this file when the discrepancy is resolved.
3. Do not silently invent product requirements. If a decision materially affects UX, data integrity, browser permissions, or architecture and is not settled in the PRD, document the question and ask before locking in the behavior.
4. Prefer the smallest implementation that satisfies the acceptance criteria.
5. Do not add dependencies, services, analytics, accounts, or backend infrastructure without a clear need and approval.
6. Do not implement future-release features in v1 unless explicitly requested.

## 4. Engineering Principles

- **KISS:** Prefer simple, explicit code over unnecessary abstraction.
- **Separation of concerns:** Keep UI, request execution, variable interpolation, persistence, and import/export responsibilities separate.
- **Single source of truth:** Popup and Side Panel must operate on the same underlying data and shared domain rules.
- **Local-first:** User-created projects, collections, requests, and variables stay local in v1.
- **Storage boundary:** UI and domain logic must not depend directly on IndexedDB APIs. Access persistence through a repository/storage interface.
- **Cloud-ready, not cloud-built:** Use stable record IDs and schema versioning where appropriate, but do not build sync, conflict resolution for remote changes, or authentication yet.
- **Explicit errors:** Do not swallow errors or report a save/import as successful unless it actually succeeded.
- **Safe rendering:** Treat endpoint responses as untrusted data. Render response bodies as text or safely formatted data; never execute response HTML or scripts.
- **Least privilege:** Request only the browser permissions necessary for the implemented behavior.
- **No speculative framework:** Follow the repository's existing stack and conventions. Do not introduce a new framework or architectural pattern without justification.

## 5. Suggested Module Boundaries

Adapt names to the repository's existing structure; these are responsibility boundaries, not mandatory folder names.

- **Extension UI**
  - Popup entry point
  - Side Panel entry point
  - Shared UI components and state
- **Request domain**
  - Request configuration types
  - HTTP method and body-mode handling
  - Request preparation and execution
  - Response normalization and display-safe formatting
- **Variable resolver**
  - Resolve `{{variableName}}` in supported URL, header, and body fields
  - Detect unresolved variables and provide actionable errors
- **Persistence**
  - IndexedDB adapter
  - Repositories for projects, collections, requests, and global variables
  - Schema versioning and migrations
- **Import/export**
  - Versioned RequestLab-owned file format
  - File parsing and validation
  - Replace and Merge workflows
  - Import conflict reporting
- **Shared domain rules**
  - Validation
  - IDs and timestamps
  - Error types and result types

Do not create all these modules pre-emptively if the repository does not need them yet. Introduce boundaries incrementally as features are implemented.

## 6. Data Model Rules

The v1 logical hierarchy is:

```text
Project
└── Collection
    └── Request
```

Global variables are shared across all requests in the current local RequestLab installation.

Expected entities:

- **Project:** `id`, `name`, `createdAt`, `updatedAt`
- **Collection:** `id`, `projectId`, `name`, `createdAt`, `updatedAt`
- **Request:** `id`, `collectionId`, `name`, `method`, `url`, `headers`, `body`, `bodyType`, `createdAt`, `updatedAt`
- **Header:** `id`, `key`, `value`, `enabled`
- **GlobalVariable:** `id`, `key`, `value`, `createdAt`, `updatedAt`
- **Local metadata:** `schemaVersion` and migration metadata as needed

Rules:
- A collection belongs to exactly one project.
- A request belongs to exactly one collection.
- A global variable is not scoped to a project or collection in v1.
- Do not persist response history as a feature in v1 unless the PRD is explicitly updated.
- Do not assume local variables are a secure secrets vault.
- Avoid logging request headers, bodies, or variable values.

## 7. HTTP Request Behavior

- Support the HTTP methods listed in the PRD; do not claim support for methods not implemented and tested.
- Request headers must support add, edit, enable/disable, and remove operations.
- v1 body modes are **JSON** and **Raw Text**. Do not add form-data or multipart UI in v1 without approval.
- JSON mode should validate JSON before sending and show a clear, actionable validation error.
- Raw Text mode must preserve the user's text as entered.
- Resolve global variables at send time in the URL, headers, and body using the PRD's documented syntax: `{{variableName}}`.
- Do not silently replace unresolved variables with empty strings. Surface the unresolved variable and prevent accidental sending.
- Distinguish an HTTP response with an error status (for example, 404 or 500) from a network or browser execution error.
- Show response status, response headers, response body, and elapsed time when the browser makes them available.
- Format valid JSON responses for readability. Treat all response content as untrusted.
- Browser permissions, CORS, host permissions, mixed content, authentication, and server policy may restrict requests. Explain actual limitations; never promise every endpoint will work.
- Do not introduce a server-side proxy to bypass browser restrictions in v1.
- Only display cancellation controls if the request execution mechanism genuinely supports cancellation.

## 8. Popup and Side Panel

- The **Popup** is for quick access and lightweight actions.
- The **Side Panel** is the primary workspace for browsing projects and collections, composing requests, and inspecting responses.
- Both surfaces must share the same data source, validation, variable resolution, and request behavior.
- Avoid maintaining separate, divergent copies of saved data for each surface.
- If both surfaces can edit the same record, prevent silent overwrites where practical and communicate save state clearly.
- Keep layouts usable at each surface's actual dimensions.
- Do not duplicate complex workflows in the Popup merely for feature parity; prefer opening the Side Panel for longer tasks.

## 9. Local Persistence

- Use IndexedDB as the preferred persistence mechanism for structured application records.
- `localStorage` may be used for small UI preferences only if useful; do not use browser cache as the source of truth for user-created data.
- Keep storage calls behind a repository or adapter boundary.
- Handle loading, empty, read-error, and write-error states.
- Never show a successful save state before persistence confirms success.
- Persist data across popup/side-panel closure and browser restarts, subject to Chrome's storage lifecycle.
- Support deleting individual entities and clearing all RequestLab data.
- Do not send user-created projects, requests, or variables to a RequestLab server in v1.

## 10. Import and Export

Import/export is part of v1 and must operate locally without a RequestLab backend.

### Export
- Export supported RequestLab data: projects, collections, requests, global variables, and required schema/export metadata.
- Use a versioned format. JSON is the preferred initial format unless the project already has a stronger established convention.
- Do not include transient response data or unrequested telemetry.
- Confirm export success only after the file has been generated and the browser has initiated the download.

### Import
- Validate file syntax, required fields, record relationships, and schema version before changing local data.
- Reject malformed or unsupported files with a clear error.
- Offer two explicit modes:
  - **Replace:** Replace the current RequestLab dataset only after a clear warning and explicit confirmation.
  - **Merge:** Preserve unrelated existing records and import non-conflicting records.
- Never silently overwrite data during Merge.
- The exact policy for matching IDs or duplicate logical records is still an open product decision in the PRD. Until resolved, implement conflict detection and present a clear resolution choice rather than inventing a silent default.
- Validate the full import before committing writes. Prefer a transaction or equivalent atomic strategy so a failed import does not leave partially imported data.
- Do not claim that an import succeeded until the local write/transaction has completed successfully.

## 11. Security and Privacy

- Treat URLs, headers, bodies, variables, and responses as potentially sensitive.
- Do not log raw request/response content or variable values in production.
- Do not transmit user data to external analytics or a RequestLab backend in v1.
- Do not render API response HTML as executable DOM.
- Request only necessary Chrome extension permissions and explain why each permission is needed.
- Do not claim local storage is encrypted or equivalent to a password manager.
- Avoid exposing sensitive values in error messages, diagnostics, or UI previews where unnecessary.
- Keep import parsing defensive; imported files are untrusted input.

## 12. Testing Expectations

For each feature, add or update tests appropriate to the repository's existing test setup.

Minimum coverage should include:

- Request configuration validation.
- JSON body validation and raw-text preservation.
- Header enable/disable behavior.
- Variable interpolation and unresolved-variable handling.
- Response normalization for JSON and plain text.
- HTTP error response versus network failure distinction.
- Project/collection/request relationship integrity.
- IndexedDB persistence and schema migrations where implemented.
- Import validation for malformed files and unsupported schema versions.
- Replace import behavior and confirmation requirements.
- Merge import behavior, including ID collisions and conflict resolution.
- Atomicity or rollback behavior when import fails.
- Popup and Side Panel using the same underlying data.
- Storage failures not being reported as successful saves.

Do not claim tests passed unless they were actually run. If the repository has no test infrastructure, explain that and propose the smallest suitable setup before adding a large testing stack.

## 13. Definition of Done

A change is complete when:

1. It satisfies the relevant PRD acceptance criteria.
2. It follows the existing repository conventions and this file's rules.
3. It handles loading, empty, validation, and failure states where relevant.
4. It does not silently lose or overwrite user data.
5. Sensitive request data is not logged or transmitted unexpectedly.
6. Tests are added or updated and actually run where feasible.
7. Any unresolved product decision or limitation is documented.
8. Documentation is updated when user-visible behavior or data formats change.

## 14. Agent Workflow

Before coding:
1. Inspect the repository structure and existing package scripts.
2. Read the current PRD and this `AGENTS.md`.
3. Identify the smallest relevant implementation path.
4. Check existing types, conventions, and tests before adding abstractions.
5. Call out blockers or unresolved decisions that could cause data loss or architectural rework.

While coding:
1. Implement in small, reviewable changes.
2. Reuse existing components and utilities where appropriate.
3. Keep types explicit and avoid unnecessary `any` values when TypeScript is in use.
4. Do not add unrelated features or refactor unrelated files.
5. Keep user-facing errors understandable and actionable.

After coding:
1. Run relevant lint, type-check, and tests available in the repository.
2. Report what changed, what was tested, and any remaining limitations.
3. Do not claim browser behavior was validated unless it was tested in the target browser.

## 15. Current Known Open Decision

**Import Merge conflicts:** The PRD supports both Replace and Merge, but the exact rule for matching IDs or duplicate logical records remains unresolved. Do not silently overwrite matching records. Detect conflicts and ask for a product decision or present explicit resolution options.
