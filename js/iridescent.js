/**
 * Mother-of-pearl iridescent effect using Three.js MeshPhysicalMaterial.
 *
 * Creates a lightweight thin-film iridescence inspired by nacre / soap bubbles,
 * using a procedural noise texture for spatial thickness variation and per-frame
 * animation for flowing color shifts.
 */
import * as THREE from 'three';

// ── Animation Constants ──────────────────────────────────────────────
const SCROLL_SPEED_X = 0.008;
const SCROLL_SPEED_Y = 0.005;
const OSCILLATION_SPEED = 0.6;
const OSCILLATION_AMPLITUDE = 120;
const THICKNESS_CENTER = 400;
const THICKNESS_MIN = 200;
const THICKNESS_MAX = 600;

// ── Noise Texture ────────────────────────────────────────────────────

let cachedNoiseTexture = null;

/**
 * Create a seamless 2D value-noise texture via Canvas2D.
 * Cached as a singleton — only one noise map is needed.
 * @param {number} size - Texture resolution (default 256)
 * @returns {THREE.CanvasTexture}
 */
function createNoiseTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  // Multi-octave value noise for organic variation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxAmplitude = 0;

      for (let octave = 0; octave < 4; octave++) {
        const sampleX = (x * frequency) / size;
        const sampleY = (y * frequency) / size;
        // Simple pseudo-random based on position for repeatable noise
        const noise = Math.abs(Math.sin(sampleX * 12.9898 + sampleY * 78.233) * 43758.5453 % 1);
        value += noise * amplitude;
        maxAmplitude += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      const normalized = Math.floor((value / maxAmplitude) * 255);
      data[idx] = normalized;
      data[idx + 1] = normalized;
      data[idx + 2] = normalized;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Get the singleton noise texture (lazy-initialized).
 * @returns {THREE.CanvasTexture}
 */
export function getIridescentTexture() {
  if (!cachedNoiseTexture) {
    cachedNoiseTexture = createNoiseTexture();
  }
  return cachedNoiseTexture;
}

// ── Iridescent Material Factory ──────────────────────────────────────

/**
 * Create a MeshPhysicalMaterial with nacre-like iridescence.
 *
 * @param {THREE.Texture} thicknessMap - Noise texture for spatial variation
 * @param {object} [options]
 * @param {boolean} [options.wireframe=false]
 * @returns {THREE.MeshPhysicalMaterial}
 */
export function createIridescentMaterial(thicknessMap, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf8f0e8,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [THICKNESS_MIN, THICKNESS_MAX],
    iridescenceThicknessMap: thicknessMap,
    side: THREE.DoubleSide,
    wireframe: options.wireframe || false,
  });
}

// ── Points Fallback (HSL Rainbow) ────────────────────────────────────

/**
 * Apply a rainbow HSL hue sweep to a point-cloud geometry's vertices
 * based on Y position. Fallback for Points mode (no iridescence on PointsMaterial).
 *
 * @param {THREE.BufferGeometry} geometry
 */
export function applyRainbowColors(geometry) {
  const position = geometry.getAttribute('position');
  const count = position.count;
  const colors = new Float32Array(count * 3);

  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = position.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const rangeY = maxY - minY || 1;

  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const t = (position.getY(i) - minY) / rangeY;
    color.setHSL(t * 0.85, 0.7, 0.6); // sweep hue 0–306° (red → violet)
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// ── Per-Frame Animation ──────────────────────────────────────────────

/**
 * Update iridescent materials in the egg group each frame.
 * Scrolls the thickness map and oscillates the thickness range.
 * Short-circuits immediately when no iridescent material is found.
 *
 * @param {THREE.Group} eggGroup
 * @param {number} elapsedTime - seconds from THREE.Clock
 */
export function updateIridescentMaterials(eggGroup, elapsedTime) {
  if (!eggGroup) return;

  eggGroup.traverse((child) => {
    if (!child.isMesh) return;
    const material = child.material;
    if (!material || material.iridescence === undefined || material.iridescence <= 0) return;

    // Scroll thickness map for flowing color
    if (material.iridescenceThicknessMap) {
      material.iridescenceThicknessMap.offset.x += SCROLL_SPEED_X * 0.016; // ~60fps
      material.iridescenceThicknessMap.offset.y += SCROLL_SPEED_Y * 0.016;
    }

    // Oscillate thickness range for global hue shift
    const oscillation = Math.sin(elapsedTime * OSCILLATION_SPEED) * OSCILLATION_AMPLITUDE;
    const thicknessLow = Math.max(100, THICKNESS_CENTER - 200 + oscillation * 0.5);
    const thicknessHigh = Math.min(800, THICKNESS_CENTER + 200 + oscillation);
    material.iridescenceThicknessRange = [thicknessLow, thicknessHigh];
  });
}
