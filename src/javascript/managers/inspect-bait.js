import {stateManager, EVENT_INFECTION_CURED} from './state-manager.js';
import { isEffectsEnabled, pickRandom } from './targets.js';
import { BAIT } from './effect-config.js';

const GLYPHS = [...new Set([...BAIT.glitchChars].filter(char => !/\s/.test(char)))]

let bait = null;
let textNode = null;
let observer = null;
let glitchTimer = null;

function _scramble(text) {
    const chars = [...text];
    const positions = [];
    chars.forEach((char, i) => {
        if (!/\s/.test(char)) positions.push(i);
    });

    const count = Math.max(1, Math.round(positions.length * BAIT.glitchFraction));
    pickRandom(positions, count).forEach(pos => {
        chars[pos] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    });
    return chars.join('');
}

function _glitchTick() {
    if (!textNode || document.hidden) return;
    textNode.nodeValue = _scramble(BAIT.text);
}

function _startGlitch() {
    if (glitchTimer || !(BAIT.glitchTickMs > 0)) return;
    _glitchTick();
    glitchTimer = setInterval(_glitchTick, BAIT.glitchTickMs);
}

function _stopGlitch({restore = false} = {}) {
    clearInterval(glitchTimer);
    glitchTimer = null;
    if (restore && textNode) textNode.nodeValue = BAIT.text;
}

function _onChange() {
    if (!bait || bait.isConnected) return;

    observer.disconnect();
    observer = null;
    _stopGlitch();
    stateManager.suppress();
}

function installBait() {
    if (!BAIT.enabled || bait) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    bait = document.createElement(BAIT.tag);
    bait.id = BAIT.id;
    bait.hidden = true;
    bait.style.display = 'none';
    bait.setAttribute('aria-hidden', 'true');
    bait.setAttribute('data-effect-ui', '');
    bait.textContent = BAIT.text;
    document.body.appendChild(bait);

    textNode = bait.firstChild;
    _startGlitch();

    observer = new MutationObserver(_onChange);
    observer.observe(document.body, {childList: true});
    return true;
}

document.addEventListener(EVENT_INFECTION_CURED, () => {
    _stopGlitch({restore: true});
    if (observer) {
        observer.disconnect();
        observer = null;
    }
});

export {installBait};