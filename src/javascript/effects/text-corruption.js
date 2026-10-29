import {stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INFECTION_CURED, EVENT_INTENSITY_CHANGED} from '../managers/state-manager.js';
import {getTextTargets, getRestingText, showRestingText, pickRandom, isEffectsEnabled} from '../managers/targets.js';
import { TEXT_CORRUPTION as DEFAULTS } from '../managers/effect-config.js';

const EFFECT_ID = 'text-corruption';

const GLYPHS = [...new Set([...DEFAULTS.glitchChars].filter(char => !/\s/.test(char)))];

let isActive = false;
let tickTimer = null;
let cycleTimer = null;
let targets = [];
let scopeRoot;
let config = {...DEFAULTS};

function _randomBetween(min, max) {
    return min + Math.random() * (max-min);
}

function _randomGlyph() {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function _scramble(text, count) {
    const chars = [...text];
    const positions = [];
    chars.forEach((char, i) => {
        if (!/\s/.test(char)) positions.push(i);
    });

    pickRandom(positions, count).forEach(pos => {
        if (Math.random() < config.glitchChance) chars[pos] = _randomGlyph();
    });
    return chars.join('');
}

function _getPauseMs() {
    const intensity = stateManager.getIntensity();
    const progress = Math.max(0, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY));
    const scale = 1 - progress * (1- config.pauseScaleAtMax);
    return _randomBetween(config.pauseMinMs, config.pauseMaxMs) * scale;
}

function _restoreTargets() {
    targets.forEach(node => {
        if (node.isConnected) showRestingText(node);
    });
    targets = [];
}

function _tick() {
    const count = Math.max(1, Math.round(stateManager.getIntensity() * config.charsPerIntensity));
    targets.forEach(node => {
        if (!node.isConnected) return;
        node.nodeValue = _scramble (getRestingText(node), count);
    });
}

function _schedulePause() {
    cycleTimer = setTimeout(() => {
        try {
            _startBurst();
        } catch (error) {
            console.error('Text Corruption burst failed', error);
            if (isActive) _schedulePause();
        }
    }, _getPauseMs());
}

function _startBurst() {
    if (!isActive) return;
    if (stateManager.getIntensity() === 0) {
        stop ({notify: true});
        return;
    }

    const found = getTextTargets({root: scopeRoot, max: config.maxTextNodes, textInclude: config.textInclude});
    if (found.length === 0) {
        _schedulePause();
        return;
    }

    targets = found;
    _tick();
    tickTimer = setInterval(_tick, config.tickMs);
    cycleTimer = setTimeout(_endBurst, _randomBetween(config.burstMinMs, config.burstMaxMs));
}

function _endBurst() {
    if (!isActive) return;
    clearInterval(tickTimer);
    tickTimer = null;
    _restoreTargets();
    _schedulePause();
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    clearInterval(tickTimer);
    clearTimeout(cycleTimer);
    tickTimer = null;
    cycleTimer = null;

    _restoreTargets();
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function start(root, options = {}) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    config = {...DEFAULTS, ...options};
    scopeRoot = root;
    isActive = true;
    _startBurst();
    return true;
}

function corruptText(root, options = {}) {
    if (isActive) stop();
    else start(root, options);
    return isActive;
}

corruptText.id = EFFECT_ID;
corruptText.minIntensity = DEFAULTS.minIntensity;
corruptText.start = start;
corruptText.stop = stop;
corruptText.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop ({notify: true});
});

export {corruptText};