import { stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED } from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { SCREEN_SHAKE as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'screen-shake';
const SHAKE_CLASSES = ['shaking-low', 'shaking-mid', 'shaking-high'];

let isActive = false;
let shakeElement = null;

function _findTarget() {
    for (const selector of SETTINGS.targets) {
        const element = document.querySelector(selector);
        if (element) return element;
    }
    return null;
}

function _getShakeClass(intensity) {
    if (intensity >= SETTINGS.highFrom) return SHAKE_CLASSES[2];
    if (intensity >= SETTINGS.midFrom) return SHAKE_CLASSES[1];
    return SHAKE_CLASSES[0];
}

function _apply() {
    const wanted = _getShakeClass(stateManager.getIntensity());
    SHAKE_CLASSES.forEach(name => shakeElement.classList.toggle(name, name === wanted));
}

function stop({ notify = false } = {}) {
    if (!isActive) return;

    shakeElement.classList.remove(...SHAKE_CLASSES);
    shakeElement = null;
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: { id: EFFECT_ID },
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    shakeElement = _findTarget();
    if (!shakeElement) return false;

    isActive = true;
    _apply();
    return true;
}

function screenShake() {
    if (isActive) stop();
    else start();
    return isActive;
}

screenShake.id = EFFECT_ID;
screenShake.minIntensity = SETTINGS.minIntensity;
screenShake.permanent = false;
screenShake.continuous = true;
screenShake.start = start;
screenShake.stop = stop;
screenShake.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => (event) => {
    if (event.detail.intensity === 0) stop({ notify: true });
    else if (isActive) _apply();
});

export {screenShake};