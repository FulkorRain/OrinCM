import {stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import {getTextTargets, getRestingText, showRestingText, pickRandom, isEffectsEnabled} from '../managers/targets.js';
import {CHAOS_TEXT as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'chaos-text';
const GLYPHS = [...SETTINGS.glitchChars];

let isActive = false;
let tickTimer = null;
let endTimer = null;
let targets = [];

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
        if (Math.random() < SETTINGS.glitchChance) chars[pos] = _randomGlyph();
    });

    return chars.join('');
}

function _tick() {
    const count = Math.max(1, Math.round(stateManager.getIntensity() * SETTINGS.charsPerIntensity));
    targets.forEach(node => {
        if (!node.isConnected) return;
        node.nodeValue = _scramble(getRestingText(node), count);
    });
}

function _getDuration() {
    const intensity = stateManager.getIntensity();
    const progress = Math.max(0, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY));
    return SETTINGS.baseDurationMs + progress * (SETTINGS.maxDurationMs - SETTINGS.baseDurationMs);
}

function stop ({notify = false} = {}) {
    if (!isActive) return;

    clearInterval(tickTimer);
    clearTimeout(endTimer);

    targets.forEach(node => {
        if (node.isConnected) showRestingText(node);
    });
    targets = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {detail: {id: EFFECT_ID}}));
    }
}

function start (root) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const found = getTextTargets({root, max: SETTINGS.maxTextNodes});
    if (found.length === 0) return false;

    targets = found;
    isActive = true;
    _tick();
    tickTimer = setInterval(_tick, SETTINGS.tickMs);
    endTimer = setTimeout(() => stop({notify: true}), _getDuration());
    return true;
}

function chaosText(root) {
    if (isActive) stop();
    else start(root);
    return isActive;
}

chaosText.id = EFFECT_ID;
chaosText.minIntensity = SETTINGS.minIntensity;
chaosText.start = start;
chaosText.stop = stop;
chaosText.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({ notify: true }));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify:true});
});

export {chaosText};