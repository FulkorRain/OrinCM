import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import {getTextTargets, getPristineText, getRestingText, setRestingText, revertToPristine, isEffectsEnabled} from '../managers/targets.js';
import {createSeededRandom, newSeed} from '../managers/seeded-random.js';
import { PERMANENT_CORRUPTION as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'permanent-corruption';

const GLYPHS = [...new Set([...SETTINGS.glitchChars].filter(char => !/\s/.test(char)))];

let isActive = false;
let seed = 0;
let scopeRoot;
let affected = [];

function _corrupt(text, count) {
    const chars = [...text];
    const positions = [];
    chars.forEach((char, i) => {
        if (!/\s/.test(char)) positions.push(i);
    });
    if (positions.length === 0) return text;

    const random = createSeededRandom(`${seed}:${text}`);

    for (let i = positions.length - 1; i> 0; i--) {
        const j = Math.floor(random() * (i+1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const glyphs = positions.map(() => GLYPHS[Math.floor(random() * GLYPHS.length)]);
    const limit = Math.max(1, Math.floor(positions.length * SETTINGS.maxFraction));
    const howMany = Math.min(count, limit);
    for (let k = 0; k < howMany; k++) {
        chars[positions[k]] = glyphs[k];
    }
    return chars.join('');
}

function _apply() {
    if (!isActive) return;
    const intensity = stateManager.getIntensity();
    if (intensity === 0) return;
    const count = intensity * SETTINGS.charsPerIntensity;

    const nodes = getTextTargets({root: scopeRoot, max: Infinity, onlyVisible: false});
    nodes.forEach(node => {
        const corrupted = _corrupt(getPristineText(node), count);
        if (corrupted !== getRestingText(node)) setRestingText(node, corrupted);
    });
    affected = nodes;
}

function _begin(root, withSeed) {
    scopeRoot = root;
    seed = withSeed;
    isActive = true;
    _apply();
}

function _shutdown({notify = false, clearSaved = false} = {}) {
    if (!isActive) return;

    affected.forEach(node => {
        if (node.isConnected) revertToPristine(node);
    });

    affected = [];
    isActive = false;

    if (clearSaved) stateManager.clearEffectState(EFFECT_ID);
    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function enable(root) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;
    _begin(root, newSeed());
    stateManager.saveEffectState(EFFECT_ID, {seed});
    return true;
}

function disable() {
    _shutdown({clearSaved: true});
}

function restore(root) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;
    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved || !Number.isFinite(saved.seed)) return false;
    _begin(root, saved.seed);
    return true;
}

function permanentCorruption(root) {
    if (isActive) disable();
    else enable(root);
    return isActive;
}

permanentCorruption.id = EFFECT_ID;
permanentCorruption.minIntensity = SETTINGS.minIntensity;
permanentCorruption.permanent = true;
permanentCorruption.continuous = true;
permanentCorruption.start = enable;
permanentCorruption.stop = disable;
permanentCorruption.restore = restore;
permanentCorruption.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => _shutdown({notify: true}));

document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) _shutdown({notify: true});
    else if (isActive) _apply();
});

export {permanentCorruption};