/**
 * Rendering mode switching: surface, wireframe, points, info.
 * Each mode creates the appropriate Three.js objects from the egg geometry.
 * Supports solid color or viridis-family palette vertex coloring.
 */
import * as THREE from 'three';
import { createEggSurface, createEggPoints } from './egg-geometry.js';
import { clearObjects, addObject } from './scene.js';
import { PALETTES, applyVertexColors } from './palettes.js';

/**
 * Render the egg in the given mode.
 *
 * @param {'surface'|'wireframe'|'points'|'info'} mode
 * @param {object} params   - { L, w, B, DL4, seq01, seq02, color, palette }
 * @param {object} elements - { viewport, infoOverlay }
 */
export function renderEgg(mode, params, elements) {
  const { viewport, infoOverlay } = elements;

  // Toggle info overlay visibility
  if (mode === 'info') {
    infoOverlay.classList.remove('hidden');
    viewport.style.opacity = '0.15';
    return;
  }

  infoOverlay.classList.add('hidden');
  viewport.style.opacity = '1';

  clearObjects();

  const palette = PALETTES[params.palette];
  const usePalette = palette != null;
  const color = new THREE.Color(params.color);

  if (mode === 'surface') {
    const geometry = createEggSurface(params);
    if (usePalette) applyVertexColors(geometry, palette);
    const material = new THREE.MeshStandardMaterial({
      color: usePalette ? 0xffffff : color,
      vertexColors: usePalette,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    addObject(new THREE.Mesh(geometry, material));
  }

  if (mode === 'wireframe') {
    const geometry = createEggSurface(params);
    if (usePalette) applyVertexColors(geometry, palette);
    const material = new THREE.MeshBasicMaterial({
      color: usePalette ? 0xffffff : color,
      vertexColors: usePalette,
      wireframe: true,
      transparent: !usePalette,
      opacity: usePalette ? 1.0 : 0.6,
    });
    addObject(new THREE.Mesh(geometry, material));
  }

  if (mode === 'points') {
    const geometry = createEggPoints(params);
    if (usePalette) applyVertexColors(geometry, palette);
    const material = new THREE.PointsMaterial({
      color: usePalette ? 0xffffff : color,
      vertexColors: usePalette,
      size: 0.08,
      transparent: !usePalette,
      opacity: usePalette ? 1.0 : 0.7,
      sizeAttenuation: true,
    });
    addObject(new THREE.Points(geometry, material));
  }
}
