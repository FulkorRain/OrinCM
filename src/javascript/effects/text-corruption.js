import {stateManager} from "../managers/state-manager.js";

const GLITCH_CHARS = '█▓▒░▄▀■□▪▫◆◇○●∆∇∞≈≠≤≥⟁⌂⌘⌛⚡ĦŦŒŊƱɣʍʘʃʈ';
const CHARS_PER_INTENSITY = 2;
const TICK_MS = 700;
const BASE_DURATION_MS = 5000;
const MAX_DURATION_MS = 15000;

let isActive = false;
let tickTimer = null;
let restoreTimer = null;

function _getGlitchChar() {
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function _tick (targets, corruptCount) {
    targets.forEach(element => {
        if (!element.dataset.original) return;

        const original = element.dataset.original;
        const arr = original.split('');

        const corruptablePositions = arr.map((char, i) => char !== ' ' ? i : null).filter(i => i !==null);

        for (let i = corruptablePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [corruptablePositions[i], corruptablePositions[j]] = [corruptablePositions[j], corruptablePositions[i]];
        }

        corruptablePositions.slice(0, corruptCount).forEach(pos => {
            arr[pos] = Math.random() > 0.5 ? _getGlitchChar() : original[pos];
        });

        element.textContent = arr.join('');
    });
}


function _restore(targets) {
    targets.forEach(element => {
        if (element.dataset.original) element.textContent = element.dataset.original;
    });
}

function corruptText(sectionElement) {
    isActive = !isActive;

    const targets = sectionElement.querySelectorAll('.corruptable-text');

    if (!isActive) {
        clearInterval(tickTimer);
        clearTimeout(restoreTimer);
        tickTimer = null;
        restoreTimer = null;
        _restore(targets);
        return isActive;
    }

    targets.forEach(element => {
        if (!element.dataset.original) element.dataset.original = element.textContent;
    });

    const intensity = stateManager.getIntensity();
    const corruptCount = intensity * CHARS_PER_INTENSITY;

    tickTimer = setInterval(() => _tick(targets, corruptCount), TICK_MS);
    
    const duration = BASE_DURATION_MS + ((intensity - 1) / 9) * (MAX_DURATION_MS - BASE_DURATION_MS);

    restoreTimer = setTimeout(() => {
        clearInterval(tickTimer);
        tickTimer = null;
        restoreTimer = null;
        _restore(targets);
        isActive = false;
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: 'text-corruption'}
        }));
    }, duration);

    return isActive;
}

corruptText.isActive = () => isActive;

export {corruptText}