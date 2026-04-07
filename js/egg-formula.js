/**
 * Mathematical core — port of the Narushin et al. (2021) universal egg shape formula.
 * Source: archive/shiny/eggplotr/R/egg_coords.R
 *
 * @see https://doi.org/10.1111/nyas.14680
 */

/**
 * Term1: egg half-width as a function of x.
 *   (B/2) * sqrt((L² - 4x²) / (L² + 8wx + 4w²))
 */
function term1(x, L, w, B) {
  const numerator = L * L - 4 * x * x;
  const denominator = L * L + 8 * w * x + 4 * w * w;
  return (B / 2) * Math.sqrt(Math.max(0, numerator / denominator));
}

/**
 * Term21: asymmetry constant (independent of x, compute once per parameter set).
 *   [sqrt(5.5L² + 11Lw + 4w²) * (sqrt(3)*B*L - 2*DL4*sqrt(L² + 2wL + 4w²))]
 *   / [sqrt(3)*B*L * (sqrt(5.5L² + 11Lw + 4w²) - 2*sqrt(L² + 2wL + 4w²))]
 */
function term21(L, w, B, DL4) {
  const a = Math.sqrt(5.5 * L * L + 11 * L * w + 4 * w * w);
  const b = Math.sqrt(L * L + 2 * w * L + 4 * w * w);
  const numerator = a * (Math.sqrt(3) * B * L - 2 * DL4 * b);
  const denominator = Math.sqrt(3) * B * L * (a - 2 * b);
  if (Math.abs(denominator) < 1e-15) return 0;
  return numerator / denominator;
}

/**
 * Term22: asymmetry function of x.
 *   1 - sqrt( [L*(L² + 8wx + 4w²)] / [2(L-2w)x² + (L²+8Lw-4w²)x + 2Lw²+L²w+L³] )
 */
function term22(x, L, w) {
  const numerator = L * (L * L + 8 * w * x + 4 * w * w);
  const denominator =
    2 * (L - 2 * w) * x * x +
    (L * L + 8 * L * w - 4 * w * w) * x +
    2 * L * w * w +
    L * L * w +
    L * L * L;
  if (Math.abs(denominator) < 1e-15) return 0;
  const ratio = numerator / denominator;
  return 1 - Math.sqrt(Math.max(0, ratio));
}

/**
 * Compute the 2D egg cross-section profile.
 *
 * @param {number} L        - Egg length
 * @param {number} w        - Maximum egg width
 * @param {number} B        - Distance between max-width position and half-length
 * @param {number} DL4      - Diameter at 1/4 length from pointed end
 * @param {number} resolution - Step size as fraction of L (default 0.05)
 * @returns {{x: number, y: number}[]} Array of profile points (y >= 0)
 */
export function eggProfile(L, w, B, DL4, resolution = 0.05) {
  const points = [];
  const step = L * resolution;
  const t21 = term21(L, w, B, DL4);

  for (let x = -L / 2; x <= L / 2 + 1e-10; x += step) {
    const clampedX = Math.min(x, L / 2);
    const t1 = term1(clampedX, L, w, B);
    const t22 = term22(clampedX, L, w);
    const t2 = 1 - t21 * t22;
    const y = t1 * t2;
    points.push({ x: clampedX, y: isNaN(y) || y < 0 ? 0 : y });
  }

  return points;
}

/**
 * Generate 3D point cloud by rotating the 2D profile around the x-axis.
 *
 * @param {number} L
 * @param {number} w
 * @param {number} B
 * @param {number} DL4
 * @param {number} resolution  - x-axis step as fraction of L
 * @param {number} angularStep - angular step in degrees
 * @returns {Float32Array} Flat array of [x,y,z, x,y,z, ...] positions
 */
export function eggPointCloud(L, w, B, DL4, resolution = 0.05, angularStep = 2) {
  const profile = eggProfile(L, w, B, DL4, resolution);
  const angleSteps = Math.floor(360 / angularStep);
  const positions = new Float32Array(profile.length * angleSteps * 3);
  let index = 0;

  for (let i = 0; i < profile.length; i++) {
    const { x, y: radius } = profile[i];
    for (let j = 0; j < angleSteps; j++) {
      const theta = (j * angularStep * Math.PI) / 180;
      positions[index++] = x;
      positions[index++] = radius * Math.cos(theta);
      positions[index++] = radius * Math.sin(theta);
    }
  }

  return positions.subarray(0, index);
}

/** Default parameter values matching the original Shiny UI */
export const DEFAULTS = {
  L: 8,
  w: 7,
  B: 3.5,
  DL4: 5,
  seq01: 0.05,
  seq02: 2,
  color: '#e67e22',
};

// Expose internals for testing
export { term1, term21, term22 };
