/**
 * Application entry point — initializes scene, wires controls, handles mode switching.
 */
import {
  initScene,
  setAutoRotate,
  getAutoRotate,
  setKeyLightIntensity,
  setKeyLightPosition,
  setFillLightIntensity,
  setAmbientLightIntensity,
} from './scene.js';
import { renderEgg } from './engines.js';
import { DEFAULTS } from './egg-formula.js';

// ── State ───────────────────────────────────────────────────────────
let currentMode = 'surface';
let params = { ...DEFAULTS, palette: 'solid', inverted: false, roughness: 0.4 };
let debounceTimer = null;

// ── DOM References ──────────────────────────────────────────────────
const viewport = document.getElementById('viewport');
const infoOverlay = document.getElementById('info-overlay');
const loading = document.getElementById('loading');
const modeButtons = document.querySelectorAll('[data-mode]');

// ── Initialize Three.js ─────────────────────────────────────────────
initScene(viewport);

// ── Initial Render ──────────────────────────────────────────────────
renderEgg(currentMode, params, { viewport, infoOverlay });
loading.classList.add('hidden');

// ── Mode Switching ──────────────────────────────────────────────────
modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    if (mode === currentMode) return;

    currentMode = mode;
    modeButtons.forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === mode);
      b.setAttribute('aria-selected', b.dataset.mode === mode);
    });

    renderEgg(currentMode, params, { viewport, infoOverlay });
  });
});

// ── Slider Controls ─────────────────────────────────────────────────
function onParamChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderEgg(currentMode, params, { viewport, infoOverlay });
  }, 100);
}

document.querySelectorAll('.param-slider').forEach((slider) => {
  const key = slider.dataset.param;
  const valueDisplay = document.getElementById(`val-${key}`);

  slider.addEventListener('input', () => {
    params[key] = parseFloat(slider.value);
    if (valueDisplay) valueDisplay.textContent = slider.value;
    onParamChange();
  });
});

// ── Color Picker ────────────────────────────────────────────────────
const colorInput = document.getElementById('egg-color');
const colorGroup = document.getElementById('color-group');
if (colorInput) {
  colorInput.addEventListener('input', () => {
    params.color = colorInput.value;
    onParamChange();
  });
}

// ── Palette Selector ────────────────────────────────────────────────
const paletteSelect = document.getElementById('palette-select');
const invertBtn = document.getElementById('btn-invert-palette');

/** Update visibility of color picker and invert button based on palette. */
function updatePaletteControls() {
  const isIridescent = params.palette === 'iridescent';
  const isSolid = params.palette === 'solid';

  // Hide color picker when using a gradient palette or iridescent
  if (colorGroup) {
    colorGroup.style.display = isSolid ? '' : 'none';
  }
  // Hide invert button for solid and iridescent (no palette to invert)
  if (invertBtn) {
    invertBtn.style.display = (isSolid || isIridescent) ? 'none' : '';
  }
}

if (paletteSelect) {
  paletteSelect.addEventListener('change', () => {
    params.palette = paletteSelect.value;
    // Reset inversion when switching palettes
    params.inverted = false;
    if (invertBtn) {
      invertBtn.classList.remove('active');
      invertBtn.setAttribute('aria-pressed', 'false');
    }
    updatePaletteControls();
    onParamChange();
  });
}

// ── Palette Inversion Toggle ─────────────────────────────────────────
if (invertBtn) {
  invertBtn.addEventListener('click', () => {
    params.inverted = !params.inverted;
    invertBtn.classList.toggle('active', params.inverted);
    invertBtn.setAttribute('aria-pressed', params.inverted);
    onParamChange();
  });
}

// Initial control visibility
updatePaletteControls();

// ── Auto-Rotate Toggle ──────────────────────────────────────────────
const autoRotateBtn = document.getElementById('btn-auto-rotate');
if (autoRotateBtn) {
  autoRotateBtn.addEventListener('click', () => {
    const next = !getAutoRotate();
    setAutoRotate(next);
    autoRotateBtn.classList.toggle('active', next);
    autoRotateBtn.setAttribute('aria-pressed', next);
  });
}

// ── Panel Toggle (mobile) ───────────────────────────────────────────
const panelToggle = document.getElementById('panel-toggle');
const controlPanel = document.getElementById('control-panel');
if (panelToggle && controlPanel) {
  panelToggle.addEventListener('click', () => {
    controlPanel.classList.toggle('collapsed');
    panelToggle.classList.toggle('collapsed');
    const isCollapsed = controlPanel.classList.contains('collapsed');
    panelToggle.setAttribute('aria-expanded', !isCollapsed);
  });
}

// ── Lighting Controls ────────────────────────────────────────────────
let keyAzimuth = 45;
let keyElevation = 47;

const lightHandlers = {
  'key-intensity': (value) => setKeyLightIntensity(value),
  'key-azimuth': (value) => { keyAzimuth = value; setKeyLightPosition(keyAzimuth, keyElevation); },
  'key-elevation': (value) => { keyElevation = value; setKeyLightPosition(keyAzimuth, keyElevation); },
  'fill-intensity': (value) => setFillLightIntensity(value),
  'ambient-intensity': (value) => setAmbientLightIntensity(value),
};

document.querySelectorAll('.light-slider').forEach((slider) => {
  const key = slider.dataset.light;
  const valueDisplay = document.getElementById(`val-${key}`);
  const handler = lightHandlers[key];

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    if (valueDisplay) valueDisplay.textContent = slider.value;
    if (handler) handler(value);
  });
});

// ── Keyboard Navigation ─────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  const modes = ['surface', 'wireframe', 'points', 'info'];
  const currentIndex = modes.indexOf(currentMode);

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % modes.length;
    document.querySelector(`[data-mode="${modes[nextIndex]}"]`).click();
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
    document.querySelector(`[data-mode="${modes[prevIndex]}"]`).click();
  }
  if (e.key === 'r' || e.key === 'R') {
    autoRotateBtn?.click();
  }
  if (e.key === 'i' || e.key === 'I') {
    invertBtn?.click();
  }
});
