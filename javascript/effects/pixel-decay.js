import {stateManager} from "../managers/state-manager.js";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 220;
const PIXEL_SIZE = window.innerWidth < 768 ? 10: 4;
const BASE_PIXELS_PER_TICK = 4;
const BASE_TICK_MS = 80;

const STAGE = {ALIVE: 0, GLITCHING: 1, FADING: 2, DEAD: 3};

let isActive = false;
let intervalId = null;

const COLS = Math.floor(CANVAS_WIDTH / PIXEL_SIZE);
const ROWS = Math.floor(CANVAS_WIDTH / PIXEL_SIZE);
const TOTAL_PIXELS = COLS * ROWS;

function _loadImagePixels(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const offscreen = document.createElement('canvas');
            offscreen.width = CANVAS_WIDTH;
            offscreen.height = CANVAS_HEIGHT;
            const ctx = offscreen.getContext('2d');
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            const cells = [];
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const px = col * PIXEL_SIZE + Math.floor(PIXEL_SIZE / 2);
                    const py = row * PIXEL_SIZE + Math.floor(PIXEL_SIZE / 2);
                    const data = ctx.getImageData(px, py, 1, 1).data;
                    cells.push({r: data[0], g: data[1], b: data[2]});
                }
            }
            resolve(cells);
        };

        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

function _drawGrid(ctx, cells, stages) {
    for (let i = 0; i< TOTAL_PIXELS; i++) {
        const col = i % COLS;
        const row = Math.floor(i/COLS);
        const x = col * PIXEL_SIZE;
        const y = row * PIXEL_SIZE;
        const {r, g, b} = cells[i];
        const stage = stages[i];

        let fillColor;

        if (stage === STAGE.ALIVE) {
            fillColor = `rgb(${r}, ${g}, ${b})`;
        } else if (stage === STAGE.GLITCHING) {
            const glitchR = Math.random() > 0.5 ? 255 - r : r + 60;
            const glitchG = Math.random() > 0.7 ? 0 : g;
            const glitchB = Math.random() > 0.5 ? 255 : b;
            fillColor = `rgb(${Math.min(255, glitchR)}, ${Math.min(255, glitchG)}, ${Math.min(255, glitchB)})`
         } else if (stage === STAGE.FADING) {
            const avg = (r + g + b) / 3;
            const fade = Math.floor(avg * 0.3);
            fillColor = `rgb(${fade}, ${fade}, ${fade})`;
         } else {
            fillColor = '#000';
         }

         ctx.fillStyle = fillColor;
         ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    }
}

function pictureDecay(sectionElement) {
    isActive = !isActive;
    const canvas = sectionElement.querySelector('.decay-canvas');
    if (!canvas) {
        console.error('pixel-decay: no .decay-canvas found in section');
        return isActive;
    }

    const ctx = canvas.getContext('2d');

    const SOURCE_IMAGE = canvas.dataset.src || 'https://picsum.photos/seed/decay/400/220';

    if (!isActive) {
        clearInterval(intervalId);
        intervalId = null;
        _loadImagePixels(SOURCE_IMAGE).then(cells => {
            const stages = new Array(TOTAL_PIXELS).fill(STAGE.ALIVE);
            _drawGrid(ctx, cells, stages);
        });
        return isActive;
    }

    _loadImagePixels(SOURCE_IMAGE).then(cells => {
        const stages = new Array(TOTAL_PIXELS).fill(STAGE.ALIVE);

        _drawGrid(ctx, cells, stages);

        const decayOrder = Array.from({length: TOTAL_PIXELS}, (_, i) => i);
        for (let i = decayOrder.length -1; i> 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [decayOrder[i], decayOrder[j]] = [decayOrder[j], decayOrder[i]];
        }

        let decayIndex =0;

        function tick() {
            const intensity = stateManager.getIntensity();
            const pixelsPerTick = BASE_PIXELS_PER_TICK * intensity;

            for (let i = 0; i < pixelsPerTick; i++) {
                if (decayIndex >= TOTAL_PIXELS) break;
                const idx = decayOrder[decayIndex++];
                stages[idx] = STAGE.GLITCHING;
            }

            for (let i = 0; i < TOTAL_PIXELS; i++) {
                if (stages[i] === STAGE.GLITCHING && Math.random() > 0.4) {
                    stages[i] = STAGE.FADING;
                } else if (stages[i] === STAGE.FADING && Math.random() > 0.5) {
                    stages[i] = STAGE.DEAD;
                }
            }

            _drawGrid(ctx, cells, stages);

            if (decayIndex >= TOTAL_PIXELS && stages.every(s => s === STAGE.DEAD)) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        const tickMs = Math.max(20, BASE_TICK_MS / stateManager.getIntensity());
        intervalId = setInterval(tick, tickMs);
    });
    return isActive;
}

pictureDecay.isActive = () => isActive;

export {pictureDecay};