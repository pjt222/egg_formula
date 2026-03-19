# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**eggplotr** is a static Vite + Three.js site that visualizes the universal egg shape formula from the paper "Egg and math: introducing a universal formula for egg shape" by Narushin, Romanov & Griffin ([DOI](https://doi.org/10.1111/nyas.14680)). Users adjust egg parameters via sliders and see 3D renderings through multiple visualization modes.

Deployed at: https://pjt222.github.io/egg_formula/

## Running Locally

```bash
npm install
npm run dev      # Development server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm test         # Run Vitest math tests
```

## Architecture

Static Vite + Three.js single-page app. No R dependency in the build. Cyberpunk design system shared with sibling projects (agent-almanac/viz, multiplex, triple-pendulum).

### Source Files

| File | Role |
|------|------|
| `index.html` | App shell (Vite entry point) |
| `js/app.js` | Entry: init scene, wire controls, mode switching |
| `js/egg-formula.js` | Pure math — port of the Narushin formula from R |
| `js/egg-geometry.js` | Three.js geometry builders (LatheGeometry, Points) |
| `js/scene.js` | Renderer, camera, OrbitControls, lights, resize |
| `js/engines.js` | Mode switching: surface, wireframe, points, info |
| `css/style.css` | Cyberpunk design tokens + component styles |
| `tests/egg-formula.test.js` | Vitest: math accuracy tests |

### Rendering Modes

| Mode | Three.js Implementation | Replaces (Shiny) |
|------|------------------------|-------------------|
| Surface | `LatheGeometry` + `MeshStandardMaterial` | `rgl_persp` (turn3d) |
| Wireframe | `LatheGeometry` + wireframe material | `threejs` scatter |
| Points | `BufferGeometry` + `PointsMaterial` | `rgl` scatter |
| Info | HTML overlay with KaTeX formula | `b.r.a.i.n.` |

### Data Flow

1. `eggProfile()` generates 2D cross-section: `y(x) = Term1(x) * (1 - Term21 * Term22(x))`
2. `createEggSurface()` feeds profile into `THREE.LatheGeometry` (surface of revolution)
3. `createEggPoints()` rotates profile into 3D point cloud via `eggPointCloud()`
4. `renderEgg()` dispatches to the active mode, creating appropriate Three.js objects

### Parameters (from the paper)

- **L** — egg length (1–20, default 8)
- **w** — maximum egg width (1–20, default 7)
- **B** — distance between max-width position and half-length (1–10, default 3.5)
- **DL4** — diameter at 1/4 length from pointed end (1–10, default 5)
- **seq01** — x-axis resolution, fraction of L (0.01–0.2, default 0.05)
- **seq02** — angular step in degrees (1–15, default 2)

### Design System

Cyberpunk aesthetic shared with sibling projects:
- Background: `#0a0a0f`
- Accent: `#00f0ff` (cyan)
- Fonts: Orbitron (display), Share Tech Mono (body)
- CRT scanline overlay
- Glassmorphic panels with backdrop blur

## Deployment

GitHub Pages via Actions. Workflow at `.github/workflows/deploy-pages.yml` builds on push to main and deploys `dist/` using Pages artifact upload.

GitHub Settings → Pages → Source: "GitHub Actions"

## Archive

The original R Shiny app is preserved at `archive/shiny/eggplotr/` for reference.

## Style Notes

- Default egg color: `#e67e22` (orange)
- 100ms debounce on slider input to prevent excessive geometry rebuilds
- OrbitControls with damping for smooth camera interaction
