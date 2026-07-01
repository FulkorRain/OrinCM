import {stateManager} from "../managers/state-manager.js";

const GLITCH_CHARS = '█▓▒░▄▀■□▪▫◆◇○●∆∇∞≈≠≤≥⟁⌂⌘⌛⚡ĦŦŒŊƱɣʍʘʃʈ';
const CHARS_PER_INTENSITY = 2;

let isActive = false;
let intervalId = null;

function _corruptString(original, count) {
    const arr = original.split('');

    const corruptablePositions = arr.map((char, i) => char !== ' ' ? i : null).filter(i=>i !== null);

    for (let i = corruptablePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [corruptablePositions[i], corruptablePositions[j]] = [corruptablePositions[j], corruptablePositions[i]];
    }

    const toCorrupt = corruptablePositions.slice(0, count);
    toCorrupt.forEach(pos => {
        arr[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    });

    return arr.join('');
}

function corruptText(sectionElement) {
    isActive = !isActive;

    const targets = sectionElement.querySelectorAll('.corruptable-text');
    if (isActive) {
        const corruptCount = stateManager.getIntensity() * CHARS_PER_INTENSITY;
        targets.forEach(el => {
            if (!el.dataset.original) el.dataset.original = el.textContent;
            el.textContent = _corruptString(el.dataset.original, corruptCount);
        });

    } else {
        targets.forEach(element => {
            if (element.dataset.original) element.textContent = element.dataset.original;
        });
    }

    return isActive;
}

corruptText.isActive = () => isActive;

export {corruptText}