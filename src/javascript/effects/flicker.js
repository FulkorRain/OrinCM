import {stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import {FLICKER as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'flicker';
const SCANLINES_CLASS = 'scanlines';
const VIGNETTE_CLASS = 'vignette';
const LIGHT = '230, 230, 230';
const DARK = '0, 0, 0';

let isActive = false;
let canvas = null;
let ctx = null;
let frameId = null;
let lastDraw = 0;
let bandY = 0;

function _progress() {
    const intensity = stateManager.getIntensity();
    return Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
}

function _lerp(from, to, amount) {
    return from + (to - from) *amount;
}

function _randomBetween(min, max) {
    return min + Math.random() * (max- min);
}

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

function _sizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function _applyClasses() {
    const intensity = stateManager.getIntensity();
    const classes = document.body.classList;
    classes.toggle(SCANLINES_CLASS, intensity >= SETTINGS.scanlinesFrom);
    classes.toggle(VIGNETTE_CLASS, intensity >= SETTINGS.vignetteFrom);
}

function _drawLines(width, height, progress) {
    const count = Math.round(_lerp(SETTINGS.linesAtLowest, SETTINGS.linesAtHighest, progress));
    const maxAlpha = _lerp(SETTINGS.alphaAtLowest, SETTINGS.alphaAtHighest, progress);

    for (let i = 0; i < count; i++) {
        const fullWidth = Math.random() < 0.4;
        const x = fullWidth ? 0 : Math.random() * width * 0.7;
        const length = fullWidth ? width : _randomBetween(width * 0.1, width * 0.5);
        const color = Math.random() < 0.6 ? LIGHT : DARK;

        ctx.fillStyle = `rgba(${color}, ${_randomBetween(0.2, 1) * maxAlpha})`;
        ctx.fillRect(x, Math.random() * height, length, _randomBetween(1, SETTINGS.maxLineHeight));
    }
}

function _drawBar(width, height, progress) {
    const chance = _lerp(SETTINGS.barChanceAtLowest, SETTINGS.barChanceAtHighest, progress);
    if (Math.random() >= chance) return;

    const maxAlpha = _lerp(SETTINGS.alphaAtLowest, SETTINGS.alphaAtHighest, progress);
    const barHeight = _randomBetween(8, SETTINGS.maxBarHeight);
    const y = Math.random() * height;

    ctx.fillStyle = `rgba(${LIGHT}, ${maxAlpha * 0.5})`;
    ctx.fillRect(0, y, width, barHeight);
    ctx.fillStyle = `rgba(${LIGHT}, ${maxAlpha})`;
    ctx.fillRect(0, y, width, 2);
}

function _drawBand(width, height, elapsed) {
    bandY += SETTINGS.bandSpeed * elapsed;
    if (bandY > height) bandY = -SETTINGS.bandHeight;

    const gradient = ctx.createLinearGradient(0, bandY, 0, bandY + SETTINGS.bandHeight);
    gradient.addColorStop(0, `rgba(${LIGHT}, 0)`);
    gradient.addColorStop(0.5, `rgba(${LIGHT}, 0.07)`);
    gradient.addColorStop(1, `rgba(${LIGHT}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bandY, width, SETTINGS.bandHeight);
}

function _drawDim(width, height) {
    if (Math.random() >= SETTINGS.dimChance) return;
    ctx.fillStyle = `rgba(${DARK}, ${Math.random() * SETTINGS.dimMax})`;
    ctx.fillRect(0, 0, width, height);
}

function _draw(elapsed) {
    const width = canvas.width;
    const height = canvas.height;
    const progress = _progress();

    ctx.clearRect(0, 0, width, height);
    _drawLines(width, height, progress);
    _drawBar(width, height, progress);
    if (stateManager.getIntensity() >= SETTINGS.bandFrom) _drawBand(width, height, elapsed);
    _drawDim(width, height);
}

function _frame(now) {
    if (!isActive) return;
    frameId = requestAnimationFrame(_frame);
    const elapsed = now - lastDraw;
    if (elapsed < SETTINGS.frameMs) return;
    lastDraw = now;
    _draw(elapsed);
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    cancelAnimationFrame(frameId);
    frameId = null;
    window.removeEventListener('resize', _sizeCanvas);

    _removeCanvas(canvas);
    canvas = null;
    ctx = null;

    document.body.classList.remove(SCANLINES_CLASS, VIGNETTE_CLASS);
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID},
        }));
    }
}

function start () {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    canvas = _createCanvas();
    ctx = canvas.getContext('2d');
    _sizeCanvas();
    window.addEventListener('resize', _sizeCanvas);

    bandY = -SETTINGS.bandHeight;
    lastDraw = performance.now();
    isActive = true;
    _applyClasses();
    frameId = requestAnimationFrame(_frame);
    return true;
}

function flicker() {
    if (isActive) stop();
    else start();
    return isActive;
}

flicker.id = EFFECT_ID;
flicker.minIntensity = SETTINGS.minIntensity;
flicker.start = start;
flicker.stop = stop;
flicker.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
    else if (isActive) _applyClasses();
});

export {flicker};