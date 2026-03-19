/**
 * Viridis-family color palettes and vertex color utilities.
 *
 * Each palette is an array of 9 [r, g, b] control points (0–255) sampled
 * at t = 0, 0.125, 0.25, … 1.0.  Linear interpolation fills the gaps.
 */
import * as THREE from 'three';

// ── Palette Definitions ────────────────────────────────────────────
const VIRIDIS = [
  [68, 1, 84], [72, 36, 117], [65, 68, 135], [53, 95, 141],
  [42, 120, 142], [33, 145, 140], [34, 168, 132], [122, 209, 81],
  [253, 231, 37],
];

const MAGMA = [
  [0, 0, 4], [28, 16, 68], [79, 18, 123], [129, 37, 129],
  [181, 54, 122], [229, 80, 100], [251, 135, 97], [254, 194, 140],
  [252, 253, 191],
];

const PLASMA = [
  [13, 8, 135], [75, 3, 161], [125, 3, 168], [168, 34, 150],
  [203, 70, 121], [229, 107, 93], [248, 148, 65], [253, 195, 40],
  [240, 249, 33],
];

const INFERNO = [
  [0, 0, 4], [31, 12, 72], [85, 15, 109], [136, 34, 106],
  [186, 54, 85], [227, 89, 51], [249, 140, 10], [249, 201, 50],
  [252, 255, 164],
];

const CIVIDIS = [
  [0, 32, 77], [0, 55, 108], [55, 76, 116], [91, 95, 110],
  [122, 116, 117], [153, 137, 106], [184, 161, 75], [217, 189, 38],
  [253, 234, 69],
];

export const PALETTES = {
  solid: null,
  viridis: VIRIDIS,
  magma: MAGMA,
  plasma: PLASMA,
  inferno: INFERNO,
  cividis: CIVIDIS,
  iridescent: 'iridescent',
};

export const PALETTE_NAMES = Object.keys(PALETTES);

// ── Interpolation ──────────────────────────────────────────────────

/**
 * Sample a palette at parameter t ∈ [0, 1].
 * Returns { r, g, b } in [0, 1] range for Three.js Color.
 */
export function samplePalette(palette, t) {
  const clamped = Math.max(0, Math.min(1, t));
  const n = palette.length - 1;
  const idx = clamped * n;
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, n);
  const frac = idx - lo;

  const a = palette[lo];
  const b = palette[hi];
  return {
    r: (a[0] + (b[0] - a[0]) * frac) / 255,
    g: (a[1] + (b[1] - a[1]) * frac) / 255,
    b: (a[2] + (b[2] - a[2]) * frac) / 255,
  };
}

// ── Vertex Color Application ───────────────────────────────────────

/**
 * Apply a color palette to a geometry's vertices based on Y position
 * (longitudinal egg axis). Adds a 'color' buffer attribute.
 *
 * @param {THREE.BufferGeometry} geometry
 * @param {number[][]} palette  - One of the palette arrays
 */
export function applyVertexColors(geometry, palette, inverted = false) {
  const position = geometry.getAttribute('position');
  const count = position.count;
  const colors = new Float32Array(count * 3);

  // Find Y extent for normalization
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = position.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const rangeY = maxY - minY || 1;

  for (let i = 0; i < count; i++) {
    let t = (position.getY(i) - minY) / rangeY;
    if (inverted) t = 1 - t;
    const c = samplePalette(palette, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}
