import {stateManager, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { PERMANENT_DECAY as SETTINGS } from '../managers/effect-config.js';


const EFFECT_ID = 'permanent-decay';

let isActive = false;
let intervalId = null;
let overlayElement = null;
let hostElement = null;
let changedPosition = false;
let previousPosition = '';
let grid = {cols: 0, rows: 0};
let deadIndicies = [];

function _buildGrid(sectionElement) {
    const cellSize = window.innerWidth < SETTINGS.mobileBelowPx ? SETTINGS.cellSizeMobile : SETTINGS.cellSizeDesktop;
    const cols = Math.ceil(sectionElement.offsetWidth / cellSize);
    const rows = Math.ceil(sectionElement.offsetHeight / cellSize);
    const total = cols * rows;
    if (total === 0) return null;

    const overlay = document.createElement('div');
    overlay.setAttribute('data-effect-ui', '');
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: ${SETTINGS.zIndex};
        overflow: hidden;
        border-radius: inherit;
    `;

    const fragment = document.createDocumentFragment();
    const cells = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                position: absolute;
                left: ${col * cellSize}px;
                top: ${row * cellSize}px;
                width: ${cellSize}px;
                height: ${cellSize}px;
                opacity: 0;
                background: ${SETTINGS.deadColor};
            `;
            fragment.appendChild(cell);
            cells.push({element: cell, dead: false});
        }
    }

    overlay.appendChild(fragment);

    hostElement = sectionElement;
    changedPosition = false;
    if (getComputedStyle(sectionElement).position === 'static') {
        previousPosition = sectionElement.style.position;
        sectionElement.style.position = 'relative';
        changedPosition = true;
    }
    sectionElement.appendChild(overlay);

    overlayElement = overlay;
    grid = {cols, rows};

    return {cells, total};
}

function _killCellsInstantly(cells, deadIndicies) {
    deadIndicies.forEach(index => {
        if(!cells[index]) return;
        cells[index].element.style.transition = 'none';
        cells[index].element.style.background = SETTINGS.deadColor;
        cells[index].element.style.opacity = '1';
    });
}

function _fitToGrid(saved) {
    const savedCols = saved.cols;
    const savedRows = saved.rows;
    if (savedCols === grid.cols && savedRows === grid.rows) return saved.deadIndicies.slice();
    if (!(savedCols > 0 && savedRows > 0)) return [];

    const savedSet = new Set(saved.deadIndicies);
    const fitted = [];
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const oldCol = Math.min(savedCols - 1, Math.floor(col * savedCols / grid.cols));
            const oldRow = Math.min(savedRows - 1, Math.floor(row * savedRows / grid.rows));
            if (savedSet.has(oldRow * savedCols + oldCol)) fitted.push(row * grid.cols + col);
        }
    }
    return fitted;
}

function _saveProgress() {
    if (deadIndicies.length === 0) return;
    stateManager.saveEffectState(EFFECT_ID, {
        cols: grid.cols,
        rows: grid.rows,
        deadIndicies,
    });
}

function _stop({notify = false, clearSaved = false} = {}) {
    if (!isActive) return;
    clearInterval(intervalId);
    intervalId = null;
    window.removeEventListener('pagehide', _saveProgress);

    if (overlayElement) {
        overlayElement.remove();
        overlayElement = null;
    }

    if (hostElement && changedPosition) hostElement.style.position = previousPosition;
    hostElement = null;
    changedPosition = false;
    deadIndicies = [];
    isActive = false;

    if (clearSaved) stateManager.clearEffectState(EFFECT_ID);
    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function _start(sectionElement) {
    if (isActive || !sectionElement) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const built = _buildGrid(sectionElement);
    if (!built) return false;
    const {cells, total} = built;

    isActive = true;
    deadIndicies = [];
    window.addEventListener('pagehide', _saveProgress);

    const intensity = stateManager.getIntensity();
    const decayPercent = (intensity / MAX_INTENSITY) * SETTINGS.maxDecayPercent;
    const targetDead = Math.floor(total * decayPercent);

    const order = Array.from({length: total}, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    let pointer = 0;
    const tickMs = Math.max(10, SETTINGS.tickMs / intensity);
    const cellsThisTick = Math.ceil(SETTINGS.cellsPerTick * (intensity/3));

    intervalId = setInterval(() => {
        for (let i = 0; i < cellsThisTick; i++) {
            if (deadIndicies.length >= targetDead || pointer >= total) {
                clearInterval(intervalId);
                intervalId = null;
                _saveProgress();
                return;
            }

            const index = order[pointer++];
            const cell = cells[index];
            cell.element.style.transition = `opacity ${SETTINGS.fadeInMs}ms ease`;
            cell.element.style.background = SETTINGS.flashColor;
            cell.element.style.opacity = String(SETTINGS.flashAlpha);

            setTimeout(() => {
                cell.element.style.background = SETTINGS.deadColor;
                cell.element.style.opacity = '1';
            }, SETTINGS.settleMinMs + Math.random() * (SETTINGS.settleMaxMs - SETTINGS.settleMinMs));

            deadIndicies.push(index);
        }
    }, tickMs);

    return true;
}

function restorePermanentDecay(sectionElement) {
    if (isActive || !sectionElement) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved || !Array.isArray(saved.deadIndicies)) return false;

    const built = _buildGrid(sectionElement);
    if (!built) return false;

    deadIndicies = _fitToGrid(saved);
    _killCellsInstantly(built.cells, deadIndicies);
    window.addEventListener('pagehide', _saveProgress);
    isActive = true;
    return true;
}

function permanentDecay(sectionElement) {
    if (isActive) _stop({clearSaved: true});
    else _start(sectionElement);
    return isActive;
}

permanentDecay.isActive = () => isActive;
permanentDecay.restore = restorePermanentDecay;

document.addEventListener(EVENT_INFECTION_CURED, () => _stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) _stop({notify: true});
});

export {permanentDecay};