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
let deadSet = new Set();
let cellsRef = [];
let totalCells = 0;
let sectionIndex = -1;

function _allCandidates() {
    return Array.from(document.querySelectorAll(SETTINGS.candidates));
}

function _isUsable(element) {
    if (element.closest(TARGETS.exclude)) return false;
    if (element.querySelector(TARGETS.exclude)) return false;
    return element.offsetWidth >= SETTINGS.minWidthPx && element.offsetHeight >= SETTINGS.minHeightPx;
}

function _pickSection() {
    const usable = _allCandidates().map((element, index) => ({element, index})).filter(item => _isUsable(item.element));
    if (usable.length === 0) return null;
    return pickRandom(usable, 1)[0];
}

function _buildGrid(sectionElement) {
    const width = sectionElement.offsetWidth;
    const height = sectionElement.offsetHeight;
    if (!width || !height) return false;

    const baseSize = window.innerWidth < SETTINGS.mobileBelowPx ? SETTINGS.cellSizeMobile : SETTINGS.cellSizeDesktop;
    const cellSize = Math.max(baseSize, Math.ceil(Math.sqrt((width * height) / SETTINGS.maxSquares )));

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
    cellsRef = cells;
    totalCells = total;

    return true;
}

function _markDead(index) {
    deadIndicies.push(index);
    deadSet.add(index);
}

function _killCellsInstantly(indicies) {
    indicies.forEach(index => {
        if(!cells[index]) return;
        cellsRef[index].element.style.transition = 'none';
        cellsRef[index].element.style.background = SETTINGS.deadColor;
        cellsRef[index].element.style.opacity = '1';
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
        index: sectionIndex,
        cols: grid.cols,
        rows: grid.rows,
        deadIndicies,
    });
}

function _beginGrowth() {
    clearInterval(intervalId);
    intervalId = null;

    const intensity = stateManager.getIntensity();
    if (intensity === 0 || totalCells === 0) return;

    const decayPercent = (intensity / MAX_INTENSITY) * SETTINGS.maxDecayPercent;
    const targetDead = Math.floor(totalCells *decayPercent);
    if (deadIndicies.length >= targetDead) return;

    const remaining = [];
    for (let i = 0; i < totalCells; i++) {
        if (!deadSet.has(i)) remaining.push(i);
    }

    const order = pickRandom(remaining, remaining.length);

    let pointer = 0;
    const tickMs = Math.max(10, SETTINGS.tickMs / intensity);
    const cellsThisTick = Math.ceil(SETTINGS.cellsPerTick * (intensity /3 ));

    intervalId = setInterval(() => {
        for (let i = 0; i < cellsThisTick; i++) {
            if (deadIndicies.length >= targetDead || pointer >= order.length) {
                clearInterval(intervalId);
                intervalId = null;
                _saveProgress();
                return;
            }

            const index = order[pointer++];
            const cell = cellsRef[index];
            cell.element.style.transition = `opacity ${SETTINGS.fadeInMs}ms ease`;
            cell.element.style.background = SETTINGS.flashColor;
            cell.element.style.opacity = String(SETTINGS.flashAlpha);

            setTimeout(() => {
                cell.element.style.background = SETTINGS.deadColor;
                cell.element.style.opacity = '1';
            }, SETTINGS.settleMinMs + Math.random() * (SETTINGS.settleMaxMs - SETTINGS.settleMinMs));

            _markDead(index);
        }
    }, tickMs);
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
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    let host = sectionElement;
    let index = -1;
    if (host) {
        index = _allCandidates().indexOf(host);
    } else {
        if (stateManager.hasEffectState(EFFECT_ID)) return false;
        const pick =  _pickSection();
        host = pick.element;
        index = pick.index;
    }

    if (!_buildGrid(host)) return false;

    isActive = true;
    sectionIndex = index;
    deadIndicies = [];
    deadSet = new Set();
    window.addEventListener('pagehide', _saveProgress);

    _beginGrowth();
    return true;
}

function restorePermanentDecay(sectionElement) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved || !Array.isArray(saved.deadIndicies)) return false;

    const host = sectionElement;
    const index = Number.isInteger(saved.index) ? saved.index: -1;
    if (!host) {
        if (index < 0) return false;
        host = _allCandidates()[index];
        if (!host || !host.offsetWidth || !host.offsetHeight) return false;
    }

    if (!_buildGrid(host)) return false;
    isActive = true;
    sectionIndex = index;
    deadIndicies = _fitToGrid(saved);
    deadSet = new Set(deadIndicies);
    _killCellsInstantly(built.cells, deadIndicies);
    window.addEventListener('pagehide', _saveProgress);
    _beginGrowth();
    return true;
}

function disable() {
    _stop({clearSaved: true});
}

function permanentDecay(sectionElement) {
    if (isActive) _stop({clearSaved: true});
    else _start(sectionElement);
    return isActive;
}

permanentDecay.id = EFFECT_ID;
permanentDecay.minIntensity = SETTINGS.minIntensity;
permanentDecay.permanent = true;
permanentDecay.continuous = true;
permanentDecay.start = _start;
permanentDecay.stop = disable;
permanentDecay.restore = restorePermanentDecay;
permanentDecay.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => _stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) _stop({notify: true});
});

export {permanentDecay};