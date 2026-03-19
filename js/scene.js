/**
 * Three.js scene setup — renderer, camera, OrbitControls, lights, animation loop, resize.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer, scene, camera, controls;
let animationId = null;

/**
 * Initialize the Three.js scene inside the given container element.
 * @param {HTMLElement} container
 * @returns {{ scene, camera, renderer, controls }}
 */
export function initScene(container) {
  scene = new THREE.Scene();
  const bgColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-primary').trim() || '#0a0a0f';
  scene.background = new THREE.Color(bgColor);

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(12, 8, 12);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 100;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404060, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 15, 10);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.3);
  fillLight.position.set(-10, -5, -10);
  scene.add(fillLight);

  // Resize handler
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return { scene, camera, renderer, controls };
}

/**
 * Remove all meshes/points from the scene (preserving lights and camera).
 */
export function clearObjects() {
  if (!scene) return;
  const toRemove = [];
  scene.traverse((child) => {
    if (child.isMesh || child.isPoints) {
      toRemove.push(child);
    }
  });
  toRemove.forEach((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
    scene.remove(obj);
  });
}

/**
 * Add an Object3D to the scene.
 * @param {THREE.Object3D} object
 */
export function addObject(object) {
  if (scene) scene.add(object);
}

export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }
export function getControls() { return controls; }
