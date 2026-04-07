/**
 * Vitest tests for the data export module.
 */
import { describe, it, expect } from 'vitest';
import { buildExportData } from '../js/export.js';
import { DEFAULTS } from '../js/egg-formula.js';

const TEST_PARAMS = {
  ...DEFAULTS,
  palette: 'solid',
  inverted: false,
  roughness: 0.4,
};

describe('buildExportData', () => {
  it('returns metadata with correct schema', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');

    expect(data.metadata).toBeDefined();
    expect(data.metadata.doi).toBe('10.1111/nyas.14680');
    expect(data.metadata.formula).toContain('Narushin');
    expect(data.metadata.formula).toContain('2021');
    expect(data.metadata.mode).toBe('surface');
    expect(data.metadata.exportedAt).toBeTruthy();
  });

  it('includes all egg parameters', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');
    const { parameters } = data.metadata;

    expect(parameters.L).toBe(DEFAULTS.L);
    expect(parameters.w).toBe(DEFAULTS.w);
    expect(parameters.B).toBe(DEFAULTS.B);
    expect(parameters.DL4).toBe(DEFAULTS.DL4);
    expect(parameters.seq01).toBe(DEFAULTS.seq01);
    expect(parameters.seq02).toBe(DEFAULTS.seq02);
  });

  it('includes appearance settings', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');
    const { appearance } = data.metadata;

    expect(appearance.color).toBe(DEFAULTS.color);
    expect(appearance.palette).toBe('solid');
    expect(appearance.inverted).toBe(false);
    expect(appearance.roughness).toBe(0.4);
  });

  it('generates mesh data with consistent counts', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');
    const { mesh } = data;

    expect(mesh.profile.length).toBe(mesh.profilePointCount);
    expect(mesh.vertices.length).toBe(mesh.vertexCount);
    expect(mesh.profilePointCount).toBeGreaterThan(0);
    expect(mesh.vertexCount).toBeGreaterThan(0);
  });

  it('profile points have x and y properties', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');

    data.mesh.profile.forEach((p) => {
      expect(typeof p.x).toBe('number');
      expect(typeof p.y).toBe('number');
    });
  });

  it('vertices are [x, y, z] triplets', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');

    data.mesh.vertices.forEach((v) => {
      expect(v).toHaveLength(3);
      v.forEach((coord) => expect(typeof coord).toBe('number'));
    });
  });

  it('vertex count matches profile points * angular steps', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');
    const angularSteps = Math.floor(360 / DEFAULTS.seq02);
    const expectedVertices = data.mesh.profilePointCount * angularSteps;

    expect(data.mesh.vertexCount).toBe(expectedVertices);
  });

  it('is JSON-serializable', () => {
    const data = buildExportData(TEST_PARAMS, 'surface');
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);

    expect(parsed.metadata.doi).toBe(data.metadata.doi);
    expect(parsed.mesh.vertexCount).toBe(data.mesh.vertexCount);
  });
});
