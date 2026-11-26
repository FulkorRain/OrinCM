import { stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED } from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { SCREEN_SHAKE as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'screen-shake';
const SVG_NS = 'http://www.w3.org/2000/svg';
const FILTER_ID = 'screen-shake-ghosts';

let isActive = false;
let shakeElement = null;
let stepTimer = null;
let filterSvg = null;
let offsetNodes = [];
let history = [];
let current = { x: 0, y: 0 };
let previousTransform = '';
let previousFilter = '';

function _progress() {
    const intensity = stateManager.getIntensity();
    return Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
}

function _findTarget() {
    for (const selector of SETTINGS.targets) {
        const element = document.querySelector(selector);
        if (element) return element;
    }
    return null;
}

function _getAmplitude() {
    return SETTINGS.amplitudeAtLowest + _progress() * (SETTINGS.amplitudeAtHighest - SETTINGS.amplitudeAtLowest);
}

function _svgNode(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
}

function _buildFilter() {
    const filter = _svgNode('filter', { id: FILTER_ID, x: 0, y: 0, width: 1, height: 1 });
    const merge = _svgNode('feMerge');
    offsetNodes = [];

    for (let i = 0; i < SETTINGS.ghostCount; i++) {
        const offset = _svgNode('feOffset', { in: 'SourceGraphic', dx: 0, dy: 0, result: `offset${i}` });
        const fade = _svgNode('feComponentTransfer', { in: `offset${i}`, result: `ghost${i}` });
        fade.appendChild(_svgNode('feFuncA', { type: 'linear', slope: SETTINGS.ghostOpacity * (1 - i / SETTINGS.ghostCount) }));
        filter.append(offset, fade);
        offsetNodes.push(offset);
    }

    merge.appendChild(_svgNode('feMergeNode', { in: 'SourceGraphic' }));
    for (let i = SETTINGS.ghostCount - 1; i >= 0; i--) {
        merge.appendChild(_svgNode('feMergeNode', { in: `ghost${i}` }));
    }
    filter.appendChild(merge);

    filterSvg = _svgNode('svg', { width: 0, height: 0, 'aria-hidden': 'true', 'data-effect-ui': '' });
    filterSvg.style.position = 'absolute';
    filterSvg.appendChild(filter);
    document.body.appendChild(filterSvg);
}

function _step() {
    const amplitude = _getAmplitude();
    const next = {
        x: (Math.random() * 2 - 1) * amplitude,
        y: (Math.random() * 2 - 1) * amplitude,
    };

    history.unshift(current);
    history.length = SETTINGS.ghostCount;
    current = next;

    shakeElement.style.transform = `translate(${next.x}px, ${next.y}px)`;

    offsetNodes.forEach((node, i) => {
        node.setAttribute('dx', (history[i].x - next.x) * SETTINGS.ghostSpread);
        node.setAttribute('dy', (history[i].y - next.y) * SETTINGS.ghostSpread);
    })
}

function stop({notify = false} = {}) {
    if (!isActive) return;
    clearInterval(stepTimer);
    stepTimer = null;
    
    shakeElement.style.transform = previousTransform;
    shakeElement.style.filter = previousFilter;
    shakeElement = null;

    if (filterSvg) {
        filterSvg.remove();
        filterSvg = null;
    }

    offsetNodes = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID},
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    shakeElement = _findTarget();
    if (!shakeElement) return false;

    previousTransform = shakeElement.style.transform;
    previousFilter = shakeElement.style.filter;

    current = {x: 0, y: 0};
    history = Array.from({length: SETTINGS.ghostCount}, () => ({x: 0, y: 0}));
    if (SETTINGS.ghostCount > 0) {
        _buildFilter();
        shakeElement.style.filter = `url(#${FILTER_ID})`;
    }

    isActive = true;
    _step();
    stepTimer = setInterval(_step, SETTINGS.stepMs);
    return true;
}

function screenShake() {
    if (isActive) stop();
    else start();
    return isActive;
}

screenShake.id = EFFECT_ID;
screenShake.minIntensity = SETTINGS.minIntensity;
screenShake.start = start;
screenShake.stop = stop;
screenShake.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop ({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {screenShake};