/**
 * Three.js geometry builders for the egg shape.
 * Converts math output from egg-formula.js into Three.js geometry objects.
 */
import * as THREE from 'three';
import { eggProfile, eggPointCloud } from './egg-formula.js';

/**
 * Create a LatheGeometry surface of revolution from the egg profile.
 * Direct analog of R's turn3d() used in the rgl_persp engine.
 *
 * @param {object} params - { L, w, B, DL4, seq01, seq02 }
 * @returns {THREE.LatheGeometry}
 */
export function createEggSurface(params) {
  const { L, w, B, DL4, seq01, seq02 } = params;
  const profile = eggProfile(L, w, B, DL4, seq01);
  const segments = Math.floor(360 / seq02);

  // LatheGeometry rotates around Y axis.
  // Map egg x -> Three.js Y (height), egg y -> Three.js X (radius).
  const lathePoints = profile.map(
    (p) => new THREE.Vector2(p.y, p.x)
  );

  return new THREE.LatheGeometry(lathePoints, segments);
}

/**
 * Create a BufferGeometry point cloud from the full 3D egg.
 * Analog of R's plot3d() scatter in the rgl engine.
 *
 * @param {object} params - { L, w, B, DL4, seq01, seq02 }
 * @returns {THREE.BufferGeometry}
 */
export function createEggPoints(params) {
  const { L, w, B, DL4, seq01, seq02 } = params;
  const positions = eggPointCloud(L, w, B, DL4, seq01, seq02);

  // Swap axes to match LatheGeometry orientation: egg x -> Y, egg y -> X, egg z -> Z
  const swapped = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 3) {
    swapped[i] = positions[i + 1];     // X = egg Y
    swapped[i + 1] = positions[i];     // Y = egg X
    swapped[i + 2] = positions[i + 2]; // Z = egg Z
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(swapped, 3));
  return geometry;
}
