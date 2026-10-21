import { stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED } from '../managers/state-manager.js';
import { isEffectsEnabled, pickRandom } from '../managers/targets.js';
import { SCREEN_DECAY as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'screen-decay';

let isActive = false;
let canvas = null;
let ctx = null;
let frameId = null;
let resizeTimer = null;
let lastFrame = 0;

let width = 0;
let height = 0;
let cellSize = 0;
let cols = 0;
let rows = 0;
let total = 0;
let order = [];
let pointer = 0;
let dying = [];
let carry = 0;

function _createCanvas() {
    const element = document.createElement('canvas');
    element.setAttribute('data-effect-ui', '');
    element.setAttribute('aria-hidden', 'true');
    element.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${SETTINGS.zIndex};
        opacity: 1;
        transition: opacity ${SETTINGS.fadeOutMs}ms ease;
    `;
    document.body.appendChild(element);
    return element;
}

function _removeCanvas(element) {
    if (SETTINGS.fadeOutMs > 0) {
        element.style.opacity = '0';
        setTimeout(() => element.remove(), SETTINGS.fadeOutMs);
    } else {
        element.remove();
    }
}

function _setupGrid() {
    width = window.innerWidth;
    height = window.innerHeight;
    cellSize = width < SETTINGS.mobileBelowPx ? SETTINGS.cellSizeMobile : SETTINGS.cellSizeDesktop;

    canvas.width = width;
    canvas.height = height;

    cols = Math.ceil(width / cellSize);
    rows = Math.ceil(height / cellSize);
    total = cols * rows;

    order = pickRandom(Array.from({ length: total }, (_, i) => i), total);
    pointer = 0;
    dying = [];
    carry = 0;
}

function _paintCell(index, color, alpha) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function _spawn(elapsedMs, now) {
    const intensity = stateManager.getIntensity();
    const targetCells = Math.floor(total * SETTINGS.maxCoverage * intensity / MAX_INTENSITY);
    const remaining = targetCells - pointer;
    if (remaining <= 0) return;

    const progress = Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
    const seconds = SETTINGS.secondsAtLowest + progress * (SETTINGS.secondsAtHighest - SETTINGS.secondsAtLowest);

    carry += (targetCells / seconds) * (elapsedMs / 1000);
    let count = Math.floor(carry);
    carry -= count;
    count = Math.min(count, remaining);

    for (let i = 0; i < count; i++) {
        const index = order[pointer++];
        _paintCell(index, SETTINGS.flashColor, SETTINGS.flashAlpha);
        dying.push({
            index, settleAt: now + SETTINGS.settleMinMs + Math.random() * (SETTINGS.settleMaxMs - SETTINGS.settleMinMs)
        });
    }
}

function _settle(now) {
    dying = dying.filter(cell => {
        if (now < cell.settleAt) return true;
        _paintCell(cell.index, SETTINGS.deadColor, 1);
        return false;
    });
}

function _frame(now) {
    if (!isActive) return;
    const elapsed = Math.min(100, Math.max(0, now - lastFrame));
    lastFrame = now;
    _spawn(elapsed, now);
    _settle(now);
    frameId = requestAnimationFrame(_frame);
}

function _onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!isActive) return;
        if (window.innerWidth === width && window.innerHeight === height) return;

        const fraction = pointer / total;
        _setupGrid();
        const count = Math.round(fraction * total);
        for (let i = 0; i < count; i++) {
            _paintCell(order[pointer++], SETTINGS.deadColor, 1);
        }
    }, 200);
}

function stop({ notify = false } = {}) {
    if (!isActive) return;

    cancelAnimationFrame(frameId);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', _onResize);
    frameId = null;
    resizeTimer = null;

    _removeCanvas(canvas);
    canvas = null;
    ctx = null;
    dying = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: { id: EFFECT_ID }
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    canvas = _createCanvas();
    ctx = canvas.getContext('2d');
    _setupGrid();

    isActive = true;
    lastFrame = performance.now();
    window.addEventListener('resize', _onResize);
    frameId = requestAnimationFrame(_frame);
    return true;
}

function screenDecay() {
    if (isActive) stop();
    else start();
    return isActive;
}

screenDecay.id = EFFECT_ID;
screenDecay.minIntensity = SETTINGS.minIntensity;
screenDecay.permanent = false;
screenDecay.continuous = true;
screenDecay.start = start;
screenDecay.stop = stop;
screenDecay.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({ notify: true }));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({ notify: true });
});

export { screenDecay };