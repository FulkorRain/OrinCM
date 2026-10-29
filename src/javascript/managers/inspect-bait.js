import { stateManager, EVENT_INFECTION_CURED } from './state-manager.js';
import { isEffectsEnabled, pickRandom } from './targets.js';
import { BAIT } from './effect-config.js';

const GLYPHS = [...new Set([...BAIT.glitchChars].filter(char => !/\s/.test(char)))]

let installed = false;
let baits = [];
let observer = null;
let glitchTimer = null;
let safetyTimer = null;

function _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _getCount() {
    const min = Math.max(1, Math.floor(BAIT.minCount));
    const max = Math.max(min, Math.floor(BAIT.maxCount));
    return _randomInt(min, max);
}

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

function _write(item, value) {
    item.lastWritten = value;
    item.textNode.nodeValue = value;
}

function _isIntact(item) {
    if (!item.element.isConnected) return false;
    if (item.textNode.parentNode !== item.element) return false;
    if (item.textNode.nodeValue !== item.lastWritten) return false;
    return true;
}

function _check() {
    if (!installed || baits.length === 0) return;

    const before = baits.length;
    baits = baits.filter(_isIntact);
    if (baits.length === before) return;
    if (baits.length > 0) return;

    _stopWatching();
    _stopGlitch();
    stateManager.suppress();
}

function _safeCheck() {
    try {
        _check();
    } catch (error) {
        console.error('Bait check failed', error);
    }
}

function _glitchTick() {
    _safeCheck();
    if (document.hidden) return;
    baits.forEach(item => _write(item, _scramble(item.text)));
}

function _startGlitch() {
    if (glitchTimer || !(BAIT.glitchTickMs > 0)) return;
    _glitchTick();
    glitchTimer = setInterval(_glitchTick, BAIT.glitchTickMs);
}

function _stopGlitch({ restore = false } = {}) {
    clearInterval(glitchTimer);
    glitchTimer = null;
    if (restore) {
        baits.forEach(item => _write(item, item.text));
    }
}

function _stopWatching() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }

    clearInterval(safetyTimer);
    safetyTimer = null;
}

function _insert(element) {
    const body = document.body;
    if (!BAIT.scatter) {
        body.appendChild(element);
        return;
    }

    const index = Math.floor(Math.random() * (body.children.length + 1));
    body.insertBefore(element, body.children[index] || null);
}

function installBait() {
    if (!BAIT.enabled || installed) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;
    if (!document.body || BAIT.texts.length === 0) return false;

    const count = _getCount();
    for (let i = 0; i< count; i++) {
        const element = document.createElement(BAIT.tag);
        element.id = `${BAIT.id}-${i + 1}`;
        element.hidden = true;
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('data-effect-ui', '');
        
        const text = pickRandom(BAIT.texts, 1)[0];
        element.textContent = text;
        _insert(element);
        baits.push({element, textNode: element.firstChild, text, lastWritten: text});

    }
    installed = true;
    _startGlitch();

    observer = new MutationObserver(_safeCheck);
    observer.observe(document.body, { childList: true });
    baits.forEach(item => observer.observe(item.element, {childList:true, characterData: true, subtree: true}));
    if (BAIT.safetyCheckMs > 0) safetyTimer = setInterval(_safeCheck, BAIT.safetyCheckMs);
    return true;
}

document.addEventListener(EVENT_INFECTION_CURED, () => {
    _stopGlitch({ restore: true });
    _stopWatching();
});

export { installBait };