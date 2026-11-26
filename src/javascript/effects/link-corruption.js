import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import {getTextTargets, getRestingText, showRestingText, pickRandom, isEffectsEnabled} from '../managers/targets.js';
import { LINK_CORRUPTION as SETTINGS } from '../managers/effect-config.js';

const GLYPHS = [...new Set([...SETTINGS.glitchChars].filter(char => !/\s/.test(char)))];

let isActive = false;
let tickTimer = null;
let cycleTimer = null;
let targets = [];


function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
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
        if (Math.random() < SETTINGS.glitchChance) chars[pos] = _randomGlyph();
    });
    return chars.join('');
}

function _findTargets() {
    let link = document.querySelector(SETTINGS.selector);
    if (!link) return [];
    return getTextTargets({root: link, max: Infinity, onlyVisible: false});
}

function _getCount() {
    const fromLevel = Math.round(stateManager.getIntensity() * SETTINGS.charsPerIntensity);
    return Math.max(SETTINGS.baseChars, fromLevel);
}

function _tick() {
    const count = _getCount();
    targets.forEach(node => {
        if (!node.isConnected) return;
        node.nodeValue = _scramble(getRestingText(node), count);
    });
}

function _restoreTargets() {
    targets.forEach(node => {
        if (node.isConnected) showRestingText(node);
    });
    targets = [];
}

function _schedulePause() {
    cycleTimer = setTimeout(_startBurst, _randomBetween(SETTINGS.pauseMinMs, SETTINGS.pauseMaxMs));
}

function _startBurst() {
    if (!isActive) return;
    targets = _findTargets();
    if (targets.length === 0) {
        _schedulePause();
        return;
    }

    _tick();
    tickTimer = setInterval(_tick, SETTINGS.tickMs);
    cycleTimer = setTimeout(_endBurst, _randomBetween(SETTINGS.burstMinMs, SETTINGS.burstMaxMs));
}

function _endBurst() {
    if (!isActive) return;
    
    clearInterval(tickTimer);
    tickTimer = null;
    _restoreTargets();
    _schedulePause();
}

function stop() {
    if (!isActive) return;

    clearInterval(tickTimer);
    clearTimeout(cycleTimer);
    tickTimer = null;
    cycleTimer = null;

    _restoreTargets();
    isActive = false;
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.isCured() || stateManager.isSuppressed()) return false;
    if (!document.querySelector(SETTINGS.selector)) return false;

    isActive = true;
    _schedulePause();
    return true;
}

function linkCorruption() {
    if (isActive) stop();
    else start();
    return isActive;
}

document.addEventListener(EVENT_INFECTION_CURED, stop);
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.suppressed) stop();
});

export {linkCorruption};