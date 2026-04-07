/**
 * Data export — builds JSON with egg metadata and mesh data, triggers download.
 */
import { eggProfile, eggPointCloud } from './egg-formula.js';

/**
 * Build export payload with metadata and mesh data for the current parameters.
 *
 * @param {object} params - { L, w, B, DL4, seq01, seq02, color, palette, ... }
 * @param {string} mode   - Current rendering mode
 * @returns {object} JSON-serializable export object
 */
export function buildExportData(params, mode) {
  const { L, w, B, DL4, seq01, seq02 } = params;

  // 2D profile
  const profile = eggProfile(L, w, B, DL4, seq01);

  // 3D point cloud (flat Float32Array → array of [x, y, z])
  const raw = eggPointCloud(L, w, B, DL4, seq01, seq02);
  const vertices = [];
  for (let i = 0; i < raw.length; i += 3) {
    vertices.push([raw[i], raw[i + 1], raw[i + 2]]);
  }

  return {
    metadata: {
      formula: 'Narushin et al. (2021) — Universal egg shape formula',
      doi: '10.1111/nyas.14680',
      exportedAt: new Date().toISOString(),
      mode,
      parameters: { L, w, B, DL4, seq01, seq02 },
      appearance: {
        color: params.color,
        palette: params.palette,
        inverted: params.inverted,
        roughness: params.roughness,
      },
    },
    mesh: {
      profile: profile.map((p) => ({ x: p.x, y: p.y })),
      vertices,
      vertexCount: vertices.length,
      profilePointCount: profile.length,
    },
  };
}

/**
 * Export egg data as a JSON file download.
 *
 * @param {object} params - Current egg parameters
 * @param {string} mode   - Current rendering mode
 */
export function exportJSON(params, mode) {
  const data = buildExportData(params, mode);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `eggplotr-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 0);
}
