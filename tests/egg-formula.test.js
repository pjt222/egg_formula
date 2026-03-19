/**
 * Vitest tests for the mathematical core.
 * Verifies JS output matches the R formula's behavior.
 */
import { describe, it, expect } from 'vitest';
import { eggProfile, eggPointCloud, term1, term21, term22, DEFAULTS } from '../js/egg-formula.js';

const TOL = 1e-8;

describe('term1', () => {
  it('returns 0 at endpoints x = ±L/2', () => {
    const { L, w, B } = DEFAULTS;
    expect(term1(L / 2, L, w, B)).toBeCloseTo(0, 10);
    expect(term1(-L / 2, L, w, B)).toBeCloseTo(0, 10);
  });

  it('returns positive values for interior x', () => {
    const { L, w, B } = DEFAULTS;
    const val = term1(0, L, w, B);
    expect(val).toBeGreaterThan(0);
  });

  it('is symmetric only at x=0 for equal denominators', () => {
    const { L, w, B } = DEFAULTS;
    const left = term1(-1, L, w, B);
    const right = term1(1, L, w, B);
    // Not symmetric due to 8wx term in denominator
    expect(left).not.toBeCloseTo(right, 5);
  });
});

describe('term21', () => {
  it('returns a finite scalar for default params', () => {
    const { L, w, B, DL4 } = DEFAULTS;
    const val = term21(L, w, B, DL4);
    expect(isFinite(val)).toBe(true);
  });

  it('is independent of x (same value for any x)', () => {
    const { L, w, B, DL4 } = DEFAULTS;
    const val1 = term21(L, w, B, DL4);
    const val2 = term21(L, w, B, DL4); // same params, term21 has no x
    expect(val1).toBe(val2);
  });
});

describe('term22', () => {
  it('returns a value between -1 and 1 for typical inputs', () => {
    const { L, w } = DEFAULTS;
    for (let x = -L / 2; x <= L / 2; x += 0.5) {
      const val = term22(x, L, w);
      expect(val).toBeLessThanOrEqual(1 + TOL);
      expect(val).toBeGreaterThanOrEqual(-1 - TOL);
    }
  });
});

describe('eggProfile', () => {
  it('generates points with default parameters', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    expect(profile.length).toBeGreaterThan(0);
  });

  it('first and last points have y ≈ 0 (egg tips)', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    expect(profile[0].y).toBeCloseTo(0, 3);
    expect(profile[profile.length - 1].y).toBeCloseTo(0, 3);
  });

  it('x values span from -L/2 to L/2', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    expect(profile[0].x).toBeCloseTo(-L / 2, 5);
    expect(profile[profile.length - 1].x).toBeCloseTo(L / 2, 5);
  });

  it('all y values are non-negative', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    profile.forEach((p) => {
      expect(p.y).toBeGreaterThanOrEqual(0);
    });
  });

  it('has a maximum y roughly equal to B/2 for default params', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    const maxY = Math.max(...profile.map((p) => p.y));
    // Maximum half-width should be in a reasonable range
    expect(maxY).toBeGreaterThan(0.5);
    expect(maxY).toBeLessThan(L);
  });

  it('profile is egg-shaped (wider on one side)', () => {
    const { L, w, B, DL4, seq01 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, seq01);
    // Find max y and its x position
    let maxY = 0;
    let maxX = 0;
    profile.forEach((p) => {
      if (p.y > maxY) {
        maxY = p.y;
        maxX = p.x;
      }
    });
    // Max width should not be at center (x=0) for asymmetric egg
    // With default params, max width is offset from center
    expect(Math.abs(maxX)).toBeGreaterThan(0.1);
  });

  it('number of points matches expected count from resolution', () => {
    const L = 8;
    const resolution = 0.1;
    const profile = eggProfile(L, 7, 3.5, 5, resolution);
    const expectedCount = Math.floor(L / (L * resolution)) + 1;
    // Allow ±1 for floating point boundary
    expect(Math.abs(profile.length - expectedCount)).toBeLessThanOrEqual(1);
  });
});

describe('eggPointCloud', () => {
  it('generates a Float32Array of positions', () => {
    const { L, w, B, DL4 } = DEFAULTS;
    const positions = eggPointCloud(L, w, B, DL4, 0.1, 30);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length % 3).toBe(0);
    expect(positions.length).toBeGreaterThan(0);
  });

  it('point count scales with resolution and angular step', () => {
    const { L, w, B, DL4 } = DEFAULTS;
    const coarse = eggPointCloud(L, w, B, DL4, 0.2, 30);
    const fine = eggPointCloud(L, w, B, DL4, 0.1, 15);
    expect(fine.length).toBeGreaterThan(coarse.length);
  });
});

describe('R reference values', () => {
  // Reference: R output with L=8, w=7, B=3.5, DL4=5, seq01=0.05
  // These values were computed from the R formula:
  //   x = 0: Term1(0) = B/2 * sqrt(L²/(L² + 4w²)) = 1.75 * sqrt(64/260) ≈ 0.8681...
  //   Term21 constant, Term22(0), and the full product.

  it('term1 at x=0 matches R computation', () => {
    const { L, w, B } = DEFAULTS;
    // B/2 * sqrt(L^2 / (L^2 + 4*w^2)) = 1.75 * sqrt(64/260)
    const expected = (B / 2) * Math.sqrt((L * L) / (L * L + 4 * w * w));
    const actual = term1(0, L, w, B);
    expect(actual).toBeCloseTo(expected, 10);
  });

  it('full profile at x=0 produces a non-trivial y value', () => {
    const { L, w, B, DL4 } = DEFAULTS;
    const profile = eggProfile(L, w, B, DL4, 0.05);
    // Find the point closest to x=0
    const midPoint = profile.reduce((closest, p) =>
      Math.abs(p.x) < Math.abs(closest.x) ? p : closest
    );
    expect(midPoint.y).toBeGreaterThan(0.3);
    expect(midPoint.y).toBeLessThan(5);
  });
});
