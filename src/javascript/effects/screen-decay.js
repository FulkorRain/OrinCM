import { stateManager } from "../managers/state-manager.js";

const TICK_MS = 40;
const CELLS_PER_TICK = 3;
const MAX_DECAY_PERCENT = 0.8;

const CELL_SIZE = window.innerWidth < 768 ? 14 : 6;

let isActive = false;
let intervalId = null;
let overlayElement = null;

function screenDecay(sectionElement) {
    isActive = !isActive;

    if (!isActive) {
        clearInterval(intervalId);
        intervalId = null;
        if (overlayElement) {
            overlayElement.remove();
            overlayElement = null;
        }
        return isActive;
    }

    const sectionW = sectionElement.offsetWidth;
    const sectionH = sectionElement.offsetHeight;

    const cols = Math.floor(sectionW/ CELL_SIZE);
    const rows = Math.floor(sectionH / CELL_SIZE);

    const total = cols * rows;

    const intensity = stateManager.getIntensity();
    const decayPercent = (intensity / 10) * MAX_DECAY_PERCENT;
    const targetDead = Math.floor(total * decayPercent);

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

    for (let row = 0; row < rows; row ++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                position: absolute;
                left: ${col * CELL_SIZE}px;
                top: ${row * CELL_SIZE}px;
                width: ${CELL_SIZE}px;
                height: ${CELL_SIZE}px;
                opacity: 0;
                transition: opacity 0.3s ease;
                background: #000;
            `;
            fragment.appendChild(cell);
            cells.push({el: cell, dead:false});
        }
    }
    
    overlay.appendChild(fragment);
    sectionElement.style.position = 'relative';
    sectionElement.appendChild(overlay);
    overlayElement = overlay;

    const order = Array.from({length: total}, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    let pointer = 0;
    let deadCount = 0;

    const tickMs = Math.max(10, TICK_MS / intensity);
    const cellsThisTick = Math.ceil(CELLS_PER_TICK * (intensity / 3));

    intervalId = setInterval(() => {
        for (let i = 0; i< cellsThisTick; i++) {
           if (deadCount >= targetDead || pointer >= total) {
                clearInterval(intervalId);
                intervalId = null;
                return;
           }

           const cell = cells[order[pointer++]];

           cell.el.style.background = '#3a0a0a';
           cell.el.style.opacity = '0.85';

           setTimeout(() => {
            cell.el.style.background = '#000';
            cell.el.style.opacity = '1';
           }, 120 + Math.random() * 180);

           cell.dead = true;
           deadCount++;
        }
    }, tickMs);

    return isActive;
}

screenDecay.isActive = () => isActive;

export {screenDecay};