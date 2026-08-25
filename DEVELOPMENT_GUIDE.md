# Development Guide

This is the canonical guide for changing the UI Kit safely. Read [PROJECT_KNOWLEDGE.md](./PROJECT_KNOWLEDGE.md) for current architecture and [ROADMAP.md](./ROADMAP.md) for planned work.

## 1. Start safely

Before editing, record the current branch, HEAD, worktree, refs, and upstream. Do not assume a branch exists because a document names it. Preserve unrelated changes in a dirty worktree and never reset, stash, or overwrite them without explicit authorization.

Identify whether the task changes a public contract, internal behavior, packaging, or documentation. For complex behavior—especially DataTable—read its existing tests and behavior contract before implementation.

## 2. Folder conventions

| Change | Primary location | Required companions |
| --- | --- | --- |
| Public component | `src/components/<category>` | `src/index.ts`, declarations include, tests, docs, consumer when material |
| Internal component | Nearest owning feature directory | Owner tests; do not export accidentally |
| Platform API | `src/platform` | platform types/tests/docs and package export |
| Composable | `src/composables` | typed contract and adjacent/integration tests |
| Directive | `src/directives` | tests and explicit package export decision |
| Theme | `src/platform/themes.ts` or `src/theme` | validation tests and docs |
| Token | `src/scss/foundation/_tokens.scss` | usage, reduced-motion consideration, packed CSS check |
| DataTable behavior | `src/components/shared/data-table-v2` | characterization tests and behavior docs |
| Package behavior | package/Vite/TS configuration | packed consumer and CI validation |

Do not make an implementation public merely because it is reusable. Export it only when its compatibility can be maintained.

## 3. Coding and TypeScript conventions

- Use Vue 3 Composition API and `<script setup lang="ts">` for new components.
- Prefer explicit interfaces and exported types over implicit cross-file shapes.
- Avoid new `any`, ignored diagnostics, and unsafe casts. Narrow external input at boundaries.
- Keep side effects out of module initialization where possible.
- Use computed state for derivation and watchers only for synchronization or effects.
- Clean up timers, listeners, URLs, teleports, and other resources on failure and unmount.
- Keep platform foundations independent from Router, Pinia, and application stores.
- Preserve the package's Node and Vue/Vuetify peer requirements unless a planned breaking release changes them.

## 4. Component contracts

### Props

Use typed props, stable defaults, and factories for mutable defaults. Optional provider-aware props should follow this precedence:

1. explicit component prop;
2. provider configuration;
3. safe built-in fallback.

Do not silently change a prop from optional to required or reinterpret false, zero, or an empty string as absence.

### Emits and v-model

Declare emits explicitly. Use `modelValue` and `update:modelValue` for the primary model. Use `update:<name>` for additional controlled models. Emit domain events such as `confirm` or `selection-change` separately from model synchronization.

Do not mutate controlled prop objects or arrays. Copy or derive them, and test external replacement.

### Slots

Name slots by purpose and document slot props. Adding a slot is usually compatible; renaming or changing its props is a public change. Do not document a slot until the implementation and tests prove it exists.

### Exposed methods

Keep `defineExpose` small. Exposed members are public behavior when documented or depended upon by tests. Changes require the same care as props and emits.

## 5. Platform usage

Use `useUiKit` or a focused composable for provider behavior. Direct component imports must still work without plugin installation.

- Messages: add typed keys and both built-in catalog values. Do not add new shared user-facing literals.
- Icons: introduce a semantic key when the meaning is shared. Do not couple a foundation component to one icon pack unnecessarily.
- Locale/direction: use provider direction and CSS logical properties. Explicit consumer props remain authoritative.
- Permissions: use `usePermission` or `PermissionGuard`; never present these checks as backend authorization.
- Async states: keep request execution in the feature and use state components for presentation.
- Runtime updates: do not retain stale copies of provider values outside Vue reactivity.
- Isolation: clone caller-owned maps and never mutate another application's context.

The injection key is private and must remain unexported.

## 6. Themes and tokens

Use semantic `--ui-*` variables for shared design decisions. Prefer intent such as surface, error, dialog elevation, or focus ring over component-specific names. Supply a safe fallback when a component could be consumed without the foundation CSS.

New theme definitions must have a non-empty name, a boolean `dark` value, a color map, and non-empty string color values. Clone definitions so consumer mutation cannot alter defaults.

Do not perform a broad raw-value replacement without visual verification. Token migration should be incremental and protected by component or visual tests.

## 7. Accessibility requirements

For every interactive change verify:

- a native element is used when possible;
- the control has an accessible name;
- keyboard activation matches the control type;
- disabled and readonly states are enforced, not merely styled;
- focus is visible and logical;
- dialogs have names and descriptions;
- loading/error changes use appropriate live semantics;
- RTL and LTR layouts use logical properties;
- animation respects reduced-motion preferences;
- icon-only controls hide decorative icons and label the action.

Happy DOM tests do not prove focus trapping, Escape behavior, focus restoration, browser downloads, or screen-reader output. Mark these for real-browser/manual verification.

## 8. Testing conventions

Choose the narrowest layer that proves public behavior:

1. adjacent unit test for a pure helper;
2. component test for props, emits, slots, models, semantics, and provider fallback;
3. platform test for isolation and cross-cutting configuration;
4. DataTable integration test for table contracts;
5. consumer fixture for package-root, declaration, CSS, ESM, or CJS behavior.

Use the shared setup and `mountWithApp`. It installs Vuetify, UI Kit, Pinia, and a memory router. Pass provider options through its supported configuration argument rather than recreating a divergent harness.

Tests must restore mocked timers, globals, clipboard, URL, DOM, and network state. Prefer deterministic event/state assertions over arbitrary waits. A timeout increase is not a substitute for fixing nondeterminism.

## 9. DataTable rules

`CustomDataTableV2` is high-risk. Both `CustomDataTableV2` and `CustomDataTable` must continue to resolve to the same implementation unless a documented breaking migration explicitly changes that contract.

Before changing it:

- locate the relevant suite in `tests/data-table-v2`;
- add or update a characterization test;
- preserve local and remote modes;
- preserve zero-based remote and one-based UI pagination;
- preserve request-parameter precedence;
- preserve custom/nested/function unique keys, including zero and empty string;
- preserve latest-request-wins behavior;
- preserve selection on failed group deletion;
- clean Blob URLs and temporary DOM in success and failure paths;
- keep optional XLSX dynamically loaded;
- preserve accessible alerts and labels;
- document unsupported behavior rather than implying it works.

Do not introduce remote sorting, cancellation, new slots, request normalization, or Router decoupling incidentally. Each requires an explicit contract, tests, and migration assessment. Avoid broad refactoring while behavior changes are in flight.

## 10. Public exports and packaging

For every new public API:

1. export it from `src/index.ts`;
2. ensure `tsconfig.lib.json` includes its source;
3. avoid exporting private application types transitively;
4. verify ESM, CJS, declarations, and CSS as applicable;
5. add the API to the consumer fixture when package resolution matters;
6. document it in `PROJECT_KNOWLEDGE.md` and focused docs.

Do not deep-import private `src` paths from consumer examples. CSS must remain available through the documented export and listed as a package side effect.

## 11. Documentation rules

- `PROJECT_KNOWLEDGE.md` describes confirmed current architecture.
- `DEVELOPMENT_GUIDE.md` describes how to change it safely.
- `ROADMAP.md` describes future or in-progress work.
- Focused behavior contracts under `docs` may provide deeper component detail.

Update documentation in the same change as public behavior. Label current behavior, known limitation, and future work distinctly. Do not copy implementation code or promise untested features.

## 12. Validation commands

Use the repository's installed dependencies and documented npm workflow. Do not install or update dependencies unless the task authorizes it.

| Scope | Command |
| --- | --- |
| Lint, read-only | `bun run lint:check` |
| Type check | `bun run typecheck` |
| Unit/component tests | `npm test` |
| Coverage | `bun run test:coverage` |
| Library package | `bun run build:lib` |
| Packed consumer | `bun run test:consumer` after library build |
| Full gate | `bun run validate` |
| Patch whitespace | `git diff --check` |

Formatting and `lint:fix` write files. Run them only when the task permits edits and review every resulting change.

## 13. Git and commit workflow

- Work from the intended development branch; never infer it from a branch name in old documentation.
- Keep `v2` and release/stable refs protected unless the task explicitly targets them.
- Create focused branches using the repository's current naming policy.
- Keep unrelated worktree changes intact.
- Review `git diff`, `git diff --check`, and status before handoff.
- Do not commit, push, tag, publish, or open a pull request without authorization.

Use conventional, scoped subjects where practical:

- `feat(platform): ...`
- `fix(table): ...`
- `test(components): ...`
- `docs(platform): ...`
- `chore(ci): ...`
- `refactor(shared): ...`

One commit should have one explainable purpose. Documentation and tests supporting that purpose may travel with it.

## 14. Migration and breaking-change policy

A breaking change includes removed/renamed exports, newly required props, changed models/emits/slots, incompatible defaults, dependency requirement changes, CSS contract removal, or changed DataTable request/response semantics.

Before a breaking change:

1. demonstrate why an additive or compatibility alias is insufficient;
2. record affected consumers;
3. define the target version and migration path;
4. add characterization tests for old behavior;
5. update consumer verification;
6. update changelog and all canonical documentation;
7. provide a deprecation period when feasible.

Bug fixes may change observable behavior, but their previous behavior and intended correction must be covered by tests and release notes.

## 15. Rules that must never be broken

- Do not bypass the validation pipeline for a release.
- Do not expose the platform injection key.
- Do not make plugin installation mandatory for direct component imports.
- Do not share mutable configuration between Vue applications.
- Do not couple new foundations to Router, Pinia, or business stores.
- Do not treat UI permission checks as authorization.
- Do not remove either DataTable export name accidentally.
- Do not claim unsupported DataTable features.
- Do not ship package-root APIs without declarations and consumer validation.
- Do not introduce breaking behavior without migration documentation.
- Do not mix confirmed architecture and proposed roadmap behavior.

## 16. Review checklist

### Contract

- [ ] Public/internal status is intentional.
- [ ] Props, emits, slots, models, and exposed methods are typed and documented.
- [ ] False, zero, empty strings, and empty arrays have deliberate behavior.
- [ ] Direct-import fallback still works.
- [ ] No private types leak through declarations.

### Platform and design

- [ ] Messages and icons use semantic foundations.
- [ ] RTL/LTR behavior uses logical layout.
- [ ] Theme/token changes have safe defaults.
- [ ] Per-app isolation is preserved.

### Quality

- [ ] Relevant characterization and regression tests exist.
- [ ] Accessibility semantics and keyboard behavior are tested.
- [ ] Browser resources are cleaned up.
- [ ] Documentation describes current behavior accurately.
- [ ] Package changes are covered by the consumer fixture.
- [ ] Appropriate validation commands passed or unrun checks are disclosed.

### Git safety

- [ ] Only intended files changed.
- [ ] No generated or lockfile changes appeared unexpectedly.
- [ ] `git diff --check` passes.
- [ ] No protected branch or remote action occurred unintentionally.
