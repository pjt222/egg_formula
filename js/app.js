/**
 * Application entry point — initializes scene, wires controls, handles mode switching.
 */
import { initScene, setAutoRotate, getAutoRotate } from './scene.js';
import { renderEgg } from './engines.js';
import { DEFAULTS } from './egg-formula.js';

// ── State ───────────────────────────────────────────────────────────
let currentMode = 'surface';
let params = { ...DEFAULTS, palette: 'solid' };
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
if (paletteSelect) {
  paletteSelect.addEventListener('change', () => {
    params.palette = paletteSelect.value;
    // Hide color picker when using a gradient palette
    if (colorGroup) {
      colorGroup.style.display = params.palette === 'solid' ? '' : 'none';
    }
    onParamChange();
  });
}

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
});
