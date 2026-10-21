import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager';
import { isEffectsEnabled } from '../managers/targets.js';
import {FLICKER as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'flicker';
const FLICKER_CLASSES = ['flickering-low', 'flickering-mid', 'flickering-high'];
const SCANLINES_CLASS = 'scanlines';
const VIGNETTE_CLASS = 'vignette';

let isActive = false;

function _getFlickerClass(intensity) {
    if (intensity >= SETTINGS.highFrom) return FLICKER_CLASSES[2];
    if (intensity >= SETTINGS.midFrom) return FLICKER_CLASSES[1];
    return FLICKER_CLASSES[0];
}

function _clearClasses() {
    document.body.classList.remove(...FLICKER_CLASSES, SCANLINES_CLASS, VIGNETTE_CLASS);
}

function _apply() {
    const intensity = stateManager.getIntensity();
    const wanted = _getFlickerClass(intensity);
    const classes = document.body.classList;
    
    FLICKER_CLASSES.forEach(name => classes.toggle(name, name === wanted));
    classes.toggle(SCANLINES_CLASS, intensity >= SETTINGS.scanlinesFrom);
    classes.toggle(VIGNETTE_CLASS, intensity >= SETTINGS.vignetteFrom);
}

function stop ({notify = false} = {}) {
    if (!isActive) return;

    _clearClasses();
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID},
        }));
    }
}

function start () {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    isActive = true;
    _apply();
    return true;
}

function flicker() {
    if (isActive) stop();
    else start();
    return isActive;
}

flicker.id = EFFECT_ID;
flicker.minIntensity = SETTINGS.minIntensity;
flicker.permanent = false;
flicker.continuous = true;
flicker.start = start;
flicker.stop = stop;
flicker.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop ({notify: true});
    else if (isActive) _apply();
});

export {flicker};