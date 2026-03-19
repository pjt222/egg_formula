/**
 * Rendering mode switching: surface, wireframe, points, info.
 * Each mode creates the appropriate Three.js objects from the egg geometry.
 */
import * as THREE from 'three';
import { createEggSurface, createEggPoints } from './egg-geometry.js';
import { clearObjects, addObject } from './scene.js';

/**
 * Render the egg in the given mode.
 *
 * @param {'surface'|'wireframe'|'points'|'info'} mode
 * @param {object} params - { L, w, B, DL4, seq01, seq02, color }
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

  const color = new THREE.Color(params.color);

  if (mode === 'surface') {
    const geometry = createEggSurface(params);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    addObject(new THREE.Mesh(geometry, material));
  }

  if (mode === 'wireframe') {
    const geometry = createEggSurface(params);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    addObject(new THREE.Mesh(geometry, material));
  }

  if (mode === 'points') {
    const geometry = createEggPoints(params);
    const material = new THREE.PointsMaterial({
      color,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    addObject(new THREE.Points(geometry, material));
  }
}
