import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import {getTextTargets, showRestingText, pickRandom, isEffectsEnabled } from '../managers/targets.js';
import {MESSAGE_SWAP as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'message-swap';

let isActive = false;
let endTimer = null;
let targets = [];

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function _isEligible(node) {
    return node.nodeValue.trim().length >= SETTINGS.minTextLength;
}

function stop({notify = false} = {}) {
    if (!isActive) return;
    
    clearTimeout(endTimer);
    endTimer = null;

    targets.forEach(node => {
        if (node.isConnected) showRestingText(node);
    });
    targets = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {detail: {id: EFFECT_ID}}));
    }
}

function start(root) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (SETTINGS.messages.length === 0) return false;
    
    const eligible = getTextTargets({root, max: Infinity}).filter(_isEligible);
    if (eligible.length === 0) return false;

    targets = pickRandom(eligible, SETTINGS.count);
    targets.forEach(node => {
        const original = node.nodeValue;
        const leading = original.match(/^\s*/)[0];
        const trailing = original.match(/\s*$/)[0];
        node.nodeValue = leading + pickRandom(SETTINGS.messages, 1)[0] + trailing;
    });

    let isActive = true;
    endTimer = setTimeout(() => stop({notify: true}), _randomBetween(SETTINGS.showMinMs, SETTINGS.showMaxMs));
    return true;
}

function messageSwap(root) {
    if (isActive) stop();
    else start(root);
    return isActive;
}

messageSwap.id = EFFECT_ID;
messageSwap.minIntensity = SETTINGS.minIntensity;
messageSwap.permanent = false;
messageSwap.continuous = false;
messageSwap.start = start;
messageSwap.stop = stop;
messageSwap.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {messageSwap};