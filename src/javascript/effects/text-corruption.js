import {stateManager} from "../managers/state-manager.js";

const GLITCH_CHARS = '𓇋 𓋴𓅂𓅂 𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓𓀔𓀕𓀖𓀗𓀘𓀙𓀚𓀛𓀜𓀝𓀞𓀟𓁀𓁁𓁂𓁃𓁄𓁅𓁆𓁇𓁈𓁉𓁊𓁋𓁌𓁍𓁎𓁏𓂀𓂁𓂂𓂃𓂄𓂅𓂆𓂇𓂈𓂉𓂊𓂋𓂌𓂍𓂎𓂏𓃀𓃁𓃂𓃃𓃄𓃅𓃆𓃇𓃈𓃉𓃊𓃋𓃌𓃍𓃎𓃏';
const CHARS_PER_INTENSITY = 2;
const TICK_MS = 500;

const BURST_MIN_MS = 800;
const BURST_MAX_MS = 3000;

const PAUSE_MIN_MS = 10000;
const PAUSE_MAX_MS = 30000;

let isActive = false;
let tickTimer = null;
let cycleTimer = null;
let targets = null;

let config = {
    tickMs: TICK_MS,
    burstMinMs: BURST_MIN_MS,
    burstMaxMs: BURST_MAX_MS,
    pauseMinMs: PAUSE_MIN_MS,
    pauseMaxMs: PAUSE_MAX_MS,
}

function _getGlitchChar() {
    const chars = [...GLITCH_CHARS];
    return chars[Math.floor(Math.random() * chars.length)];
}

function _tick (targets, corruptCount) {
    targets.forEach(element => {
        if (!element.dataset.original) return;

        const original = element.dataset.original;
        const arr = [...original];

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
        if (element.dataset.originalHTML) {
            element.innerHTML = element.dataset.originalHTML;
        }
    });
}

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function _startBurst() {
    if (!isActive) return;

    const intensity = stateManager.getIntensity();
    const corruptCount = intensity * CHARS_PER_INTENSITY;

    tickTimer = setInterval(() => _tick(targets, corruptCount), config.tickMs);

    const burstDuration = _randomBetween(config.burstMinMs, config.burstMaxMs);
    cycleTimer = setTimeout(() => {
        _stopBurst();
    }, burstDuration);
}

function _stopBurst() {
    if (!isActive) return;

    clearInterval(tickTimer);
    tickTimer = null;
    _restore(targets);

    const pauseDuration = _randomBetween(config.pauseMinMs, config.pauseMaxMs);
    cycleTimer = setTimeout(() => {
        _startBurst();
    }, pauseDuration);
}

function _stopAll() {
    clearInterval(tickTimer);
    clearTimeout(cycleTimer);
    tickTimer = null;
    cycleTimer = null;
    if(targets) _restore(targets);
     document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: 'text-corruption'}
    }));
}

function corruptText(
    sectionElement, 
    options = {}
) {
    isActive = !isActive;

    targets = sectionElement.querySelectorAll('.corruptable-text');

    if (!isActive) {
        clearInterval(tickTimer);
        tickTimer = null;
        _restore(targets);
        return isActive;
    }

    config = {
        tickMs: options.tickMs ?? TICK_MS, 
        burstMinMs: options.burstMinMs ?? BURST_MIN_MS,
        burstMaxMs: options.burstMaxMs ?? BURST_MAX_MS,
        pauseMinMs: options.pauseMinMs ?? PAUSE_MIN_MS,
        pauseMaxMs: options.pauseMaxMs ?? PAUSE_MAX_MS
    };

    targets.forEach(element => {
        if (!element.dataset.original) {
            element.dataset.original = element.textContent;
            element.dataset.originalHTML = element.innerHTML;
        }
    });

    _startBurst();

    return isActive;
}

corruptText.isActive = () => isActive;

export {corruptText}