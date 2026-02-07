# Senior Code Review: `eggplotr`

**Project**: R Shiny application visualizing the universal egg shape formula from Narushin et al. (2021)
**Stack**: R / Shiny / rgl / threejs / ShinyApps.io
**Last deployed**: March 2022

---

## 1. BUGS - Critical Issues

### 1.1 Duplicate dead code block (`egg_coords.R:124-165`)

The `rgl_persp` engine branch is **duplicated identically**. Lines 124-143 and lines 145-164 are the same `if (engine == "rgl_persp")` block. The second block is dead code -- it can never be reached because the first block returns.

### 1.2 No fallback / default return in `plot_egg()`

If `engine` is passed a value that doesn't match `"rgl"`, `"rgl_persp"`, or `"threejs"`, the function silently returns `NULL`. There is no `else` clause or input validation.

### 1.3 `renderPrint` used for HTML output (`server.R:18-26`)

`renderPrint` is the wrong renderer for HTML content. It wraps output in `<pre>` tags and escapes HTML. The correct function is `renderUI`. The `withMathJax(HTML(...))` inside `renderPrint` likely renders partially or incorrectly.

### 1.4 Global assignment operator `<<-` (`1_engine_definitions.R:1`)

`engine_definition_brain <<-` assigns to the global environment. This breaks encapsulation. A regular `<-` assignment works here since `app.R` sources this at the top level.

---

## 2. CODE QUALITY

### 2.1 Naming & readability

- Slider labels `"w"`, `"B"`, `"DL4"`, `"seq01"`, `"seq02"` are cryptic to users.
- Roxygen docs are in German while UI and code are in English.
- Variable names like `y_p`, `yEQz` are opaque.

### 2.2 Deprecated rgl API

`rgl.clear()` and `rgl.viewpoint()` are deprecated. Use `clear3d()` and `view3d()`.

### 2.3 `T` instead of `TRUE` (`egg_coords.R:133`)

`smooth = T` uses shorthand that can be overwritten. Always use `TRUE`.

### 2.4 Unnecessary `ifelse()` (`egg_coords.R:98`)

`ifelse(y == z, TRUE, FALSE)` is equivalent to `(y == z)`.

### 2.5 Hardcoded magic numbers

`#696969` appears 11 times across files. Should be a single constant.

### 2.6 Unused `...` arguments

`plot_egg()`, `Term1()`, and `Term21()` accept `...` but never use them.

---

## 3. ARCHITECTURE

### 3.1 No package structure

No `DESCRIPTION`, `NAMESPACE`, or explicit imports. Consider `{golem}` or `{rhino}` for testability and dependency management.

### 3.2 All rendering engines computed eagerly

All three outputs re-render on every parameter change, regardless of active tab.

### 3.3 No reactive caching

Egg coordinates computed inside `plot_egg()` for every call. Should be a shared `reactive()`.

### 3.4 Waiter show/hide is synchronous (`server.R:79-83`)

`w$show()` and `w$hide()` execute in the same flush cycle. The spinner likely never appears.

---

## 4. TESTING

Zero tests. No `testthat`, no CI. For a math-critical application, unit tests against known paper values are essential.

---

## 5. SECURITY & DEPLOYMENT

- Low risk profile (read-only visualization, minimal attack surface) - appropriate for its purpose.
- No `renv.lock` for dependency pinning.
- `rsconnect/` metadata committed (consider `.gitignore`).

---

## 6. DOCUMENTATION

- No README.
- Spelling errors: "aimes", "vizualise", "ist the the", "wich".
- Commented-out code and unresolved `# TODO mind + -`.
- Invalid CSS hacks (`*property`) from IE6/7 era.

---

## Summary Scorecard

| Category | Rating | Notes |
|---|---|---|
| Correctness | Needs work | Duplicate code block, wrong renderer, no validation |
| Code Quality | Fair | Readable math, cryptic naming, deprecated API |
| Architecture | Fair | Works for small app, eager rendering wastes compute |
| Testing | Missing | Zero tests for math-critical application |
| Security | Good | Minimal attack surface |
| Documentation | Needs work | No README, spelling errors, unresolved TODOs |

## Top 5 Recommended Actions

1. Fix bugs: Remove duplicate `rgl_persp` block, change `renderPrint` to `renderUI`
2. Add tests: Unit-test formula functions against known values from the paper
3. Lazy rendering: Only compute the active engine's output
4. Add `renv`: Pin dependencies for reproducible deployments
5. Clean up: Remove dead code, fix spelling, resolve TODO, use `TRUE` not `T`
