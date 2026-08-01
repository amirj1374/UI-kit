# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- npm-based CI, packed-package consumer verification, and initial public-component tests.
- Accessible semantics for shared interactive controls and dialogs.

### Fixed

- Package-manager, lockfile, license, side-effect, lint, and documentation metadata.
- Disabled date-picker propagation and declared AppStepper event behavior.

## [1.9.0] - 2026-06-29

Build and packaging modernization for Vite 8 / Rolldown. No changes to the
public API: exported components, composables, utilities, the `install` plugin
function, TypeScript types, props, and emitted events are all unchanged.

### Fixed

- **CommonJS entry point.** The CJS bundle was emitted as `ui-kit.cjs.js`; under
  `"type": "module"` Node parsed that `.js` file as ESM, so `require()` returned
  an empty module (all exports `undefined`). The CJS bundle is now emitted as
  `ui-kit.cjs`, and `main` / `exports.require` point to it. `require()` of the
  package now resolves all exports correctly. The ESM (`import`) path was always
  correct and is unchanged.
- **`xlsx` optional dependency.** Range corrected from `^0.20.3` (not resolvable
  from the npm registry, which stops at `0.18.5`) to `^0.18.5`, and the
  duplicate/​conflicting `devDependencies` entry was removed. `xlsx` remains a
  lazy `import()` so it stays optional.
- Removed dead `:deep(...)` rules from the global `_approval.scss` stylesheet.
  `:deep()` is a Vue scoped-style feature; in a global stylesheet it compiled to
  an invalid selector that matched nothing, so removal changes no rendered output
  while clearing LightningCSS minify warnings.

### Added

- `./package.json` subpath to the `exports` map (additive; aids tooling).
- `engines` field: `"node": "^20.19.0 || >=22.12.0"` documenting the Vite 8
  toolchain requirement (advisory; npm only warns on mismatch).

### Changed

- **Vite 8 / Rolldown compatibility.** `manualChunks` converted to a function
  (Rolldown requirement); declared `output.exports: "named"` to resolve the
  mixed named/default exports warning.
- **Minifier.** Switched from terser to Rolldown's native Oxc minifier
  (`minify: 'oxc'`), preserving `console`/`debugger` stripping via
  `output.minify`. Faster builds; `terser` and the unused `sass-loader` were
  removed from devDependencies.
- **SCSS.** Migrated deprecated Sass `@import` to `@use` across `style.scss`, the
  affected partials, and two component `<style>` blocks. Generated CSS is
  functionally identical (vendor-CSS order preserved); zero Sass deprecation
  warnings.
- **`exports` map.** Reordered so the `types` condition resolves first (correct
  for `node16`/`bundler` module resolution).
- **Source maps.** Disabled for the published build (`build.sourcemap: false`,
  `declarationMap: false`) to match the existing `.npmignore` policy and remove
  dangling `sourceMappingURL` references that 404'd in consumers' devtools.

[1.9.0]: https://github.com/amirjalili1374/ui-kit/releases/tag/v1.9.0
