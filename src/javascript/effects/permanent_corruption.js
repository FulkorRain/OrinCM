import { stateManager } from "../managers/state-manager.js";

const GLITCH_CHARS        = '█▓▒░▄▀■□▪▫◆◇○●∆∇∞≈≠≤≥⟁⌂⌘⌛⚡ĦŦŒŊƱɣʍʘʃʈ';
const CHARS_PER_INTENSITY = 2;
const EFFECT_ID = 'permanent-corruption';

let isActive = false;

function _corruptString(original, count) {
    const arr = original.split('');


    const corruptablePositions = arr.map((char, i) => char !== ' ' ? i : null).filter(i => i !==null);

    for (let i = corruptablePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [corruptablePositions[i], corruptablePositions[j]] = [corruptablePositions[j], corruptablePositions[i]];
    }

    corruptablePositions.slice(0, count).forEach(pos => {
        arr[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    });

    return arr.join('');
}

function restorePermanentCorruption(sectionElement) {
    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved) return false;

    const targets = sectionElement.querySelectorAll('.corruptable-text');
    targets.forEach(element => {
        if (!element.dataset.original) element.dataset.original = element.textContent;

        const index = Array.from(targets).indexOf(element);
        if(saved.corrupted[index] !== undefined) {
            element.textContent = saved.corrupted[index];
        }
    });

    isActive = true;
    return true;
}

function permanentCorruption(sectionElement) {
    isActive = !isActive;

    const targets = sectionElement.querySelectorAll('.corruptable-text');

    if (!isActive) {
        targets.forEach(element => {
            if (element.dataset.original) element.textContent = element.dataset.original;
        });
        stateManager.clearEffectState(EFFECT_ID);
        return isActive;
    }

    const intensity = stateManager.getIntensity();
    const corruptCount = intensity * CHARS_PER_INTENSITY;
    const corrupted = [];

    targets.forEach(element => {
        if (!element.dataset.original) element.dataset.original = element.textContent;

        const corruptedString = _corruptString(element.dataset.original, corruptCount);
        element.textContent = corruptedString;
        
        corrupted.push(corruptedString);
    });

    stateManager.saveEffectState(EFFECT_ID, {corrupted});

    return isActive;
}

permanentCorruption.isActive = () => isActive;
permanentCorruption.restore = restorePermanentCorruption;

export {permanentCorruption};