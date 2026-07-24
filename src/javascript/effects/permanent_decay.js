import {stateManager} from '../managers/state-manager';

const CELL_SIZE = window.innerWidth < 768 ? 14 : 6;
const TICK_MS = 80;
const CELLS_PER_TICK = 3;
const MAX_DECAY_PERCENT = 0.7;
const EFFECT_ID = 'permanent-decay';

let isActive = false;
let intervalId = null;
let overlayElement = null;
let sectionRef = null;

function _buildGrid(sectionElement) {
    const sectionWidth = sectionElement.offsetWidth;
    const sectionHeight = sectionElement.offsetHeight;
    const cols = Math.floor(sectionWidth / CELL_SIZE);
    const rows = Math.floor(sectionHeight / CELL_SIZE);
    const total = cols * rows;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
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
                left: ${col * CELL_SIZE}px;
                top: ${row * CELL_SIZE}px;
                width: ${CELL_SIZE}px;
                height: ${CELL_SIZE}px;
                opacity: 0;
                background: #000;
            `;
            fragment.appendChild(cell);
            cells.push({element: cell, dead: false});
        }
    }

    overlay.appendChild(fragment);
    sectionElement.style.position = 'relative';
    sectionElement.appendChild(overlay);

    return {overlay, cells, total};
}

function _killCellsInstantly(cells, deadIndicies) {
    deadIndicies.forEach(index => {
        if(!cells[index]) return;
        cells[index].element.style.transition = 'none';
        cells[index].element.style.background = '#000';
        cells[index].element.style.opacity = '1';
        cells[index].dead = true;
    });
}

function restorePermanentDecay(sectionElement) {
    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved) return false;

    sectionRef = sectionElement;

    const {overlay, cells} = _buildGrid(sectionElement);
    overlayElement = overlay;

    _killCellsInstantly(cells, saved.deadIndicies);

    isActive = true;
    return true;
}

function permanentDecay(sectionElement) {
    isActive = !isActive;
    sectionRef = sectionElement;
    
    if (!isActive) {
        clearInterval(intervalId);
        intervalId = null;
        if (overlayElement) {
            overlayElement.remove();
            overlayElement = null;
        }
        stateManager.clearEffectState(EFFECT_ID);
        return isActive;
    }

    const {overlay, cells, total} = _buildGrid(sectionElement);
    overlayElement = overlay;

    const intensity = stateManager.getIntensity();
    const decayPercent = (intensity / 10) * MAX_DECAY_PERCENT;
    const targetDead = Math.floor(total * decayPercent);

    const order = Array.from({length: total}, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    let pointer = 0;
    let deadCount = 0;
    const deadIndicies = [];

    const tickMs = Math.max(10, TICK_MS / intensity);
    const cellsThisTick = Math.ceil(CELLS_PER_TICK * (intensity/3));

    intervalId = setInterval(() => {
        for (let i = 0; i < cellsThisTick; i++) {
            if (deadCount >= targetDead || pointer >= total) {
                clearInterval(intervalId);
                intervalId = null;
                stateManager.saveEffectState(EFFECT_ID, {deadIndicies});
                return;
            }

            const index = order[pointer++];
            const cell = cells[index];
            cell.element.style.transition = 'opacity 0.3s ease';
            cell.element.style.background = '#3a0a0a';
            cell.element.style.opacity = '0.85';

            setTimeout(() => {
                cell.element.style.background = '#000';
                cell.element.style.opacity = '1';
            }, 120 + Math.random() * 180);

            cell.dead = true;
            deadIndicies.push(index);
            deadCount++;
        }
    }, tickMs);

    return isActive;
}

permanentDecay.isActive = () => isActive;
permanentDecay.restore = restorePermanentDecay;

export {permanentDecay};